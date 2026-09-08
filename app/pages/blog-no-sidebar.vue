<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="소식 & 블로그" subtitle="블로그 기본" />
    <blog-no-sidebar-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import BlogNoSidebarArea from "~/components/blogs/BlogNoSidebarArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "블로그",
});
usePageTitle("블로그 사이드없음");
</script>
