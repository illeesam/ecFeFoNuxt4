/**
 * Google OAuth 2.0 로그인 시작: 사용자를 Google 인증 페이지로 리다이렉트합니다.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const clientId = config.googleClientId as string;
  if (!clientId) {
    return sendRedirect(event, "/login?error=" + encodeURIComponent("Google 로그인이 설정되지 않았습니다."), 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const scope = "openid email profile";
  const state = Buffer.from(Date.now().toString(36) + Math.random().toString(36)).toString("base64url");
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;
  return sendRedirect(event, url, 302);
});
