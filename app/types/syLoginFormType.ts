/** 로그인 요청 폼 */
export interface SyLoginFormType {
  loginFormId?: number; // 폼ID
  email: string; // 이메일
  password: string; // 비밀번호
  remember?: boolean; // 로그인 유지 여부
}
