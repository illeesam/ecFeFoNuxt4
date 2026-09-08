/**
 * JWT 서명/검증 (HMAC-SHA256). Redis API 로그인/리프레시용 액세스 토큰.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const HEADER = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
const DEFAULT_TTL_SEC = 60 * 60 * 24; // 24h

export function signAuthJwt(
  payload: Record<string, unknown>,
  secret: string,
  ttlSec = DEFAULT_TTL_SEC
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const sig = createHmac("sha256", secret).update(`${HEADER}.${body}`).digest("base64url");
  return `${HEADER}.${body}.${sig}`;
}

export function verifyAuthJwt(token: string, secret: string): Record<string, unknown> | null {
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const [h, body, sig] = parts;
    const expected = createHmac("sha256", secret).update(`${h}.${body}`).digest("base64url");
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))) return null;
    const payload = JSON.parse(Buffer.from(body!, "base64url").toString("utf8")) as Record<string, unknown>;
    const exp = payload.exp as number;
    if (typeof exp !== "number" || exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
