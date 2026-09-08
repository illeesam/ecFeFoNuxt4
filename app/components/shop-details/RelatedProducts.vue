<template>
  <section class="related__product pb-60">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-12">
          <div class="section__title-wrapper text-center mb-55">
            <div class="section__title mb-10">
              <h2>관련 상품</h2>
            </div>
            <div class="section__sub-title">
              <p>함께 보면 좋은 상품을 만나보세요.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div v-for="(prdItem, i) in state.getStRelatedProducts(item.category.categoryCode ?? String(item.category.categoryId), item.productId)" :key="i" class="col-xl-3 col-lg-3 col-md-6 col-sm-6">
          <product-item :item="prdItem" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('관련 상품');
import { type PdProductType } from "~/types/pdProductType";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItem from "../products/ProductItem.vue";

defineProps<{
  item: PdProductType;
}>();
const state = useProductsStore();
</script>
