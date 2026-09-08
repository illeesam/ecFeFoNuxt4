<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="비교" subtitle="비교" />
    <compare-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import CompareArea from "~/components/compare/CompareArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "비교",
});
usePageTitle("비교");
</script>
