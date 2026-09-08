<template>
  <layout :white_bg="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <!-- 스켈레톤: SSR/CSR 로딩 중 -->
    <skeleton-blog-detail v-if="pending" />

    <!-- 블로그 상세 -->
    <blog-details-area v-else-if="item" :item="item" />

    <!-- 블로그 없음 fallback -->
    <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
      블로그를 찾을 수 없습니다.
    </div>
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

const route = useRoute();
const id = route.params.id as string;

// SSR: 서버에서 /api/blogs/:id 조회 → SEO 메타 적용
const { data: item, pending } = await useAsyncData<CoBlogType>(
  `blog-${id}`,
  () => axiosSsr.get<CoBlogType>(`/api/blogs/${id}`).then((r) => r.data)
);

import { usePageTitle } from "~/composables/usePageTitle";
import { useGa } from "~/composables/useGa";
useSeoMeta({
  title: item.value ? `${item.value.title} | Outstock 블로그` : "블로그 상세",
  ogTitle: item.value?.title ?? "블로그 상세",
  description: item.value?.desc,
  ogDescription: item.value?.desc,
  ogImage: item.value?.img,
});
usePageTitle("블로그 상세");

// GA4: 상세 조회 데이터 기준으로 page_view 전송
const { sendPageView } = useGa();
watch(
  item,
  (v) => {
    if (v?.title) sendPageView(`${v.title} | Outstock 블로그`);
  },
  { immediate: true }
);
</script>
