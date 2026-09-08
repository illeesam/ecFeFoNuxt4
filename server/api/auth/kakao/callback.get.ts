/**
 * 카카오 OAuth 2.0 콜백: code로 액세스 토큰 교환 후 사용자 정보 조회, 앱 토큰 발급.
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
  const clientId = config.kakaoClientId as string;
  const clientSecret = config.kakaoClientSecret as string;
  if (!clientId) {
    return sendRedirect(event, "/login?error=config", 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/kakao/callback`;

  const body: Record<string, string> = {
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  };
  if (clientSecret) body.client_secret = clientSecret;

  const tokenRes = await $fetch<{ access_token?: string }>("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  }).catch(() => null);

  if (!tokenRes?.access_token) {
    return sendRedirect(event, "/login?error=token_exchange", 302);
  }

  const userRes = await $fetch<{
    id?: number;
    kakao_account?: { email?: string };
    properties?: { nickname?: string };
  }>("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${tokenRes.access_token}` },
  }).catch(() => null);

  const id = userRes?.id?.toString();
  if (!id) {
    return sendRedirect(event, "/login?error=user_info", 302);
  }
  const email = userRes?.kakao_account?.email || "";
  const name = userRes?.properties?.nickname || email || "User";

  const token = createOAuthToken({ provider: "kakao", id, email, name });
  return sendRedirect(event, `/login/oauth-success?token=${encodeURIComponent(token)}`, 302);
});
