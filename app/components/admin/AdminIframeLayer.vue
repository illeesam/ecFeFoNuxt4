<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[99]"
      @click.self="onBackdropClick"
    >
      <div class="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        class="fixed z-10 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        :style="panelStyle"
        @click.stop
      >
        <!-- 드래그 핸들: 상단 바 클릭/터치 후 드래그로 이동 (Pointer Events로 마우스·터치 공통 처리) -->
        <div
          ref="dragHandleRef"
          class="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50 cursor-move select-none admin-iframe-layer-drag"
          @pointerdown.prevent="startDrag"
        >
          <span class="text-sm font-semibold text-gray-800">{{ title }}</span>
          <button
            type="button"
            class="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
            aria-label="닫기"
            @pointerdown.stop
            @click="close"
          >
            &times;
          </button>
        </div>
        <iframe
          v-if="src"
          :src="src"
          class="flex-1 min-h-0 w-full border-0"
          :title="title"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    src?: string;
    title?: string;
    width?: number;
    height?: number;
    /** iframe에서 postMessage로 올 때 선택 완료 메시지 타입 (지정 시 레이어가 수신 후 onSelect 콜백 호출) */
    selectMessageType?: string;
    /** iframe에서 postMessage로 올 때 닫기 메시지 타입 (지정 시 레이어가 수신 후 onClose 호출·레이어 닫기) */
    closeMessageType?: string;
    /** 선택 완료 시 콜백 (payload: postMessage payload) */
    onSelect?: (payload: unknown) => void;
    /** 닫기 요청 시 콜백 (레이어는 그대로 닫기 emit 수행) */
    onClose?: () => void;
  }>(),
  {
    src: "",
    title: "레이어",
    width: 900,
    height: 620,
    selectMessageType: "",
    closeMessageType: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const dragHandleRef = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const drag = ref({
  active: false,
  pointerId: 0,
  startX: 0,
  startY: 0,
  startLeft: 0,
  startTop: 0,
});

const panelStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  width: `${props.width}px`,
  height: `${props.height}px`,
  maxWidth: `min(100vw - 24px, ${props.width}px)`,
  maxHeight: `min(100vh - 24px, ${props.height}px)`,
}));

function centerPosition() {
  if (typeof window === "undefined") return;
  const w = Math.min(props.width, window.innerWidth - 24);
  const h = Math.min(props.height, window.innerHeight - 24);
  position.value = {
    x: Math.max(0, (window.innerWidth - w) / 2),
    y: Math.max(0, (window.innerHeight - h) / 2),
  };
}

function close() {
  emit("update:modelValue", false);
}

function onBackdropClick() {
  close();
}

function startDrag(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture?.(e.pointerId);
  drag.value = {
    active: true,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    startLeft: position.value.x,
    startTop: position.value.y,
  };
}

function onDrag(e: PointerEvent) {
  if (!drag.value.active) return;
  const dx = e.clientX - drag.value.startX;
  const dy = e.clientY - drag.value.startY;
  position.value = {
    x: Math.max(0, drag.value.startLeft + dx),
    y: Math.max(0, drag.value.startTop + dy),
  };
}

function endDrag() {
  if (drag.value.active && dragHandleRef.value) {
    try {
      dragHandleRef.value.releasePointerCapture?.(drag.value.pointerId);
    } catch {
      // ignore
    }
  }
  drag.value.active = false;
}

function handleMessage(e: MessageEvent) {
  if (typeof window === "undefined") return;
  if (e.origin !== window.location.origin) return;
  const type = e.data?.type as string | undefined;
  if (!type) return;
  if (props.closeMessageType && type === props.closeMessageType) {
    props.onClose?.();
    close();
    return;
  }
  if (props.selectMessageType && type === props.selectMessageType) {
    const payload = e.data?.payload;
    props.onSelect?.(payload);
    close();
  }
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      centerPosition();
      if (typeof window !== "undefined" && (props.selectMessageType || props.closeMessageType)) {
        window.addEventListener("message", handleMessage);
      }
    } else {
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleMessage);
      }
    }
  }
);

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("pointermove", onDrag, { passive: true });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  }
});
onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
    window.removeEventListener("message", handleMessage);
  }
});
</script>

<style scoped>
.admin-iframe-layer-drag {
  touch-action: none;
}
</style>
