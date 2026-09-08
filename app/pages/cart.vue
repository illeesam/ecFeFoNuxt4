<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="장바구니" subtitle="장바구니" />
    <cart-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import CartArea from "~/components/cart-wishlists/CartArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "장바구니",
});
usePageTitle("장바구니");
</script>
