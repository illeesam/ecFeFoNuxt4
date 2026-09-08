<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="상품 상세" subtitle="상품 상세" />

    <!-- 스켈레톤: SSR/CSR 로딩 중 -->
    <skeleton-product-detail v-if="pending" />

    <!-- 상품 상세 -->
    <shop-details-area v-else-if="item" :item="item" />

    <!-- 상품 없음 fallback -->
    <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">상품을 찾을 수 없습니다.</div>
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import ShopDetailsArea from "~/components/shop-details/ShopDetailsArea.vue";
import SkeletonProductDetail from "~/components/ui/SkeletonProductDetail.vue";
import { axiosSsr } from "~/utils/axiosSsr";
import { useProductsStore } from "~/store/useProductsStore";
import { type PdProductType } from "~/types/pdProductType";

const route = useRoute();
const id = route.params.id as string;
const idNum = id ? Number(id) : NaN;
const isProductId = Number.isInteger(idNum) && idNum >= 1;

// SSR: 서버에서 /api/products/:id 조회 (숫자 id만; .css.map 등 잘못된 경로 요청 방지)
const { data: item, pending } = await useAsyncData<PdProductType>(
  `product-${id}`,
  () => (isProductId ? axiosSsr.get<PdProductType>(`/api/products/${id}`).then((r) => r.data) : Promise.resolve(null)),
  { default: () => null }
);

// 전체 상품 목록은 CSR에서 별도 로드 (관련 상품 등 활용)
const store = useProductsStore();
if (import.meta.client && !store.loaded) {
  store.loadStProducts();
}

import { usePageTitle } from "~/composables/usePageTitle";
import { useGa } from "~/composables/useGa";
useSeoMeta({
  title: item.value ? `${item.value.title} | Outstock` : "상품 상세",
  ogTitle: item.value?.title ?? "상품 상세",
  description: item.value?.smDesc,
  ogDescription: item.value?.smDesc,
  ogImage: item.value?.img,
});
usePageTitle("상품 상세");

// GA4: 상세 조회 데이터 기준으로 page_view 전송
const { sendPageView } = useGa();
watch(
  item,
  (v) => {
    if (v?.title) sendPageView(`${v.title} | Outstock`);
  },
  { immediate: true }
);
</script>
