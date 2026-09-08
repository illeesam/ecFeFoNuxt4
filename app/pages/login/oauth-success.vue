<template>
  <layout :transparent="true">
    <div class="min-h-[40vh] flex items-center justify-center">
      <p class="text-gray-600">{{ message }}</p>
    </div>
  </layout>
</template>

<script setup lang="ts">
import Layout from "~/layout/Layout.vue";
import { useAuthStore } from "~/store/useAuthStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const message = ref("로그인 처리 중...");

onMounted(() => {
  const token = route.query.token as string;
  if (!token) {
    message.value = "토큰이 없습니다.";
    router.replace("/login");
    return;
  }
  authStore.setToken(token);
  authStore.loadStAuthInfo().then(() => {
    router.replace("/");
  });
});

useHead({ title: "로그인 완료" });
</script>
