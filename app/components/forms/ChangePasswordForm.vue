<template>
  <form action="#">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="password__input">
      <p>현재 비밀번호</p>
      <input type="password" placeholder="현재 비밀번호" />
    </div>
    <div class="password__input">
      <p>새 비밀번호</p>
      <input type="password" placeholder="새 비밀번호" />
    </div>
    <div class="password__input">
      <p>비밀번호 확인</p>
      <input type="password" placeholder="비밀번호 확인" />
    </div>
    <div class="password__input">
      <button type="submit" class="os-btn os-btn-black">비밀번호 변경</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('비밀번호 변경 폼');
</script>
