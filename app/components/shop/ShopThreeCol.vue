<template>
  <section class="shop__area pt-100 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row flex justify-center">
        <div class="col-xl-8 col-lg-8 col-12 mx-auto">
          <div class="shop__content-area">
            <div class="shop__header flex flex-wrap justify-between items-center mb-40">
              <div class="shop__header-left">
                <div class="show-text">
                  <span>전체 {{ state.products.length }}개 중 1–{{ state.products.slice(pageStart, pageStart + countOfPage).length }}개 표시</span>
                </div>
              </div>
              <div class="shop__header-right flex items-center justify-between sm:justify-end">
                <!-- 정렬/필터 -->
                <sort-filtering />
                <!-- 정렬/필터 -->
                <ul class="flex items-center gap-2" role="tablist">
                  <li>
                    <button type="button" :class="['p-2 rounded', viewMode === 'grid' ? 'bg-theme text-white' : 'bg-gray-200']" @click="viewMode = 'grid'" aria-label="그리드 보기"><i class="fas fa-th"></i></button>
                  </li>
                  <li>
                    <button type="button" :class="['p-2 rounded', viewMode === 'list' ? 'bg-theme text-white' : 'bg-gray-200']" @click="viewMode = 'list'" aria-label="목록 보기"><i class="fas fa-list-ul"></i></button>
                  </li>
                </ul>
              </div>
            </div>
            <div id="pills-tabContent">
              <div v-show="viewMode === 'grid'" id="pills-grid" role="tabpanel">
                <product-item v-for="(item, i) in state.filterProducts.slice(pageStart, pageStart + countOfPage)" :key="i" :item="item" />
              </div>
              <div v-show="viewMode === 'list'" id="pills-list" role="tabpanel">
                <product-list-item v-for="(item, i) in state.filterProducts.slice(pageStart, pageStart + countOfPage)" :key="i" :item="item" />
              </div>
            </div>
            <div class="row mt-40">
              <div class="col-xl-12">
                <pagination :items="state.products" :count-of-page="9" @paginatedData="paginatedData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('쇼핑 3단');
import { ref, reactive } from "vue";
import SortFiltering from "./filter-widget/SortFiltering.vue";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItem from "../products/ProductItem.vue";
import ProductListItem from "../products/ProductListItem.vue";
import Pagination from "~/components/ui/Pagination.vue";

const state = useProductsStore();
const viewMode = ref<"grid" | "list">("grid");
const filteredRows = reactive<unknown[]>([]);
const pageStart = ref(0);
const countOfPage = ref(9);

function paginatedData(rows: unknown[], start: number, count: number) {
  filteredRows.splice(0, filteredRows.length, ...rows);
  pageStart.value = start;
  countOfPage.value = count;
}
</script>
