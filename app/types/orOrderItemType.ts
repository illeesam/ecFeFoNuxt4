/** 주문 한 줄 (상품 + 수량 + 소계) */
export interface OrOrderItemType {
  orderItemId: number; // 주문품목ID
  productId: number; // 상품ID
  title: string; // 상품명
  price: number; // 단가
  orderQuantity: number; // 주문 수량
  subtotal: number; // 소계
}
