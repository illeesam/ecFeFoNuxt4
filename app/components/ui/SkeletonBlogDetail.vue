<template>
  <!-- 블로그 상세 스켈레톤 -->
  <section class="blog__area pt-55">
    <xdev-file-path-badge file-path="app/components/ui/SkeletonBlogDetail.vue" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-9 col-lg-8">
          <!-- 제목 영역 -->
          <div class="mb-55">
            <div class="skeleton-line skeleton-shimmer" style="width:70%;height:32px;margin-bottom:12px" />
            <div class="skeleton-line skeleton-shimmer" style="width:40%;height:14px" />
          </div>
          <!-- 메인 이미지 -->
          <div class="skeleton-blog-img skeleton-shimmer mb-40" />
          <!-- 본문 -->
          <div class="mb-40">
            <div v-for="n in 5" :key="n" class="skeleton-line skeleton-shimmer" :style="`width:${90 - n * 5}%;height:14px;margin-bottom:10px`" />
          </div>
        </div>
        <!-- 사이드바 -->
        <div class="col-xl-3 col-lg-4">
          <div class="skeleton-sidebar-block skeleton-shimmer mb-20" />
          <div class="skeleton-sidebar-block skeleton-shimmer" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('스켈레톤 블로그');
</script>

<style scoped>
.skeleton-blog-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 4px;
}

.skeleton-sidebar-block {
  width: 100%;
  height: 160px;
  border-radius: 4px;
}

.skeleton-line {
  border-radius: 4px;
}

.skeleton-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite ease-in-out;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
