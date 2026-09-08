<template>
  <layout-five>
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <home-five-hero-slider />
    <div class="box-25">
      <trending-products :style_3="true" />
      <shop-banner />
      <subscribe-area />
    </div>
  </layout-five>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import LayoutFive from "~/layout/LayoutFive.vue";
import HomeFiveHeroSlider from "~/components/hero-banner/HomeFiveHeroSlider.vue";
import TrendingProducts from "~/components/products/TrendingProducts.vue";
import ShopBanner from "~/components/shop-banner/ShopBanner.vue";
import SubscribeArea from "~/components/subscribe/SubscribeArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "홈 5",
});
usePageTitle("홈 5");
</script>
