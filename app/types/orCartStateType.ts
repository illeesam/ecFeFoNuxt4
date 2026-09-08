import type { OrCartItemType } from "~/types/orCartItemType";

/** 장바구니 스토어 상태 */
export interface OrCartStateType {
  cartStateId?: number; // 상태ID
  cartProducts: OrCartItemType[]; // 장바구니 상품 목록
  orderQuantity: number; // 주문 수량 합계
  quantityCount: number; // 품목 수
  total: number; // 총 금액
}
