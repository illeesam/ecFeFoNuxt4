<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="쇼핑" subtitle="쇼핑" />

    <!-- 스켈레톤 그리드 (SSR 로딩 중) -->
    <section v-if="pending" class="shop__area pt-100 pb-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row">
          <div class="col-xl-9 col-lg-9 col-md-8 offset-xl-3 offset-lg-3 offset-md-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <skeleton-card v-for="n in 9" :key="n" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 실제 쇼핑 영역 -->
    <shop-area v-else />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import ShopArea from "~/components/shop/ShopArea.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";
import { axiosSsr } from "~/utils/axiosSsr";
import { useProductsStore } from "~/store/useProductsStore";
import { type PdProductType } from "~/types/pdProductType";

import { usePageTitle } from "~/composables/usePageTitle";
useSeoMeta({
  title: "쇼핑 | Outstock",
  ogTitle: "쇼핑 | Outstock",
  description: "다양한 상품을 쇼핑하세요.",
});
usePageTitle("쇼핑");

// SSR: 상품 목록 사전 로드 → 스토어에 주입 (검색엔진 크롤러용)
const { pending } = await useAsyncData<PdProductType[]>(
  "shop-products",
  async () => {
    const res = await axiosSsr.get<PdProductType[]>("/api/products");
    return res.data;
  },
  {
    transform: (data) => {
      const store = useProductsStore();
      if (!store.loaded) store.setStHydrate(data);
      return data;
    },
  }
);
</script>
