<template>
  <layout>
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <home-hero-slider />
    <category-area />
    <trending-products />
    <shop-banner />
    <sale-off-product />
    <client-brand-slider />
    <blog-area />
    <subscribe-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import HomeHeroSlider from "~/components/hero-banner/HomeHeroSlider.vue";
import Layout from "~/layout/Layout.vue";
import CategoryArea from "~/components/category/CategoryArea.vue";
import TrendingProducts from "~/components/products/TrendingProducts.vue";
import ShopBanner from "~/components/shop-banner/ShopBanner.vue";
import SaleOffProduct from "~/components/products/SaleOffProduct.vue";
import ClientBrandSlider from "~/components/client-brands/ClientBrandSlider.vue";
import BlogArea from "~/components/blogs/BlogArea.vue";
import SubscribeArea from "~/components/subscribe/SubscribeArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "정담",
});
usePageTitle("홈");
</script>
