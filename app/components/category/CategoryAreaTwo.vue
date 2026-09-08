<template>
  <div class="banner__area-df mt-10">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div v-for="item in categoryItems" :key="item.categoryId" class="banner__item-3 mb-30">
      <div class="banner__item-3-image m-img">
        <app-image
          :src="item.img"
          :alt="item.parentTitle"
          wrap-class="m-img"
          :skeleton-style="{ width: '100%', aspectRatio: '4/3' }"
        />
      </div>
      <div class="banner__content-5">
        <h5>{{ item.parentTitle }}</h5>
        <p>{{ item.smDesc }}</p>
        <nuxt-link href="/shop" class="os-btn-5">쇼핑하기</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('카테고리 2');
import { computed } from "vue";
import { axiosSsr } from "~/utils/axiosSsr";
import AppImage from "~/components/ui/AppImage.vue";

interface CategoryTreeItem {
  categoryId: string;
  img: string;
  parentTitle: string;
  value: string;
  children: string[];
  smDesc?: string;
}

const { data: catData } = useAsyncData<{ categoryTree: CategoryTreeItem[] }>(
  "category-tree",
  () => axiosSsr.get<{ categoryTree: CategoryTreeItem[] }>("/api/category-tree").then((r) => r.data),
  { default: () => ({ categoryTree: [] }) }
);

const categoryItems = computed(() => (catData.value?.categoryTree ?? []).slice(3, 6));
</script>
