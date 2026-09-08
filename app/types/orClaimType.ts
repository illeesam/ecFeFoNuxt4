/** 클레임(교환/반품/취소) */
export interface OrClaimType {
  claimId: number; // 클레임ID
  orderId: number; // 주문ID
  claimType: "exchange" | "return" | "cancel"; // 클레임 유형
  reason: string; // 사유
  status: "requested" | "approved" | "rejected" | "completed"; // 처리상태
  createdAt?: string; // 생성일시
}
