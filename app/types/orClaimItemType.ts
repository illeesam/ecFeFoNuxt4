/** 클레임 한 건 (목록/상세용) */
export interface OrClaimItemType {
  claimItemId: number; // 클레임품목ID
  claimId: string; // 클레임ID
  orderId: string; // 주문ID
  claimType: "exchange" | "return" | "cancel"; // 클레임 유형 (교환/반품/취소)
  reason: string; // 사유
  status: "requested" | "approved" | "rejected" | "completed"; // 처리상태
  productId?: number; // 상품ID
  productTitle?: string; // 상품명
  quantity?: number; // 수량
  createdAt?: string; // 생성일시
  updatedAt?: string; // 수정일시
}
