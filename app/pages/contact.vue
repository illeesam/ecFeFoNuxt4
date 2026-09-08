<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="문의하기" subtitle="문의하기" />
    <contact-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import ContactArea from "~/components/contact/ContactArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "문의하기",
});
usePageTitle("문의하기");
</script>
