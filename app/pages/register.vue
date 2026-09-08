<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="회원가입" subtitle="회원가입" />
    <register-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import RegisterArea from "~/components/login-register/RegisterArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "회원가입",
});
usePageTitle("회원가입");
</script>
