<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminCo/sites" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminCo/sites', '사이트관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '사이트 등록' : mode === 'edit' ? '사이트 수정' : '사이트 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <template v-if="mode === 'view' && site">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">사이트ID</dt>
            <dd class="min-w-0 break-words">{{ site.siteId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">사이트명</dt>
            <dd class="min-w-0 break-words">{{ site.siteNm }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">사용여부</dt>
            <dd class="min-w-0 break-words">{{ site.useYn }}</dd>
          </div>
        </dl>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminCo/sites/${site.siteId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <template v-else-if="mode === 'edit' || mode === 'new'">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">사이트ID</label>
              <input :value="site?.siteId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">사이트명</label>
              <input v-model="form.siteNm" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="255" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">사용여부</label>
              <select v-model="form.useYn" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full">
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminCo/sites' : `/adminCo/sites/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !site && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageTitle } from "~/composables/usePageTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });
usePageTitle("사이트 상세");
const { goToList } = useAdminListNav();

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

const site = ref<{ siteId: number; siteNm: string; useYn: string } | null>(null);
const loading = ref(false);
const form = reactive({ siteNm: "", useYn: "Y" });

const pageTitle = computed(() => {
  if (mode.value === "new") return "사이트 등록";
  if (site.value) return `사이트상세(${site.value.siteId})`;
  return entityId.value ? `사이트상세(${entityId.value})` : "사이트 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function load() {
  if (mode.value === "new") return;
  if (!entityId.value) return;
  loading.value = true;
  try {
    // TODO: API /api/co/sites/:id
    site.value = { siteId: Number(entityId.value), siteNm: "메인사이트", useYn: "Y" };
    if (site.value && mode.value === "edit") {
      form.siteNm = site.value.siteNm;
      form.useYn = site.value.useYn;
    }
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!form.siteNm.trim()) {
    await useAlert().openAlert("사이트명을 입력하세요.");
    return;
  }
  // TODO: API POST/PUT
  await useAlert().openAlert("저장 기능은 API 연동 후 구현됩니다.");
}

watch([rawId, mode], load, { immediate: true });
</script>
