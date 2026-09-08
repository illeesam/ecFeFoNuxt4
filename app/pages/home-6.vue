<template>
  <layout-six>
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <home-hero-slider :style_2="true" />
    <category-area :style_4="true" />
    <trending-product-three />
    <shop-banner />
    <sale-off-product />
    <blog-area />
    <subscribe-area />
  </layout-six>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import LayoutSix from "~/layout/LayoutSix.vue";
import HomeHeroSlider from "~/components/hero-banner/HomeHeroSlider.vue";
import CategoryArea from "~/components/category/CategoryArea.vue";
import TrendingProductThree from "~/components/products/TrendingProductThree.vue";
import ShopBanner from "~/components/shop-banner/ShopBanner.vue";
import SaleOffProduct from "~/components/products/SaleOffProduct.vue";
import BlogArea from "~/components/blogs/BlogArea.vue";
import SubscribeArea from "~/components/subscribe/SubscribeArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "홈 6",
});
usePageTitle("홈 6");
</script>
