<template>
  <section class="product__area pt-60 pb-100">
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
    <div class="container-fluid">
      <div class="product__banner relative">
        <div class="product__banner-inner absolute fix hidden lg:block">
          <div class="product__banner-img fix">
            <nuxt-link :to="`/product-details/${big_item?.productId}`">
              <app-image :src="big_item?.bigImg" alt="product-banner" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '3/4' }" />
            </nuxt-link>
          </div>
          <div class="product__banner-content absolute">
            <h4>
              <nuxt-link :to="`/product-details/${big_item?.productId}`">
                <span v-html="big_item?.title"></span>
              </nuxt-link>
            </h4>
            <nuxt-link :to="`/product-details/${big_item?.productId}`" class="link-btn"> 바로 보기 </nuxt-link>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-6 offset-xl-6 col-lg-6 offset-lg-6">
            <div class="product__slider-2">
              <div class="row">
                <div v-for="item in trending_products" :key="item.productId" class="col-lg-4 col-md-6 product__item">
                  <product-item :item="item" />
                </div>
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
useComponentTitle('트렌드 상품 2');
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItem from "./ProductItem.vue";
import AppImage from "~/components/ui/AppImage.vue";

const store = useProductsStore();
const big_item = computed(() => store.products.find((p) => p.bigImg));
const trending_products = computed(() => store.products.filter((p) => p.trending).slice(0, 6));
</script>
