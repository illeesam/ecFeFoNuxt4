/**
 * 인증 정보 조회. Bearer 토큰으로 사용자 정보 반환.
 * Redis 사용 시 세션에서 조회, 미사용 시 JWT payload에서 복원.
 */
import { verifyAuthJwt } from "~~/server/utils/authJwt";
import { getAuthSession } from "~~/server/utils/authRedis";
import { getRedis } from "~~/server/utils/redis";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = config.authJwtSecret as string;
  const auth = getHeader(event, "authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) throw createError({ statusCode: 401, statusMessage: "인증이 필요합니다." });
  if (!secret) throw createError({ statusCode: 501, statusMessage: "인증 설정이 없습니다." });
  const payload = verifyAuthJwt(token, secret);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "유효하지 않거나 만료된 토큰입니다." });
  const sessionId = payload.sessionId as string;
  const useRedis = await getRedis().then((r) => !!r);
  if (useRedis && sessionId) {
    const data = await getAuthSession(sessionId);
    if (data?.user) return data.user;
    throw createError({ statusCode: 401, statusMessage: "세션이 만료되었습니다." });
  }
  return {
    userId: payload.userId as number,
    username: (payload.username as string) || (payload.email as string) || "User",
    email: (payload.email as string) || "",
    role: (payload.role as string) || "user",
  };
});
