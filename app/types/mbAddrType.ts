/** 주소 (배송/청구) */
export interface MbAddrType {
  addrId: number; // 주소ID
  addressId?: string; // 주소 식별자
  recipientName: string; // 수령인명
  recipientLastName?: string; // 수령인 성
  company?: string; // 회사명
  roadAddr: string; // 도로명 주소
  detailAddr?: string; // 상세 주소
  zonecode: string; // 우편번호
  sido: string; // 시/도
  sigungu: string; // 시/군/구
  email: string; // 이메일
  phone: string; // 연락처
}
