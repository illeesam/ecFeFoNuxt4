/**
 * Google OAuth 2.0 콜백: code를 액세스 토큰으로 교환 후 사용자 정보 조회, 앱 토큰 발급하여 리다이렉트.
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
  const clientId = config.googleClientId as string;
  const clientSecret = config.googleClientSecret as string;
  if (!clientId || !clientSecret) {
    return sendRedirect(event, "/login?error=config", 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const tokenRes = await $fetch<{ access_token?: string }>("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  }).catch(() => null);

  if (!tokenRes?.access_token) {
    return sendRedirect(event, "/login?error=token_exchange", 302);
  }

  const userRes = await $fetch<{ id?: string; email?: string; name?: string; picture?: string }>(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${tokenRes.access_token}` } }
  ).catch(() => null);

  if (!userRes?.id) {
    return sendRedirect(event, "/login?error=user_info", 302);
  }

  const token = createOAuthToken({
    provider: "google",
    id: userRes.id,
    email: userRes.email || "",
    name: userRes.name || userRes.email || "User",
  });
  return sendRedirect(event, `/login/oauth-success?token=${encodeURIComponent(token)}`, 302);
});
