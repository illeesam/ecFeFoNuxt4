/**
 * 네이버 OAuth 2.0 콜백: code로 액세스 토큰 교환 후 회원정보 조회, 앱 토큰 발급.
 */
import { createOAuthToken } from "~~/server/utils/oauthToken";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const code = query.code as string;
  const error = query.error as string;
  if (error) {
    return sendRedirect(event, `/login?error=${encodeURIComponent(error)}`, 302);
  }
  if (!code) {
    return sendRedirect(event, "/login?error=no_code", 302);
  }
  const clientId = config.naverClientId as string;
  const clientSecret = config.naverClientSecret as string;
  if (!clientId || !clientSecret) {
    return sendRedirect(event, "/login?error=config", 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/naver/callback`;

  const tokenRes = await $fetch<{ access_token?: string }>("https://nid.naver.com/oauth2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state: (query.state as string) || "",
    }).toString(),
  }).catch(() => null);

  if (!tokenRes?.access_token) {
    return sendRedirect(event, "/login?error=token_exchange", 302);
  }

  const userRes = await $fetch<{ response?: { id: string; email?: string; name?: string } }>(
    "https://openapi.naver.com/v1/nid/me",
    { headers: { Authorization: `Bearer ${tokenRes.access_token}` } }
  ).catch(() => null);

  const profile = userRes?.response;
  if (!profile?.id) {
    return sendRedirect(event, "/login?error=user_info", 302);
  }

  const token = createOAuthToken({
    provider: "naver",
    id: profile.id,
    email: profile.email || "",
    name: profile.name || profile.email || "User",
  });
  return sendRedirect(event, `/login/oauth-success?token=${encodeURIComponent(token)}`, 302);
});
