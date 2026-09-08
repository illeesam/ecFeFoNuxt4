<template>
  <!-- 상품 카드 목록용 스켈레톤 -->
  <div class="skeleton-card mb-60">
    <xdev-file-path-badge file-path="app/components/ui/SkeletonCard.vue" :absolute="true" />
    <!-- 이미지 영역 -->
    <div class="skeleton-card__img skeleton-shimmer" />
    <!-- 텍스트 영역 -->
    <div class="skeleton-card__body">
      <div class="skeleton-line skeleton-shimmer" style="width: 70%; height: 14px; margin-bottom: 8px;" />
      <div class="skeleton-line skeleton-shimmer" style="width: 40%; height: 14px;" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('스켈레톤 카드');
</script>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 4px;
}

.skeleton-card__body {
  padding: 0 4px;
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
