<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="로그인" subtitle="로그인" />
    <login-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import LoginArea from "~/components/login-register/LoginArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "로그인",
});
usePageTitle("로그인");
</script>
