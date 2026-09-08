<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="블로그 2단 메이슨리" subtitle="블로그 2단 메이슨리" />
    <blog-two-col-masonry-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import BlogTwoColMasonryArea from "~/components/blogs/BlogTwoColMasonryArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "블로그 2단 메이슨리",
});
usePageTitle("블로그 2단 메이슨리");
</script>
