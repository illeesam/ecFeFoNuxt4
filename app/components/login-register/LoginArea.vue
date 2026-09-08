<template>
  <section class="login-area pt-100 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row flex justify-center">
        <div class="col-lg-8 col-12 mx-auto">
          <div class="basic-login">
            <h3 class="text-center mb-60">로그인</h3>
            <!-- 폼 시작 -->
            <login-form />
            <!-- 폼 끝 -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('로그인');
import LoginForm from "../forms/LoginForm.vue";
</script>
