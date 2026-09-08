/**
 * 리프레시 토큰으로 새 액세스 토큰·리프레시 토큰 발급.
 * Redis 사용 시에만 동작하며, 기존 리프레시 토큰은 무효화.
 */
import { signAuthJwt } from "~~/server/utils/authJwt";
import { getAuthSession, getRefreshPayload, setAuthSession, setRefreshToken, delRefreshToken } from "~~/server/utils/authRedis";
import { getRedis } from "~~/server/utils/redis";
import { randomBytes } from "node:crypto";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = config.authJwtSecret as string;
  const body = await readBody(event).catch(() => ({})) as { refreshToken?: string };
  const refreshToken = String(body?.refreshToken ?? "").trim();
  if (!refreshToken) {
    throw createError({ statusCode: 400, statusMessage: "refreshToken이 필요합니다." });
  }
  if (!secret) {
    throw createError({ statusCode: 501, statusMessage: "인증 설정이 없습니다." });
  }
  const useRedis = await getRedis().then((r) => !!r);
  if (!useRedis) {
    throw createError({ statusCode: 400, statusMessage: "리프레시는 Redis 사용 시에만 가능합니다." });
  }
  const payload = await getRefreshPayload(refreshToken);
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: "유효하지 않거나 만료된 리프레시 토큰입니다." });
  }
  const data = await getAuthSession(payload.sessionId);
  if (!data?.user) {
    throw createError({ statusCode: 401, statusMessage: "세션이 만료되었습니다." });
  }
  await delRefreshToken(refreshToken);
  const newSessionId = randomBytes(24).toString("base64url");
  const newRefreshToken = randomBytes(32).toString("base64url");
  const accessTtlSec = (config.authAccessTokenTtlSec as number) || 15 * 60;
  const refreshTtlSec = (config.authRefreshTokenTtlSec as number) || 7 * 24 * 60 * 60;
  const token = signAuthJwt(
    { sessionId: newSessionId, userId: data.user.userId, email: data.user.email, sub: String(data.user.userId), username: data.user.username, role: data.user.role },
    secret,
    accessTtlSec
  );
  await setAuthSession(newSessionId, { user: data.user, refreshToken: newRefreshToken }, refreshTtlSec);
  await setRefreshToken(newRefreshToken, { sessionId: newSessionId, userId: data.user.userId, email: data.user.email }, refreshTtlSec);
  return {
    token,
    refreshToken: newRefreshToken,
    user: data.user,
  };
});
