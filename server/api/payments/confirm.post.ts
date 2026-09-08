/**
 * 토스페이먼츠 결제 승인 API
 * successUrl 리다이렉트 후 클라이언트에서 paymentKey, orderId, amount 를 보내 승인 처리합니다.
 * @see https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secretKey = config.tossPaymentsSecretKey as string;
  if (!secretKey) {
    throw createError({ statusCode: 500, statusMessage: "토스페이먼츠 시크릿 키가 설정되지 않았습니다." });
  }

  const body = await readBody(event).catch(() => ({})) as {
    paymentKey?: string;
    orderId?: string;
    amount?: number;
  };
  const paymentKey = String(body?.paymentKey ?? "").trim();
  const orderId = String(body?.orderId ?? "").trim();
  const amount = Number(body?.amount);

  if (!paymentKey || !orderId || !Number.isInteger(amount) || amount < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "paymentKey, orderId, amount(원)가 필요합니다.",
    });
  }

  const auth = Buffer.from(`${secretKey}:`, "utf8").toString("base64");
  const res = await $fetch<Record<string, unknown>>("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: { paymentKey, orderId, amount },
  }).catch((err: { data?: { code?: string; message?: string }; statusCode?: number }) => {
    const message = err?.data?.message ?? err?.data?.code ?? "결제 승인 요청 실패";
    throw createError({
      statusCode: err?.statusCode ?? 502,
      statusMessage: message,
    });
  });

  return res;
});
