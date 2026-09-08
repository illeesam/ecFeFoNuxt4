<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminEc/members" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminEc/members', '회원관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '회원 등록' : mode === 'edit' ? '회원 수정' : '회원 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <!-- 상세(보기): 라벨 고정폭(5.5rem) + 값 min-w-0 -->
      <template v-if="mode === 'view' && member">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">회원ID</dt>
            <dd class="min-w-0 break-words">{{ member.memberId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">이름</dt>
            <dd class="min-w-0 break-words">{{ member.name }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">이메일</dt>
            <dd class="min-w-0 break-words">{{ member.email }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">연락처</dt>
            <dd class="min-w-0 break-words">{{ member.phone }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">상태</dt>
            <dd class="min-w-0 break-words">{{ member.status }}</dd>
          </div>
        </dl>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminEc/members/${member.memberId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <!-- 신규/수정 폼: 라벨 5.5rem + 입력 min-w-0 -->
      <template v-else>
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">회원ID</label>
              <input :value="member?.memberId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">회원명 <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">이메일</label>
              <input v-model="form.email" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">연락처</label>
              <input v-model="form.phone" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">상태</label>
              <input v-model="form.status" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminEc/members' : `/adminEc/members/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !member && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { usePageTitle } from "~/composables/usePageTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });
usePageTitle("회원 상세");
const { goToList } = useAdminListNav();

const memberSchema = yup.object({
  name: yup.string().required("회원명을 입력해 주세요").label("회원명"),
});

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

const member = ref<{ memberId: number; name: string; email: string; phone: string; status: string } | null>(null);
const loading = ref(false);
const form = reactive({ name: "", email: "", phone: "", status: "정상" });

const pageTitle = computed(() => {
  if (mode.value === "new") return "회원 등록";
  if (member.value) return `회원상세(${member.value.memberId})`;
  return entityId.value ? `회원상세(${entityId.value})` : "회원 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function load() {
  if (!entityId.value) return;
  loading.value = true;
  try {
    // TODO: API /adminEc/members/:id
    member.value = {
      memberId: Number(entityId.value),
      name: "김회원",
      email: "member1@example.com",
      phone: "010-1111-2222",
      status: "정상",
    };
    if (mode.value === "edit") {
      form.name = member.value.name;
      form.email = member.value.email;
      form.phone = member.value.phone;
      form.status = member.value.status;
    }
  } finally {
    loading.value = false;
  }
}

async function save() {
  try {
    await memberSchema.validate({ name: form.name });
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
