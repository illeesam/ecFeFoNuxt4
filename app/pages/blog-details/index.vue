<template>
  <layout :white_bg="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <!-- 스켈레톤: SSR/CSR 로딩 중 -->
    <skeleton-blog-detail v-if="pending" />

    <!-- 블로그 상세 -->
    <blog-details-area v-else-if="item" :item="item" />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BlogDetailsArea from "~/components/blog-details/BlogDetailsArea.vue";
import SkeletonBlogDetail from "~/components/ui/SkeletonBlogDetail.vue";
import { axiosSsr } from "~/utils/axiosSsr";
import { type CoBlogType } from "~/types/coBlogType";

const { data: item, pending } = useAsyncData<CoBlogType>(
  "blog-details-preview",
  () => axiosSsr.get<CoBlogType>("/api/blogs/13").then((r) => r.data)
);

import { usePageTitle } from "~/composables/usePageTitle";
useHead({ title: "블로그 상세" });
usePageTitle("블로그 상세");
</script>
