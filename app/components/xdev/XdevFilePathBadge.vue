<template>
  <span ref="markerRef" style="display: none" />
</template>

<script setup lang="ts">
type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const props = defineProps<{
  filePath: string | null;
  absolute?: boolean;
  position?: Position;
}>();

const config = useRuntimeConfig();
const isLocal = config.public.mode === "local";
const { register, unregister, checkedIds, hoveredId, registerInstanceAccessors, registerDataAccessor, registerDomEl, unregisterDomEl } =
  useFilePathBadgeRegistry();

const id = Math.random().toString(36).slice(2);
const markerRef = ref<HTMLElement | null>(null);

// 이 배지를 포함하는 컴포넌트 인스턴스
const componentInstance = getCurrentInstance()?.parent;
const instanceUid = componentInstance?.uid;
const parentInstanceUid = componentInstance?.parent?.uid;

const isHighlighted = computed(() => checkedIds.value.includes(id));
const isHovered = computed(() => hoveredId.value === id);

watch([isHighlighted, isHovered], ([highlighted, hovered]) => {
  const el = markerRef.value?.parentElement as HTMLElement | null;
  if (!el) return;
  // checked: inset box-shadow (outline과 충돌 없음)
  el.style.boxShadow = highlighted ? "inset 0 0 0 3px #f59e0b" : "";
  // hover: outline 10px dashed (checked와 동시에 표시 가능)
  if (hovered) {
    el.style.outline = "6px dashed rgba(99, 102, 241, 0.55)";
    el.style.outlineOffset = "-3px";
  } else {
    el.style.outline = "";
    el.style.outlineOffset = "";
  }
});

onBeforeUnmount(() => {
  const el = markerRef.value?.parentElement as HTMLElement | null;
  if (el) {
    el.style.outline = "";
    el.style.outlineOffset = "";
    el.style.boxShadow = "";
  }
});

onMounted(() => {
  if (!isLocal || !props.filePath) return;

  register(id, props.filePath, instanceUid, parentInstanceUid);

  const parentEl = markerRef.value?.parentElement as HTMLElement | null;
  if (parentEl) registerDomEl(id, parentEl);

  // data getter + setter: 현재 인스턴스의 setupState
  registerDataAccessor(
    id,
    () => {
      if (!componentInstance) return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const setupState = (componentInstance as any).setupState as Record<string, unknown> | null;
      if (!setupState || typeof setupState !== 'object') return null;
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(setupState)) {
        if (key.startsWith('__') || key.startsWith('$')) continue;
        try { result[key] = typeof val === 'function' ? '[Function]' : val; } catch { /* skip */ }
      }
      return Object.keys(result).length > 0 ? result : null;
    },
    (newData) => {
      if (!componentInstance) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const setupState = (componentInstance as any).setupState as Record<string, unknown> | undefined;
      if (!setupState || typeof setupState !== 'object') return;
      for (const [key, value] of Object.entries(newData)) {
        if (key.startsWith('__') || key.startsWith('$')) continue;
        if (value === '[Function]') continue;
        try { setupState[key] = value; } catch { /* skip */ }
      }
    }
  );

  // props getter: 현재 인스턴스의 props를 직렬화 가능한 형태로 반환
  registerInstanceAccessors(
    id,
    () => {
      if (!componentInstance) return null;
      const raw = componentInstance.props as Record<string, unknown>;
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(raw)) {
        if (key.startsWith("__")) continue;
        result[key] = typeof val === "function" ? "[Function]" : val;
      }
      return result;
    },
    // props setter: 직접 mutation (dev 전용)
    (newProps) => {
      if (!componentInstance) return;
      const propsProxy = componentInstance.props as Record<string, unknown>;
      for (const [key, value] of Object.entries(newProps)) {
        if (value === "[Function]") continue;
        propsProxy[key] = value;
      }
    }
  );
});

onUnmounted(() => {
  unregister(id);
  unregisterDomEl(id);
});
</script>
