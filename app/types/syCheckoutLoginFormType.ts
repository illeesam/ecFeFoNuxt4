/** 체크아웃 시 로그인 폼 (아이디 또는 이메일) */
export interface SyCheckoutLoginFormType {
  checkoutLoginFormId?: number; // 폼ID
  name_or_email: string; // 아이디 또는 이메일
  password: string; // 비밀번호
  isChecked: boolean; // 약관 동의 여부
}
