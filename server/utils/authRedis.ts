/**
 * 로그인 세션·리프레시 토큰 Redis 보관 (USE_REDIS=true 일 때만 동작).
 */
import { getRedis } from "~~/server/utils/redis";

const PREFIX_SESSION = "auth:session:";
const PREFIX_REFRESH = "auth:refresh:";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7; // 7일 (기본값, env에서 오버라이드)
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7일 (기본값, env에서 오버라이드)

export interface AuthSessionUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface AuthSessionData {
  user: AuthSessionUser;
  refreshToken?: string;
}

export async function setAuthSession(sessionId: string, data: AuthSessionData, ttlSec = SESSION_TTL_SEC): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;
  try {
    await redis.set(PREFIX_SESSION + sessionId, JSON.stringify(data), { EX: ttlSec });
    return true;
  } catch {
    return false;
  }
}

export async function getAuthSession(sessionId: string): Promise<AuthSessionData | null> {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get(PREFIX_SESSION + sessionId);
    return raw ? (JSON.parse(raw) as AuthSessionData) : null;
  } catch {
    return null;
  }
}

export async function delAuthSession(sessionId: string): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;
  try {
    await redis.del(PREFIX_SESSION + sessionId);
    return true;
  } catch {
    return false;
  }
}

export interface RefreshPayload {
  sessionId: string;
  userId: number;
  email: string;
}

export async function setRefreshToken(refreshToken: string, payload: RefreshPayload, ttlSec = REFRESH_TTL_SEC): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;
  try {
    await redis.set(PREFIX_REFRESH + refreshToken, JSON.stringify(payload), { EX: ttlSec });
    return true;
  } catch {
    return false;
  }
}

export async function getRefreshPayload(refreshToken: string): Promise<RefreshPayload | null> {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get(PREFIX_REFRESH + refreshToken);
    return raw ? (JSON.parse(raw) as RefreshPayload) : null;
  } catch {
    return null;
  }
}

export async function delRefreshToken(refreshToken: string): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;
  try {
    await redis.del(PREFIX_REFRESH + refreshToken);
    return true;
  } catch {
    return false;
  }
}
