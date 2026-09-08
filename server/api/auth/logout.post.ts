/**
 * 로그아웃 API. Authorization Bearer 토큰으로 세션·리프레시 토큰 무효화.
 */
import { verifyAuthJwt } from "~~/server/utils/authJwt";
import { getAuthSession, delAuthSession, delRefreshToken } from "~~/server/utils/authRedis";
import { getRedis } from "~~/server/utils/redis";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = config.authJwtSecret as string;
  const auth = getHeader(event, "authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { ok: true };
  if (!secret) return { ok: true };
  const payload = verifyAuthJwt(token, secret);
  if (!payload?.sessionId) return { ok: true };
  const useRedis = await getRedis().then((r) => !!r);
  if (useRedis) {
    const data = await getAuthSession(payload.sessionId as string);
    if (data?.refreshToken) await delRefreshToken(data.refreshToken);
    await delAuthSession(payload.sessionId as string);
  }
  return { ok: true };
});
