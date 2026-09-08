/** 인증 정보 (토큰·만료 등) */
export interface SyAuthType {
  authInfoId: number; // 인증정보ID
  accessToken?: string; // 액세스 토큰
  refreshToken?: string; // 리프레시 토큰
  userId: string; // 사용자ID
  expiresAt?: number; // 만료 시각
}
