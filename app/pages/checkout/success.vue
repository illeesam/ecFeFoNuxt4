<template>
  <layout :transparent="true">
    <breadcrumb-area title="결제 완료" subtitle="결제 완료" />
    <section class="checkout-area pb-70">
      <div class="max-w-2xl mx-auto px-4 py-16 text-center">
        <template v-if="status === 'loading'">
          <p class="text-gray-600">결제를 확인하고 있습니다...</p>
        </template>
        <template v-else-if="status === 'success'">
          <h2 class="text-2xl font-bold text-green-700 mb-4">결제가 완료되었습니다</h2>
          <p class="text-gray-600 mb-2">주문번호: {{ orderId }}</p>
          <p class="text-gray-600 mb-8">결제 금액: {{ formatPrice(amount) }}</p>
          <nuxt-link class="os-btn os-btn-black" to="/">쇼핑 계속하기</nuxt-link>
        </template>
        <template v-else>
          <h2 class="text-2xl font-bold text-red-600 mb-4">결제 확인 실패</h2>
          <p class="text-gray-600 mb-8">{{ errorMessage }}</p>
          <nuxt-link class="os-btn os-btn-black" to="/checkout">결제 페이지로</nuxt-link>
        </template>
      </div>
    </section>
  </layout>
</template>

<script setup lang="ts">
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import { usePrice } from "~/composables/usePrice";

const route = useRoute();
const { formatPrice } = usePrice();

const status = ref<"loading" | "success" | "fail">("loading");
const orderId = ref("");
const amount = ref(0);
const errorMessage = ref("");

const paymentKey = route.query.paymentKey as string;
const orderIdQuery = route.query.orderId as string;
const amountQuery = route.query.amount as string;

onMounted(async () => {
  if (!paymentKey || !orderIdQuery || !amountQuery) {
    status.value = "fail";
    errorMessage.value = "결제 정보가 없습니다.";
    return;
  }
  orderId.value = orderIdQuery;
  amount.value = Number(amountQuery) || 0;

  try {
    await $fetch("/api/payments/confirm", {
      method: "POST",
      body: {
        paymentKey,
        orderId: orderIdQuery,
        amount: amount.value,
      },
    });
    status.value = "success";
  } catch (e: unknown) {
    status.value = "fail";
    const err = e as { data?: { statusMessage?: string }; statusMessage?: string };
    errorMessage.value = err?.data?.statusMessage ?? err?.statusMessage ?? "결제 승인 처리에 실패했습니다.";
  }
});

useHead({ title: "결제 완료" });
</script>
