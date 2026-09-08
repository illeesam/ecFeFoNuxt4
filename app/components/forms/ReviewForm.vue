<template>
  <form id="contacts-form" class="conatct-post-form" @submit.prevent="handleSubmit">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="row">
      <div class="col-xl-12">
        <div class="contact-icon relative contacts-name">
          <input v-model="name" type="text" placeholder="이름" required />
        </div>
      </div>
      <div class="col-xl-12">
        <div class="contact-icon relative contacts-message">
          <textarea v-model="content" name="comments" id="comments" cols="30" rows="10" placeholder="내용"></textarea>
        </div>
      </div>
      <!-- 첨부: 답글일 때는 숨김 -->
      <div v-if="!isReply" class="col-xl-12 mb-20">
        <label class="block mb-2 font-medium">이미지·동영상 첨부 (최대 10개, 총 30MB)</label>
        <input
          ref="fileInputRef"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov"
          multiple
          class="hidden"
          @change="onFileSelect"
        />
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="os-btn os-btn-black" :disabled="files.length >= MAX_FILES" @click="triggerFileInput">
            파일 선택
          </button>
          <button type="button" class="os-btn" :disabled="files.length >= MAX_FILES" @click="triggerFileInput">
            [추가]
          </button>
          <span class="text-gray-500 text-sm">{{ files.length }} / {{ MAX_FILES }}개, {{ totalSizeMb }} / {{ MAX_SIZE_MB }}MB</span>
        </div>
        <p v-if="attachError" class="text-danger text-sm mt-2">{{ attachError }}</p>
        <ul v-if="files.length" class="mt-3 space-y-2">
          <li v-for="(f, i) in files" :key="i" class="flex items-center gap-2 text-sm">
            <span class="truncate flex-1">{{ f.name }}</span>
            <span class="text-gray-400">({{ formatSize(f.size) }})</span>
            <button type="button" class="text-red-600 hover:underline" @click="removeFile(i)">삭제</button>
          </li>
        </ul>
      </div>
      <div class="col-xl-12">
        <button class="os-btn os-btn-black" type="submit" :disabled="loading">
          {{ loading ? "등록 중..." : (isReply ? "답글 등록" : "댓글 등록") }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle("리뷰 폼");
import { useNuxtApp } from "#app/nuxt";

const MAX_FILES = 10;
const MAX_SIZE_MB = 30;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_EXT = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "mp4",
  "webm",
  "mov",
];

const props = defineProps<{
  productId: number;
  rating: number;
  /** 답글 모드: 지정 시 이름+내용만, 별점·첨부 없음 */
  parentReviewId?: number;
}>();

const emit = defineEmits<{ (e: "submitted"): void }>();

const isReply = computed(() => Number.isInteger(props.parentReviewId) && (props.parentReviewId as number) > 0);

const name = ref("");
const content = ref("");
const loading = ref(false);
const files = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const attachError = ref("");

const totalSizeMb = computed(() => {
  const total = files.value.reduce((s, f) => s + f.size, 0);
  return (total / (1024 * 1024)).toFixed(2);
});

function getExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function isAllowedExt(file: File): boolean {
  return ALLOWED_EXT.includes(getExt(file.name));
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function triggerFileInput() {
  attachError.value = "";
  fileInputRef.value?.click();
}

function onFileSelect(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const added = input.files ? Array.from(input.files) : [];
  input.value = "";

  for (const file of added) {
    if (!isAllowedExt(file)) {
      attachError.value = `지원하지 않는 확장자입니다: ${file.name} (허용: ${ALLOWED_EXT.join(", ")})`;
      return;
    }
  }

  const next = [...files.value];
  let totalBytes = next.reduce((s, f) => s + f.size, 0);

  for (const file of added) {
    if (next.length >= MAX_FILES) {
      attachError.value = `첨부는 최대 ${MAX_FILES}개까지 가능합니다.`;
      break;
    }
    if (totalBytes + file.size > MAX_SIZE_BYTES) {
      attachError.value = `총 용량은 ${MAX_SIZE_MB}MB를 초과할 수 없습니다.`;
      break;
    }
    next.push(file);
    totalBytes += file.size;
  }
  files.value = next;
}

function removeFile(index: number) {
  files.value = files.value.filter((_, i) => i !== index);
  attachError.value = "";
}

async function handleSubmit() {
  const nameTrim = name.value.trim();
  if (!nameTrim) {
    useNuxtApp().$toast?.error?.("이름을 입력해 주세요.");
    return;
  }
  if (!isReply.value && (props.rating < 0.5 || !props.productId)) {
    useNuxtApp().$toast?.error?.("별점을 선택해 주세요.");
    return;
  }
  loading.value = true;
  attachError.value = "";
  try {
    if (isReply.value && props.parentReviewId) {
      const res = await $fetch<{ success?: boolean; message?: string }>(`/api/products/${props.productId}/reviews`, {
        method: "POST",
        body: { name: nameTrim, content: content.value.trim(), parentReviewId: props.parentReviewId },
      });
      if (res?.success) {
        useNuxtApp().$toast?.success?.(res.message ?? "답글이 등록되었습니다.");
        content.value = "";
        emit("submitted");
      }
    } else {
      const formData = new FormData();
      formData.append("name", nameTrim);
      formData.append("content", content.value.trim());
      formData.append("rating", String(props.rating));
      files.value.forEach((f) => formData.append("files", f));
      const res = await $fetch<{ success?: boolean; message?: string }>(`/api/products/${props.productId}/reviews`, {
        method: "POST",
        body: formData,
      });
      if (res?.success) {
        useNuxtApp().$toast?.success?.(res.message ?? "리뷰가 등록되었습니다.");
        content.value = "";
        files.value = [];
        emit("submitted");
      }
    }
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message ?? (isReply.value ? "답글 등록에 실패했습니다." : "리뷰 등록에 실패했습니다.");
    useNuxtApp().$toast?.error?.(msg);
  } finally {
    loading.value = false;
  }
}
</script>
