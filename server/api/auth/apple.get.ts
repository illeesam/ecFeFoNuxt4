/** Apple Sign In 시작: Apple 인증 페이지로 리다이렉트 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const clientId = config.appleClientId as string;
  if (!clientId) {
    return sendRedirect(event, "/login?error=" + encodeURIComponent("Apple 로그인이 설정되지 않았습니다."), 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/apple/callback`;
  const state = Buffer.from(Date.now().toString(36) + Math.random().toString(36)).toString("base64url");
  const url = `https://appleid.apple.com/auth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code id_token&response_mode=form_post&scope=name email&state=${state}`;
  return sendRedirect(event, url, 302);
});
