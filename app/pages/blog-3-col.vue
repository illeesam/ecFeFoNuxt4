<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="블로그 3단" subtitle="블로그 3단" />
    <blog-three-col-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import BlogThreeColArea from "~/components/blogs/BlogThreeColArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "블로그 3단",
});
usePageTitle("블로그 3단");
</script>
