<template>
  <section class="product__area pt-60 pb-65">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-12">
          <div class="section__title-wrapper text-center mb-55">
            <div class="section__title mb-10">
              <h2>인기 상품</h2>
            </div>
            <div class="section__sub-title">
              <p>다양한 트렌드를 반영한 인기 상품을 만나보세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-6 col-lg-6">
          <div class="product__slider-3">
            <div class="row">
              <div v-for="item in trending_products.slice(0, 2)" :key="item.productId" class="col-lg-6 col-md-6 product__item">
                <product-item :item="item" />
              </div>
            </div>
          </div>
          <div v-if="big_item_2" class="product__banner mb-30">
            <nuxt-link :to="`/product-details/${big_item_2.productId}`" class="w-img">
              <app-image :src="big_item_2.bigImg" alt="product_img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '4/3' }" />
            </nuxt-link>
          </div>
        </div>
        <div class="col-xl-6 col-lg-6">
          <div v-if="big_item_1" class="product__banner w-img pb-25 mb-30 relative">
            <nuxt-link :to="`/product-details/${big_item_1.productId}`" class="w-img">
              <app-image :src="big_item_1.bigImg" alt="product_img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '4/3' }" />
            </nuxt-link>
            <div class="product__banner-content absolute">
              <h4>
                <nuxt-link :to="`/product-details/${big_item_1.productId}`">
                  <span v-html="big_item_1.title"></span>
                </nuxt-link>
              </h4>
              <nuxt-link :to="`/product-details/${big_item_1.productId}`" class="link-btn"> 바로 보기 </nuxt-link>
            </div>
          </div>
          <div class="product__slider-3">
            <div class="row">
              <div v-for="item in trending_products.slice(2, 4)" :key="item.productId" class="col-lg-6 col-md-6 product__item">
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
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('트렌드 상품 3');
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItem from "./ProductItem.vue";
import AppImage from "~/components/ui/AppImage.vue";

const store = useProductsStore();
const big_item_1 = computed(() => store.products.filter((p) => p.bigImg)[0]);
const big_item_2 = computed(() => store.products.filter((p) => p.bigImg)[1]);
const trending_products = computed(() => store.products.filter((p) => p.trending).slice(0, 4));
</script>
