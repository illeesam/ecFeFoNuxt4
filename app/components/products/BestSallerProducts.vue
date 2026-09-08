<template>
  <div class="product__view-area pt-60 pb-60">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="container custom-container-2">
      <div class="row">
        <div class="col-xl-12">
          <div class="section__wrapper text-center">
            <h3 class="section__title-2"><span>베스트셀러 상품</span></h3>
            <p>베스트셀러 상품을 만나보세요.</p>
          </div>
        </div>
      </div>
      <div class="row mt-40">
        <div class="col-xl-6 col-lg-6">
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div v-for="(item, i) in sm_best_prd.slice(0, 2)" :key="i" class="col-xl-6 col-lg-12 col-md-6">
                  <div class="product__item mb-40">
                    <product-item-two :item="item" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="big_prd_1" class="col-lg-12">
              <div class="product__big-image effectThree mb-40">
                <nuxt-link :to="`/product-details/${big_prd_1.productId}`">
                  <app-image :src="big_prd_1.bigImg" alt="product img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '4/3' }" />
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-lg-6">
          <div class="row">
            <div v-if="big_prd_2" class="col-lg-12">
              <div class="product__big-image effectThree mb-40">
                <nuxt-link :to="`/product-details/${big_prd_2.productId}`">
                  <app-image :src="big_prd_2.bigImg" alt="product img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '4/3' }" />
                </nuxt-link>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="row">
                <div v-for="(item, i) in sm_best_prd.slice(2, 4)" :key="i" class="col-xl-6 col-lg-12 col-md-6">
                  <div class="product__item mb-40">
                    <product-item-two :item="item" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('베스트 상품');
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItemTwo from "./ProductItemTwo.vue";
import AppImage from "~/components/ui/AppImage.vue";

const store = useProductsStore();
const best_sale_prd = computed(() => store.products.filter((p) => p.bestSeller));
const big_prd_1 = computed(() => best_sale_prd.value.filter((p) => p.bigImg)[0]);
const big_prd_2 = computed(() => best_sale_prd.value.filter((p) => p.bigImg)[1]);
const sm_best_prd = computed(() => best_sale_prd.value.filter((p) => !p.bigImg));
</script>
