/**
 * 로그인 API. 이메일/비밀번호 검증 후 액세스 토큰·리프레시 토큰·사용자 정보 반환.
 * Redis 사용 시 세션·리프레시 토큰을 Redis에 보관.
 */
import { signAuthJwt } from "~~/server/utils/authJwt";
import { setAuthSession, setRefreshToken, type AuthSessionUser } from "~~/server/utils/authRedis";
import { getRedis } from "~~/server/utils/redis";
import { randomBytes } from "node:crypto";

function buildDemoUser(num: number): AuthSessionUser {
  return {
    userId: num,
    username: `홍길동${num}`,
    email: `demo${num}@mail.com`,
    role: "user",
    phone: `010-1234-${num.toString().padStart(4, "0")}`,
    address: `성남시 중원구 성남대로 997-${num}`,
  };
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = config.authJwtSecret as string;
  const body = await readBody(event).catch(() => ({})) as { email?: string; password?: string };
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "이메일과 비밀번호를 입력해 주세요." });
  }

  const match = email.match(/^demo(\d+)@mail\.com$/);
  if (!match || password !== "123456") {
    throw createError({ statusCode: 401, statusMessage: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }
  const num = parseInt(match[1]!, 10);
  if (num < 1 || num > 99) {
    throw createError({ statusCode: 401, statusMessage: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  const user = buildDemoUser(num);
  const sessionId = randomBytes(24).toString("base64url");
  const refreshToken = randomBytes(32).toString("base64url");

  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: "인증 설정이 없습니다. AUTH_JWT_SECRET을 설정해 주세요." });
  }

  const accessTtlSec = (config.authAccessTokenTtlSec as number) || 15 * 60;
  const refreshTtlSec = (config.authRefreshTokenTtlSec as number) || 7 * 24 * 60 * 60;

  const token = signAuthJwt(
    { sessionId, userId: user.userId, email: user.email, sub: String(user.userId), username: user.username, role: user.role },
    secret,
    accessTtlSec
  );

  const useRedis = await getRedis().then((r) => !!r);
  if (useRedis) {
    await setAuthSession(sessionId, { user, refreshToken }, refreshTtlSec);
    await setRefreshToken(refreshToken, { sessionId, userId: user.userId, email: user.email }, refreshTtlSec);
  }

  return {
    token,
    refreshToken: useRedis ? refreshToken : undefined,
    user,
  };
});
