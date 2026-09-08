/**
 * Redis 클라이언트 (USE_REDIS=true 일 때만 연결).
 * 로그인 세션·리프레시 토큰 보관에 사용.
 */
type RedisClient = { get: (k: string) => Promise<string | null>; set: (k: string, v: string, opts?: { EX?: number }) => Promise<unknown>; del: (k: string) => Promise<unknown>; connect?: () => Promise<void>; on?: (e: string, fn: (err: Error) => void) => void };

let client: RedisClient | null = null;

export async function getRedis(): Promise<RedisClient | null> {
  const config = useRuntimeConfig();
  const useRedis = config.useRedis as boolean;
  const url = (config.redisUrl as string) || "redis://localhost:6379";
  if (!useRedis) return null;
  if (client) return client;
  try {
    const { createClient } = await import("redis");
    const c = createClient({ url }) as RedisClient;
    if (c.on) c.on("error", (err: Error) => console.warn("[Redis]", err));
    if (c.connect) await c.connect();
    client = c;
    return client;
  } catch (e) {
    console.warn("[Redis] connect failed:", e);
    return null;
  }
}

export function isRedisEnabled(): boolean {
  const config = useRuntimeConfig();
  return !!(config.useRedis as boolean);
}
