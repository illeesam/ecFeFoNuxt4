/** 카카오 로그인 시작: 카카오 인증 페이지로 리다이렉트 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const clientId = config.kakaoClientId as string;
  if (!clientId) {
    return sendRedirect(event, "/login?error=" + encodeURIComponent("카카오 로그인이 설정되지 않았습니다."), 302);
  }
  const baseUrl = config.apiBaseUrl || getRequestURL(event).origin;
  const redirectUri = `${baseUrl}/api/auth/kakao/callback`;
  const state = Buffer.from(Date.now().toString(36) + Math.random().toString(36)).toString("base64url");
  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}&scope=account_email profile_nickname`;
  return sendRedirect(event, url, 302);
});
