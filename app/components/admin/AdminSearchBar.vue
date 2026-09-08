<template>
  <div class="admin-search-bar flex flex-wrap items-end gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
    <slot />
    <div class="flex gap-2 ml-auto">
      <button type="button" class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 text-sm" @click="$emit('search')">
        조회
      </button>
      <button v-if="showReset" type="button" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm" @click="$emit('reset')">
        초기화
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageType } from "~/types/page";

withDefaults(
  defineProps<{
    showReset?: boolean;
    /** 목록 페이징 타입 (반응형 시 카드/더보기 구분용) */
    pageType?: PageType;
  }>(),
  { showReset: false }
);
defineEmits<{ (e: "search"): void; (e: "reset"): void }>();
</script>
