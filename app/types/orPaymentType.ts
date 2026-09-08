/** 결제 정보 */
export interface OrPaymentType {
  paymentId: number; // 결제ID
  orderId: string; // 주문ID
  method: "transfer" | "card" | "check" | "free"; // 결제 수단
  amount: number; // 결제 금액
  status: "pending" | "completed" | "failed"; // 결제상태
  paidAt?: string; // 결제일시
}
