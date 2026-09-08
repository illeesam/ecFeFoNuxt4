/** 문의하기 폼/데이터 */
export interface CoInquiryType {
  inquiryId?: number; // 문의ID
  name: string; // 이름
  email: string; // 이메일
  subject: string; // 제목
  msg: string; // 내용
}
