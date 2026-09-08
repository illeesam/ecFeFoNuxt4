<template>
  <Teleport to="body">
    <Transition name="media-viewer-fade">
      <div
        v-show="open"
        class="fixed inset-0 z-[10010] flex flex-col bg-black/95"
        role="dialog"
        aria-modal="true"
        aria-label="미디어 보기"
      >
        <!-- 닫기 -->
        <div class="absolute top-4 right-4 z-20">
          <button
            type="button"
            class="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="닫기"
            @click="close"
          >
            <i class="fa fa-times text-xl"></i>
          </button>
        </div>

        <!-- 가운데: 큰 이미지 또는 동영상 + 좌/우 버튼 -->
        <div class="flex-1 flex items-center justify-center min-h-0 relative px-14 py-4">
          <button
            v-if="normalizedItems.length > 1"
            type="button"
            class="media-viewer-nav media-viewer-nav--left"
            aria-label="이전"
            @click="prev"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <div class="flex-1 flex items-center justify-center max-w-4xl max-h-full">
            <template v-if="currentItem">
              <img
                v-if="currentItem.type === 'image'"
                :src="currentItem.url"
                :alt="`첨부 ${currentIndex + 1}`"
                class="max-w-full max-h-[60vh] object-contain"
              />
              <video
                v-else
                :src="currentItem.url"
                controls
                class="max-w-full max-h-[60vh]"
                @click.stop
              />
            </template>
          </div>
          <button
            v-if="normalizedItems.length > 1"
            type="button"
            class="media-viewer-nav media-viewer-nav--right"
            aria-label="다음"
            @click="next"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <!-- 하단: 썸네일 한 줄 + 페이징 -->
        <div class="flex-shrink-0 border-t border-white/20 bg-black/50 px-4 py-3">
          <div class="flex justify-center gap-2 overflow-x-auto pb-2 max-w-4xl mx-auto" style="scrollbar-width: thin;">
            <button
              v-for="(item, i) in normalizedItems"
              :key="item.url"
              type="button"
              :class="[
                'flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition',
                i === currentIndex ? 'border-white ring-2 ring-white/50' : 'border-transparent opacity-70 hover:opacity-100',
              ]"
              @click="goTo(i)"
            >
              <img
                v-if="item.type === 'image'"
                :src="item.url"
                :alt="`${i + 1}`"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center text-white text-lg">
                <i class="fa fa-play"></i>
              </div>
            </button>
          </div>
          <div class="flex items-center justify-center gap-2 text-white/80 text-sm">
            <span>{{ currentIndex + 1 }} / {{ normalizedItems.length }}</span>
            <template v-if="normalizedItems.length > thumbPerPage">
              <button
                type="button"
                class="px-2 py-1 rounded hover:bg-white/10 disabled:opacity-40"
                :disabled="currentPage === 0"
                @click="prevPage"
              >
                이전
              </button>
              <span class="px-2">{{ pageStart + 1 }}-{{ Math.min(pageStart + thumbPerPage, normalizedItems.length) }}</span>
              <button
                type="button"
                class="px-2 py-1 rounded hover:bg-white/10 disabled:opacity-40"
                :disabled="currentPage >= maxPage"
                @click="nextPage"
              >
                다음
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const VIDEO_EXT = new Set(['mp4', 'webm', 'mov']);

function mediaType(url: string): 'image' | 'video' {
  const ext = url.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXT.has(ext) ? 'video' : 'image';
}

const props = withDefaults(
  defineProps<{
    open: boolean;
    /** URL 목록 (이미지/동영상 구분은 확장자로 자동) */
    items: string[];
    /** 처음 열 때 보여줄 인덱스 */
    initialIndex?: number;
  }>(),
  { initialIndex: 0 }
);

const emit = defineEmits<{ (e: 'close'): void }>();

const currentIndex = ref(0);
const thumbPerPage = 10;

const normalizedItems = computed(() =>
  props.items.map((url) => ({ url, type: mediaType(url) as 'image' | 'video' }))
);

const currentItem = computed(() => normalizedItems.value[currentIndex.value] ?? null);

const maxPage = computed(() => Math.max(0, Math.ceil(normalizedItems.value.length / thumbPerPage) - 1));
const currentPage = computed(() => Math.min(maxPage.value, Math.floor(currentIndex.value / thumbPerPage)));
const pageStart = computed(() => currentPage.value * thumbPerPage);

watch(
  () => [props.open, props.initialIndex] as const,
  ([open, idx]) => {
    if (open) {
      const len = props.items.length;
      currentIndex.value = len ? Math.min(Math.max(0, idx ?? 0), len - 1) : 0;
    }
  },
  { immediate: true }
);

function close() {
  emit('close');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}
const hasDocument = typeof document !== 'undefined';
watch(
  () => props.open,
  (open) => {
    if (!hasDocument) return;
    if (open) {
      document.addEventListener('keydown', onKeydown);
    } else {
      document.removeEventListener('keydown', onKeydown);
    }
  },
  { immediate: true }
);
onUnmounted(() => {
  if (hasDocument) document.removeEventListener('keydown', onKeydown);
});
function prev() {
  if (normalizedItems.value.length <= 1) return;
  currentIndex.value = currentIndex.value <= 0 ? normalizedItems.value.length - 1 : currentIndex.value - 1;
}
function next() {
  if (normalizedItems.value.length <= 1) return;
  currentIndex.value = currentIndex.value >= normalizedItems.value.length - 1 ? 0 : currentIndex.value + 1;
}
function goTo(i: number) {
  currentIndex.value = i;
}
function prevPage() {
  if (currentPage.value > 0) currentIndex.value = (currentPage.value - 1) * thumbPerPage;
}
function nextPage() {
  if (currentPage.value < maxPage.value) currentIndex.value = (currentPage.value + 1) * thumbPerPage;
}
</script>

<style scoped>
.media-viewer-fade-enter-active,
.media-viewer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.media-viewer-fade-enter-from,
.media-viewer-fade-leave-to {
  opacity: 0;
}

.media-viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  cursor: pointer;
  z-index: 20;
  transition: background 0.2s, color 0.2s;
}
.media-viewer-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}
.media-viewer-nav--left {
  left: 12px;
}
.media-viewer-nav--right {
  right: 12px;
}
</style>
