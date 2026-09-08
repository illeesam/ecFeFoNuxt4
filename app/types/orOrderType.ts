import type { OrOrderItemType } from "~/types/orOrderItemType";

export type { OrOrderItemType };

/** 주문 */
export interface OrOrderType {
  orderId: number; // 주문ID
  items: OrOrderItemType[]; // 주문 품목 목록
  shippingCost: number; // 배송비
  total: number; // 총 금액
  status: string; // 주문상태
  createdAt?: string; // 생성일시
}
