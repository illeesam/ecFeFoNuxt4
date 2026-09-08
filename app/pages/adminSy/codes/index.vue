<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">코드관리</h1>
    <AdminSearchBar show-reset @search="fetchCodes" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">그룹코드</span>
          <input v-model="searchGrp" type="text" class="border rounded px-3 py-1.5 w-40" placeholder="그룹코드" />
        </label>
      </div>
    </AdminSearchBar>
    <div class="flex gap-4 mt-4">
      <div class="w-64 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-3 border-b border-gray-200 font-semibold bg-gray-50">그룹코드 목록</div>
        <ul class="max-h-[400px] overflow-y-auto">
          <li
            v-for="(grp, idx) in groupDisplayList"
            :key="grp"
            class="px-3 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition"
            :class="{ 'bg-amber-100 font-medium': selectedGrp === grp, 'bg-gray-50': selectedGrp !== grp && idx % 2 === 1 }"
            @click="selectGrp(grp)"
          >
            {{ grp }}
          </li>
        </ul>
        <AdminPagination v-model:page-no="groupPageNo" :page-size="groupPageSize" :total-count="groupTotalCount" :max-page-numbers="5" class="border-t" @update:page-no="applyGroupPage" @update:page-size="onGroupPageSizeChange" />
      </div>
      <div class="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <span class="font-semibold">상세코드 ({{ selectedGrp || "-" }})</span>
          <button type="button" class="px-3 py-1.5 bg-amber-600 text-white rounded text-sm hover:bg-amber-700" @click="openDetailForm()">+ 추가</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 border-b">
              <tr>
                <th class="p-2 text-left">codeId</th>
                <th class="p-2 text-left">value</th>
                <th class="p-2 text-left">label</th>
                <th class="w-20 p-2">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in detailDisplayList" :key="row.codeId" class="border-b hover:bg-gray-50">
                <td class="p-2">{{ row.codeId }}</td>
                <td class="p-2">{{ row.value }}</td>
                <td class="p-2">{{ row.label }}</td>
                <td class="p-2">
                  <button type="button" class="text-amber-600 hover:underline mr-2" @click="openDetailForm(row)">수정</button>
                  <button type="button" class="text-red-600 hover:underline" @click="deleteCode(row)">삭제</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="detailDisplayList.length === 0 && selectedGrp" class="p-8 text-center text-gray-500">코드가 없습니다. 추가 버튼을 눌러 등록하세요.</div>
        <AdminPagination v-model:page-no="detailPageNo" :page-size="detailPageSize" :total-count="detailTotalCount" @update:page-no="applyDetailPage" @update:page-size="onDetailPageSizeChange" />
      </div>
    </div>
    <!-- 상세코드 편집 폼 (인라인 또는 간단 모달) -->
    <div v-if="editForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="editForm = null">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="font-bold mb-4">{{ editForm.codeId ? "수정" : "추가" }}</h3>
        <div class="space-y-3">
          <label class="block">
            <span class="text-sm text-gray-600">value</span>
            <input v-model="editForm.value" type="text" class="border rounded px-3 py-2 w-full" />
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">코드명 <span class="text-red-500">*</span></span>
            <input v-model="editForm.label" type="text" class="border rounded px-3 py-2 w-full" />
          </label>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="button" class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700" @click="saveCode">저장</button>
          <button type="button" class="px-4 py-2 border rounded hover:bg-gray-50" @click="editForm = null">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { reactive } from "vue";
import { usePageTitle } from "~/composables/usePageTitle";
definePageMeta({ layout: "admin" });
usePageTitle("코드관리");

const codeSchema = yup.object({
  label: yup.string().required("코드명을 입력해 주세요").label("코드명"),
});

type CodeRow = { codeId: number; grpCode: string; value: string; label: string };

const searchGrp = ref("");
const allCodes = reactive<CodeRow[]>([]);
const selectedGrp = ref("");
const editForm = ref<{ codeId?: number; grpCode: string; value: string; label: string } | null>(null);

const groupPageNo = ref(1);
const groupPageSize = ref(10);
const groupList = computed(() => {
  const set = new Set(allCodes.map((c) => c.grpCode));
  return Array.from(set).sort();
});
const groupTotalCount = computed(() => groupList.value.length);
const groupDisplayList = computed(() => {
  const start = (groupPageNo.value - 1) * groupPageSize.value;
  return groupList.value.slice(start, start + groupPageSize.value);
});

const detailPageNo = ref(1);
const detailPageSize = ref(10);
const detailList = computed(() => allCodes.filter((c) => c.grpCode === selectedGrp.value));
const detailTotalCount = computed(() => detailList.value.length);
const detailDisplayList = computed(() => {
  const start = (detailPageNo.value - 1) * detailPageSize.value;
  return detailList.value.slice(start, start + detailPageSize.value);
});

function selectGrp(grp: string) {
  selectedGrp.value = grp;
  detailPageNo.value = 1;
}
function applyGroupPage() {}
function applyDetailPage() {}
function onGroupPageSizeChange(v: number) {
  groupPageSize.value = v;
  groupPageNo.value = 1;
}
function onDetailPageSizeChange(v: number) {
  detailPageSize.value = v;
  detailPageNo.value = 1;
}

async function fetchCodes() {
  try {
    const res = await $fetch<CodeRow[]>("/api/codes");
    const data = res ?? [];
    allCodes.splice(0, allCodes.length, ...data);
    const firstGrp = groupList.value[0];
    if (!selectedGrp.value && firstGrp !== undefined) selectedGrp.value = firstGrp;
    groupPageNo.value = 1;
    detailPageNo.value = 1;
  } catch {
    allCodes.splice(0, allCodes.length);
  }
}

function resetSearch() {
  searchGrp.value = "";
  fetchCodes();
}

function openDetailForm(row?: CodeRow) {
  if (!selectedGrp.value && !row) return;
  editForm.value = row ? { codeId: row.codeId, grpCode: row.grpCode, value: row.value, label: row.label } : { grpCode: selectedGrp.value, value: "", label: "" };
}

async function saveCode() {
  if (!editForm.value) return;
  try {
    await codeSchema.validate({ label: editForm.value.label });
  } catch (e: unknown) {
    const err = e as yup.ValidationError;
    await useAlert().openAlert(err.message ?? "입력값을 확인해 주세요.");
    return;
  }
  // TODO: API POST/PUT 코드 저장
  await useAlert().openAlert("저장 기능은 API 연동 후 구현됩니다.");
  editForm.value = null;
  fetchCodes();
}

async function deleteCode(row: CodeRow) {
  const ok = await useConfirm().openConfirm({
    title: "삭제 확인",
    message: `코드 [${row.label}]을 삭제할까요?`,
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
  });
  if (!ok) return;
  // TODO: API DELETE
  fetchCodes();
}

onMounted(fetchCodes);
</script>
