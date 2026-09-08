<template>
  <section class="blog__area pt-100 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row flex justify-center">
        <div v-if="left_side" class="col-xl-3 col-lg-4">
          <blog-sidebar />
        </div>
        <div :class="`col-xl-${left_side ? '9' : '8'} col-lg-8`">
          <div class="blog__wrapper">
            <!-- 로딩 중 스켈레톤 -->
            <template v-if="pending">
              <skeleton-card v-for="n in 3" :key="n" />
            </template>
            <template v-else>
              <blog-standard-item v-for="(blog, i) in filteredRows.slice(pageStart, pageStart + countOfPage)" :key="i" :blog="blog" />
            </template>
            <div class="row">
              <div class="col-xl-12">
                <pagination :items="standardBlogs" :count-of-page="3" @paginatedData="paginatedData" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="!left_side" class="col-xl-3 col-lg-4">
          <blog-sidebar />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그');
import { ref, reactive, computed } from "vue";
import { useBlogs } from "~/composables/useBlogs";
import BlogSidebar from "../common/sidebar/BlogSidebar.vue";
import Pagination from "~/components/ui/Pagination.vue";
import { type CoBlogType } from "~/types/coBlogType";
import BlogStandardItem from "./BlogStandardItem.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";

defineProps({
  left_side: { type: Boolean, default: false },
});

const { blogs, pending } = useBlogs();
const standardBlogs = computed(() => (blogs.value ?? []).filter((b) => b.blog === "블로그-스탠다드"));

const filteredRows = reactive<CoBlogType[]>([]);
const pageStart = ref(0);
const countOfPage = ref(9);
function paginatedData(rows: unknown[], start: number, count: number) {
  filteredRows.splice(0, filteredRows.length, ...(rows ?? []) as CoBlogType[]);
  pageStart.value = start;
  countOfPage.value = count;
}
</script>
