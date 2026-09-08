<template>
  <layout :transparent="true">
    <breadcrumb-area title="오류" subtitle="오류" />
    <!-- 에러 영역 시작 -->
    <section class="error__area pt-60 pb-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="col-xl-8 offset-xl-2 col-lg-8 offset-lg-2">
          <div class="error__content text-center">
            <div class="error__number">
              <h1>{{ error.statusCode }}</h1>
            </div>
            <span>오류: {{ error.message }}</span>
            <h2>찾으시는 페이지가 없습니다</h2>
            <p>
              요청하신 페이지가 이동되었거나 홈페이지로 돌아가시거나, 문제가 계속되면
              <span class="highlight comment">illeddam@gmail.com</span>으로 문의해 주세요.
            </p>

            <div class="error__search">
              <button @click="handleClearError" class="os-btn os-btn-3 os-btn-black">홈으로 돌아가기</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 에러 영역 끝 -->
  </layout>
</template>

<script lang="ts" setup>
import Layout from "./layout/Layout.vue";
import BreadcrumbArea from "./components/common/breadcrumb/BreadcrumbArea.vue";

defineProps(["error"]);
const handleClearError = () => clearError({ redirect: "/" });
</script>
