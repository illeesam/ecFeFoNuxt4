<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-xl font-bold text-gray-800 text-center mb-6">관리자 로그인</h1>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <label class="block">
          <span class="text-sm text-gray-600">아이디</span>
          <input
            v-model="form.loginId"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="아이디"
            autocomplete="username"
          />
        </label>
        <label class="block">
          <span class="text-sm text-gray-600">비밀번호</span>
          <input
            v-model="form.password"
            type="password"
            class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="비밀번호"
            autocomplete="current-password"
          />
        </label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <button
          type="submit"
          class="w-full py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition"
        >
          로그인
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-500">
        <NuxtLink to="/" class="text-amber-600 hover:underline">쇼핑몰로 돌아가기</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageTitle } from "~/composables/usePageTitle";
definePageMeta({ layout: false });
usePageTitle("관리자 로그인");

const form = reactive({ loginId: "", password: "" });
const error = ref("");

function onSubmit() {
  error.value = "";
  if (!form.loginId.trim()) {
    error.value = "아이디를 입력하세요.";
    return;
  }
  if (!form.password) {
    error.value = "비밀번호를 입력하세요.";
    return;
  }
  // TODO: API 로그인 연동
  navigateTo("/adminEc", { replace: true });
}
</script>
