/** 회원(멤버) 정보 */
export interface MbMemberType {
  memberId: number; // 회원ID
  name: string; // 이름
  loginId: string; // 로그인ID
  password: string; // 비밀번호
  email: string; // 이메일
  phone?: string; // 연락처
  address?: string; // 주소
  createdAt: string; // 생성일시
  updatedAt: string; // 수정일시
}
