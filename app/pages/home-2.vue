<template>
  <layout-two>
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <main class="box-25">
      <home-two-hero-slider />
      <category-area :style_2="true" />
      <trending-product-two />
      <shop-banner :style_2="true" />
      <sale-off-area-two />
      <blog-area />
      <client-brand-slider :style_2="true" />
      <subscribe-area :style_2="true" />
    </main>
  </layout-two>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import LayoutTwo from "~/layout/LayoutTwo.vue";
import HomeTwoHeroSlider from "~/components/hero-banner/HomeTwoHeroSlider.vue";
import CategoryArea from "~/components/category/CategoryArea.vue";
import TrendingProductTwo from "~/components/products/TrendingProductTwo.vue";
import ShopBanner from "~/components/shop-banner/ShopBanner.vue";
import SaleOffAreaTwo from "~/components/products/SaleOffAreaTwo.vue";
import BlogArea from "~/components/blogs/BlogArea.vue";
import ClientBrandSlider from "~/components/client-brands/ClientBrandSlider.vue";
import SubscribeArea from "~/components/subscribe/SubscribeArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "홈 2",
});
usePageTitle("홈 2");
</script>

<style scoped></style>
