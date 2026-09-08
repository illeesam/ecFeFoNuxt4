import type { PdProductType } from "~/types/pdProductType";

/** 장바구니에 담긴 상품 한 줄 (상품 + 주문 수량) */
export interface OrCartItemType extends PdProductType {
  cartItemId?: number; // 장바구니품목ID
  orderQuantity: number; // 주문 수량
}
