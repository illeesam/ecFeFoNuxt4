<template>
  <section class="sale__area pb-55">
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
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-12">
          <div class="sale__area-slider-2">
            <div class="row">
              <div v-for="(item, i) in sell_products" :key="i" class="col-xl-2 col-lg-3 col-md-4 col-6 sale__item">
                <product-item :item="item" />
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
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItem from "./ProductItem.vue";

useComponentTitle("할인");

const store = useProductsStore();
const sell_products = computed(() => store.products.filter((p) => typeof p.saleOfPer === "number" && p.saleOfPer > 0).slice(0, 12));
</script>
