<template>
  <div class="xdev-open-comp">
    <div v-if="error" class="xdev-open-comp-error">{{ error }}</div>
    <component v-else-if="resolvedComponent" :key="componentPath" :is="resolvedComponent" />
  </div>
</template>

<script setup lang="ts">
import { markRaw, shallowRef } from "vue";

const route = useRoute();
const componentPath = computed(() => (route.query.component as string) || "");

const resolvedComponent = shallowRef<object | null>(null);
const error = ref("");

const componentModules = import.meta.glob("~/components/**/*.vue");

async function loadComponent() {
  resolvedComponent.value = null;
  error.value = "";
  const path = componentPath.value.trim();
  if (!path) {
    error.value = "컴포넌트 경로를 지정해주세요. (query: component=경로)";
    return;
  }
  const normalized = path.replace(/\.vue$/i, "");
  const suffix = `${normalized}.vue`;
  const key = Object.keys(componentModules).find((k) => k.endsWith(suffix) || k.includes(`/${normalized}.vue`));
  const loader = key ? componentModules[key] : undefined;
  if (!loader) {
    error.value = `컴포넌트를 찾을 수 없습니다: ${normalized}.vue`;
    return;
  }
  try {
    const comp = await loader();
    const componentDef = (comp as { default?: object }).default ?? comp;
    resolvedComponent.value = markRaw(componentDef as object);
  } catch (e) {
    error.value = `컴포넌트를 불러올 수 없습니다: ${normalized}.vue`;
    console.error(e);
  }
}

watch(componentPath, loadComponent, { immediate: true });
</script>

<style scoped>
.xdev-open-comp {
  min-height: 100vh;
  padding: 1rem;
  background: #f9fafb;
}
.xdev-open-comp-error {
  color: #dc2626;
  font-size: 0.9rem;
  padding: 1rem;
}
</style>
