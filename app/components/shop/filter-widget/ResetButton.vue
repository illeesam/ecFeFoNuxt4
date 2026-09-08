<template>
  <div class="reset-button mt-20 mb-30">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <button class="os-btn os-btn-black" @click="state.handleStResetFilter">필터 초기화</button>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('필터 초기화');
import { useProductsStore } from "~/store/useProductsStore";

const state = useProductsStore();
</script>
