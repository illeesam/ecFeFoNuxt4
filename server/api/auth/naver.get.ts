/** 네이버 로그인 시작: 네이버 인증 페이지로 리다이렉트 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const clientId = config.naverClientId as string;
  if (!clientId) {
    return sendRedirect(event, "/login?error=" + encodeURIComponent("네이버 로그인이 설정되지 않았습니다."), 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/naver/callback`;
  const state = Buffer.from(Date.now().toString(36) + Math.random().toString(36)).toString("base64url");
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  return sendRedirect(event, url, 302);
});
