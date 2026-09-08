<template>
  <section class="checkout-area pb-70">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row">
          <div class="col-lg-6">
            <div class="checkbox-form">
              <h3>결제 정보</h3>
              <!-- 청구 정보 시작 -->
              <billing-details />
              <!-- 청구 정보 끝 -->

              <!-- 다른 배송지 시작 -->
              <different-address />
              <!-- 다른 배송지 끝 -->
            </div>
          </div>
          <div class="col-lg-6">
            <!-- 주문 영역 시작 -->
            <order-area />
            <!-- 주문 영역 끝 -->
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('결제');
import BillingDetails from "./BillingDetails.vue";
import DifferentAddress from "./DifferentAddress.vue";
import OrderArea from "./OrderArea.vue";

/** 주문 합계(원). OrderArea에서 계산해 주입합니다. */
const orderTotalRef = ref(0);
provide("checkoutOrderTotal", orderTotalRef);

async function handleFormSubmit() {
  if (import.meta.server) return;
  const { requestCardPayment, clientKey } = useTossPayments();
  if (!clientKey) {
    await useAlert().openAlert("결제 설정이 없습니다. .env에 NUXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY를 설정해 주세요.");
    return;
  }
  const total = orderTotalRef.value;
  if (total <= 0) {
    await useAlert().openAlert("주문 금액을 확인해 주세요.");
    return;
  }
  const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const origin = window.location.origin;
  try {
    await requestCardPayment({
      amount: total,
      orderId,
      orderName: "정담 주문",
      successUrl: `${origin}/checkout/success`,
      failUrl: `${origin}/checkout/fail`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "결제 요청 중 오류가 발생했습니다.";
    await useAlert().openAlert(msg);
  }
}
</script>
