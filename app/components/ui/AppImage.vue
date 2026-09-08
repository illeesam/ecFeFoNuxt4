<template>
  <div :class="['app-image-wrap', wrapClass]" :style="wrapStyle">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <!-- 스켈레톤 (로딩 중) -->
    <div v-if="loading" class="app-image-skeleton skeleton-shimmer" :style="skeletonStyle" />

    <!-- 실제 이미지 -->
    <img
      ref="imgRef"
      v-show="!loading"
      :src="currentSrc"
      :alt="alt"
      :class="imgClass"
      :style="imgStyle"
      v-bind="$attrs"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('이미지');
import { ref, watch, onMounted } from "vue";

// noImage 폴백 SVG (인라인 data URI)
const NO_IMAGE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23aaa'%3E이미지 없음%3C/text%3E%3Cpath d='M160 170 l80 0 l0-80 l-80 0 Z' fill='none' stroke='%23ccc' stroke-width='2'/%3E%3Ccircle cx='190' cy='140' r='10' fill='%23ccc'/%3E%3Cpath d='M165 175 l25-25 l20 20 l15-10 l35 35' fill='none' stroke='%23ccc' stroke-width='2'/%3E%3C/svg%3E`;

interface Props {
  src?: string | null;
  alt?: string;
  wrapClass?: string;
  wrapStyle?: Record<string, string> | string;
  imgClass?: string;
  imgStyle?: Record<string, string> | string;
  skeletonStyle?: Record<string, string> | string;
  /** 스켈레톤 표시 여부를 외부에서 강제로 지정 (미지정시 자체 로딩상태 사용) */
  showSkeleton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  alt: "이미지",
  wrapClass: "",
});

const imgRef = ref<HTMLImageElement | null>(null);
const loading = ref(true);
const currentSrc = ref(props.src || NO_IMAGE_SVG);

watch(
  () => props.src,
  (newSrc) => {
    loading.value = true;
    currentSrc.value = newSrc || NO_IMAGE_SVG;
  }
);

// SSR 하이드레이션 후 이미 로드된 이미지 처리
// (서버에서 렌더링된 img가 Vue 이벤트 리스너 등록 전에 로드 완료된 경우)
onMounted(() => {
  const img = imgRef.value;
  if (!img || !img.complete) return;
  if (img.naturalWidth === 0) {
    onError();
  } else {
    onLoad();
  }
});

function onLoad() {
  loading.value = false;
}

function onError() {
  loading.value = false;
  currentSrc.value = NO_IMAGE_SVG;
}
</script>

<style scoped>
.app-image-wrap {
  position: relative;
  display: block;
  overflow: hidden;
}

.app-image-skeleton {
  position: absolute;
  inset: 0;
  border-radius: 4px;
}

/* 공통 shimmer 애니메이션 */
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
