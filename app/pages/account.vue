<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="마이페이지" subtitle="마이페이지" />
    <profile-area />
    <profile-menu-area />
  </layout>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import Layout from "~/layout/Layout.vue";
import BreadcrumbArea from "~/components/common/breadcrumb/BreadcrumbArea.vue";
import ProfileArea from "~/components/profile/ProfileArea.vue";
import ProfileMenuArea from "~/components/profile/ProfileMenuArea.vue";

import { usePageTitle } from "~/composables/usePageTitle";
useHead({
  title: "마이페이지",
});
usePageTitle("마이페이지");
</script>
