/** 로그인된 사용자(화면 표시용) */
export interface SyUserType {
  userId: number; // 사용자ID
  name: string; // 이름
  email: string; // 이메일
  role?: string; // 역할
  avatar?: string; // 프로필 이미지
}
