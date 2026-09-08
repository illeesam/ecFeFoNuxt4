/** 배송 품목 한 줄 (배송 단위 내 상품) */
export interface DvDeliveryItemType {
  deliveryItemId: number; // 배송품목ID
  productId: number; // 상품ID
  title: string; // 상품명
  quantity: number; // 수량
  optionSummary?: string; // 옵션 요약
}
