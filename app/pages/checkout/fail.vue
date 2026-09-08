<template>
  <layout :transparent="true">
    <breadcrumb-area title="결제 실패" subtitle="결제 실패" />
    <section class="checkout-area pb-70">
      <div class="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">결제에 실패했습니다</h2>
        <p class="text-gray-600 mb-2" v-if="code">에러 코드: {{ code }}</p>
        <p class="text-gray-600 mb-8">{{ message || "다시 시도해 주세요." }}</p>
        <nuxt-link class="os-btn os-btn-black" to="/checkout">결제 페이지로</nuxt-link>
      </div>
    </section>
  </layout>
</template>

<script setup lang="ts">
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";

const route = useRoute();
const code = computed(() => (route.query.code as string) ?? "");
const message = computed(() => (route.query.message as string) ?? "");

useHead({ title: "결제 실패" });
</script>
