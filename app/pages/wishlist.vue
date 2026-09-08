<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="위시리스트" subtitle="위시리스트" />
    <wishlist-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import WishlistArea from "~/components/cart-wishlists/WishlistArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "위시리스트",
});
usePageTitle("위시리스트");
</script>
