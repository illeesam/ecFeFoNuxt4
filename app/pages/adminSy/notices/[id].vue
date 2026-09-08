<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminSy/notices" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminSy/notices', '공지사항관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '공지사항 등록' : mode === 'edit' ? '공지사항 수정' : '공지사항 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <template v-if="mode === 'view' && notice">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">공지ID</dt>
            <dd class="min-w-0 break-words">{{ notice.noticeId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">공지제목</dt>
            <dd class="min-w-0 break-words">{{ notice.noticeTitle }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">공지유형</dt>
            <dd class="min-w-0 break-words">{{ noticeTypeLabel(notice.noticeType) }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-start min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0 pt-1">공지콘텐츠</dt>
            <dd class="min-w-0 break-words whitespace-pre-wrap">{{ notice.noticeContent || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">공지상태</dt>
            <dd class="min-w-0 break-words">{{ notice.status === "0" ? "정상" : "비표시" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-start min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0 pt-1">첨부파일</dt>
            <dd class="min-w-0 overflow-hidden pr-2">
              <template v-if="attachments.list.length">
                <ul class="space-y-1">
                  <li v-for="a in attachments.list" :key="a.attachId" class="flex items-center gap-2 min-w-0">
                    <a :href="a.url" target="_blank" rel="noopener" class="text-amber-600 hover:underline truncate">{{ a.fileNm }}</a>
                    <span class="text-gray-400 text-xs shrink-0">({{ formatSize(a.fileSize) }})</span>
                  </li>
                </ul>
              </template>
              <span v-else class="text-gray-400">없음</span>
            </dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">생성자</dt>
            <dd class="min-w-0 break-words">{{ notice.createBy || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">생성시간</dt>
            <dd class="min-w-0 break-words">{{ notice.createTime || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">변경자</dt>
            <dd class="min-w-0 break-words">{{ notice.updateBy || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">변경시간</dt>
            <dd class="min-w-0 break-words">{{ notice.updateTime || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">설명</dt>
            <dd class="min-w-0 break-words">{{ notice.remark || "-" }}</dd>
          </div>
        </dl>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminSy/notices/${notice.noticeId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <template v-else-if="mode === 'edit' || mode === 'new'">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">공지ID</label>
              <input :value="notice?.noticeId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">공지사항제목 <span class="text-red-500">*</span></label>
              <input v-model="form.noticeTitle" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="200" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">공지유형</label>
              <select v-model="form.noticeType" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full">
                <option value="1">알림</option>
                <option value="2">공지</option>
              </select>
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-start min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0 pt-2">공지콘텐츠</label>
              <textarea v-model="form.noticeContent" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full min-h-[120px]" maxlength="5000" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">공지상태</label>
              <select v-model="form.status" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full">
                <option value="0">정상</option>
                <option value="1">비표시</option>
              </select>
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">설명</label>
              <input v-model="form.remark" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="255" />
            </div>
            <!-- 파일 첨부 -->
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-start min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0 pt-2">파일첨부</label>
              <div class="space-y-2 min-w-0 w-full max-w-full">
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.txt,.csv,.zip,.rar,.7z"
                class="border rounded px-2 py-1.5 text-sm w-full"
                @change="onFileSelect"
              />
              <p class="text-xs text-gray-500">이미지, 동영상, 문서(PDF/오피스/HWP), 압축파일. 여러 개 선택 가능. 50MB 이하.</p>
              <!-- 기존 첨부 (수정 시) -->
              <ul v-if="mode === 'edit' && attachments.list.length" class="border rounded divide-y text-sm">
                <li v-for="a in attachments.list" :key="a.attachId" class="flex items-center justify-between px-3 py-2">
                  <a :href="a.url" target="_blank" class="text-amber-600 hover:underline truncate flex-1">{{ a.fileNm }}</a>
                  <button type="button" class="ml-2 text-red-600 hover:underline shrink-0" @click="removeAttach(a.attachId)">삭제</button>
                </li>
              </ul>
              <!-- 새로 선택한 파일 (아직 업로드 전) -->
              <ul v-if="pendingFiles.length" class="border rounded divide-y text-sm text-gray-600">
                <li v-for="(f, idx) in pendingFiles" :key="idx" class="flex items-center justify-between px-3 py-2">
                  <span class="truncate flex-1">{{ f.name }}</span>
                  <button type="button" class="ml-2 text-red-600 hover:underline shrink-0" @click="removePending(idx)">제거</button>
                </li>
              </ul>
            </div>
          </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700" :disabled="saving">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminSy/notices' : `/adminSy/notices/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !notice && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { usePageTitle } from "~/composables/usePageTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });

const noticeSchema = yup.object({
  noticeTitle: yup.string().required("공지사항제목을 입력해 주세요").label("공지사항제목"),
});
usePageTitle("공지사항 상세");
const { goToList } = useAdminListNav();

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

type Notice = {
  noticeId: string;
  noticeTitle: string;
  noticeType: string;
  noticeContent?: string;
  status: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
};

type AttachRow = {
  attachId: number;
  fileNm: string;
  physicalNm: string;
  ext: string;
  fileSize?: number;
  mimeType?: string;
  url: string;
  sortOrder: number;
};

const notice = ref<Notice | null>(null);
const loading = ref(false);
const saving = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const form = reactive({
  noticeTitle: "",
  noticeType: "1",
  noticeContent: "",
  status: "0",
  remark: "",
});
const attachments = reactive<{ list: AttachRow[] }>({ list: [] });
const pendingFiles = ref<File[]>([]);

function noticeTypeLabel(t: string) {
  return t === "1" ? "알림" : t === "2" ? "공지" : t;
}

function formatSize(n: number | undefined) {
  if (n == null) return "-";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(1) + " MB";
}

const pageTitle = computed(() => {
  if (mode.value === "new") return "공지사항 등록";
  if (notice.value) return `공지상세(${notice.value.noticeId})`;
  return entityId.value ? `공지상세(${entityId.value})` : "공지사항 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function loadAttachments(noticeId: string) {
  try {
    const { list } = await $fetch<{ list: AttachRow[] }>(`/api/sy/notices/${noticeId}/attachments`);
    attachments.list = list ?? [];
  } catch {
    attachments.list = [];
  }
}

async function load() {
  if (mode.value === "new") {
    attachments.list = [];
    pendingFiles.value = [];
    return;
  }
  if (!entityId.value) return;
  loading.value = true;
  try {
    const data = await $fetch<Notice>(`/api/sy/notices/${entityId.value}`);
    notice.value = data;
    if (notice.value && mode.value === "edit") {
      form.noticeTitle = notice.value.noticeTitle;
      form.noticeType = notice.value.noticeType;
      form.noticeContent = notice.value.noticeContent ?? "";
      form.status = notice.value.status;
      form.remark = notice.value.remark ?? "";
    }
    await loadAttachments(entityId.value);
  } catch (e: any) {
    if (e?.statusCode === 404) notice.value = null;
    else throw e;
  } finally {
    loading.value = false;
  }
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const add = Array.from(input.files);
  pendingFiles.value = [...pendingFiles.value, ...add];
  input.value = "";
}

function removePending(idx: number) {
  pendingFiles.value = pendingFiles.value.filter((_, i) => i !== idx);
}

async function removeAttach(attachId: number) {
  const ok = await useConfirm().openConfirm({
    title: "삭제 확인",
    message: "이 첨부파일을 삭제할까요?",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
  });
  if (!ok) return;
  await $fetch(`/api/sy/attachments/${attachId}`, { method: "DELETE" });
  attachments.list = attachments.list.filter((a) => a.attachId !== attachId);
}

async function uploadPendingFiles(noticeId: string) {
  if (!pendingFiles.value.length) return;
  const formData = new FormData();
  for (const f of pendingFiles.value) formData.append("files", f);
  await $fetch(`/api/sy/notices/${noticeId}/attachments`, {
    method: "POST",
    body: formData,
  });
  pendingFiles.value = [];
  await loadAttachments(noticeId);
}

async function save() {
  try {
    await noticeSchema.validate({ noticeTitle: form.noticeTitle });
  } catch (e: unknown) {
    const err = e as yup.ValidationError;
    await useAlert().openAlert(err.message ?? "입력값을 확인해 주세요.");
    return;
  }
  saving.value = true;
  try {
    if (mode.value === "new") {
      const { noticeId } = await $fetch<{ noticeId: string }>("/api/sy/notices", {
        method: "POST",
        body: {
          noticeTitle: form.noticeTitle.trim(),
          noticeType: form.noticeType,
          noticeContent: form.noticeContent.trim() || undefined,
          status: form.status,
          remark: form.remark.trim() || undefined,
        },
      });
      await uploadPendingFiles(noticeId);
      await navigateTo(`/adminSy/notices/${noticeId}`);
    } else {
      await $fetch(`/api/sy/notices/${entityId.value}`, {
        method: "PUT",
        body: {
          noticeTitle: form.noticeTitle.trim(),
          noticeType: form.noticeType,
          noticeContent: form.noticeContent.trim() || undefined,
          status: form.status,
          remark: form.remark.trim() || undefined,
        },
      });
      await uploadPendingFiles(entityId.value!);
      await navigateTo(`/adminSy/notices/${entityId.value}`);
    }
  } catch (e: any) {
    await useAlert().openAlert(e?.data?.message || e?.message || "저장에 실패했습니다.");
  } finally {
    saving.value = false;
  }
}

watch([rawId, mode], load, { immediate: true });
</script>
