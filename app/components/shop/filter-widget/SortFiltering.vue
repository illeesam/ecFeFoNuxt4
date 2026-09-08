<template>
  <div class="sort-wrapper mr-30 pr-25 relative">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <select v-model="selectVal" @change="state.handleStSelectFiltering(selectVal)">
      <option value="Default Sorting">기본 정렬</option>
      <option value="Sort By Trending">인기순</option>
      <option value="Short By BestSeller">베스트셀러순</option>
      <option value="Price High To Low">가격 높은순</option>
      <option value="Price Low To High">가격 낮은순</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('정렬');
import { ref } from "vue";
import { useProductsStore } from "~/store/useProductsStore";

const selectVal = ref("Default Sorting");
const state = useProductsStore();
</script>
