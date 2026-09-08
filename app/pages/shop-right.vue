<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="쇼핑" subtitle="쇼핑" />
    <shop-area :shop_right="true" />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import ShopArea from "~/components/shop/ShopArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "쇼핑",
});
usePageTitle("쇼핑 우사이드");
</script>
