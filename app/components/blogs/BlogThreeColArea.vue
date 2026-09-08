<template>
  <section class="blog__area pt-100 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <!-- 로딩 중 스켈레톤 -->
      <div v-if="pending" class="row">
        <div v-for="n in 6" :key="n" class="col-xl-4 col-lg-4 col-md-6">
          <skeleton-card />
        </div>
      </div>
      <template v-else>
        <div class="row">
          <div v-for="(blog, i) in filteredRows.slice(pageStart, pageStart + countOfPage)" :key="i" class="col-xl-4 col-lg-4 col-md-6">
            <blog-standard-item :blog="blog" :style_3="true" />
          </div>
        </div>
        <div class="row">
          <div class="col-xl-12">
            <pagination :items="standardBlogs" :count-of-page="6" @paginatedData="paginatedData" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그 3단');
import { ref, reactive, computed } from "vue";
import { useBlogs } from "~/composables/useBlogs";
import { type CoBlogType } from "~/types/coBlogType";
import Pagination from "~/components/ui/Pagination.vue";
import BlogStandardItem from "./BlogStandardItem.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";

const { blogs, pending } = useBlogs();
const standardBlogs = computed(() => (blogs.value ?? []).filter((b) => b.blog === "블로그-스탠다드"));

const filteredRows = reactive<CoBlogType[]>([]);
const pageStart = ref(0);
const countOfPage = ref(6);
function paginatedData(rows: unknown[], start: number, count: number) {
  filteredRows.splice(0, filteredRows.length, ...(rows ?? []) as CoBlogType[]);
  pageStart.value = start;
  countOfPage.value = count;
}
</script>
