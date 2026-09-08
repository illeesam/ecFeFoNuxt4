<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="쇼핑" subtitle="쇼핑" />
    <shop-four-col />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import ShopFourCol from "~/components/shop/ShopFourCol.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "쇼핑 4단",
});
usePageTitle("쇼핑 4단");
</script>
