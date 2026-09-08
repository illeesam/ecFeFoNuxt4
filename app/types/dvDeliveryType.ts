import type { MbAddrType } from "~/types/mbAddrType";

/** 배송 정보 */
export interface DvDeliveryType {
  deliveryId: number; // 배송ID
  orderId: string; // 주문ID
  recipientName: string; // 수령인명
  phone: string; // 연락처
  address: MbAddrType | string; // 주소
  status: "pending" | "shipped" | "in_transit" | "delivered" | "failed"; // 배송상태
  trackingNumber?: string; // 송장번호
  shippedAt?: string; // 발송일시
  deliveredAt?: string; // 도착일시
  memo?: string; // 메모
}
