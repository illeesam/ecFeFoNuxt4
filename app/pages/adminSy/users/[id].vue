<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminSy/users" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminSy/users', '사용자관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '사용자 등록' : mode === 'edit' ? '사용자 수정' : '사용자 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <!-- 상세(보기): 라벨 5.5rem + 값 min-w-0 -->
      <template v-if="mode === 'view' && user">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">사용자ID</dt>
            <dd class="min-w-0 break-words">{{ user.userId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">로그인ID</dt>
            <dd class="min-w-0 break-words">{{ user.loginId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">이름</dt>
            <dd class="min-w-0 break-words">{{ user.name }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">이메일</dt>
            <dd class="min-w-0 break-words">{{ user.email }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">역할</dt>
            <dd class="min-w-0 break-words">{{ user.role }}</dd>
          </div>
        </dl>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminSy/users/${user.userId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <!-- 신규/수정 폼: 라벨 5.5rem + 입력 min-w-0 -->
      <template v-else-if="mode === 'edit' || mode === 'new'">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">사용자ID</label>
              <input :value="user?.userId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">로그인ID</label>
              <input v-model="form.loginId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">사용자명 <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">이메일</label>
              <input v-model="form.email" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">역할</label>
              <input v-model="form.role" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminSy/users' : `/adminSy/users/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !user && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { usePageTitle } from "~/composables/usePageTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });
usePageTitle("사용자 상세");
const { goToList } = useAdminListNav();

const userSchema = yup.object({
  name: yup.string().required("사용자명을 입력해 주세요").label("사용자명"),
});

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

const user = ref<{ userId: number; loginId: string; name: string; email: string; role: string } | null>(null);
const loading = ref(false);
const form = reactive({ loginId: "", name: "", email: "", role: "USER" });

const pageTitle = computed(() => {
  if (mode.value === "new") return "사용자 등록";
  if (user.value) return `사용자상세(${user.value.userId})`;
  return entityId.value ? `사용자상세(${entityId.value})` : "사용자 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function load() {
  if (mode.value === "new") return;
  if (!entityId.value) return;
  loading.value = true;
  try {
    // TODO: API /adminSy/users/:id
    user.value = { userId: Number(entityId.value), loginId: "admin", name: "관리자", email: "admin@example.com", role: "ADMIN" };
    if (user.value && mode.value === "edit") {
      form.loginId = user.value.loginId;
      form.name = user.value.name;
      form.email = user.value.email;
      form.role = user.value.role;
    }
  } finally {
    loading.value = false;
  }
}

async function save() {
  try {
    await userSchema.validate({ name: form.name });
  } catch (e: unknown) {
    const err = e as yup.ValidationError;
    await useAlert().openAlert(err.message ?? "입력값을 확인해 주세요.");
    return;
  }
  // TODO: API POST/PUT
  await useAlert().openAlert("저장 기능은 API 연동 후 구현됩니다.");
}

watch([rawId, mode], load, { immediate: true });
</script>
