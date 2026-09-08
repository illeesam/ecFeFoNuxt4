<template>
  <!-- 상품 상세 페이지 스켈레톤 -->
  <section class="shop__area pb-65">
    <xdev-file-path-badge file-path="app/components/ui/SkeletonProductDetail.vue" :absolute="true" />
    <div class="shop__top pt-100 pb-90" style="background:#fff">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row">
          <!-- 이미지 갤러리 영역 -->
          <div class="col-xl-6 col-lg-6">
            <div class="skeleton-gallery">
              <!-- 썸네일 목록 -->
              <div class="skeleton-thumbs">
                <div v-for="n in 3" :key="n" class="skeleton-thumb-btn skeleton-shimmer" />
              </div>
              <!-- 메인 이미지 -->
              <div class="skeleton-main-img skeleton-shimmer" />
            </div>
          </div>
          <!-- 상품 정보 영역 -->
          <div class="col-xl-6 col-lg-6">
            <div class="skeleton-info">
              <div class="skeleton-line skeleton-shimmer" style="width:60%;height:28px;margin-bottom:16px" />
              <div class="skeleton-line skeleton-shimmer" style="width:40%;height:20px;margin-bottom:12px" />
              <div class="skeleton-line skeleton-shimmer" style="width:80%;height:14px;margin-bottom:8px" />
              <div class="skeleton-line skeleton-shimmer" style="width:75%;height:14px;margin-bottom:8px" />
              <div class="skeleton-line skeleton-shimmer" style="width:55%;height:14px;margin-bottom:24px" />
              <div class="skeleton-line skeleton-shimmer" style="width:30%;height:44px;border-radius:4px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('스켈레톤 상품 상세');
</script>

<style scoped>
.skeleton-gallery {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}

.skeleton-thumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-thumb-btn {
  width: 95px;
  height: 120px;
  border-radius: 4px;
}

.skeleton-main-img {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 4px;
}

.skeleton-info {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
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
