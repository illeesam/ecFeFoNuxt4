<template>
  <section class="sale__area pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-12">
          <div class="section__title-wrapper text-center mb-55">
            <div class="section__title mb-10">
              <h2>할인</h2>
            </div>
            <div class="section__sub-title">
              <p>한정 할인 상품을 만나보세요.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
        <div class="col" v-for="(item, i) in store.products.filter((p) => p.saleOfPer).slice(0, 5)" :key="i">
          <product-item :item="item" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('할인 상품');
import ProductItem from "./ProductItem.vue";
import { useProductsStore } from "~/store/useProductsStore";

const store = useProductsStore();
</script>

<style scoped>
.sale__area .carousel__slide.sale__item {
  padding: 0 15px;
}
</style>
