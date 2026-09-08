/**
 * OAuth 로그인 후 클라이언트에 전달할 토큰 생성.
 * 형식: oauth_<base64url(JSON.stringify({ provider, email, name, id }))>
 */
export interface OAuthUserPayload {
  provider: string;
  email: string;
  name: string;
  id: string;
}

export function createOAuthToken(payload: OAuthUserPayload): string {
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json, "utf8").toString("base64url");
  return `oauth_${base64}`;
}

export function parseOAuthToken(token: string): OAuthUserPayload | null {
  if (!token.startsWith("oauth_")) return null;
  try {
    const base64 = token.slice(6);
    const json = Buffer.from(base64, "base64url").toString("utf8");
    return JSON.parse(json) as OAuthUserPayload;
  } catch {
    return null;
  }
}
