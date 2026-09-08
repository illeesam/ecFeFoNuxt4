<template>
  <div class="flex items-center justify-between gap-4 py-4 flex-wrap">
    <div class="text-sm text-gray-600 shrink-0">
      총 <span class="font-medium text-gray-800">{{ totalCount }}</span> 개
    </div>
    <!-- 좁은 화면 + 카드 자동/수동더보기: 페이징 대신 더보기 -->
    <template v-if="showCardLoadMore">
      <div class="flex-1" />
      <div class="flex flex-col items-center gap-2 shrink-0">
        <button
          v-if="isManualLoad && hasMoreCard"
          type="button"
          class="px-4 py-2 border border-amber-600 text-amber-600 rounded hover:bg-amber-50 disabled:opacity-50"
          :disabled="loadingMore"
          @click="$emit('loadMore')"
        >
          {{ loadingMore ? "로딩 중..." : "더보기" }}
        </button>
        <div v-if="isAutoLoad" ref="sentinelRef" class="h-4 w-full" />
      </div>
    </template>
    <div v-else-if="totalPages > 0" class="flex items-center justify-center gap-1 flex-1 min-w-0">
      <button
        type="button"
        class="min-w-[2.25rem] px-2 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="pageNo <= 1"
        @click="go(1)"
      >
        처음
      </button>
      <button
        type="button"
        class="min-w-[2.25rem] px-2 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="pageNo <= 1"
        @click="go(pageNo - 1)"
      >
        이전
      </button>
      <template v-for="n in pageNumbers" :key="n">
        <button
          type="button"
          class="min-w-[2.25rem] px-2 py-1.5 text-sm border rounded transition"
          :class="n === pageNo ? 'bg-amber-600 text-white border-amber-600' : 'hover:bg-gray-100'"
          @click="go(n)"
        >
          {{ n }}
        </button>
      </template>
      <button
        type="button"
        class="min-w-[2.25rem] px-2 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="pageNo >= totalPages"
        @click="go(pageNo + 1)"
      >
        다음
      </button>
      <button
        type="button"
        class="min-w-[4rem] px-2 py-1.5 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="pageNo >= totalPages"
        @click="go(totalPages)"
      >
        마지막 ({{ totalPages }})
      </button>
    </div>
    <div v-else class="flex-1" />
    <div v-if="!showCardLoadMore" class="shrink-0">
      <select
        :value="pageSize"
        class="text-sm border rounded px-2 py-1.5 bg-white text-gray-800"
        @change="onPageSizeChange(Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageType } from "~/types/page";

const props = withDefaults(
  defineProps<{
    pageNo: number;
    pageSize: number;
    totalCount: number;
    /** 표시할 최대 페이지 번호 개수 (기본 10) */
    maxPageNumbers?: number;
    /** 목록 페이징 타입 (반응형 시 카드 더보기 구분) */
    pageType?: PageType;
    /** 카드 뷰에서 더 로드 가능 여부 (수동/자동 더보기 시) */
    hasMoreCard?: boolean;
    /** 카드 뷰 더보기 로딩 중 */
    loadingMore?: boolean;
  }>(),
  { maxPageNumbers: 10, hasMoreCard: false, loadingMore: false }
);

const emit = defineEmits<{
  (e: "update:pageNo", value: number): void;
  (e: "update:pageSize", value: number): void;
  (e: "loadMore"): void;
}>();

const { isCardView } = useBreakpoint();
const sentinelRef = ref<HTMLElement | null>(null);

const isCardMode = computed(() => {
  const t = props.pageType;
  return t === "L_Paging_C_AutoLoad" || t === "L_Paging_C_ManualLoad";
});

const showCardLoadMore = computed(() => isCardView.value && isCardMode.value);

const isManualLoad = computed(() => props.pageType === "L_Paging_C_ManualLoad");
const isAutoLoad = computed(() => props.pageType === "L_Paging_C_AutoLoad");

let observer: IntersectionObserver | null = null;
onMounted(() => {
  if (typeof IntersectionObserver === "undefined") return;
  observer = new IntersectionObserver(
    (entries) => {
      if (props.pageType !== "L_Paging_C_AutoLoad" || !props.hasMoreCard || props.loadingMore) return;
      if (entries[0]?.isIntersecting) emit("loadMore");
    },
    { root: null, rootMargin: "100px", threshold: 0 }
  );
});
watch(
  () => [sentinelRef.value, isCardView.value, showCardLoadMore.value] as const,
  ([el, card, show]) => {
    if (!observer) return;
    if (el && card && show && isAutoLoad.value) observer.observe(el);
    else if (el) observer.unobserve(el);
  },
  { immediate: true }
);
onUnmounted(() => {
  if (observer && sentinelRef.value) observer.unobserve(sentinelRef.value);
});

const pageSizeOptions = [2, 3, 5, 10, 15, 20, 30, 50, 100, 200, 300];

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalCount / props.pageSize)));

function onPageSizeChange(size: number) {
  if (size !== props.pageSize) emit("update:pageSize", size);
}

const pageNumbers = computed(() => {
  const total = totalPages.value;
  const max = props.maxPageNumbers ?? 10;
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(max / 2);
  let start = Math.max(1, props.pageNo - half);
  let end = Math.min(total, start + max - 1);
  if (end - start + 1 < max) {
    start = Math.max(1, end - max + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function go(n: number) {
  const p = Math.max(1, Math.min(n, totalPages.value));
  if (p !== props.pageNo) emit("update:pageNo", p);
}
</script>
