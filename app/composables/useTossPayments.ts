/**
 * 토스페이먼츠 결제창 SDK v2 로드 및 결제 요청 (클라이언트 전용)
 * @see https://docs.tosspayments.com/sdk/v2/js
 */
const TOSSPAYMENTS_SCRIPT = "https://js.tosspayments.com/v2/standard";

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      payment: (params: { customerKey: string }) => {
        requestPayment: (options: {
          method: string;
          amount: { currency: string; value: number };
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
          customerName?: string;
        }) => Promise<void>;
      };
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("document is not available"));
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function randomCustomerKey(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function useTossPayments() {
  const config = useRuntimeConfig().public as {
    tossPaymentClientKey: string;
  };

  async function requestCardPayment(params: {
    amount: number;
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
    customerName?: string;
  }) {
    if (import.meta.server) {
      throw new Error("useTossPayments is for client only");
    }
    if (!config.tossPaymentClientKey) {
      throw new Error("토스페이먼츠 클라이언트 키가 설정되지 않았습니다.");
    }
    await loadScript(TOSSPAYMENTS_SCRIPT);
    const TossPayments = window.TossPayments;
    if (!TossPayments) {
      throw new Error("토스페이먼츠 스크립트를 불러오지 못했습니다.");
    }
    const client = TossPayments(config.tossPaymentClientKey);
    const payment = client.payment({ customerKey: randomCustomerKey() });
    await payment.requestPayment({
      method: "CARD",
      amount: { currency: "KRW", value: params.amount },
      orderId: params.orderId,
      orderName: params.orderName,
      successUrl: params.successUrl,
      failUrl: params.failUrl,
      ...(params.customerName && { customerName: params.customerName }),
    });
  }

  return {
    clientKey: config.tossPaymentClientKey,
    requestCardPayment,
  };
}
