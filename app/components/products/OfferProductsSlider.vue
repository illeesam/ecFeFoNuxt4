<template>
  <section :class="`product__offer ${style_2 ? 'pb-45' : 'pt-115 pb-50'}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div :class="`${style_2 ? 'custom-container' : 'container'} mx-auto`">
      <div class="row flex justify-center">
        <!-- 인기 상품 시작 -->
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div class="product__offer-inner mb-30">
            <div class="product__title mb-60">
              <h4>인기 상품</h4>
            </div>
            <div class="product__offer-slider relative">
              <Carousel :items-to-show="1" :wrap-around="true" :snapAlign="'center'" ref="slider_1">
                <Slide v-for="(item, i) in trending_products" :key="i" class="product__offer-wrapper">
                  <div class="sidebar__widget-content">
                    <sm-product-item v-for="(prd, i) in item.items" :key="i" :prd="prd" />
                  </div>
                </Slide>
              </Carousel>
              <!-- 네비 버튼 -->
              <div class="owl-nav">
                <div @click="handlePrev" class="owl-prev">
                  <button>
                    <i class="fal fa-angle-left"></i>
                  </button>
                </div>
                <div class="owl-next" @click="handleNext">
                  <button>
                    <i class="fal fa-angle-right"></i>
                  </button>
                </div>
              </div>
              <!-- 네비 버튼 -->
            </div>
          </div>
        </div>
        <!-- 인기 상품 끝 -->

        <!-- 세일 상품 시작 -->
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div class="product__offer-inner mb-30">
            <div class="product__title mb-60">
              <h4>할인 상품</h4>
            </div>
            <div class="product__offer-slider relative">
              <Carousel :items-to-show="1" :wrap-around="true" :snapAlign="'center'" ref="slider_2">
                <Slide v-for="(item, i) in sale_products" :key="i" class="product__offer-wrapper">
                  <div class="sidebar__widget-content">
                    <sm-product-item v-for="(prd, i) in item.items" :key="i" :prd="prd" />
                  </div>
                </Slide>
              </Carousel>
              <!-- 네비 버튼 -->
              <div class="owl-nav">
                <div @click="handlePrevTwo" class="owl-prev">
                  <button>
                    <i class="fal fa-angle-left"></i>
                  </button>
                </div>
                <div class="owl-next" @click="handleNextTwo">
                  <button>
                    <i class="fal fa-angle-right"></i>
                  </button>
                </div>
              </div>
              <!-- 네비 버튼 -->
            </div>
          </div>
        </div>
        <!-- 세일 상품 끝 -->

        <!-- 베스트 상품 시작 -->
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div class="product__offer-inner mb-30">
            <div class="product__title mb-60">
              <h4>베스트 상품</h4>
            </div>
            <div class="product__offer-slider relative">
              <Carousel :items-to-show="1" :wrap-around="true" :snapAlign="'center'" ref="slider_3">
                <Slide v-for="(item, i) in top_products" :key="i" class="product__offer-wrapper">
                  <div class="sidebar__widget-content">
                    <sm-product-item v-for="(prd, i) in item.items" :key="i" :prd="prd" />
                  </div>
                </Slide>
              </Carousel>
              <!-- 네비 버튼 -->
              <div class="owl-nav">
                <div @click="handlePrevThree" class="owl-prev">
                  <button>
                    <i class="fal fa-angle-left"></i>
                  </button>
                </div>
                <div class="owl-next" @click="handleNextThree">
                  <button>
                    <i class="fal fa-angle-right"></i>
                  </button>
                </div>
              </div>
              <!-- 네비 버튼 -->
            </div>
          </div>
        </div>
        <!-- 베스트 상품 끝 -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('특가 상품');
import { ref, computed } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import { useProductsStore } from "~/store/useProductsStore";
import SmProductItem from "./SmProductItem.vue";

defineProps({
  style_2: { type: Boolean, default: false },
});
const slider_1 = ref<{ next(): void; prev(): void } | null>(null);
const slider_2 = ref<{ next(): void; prev(): void } | null>(null);
const slider_3 = ref<{ next(): void; prev(): void } | null>(null);
const store = useProductsStore();
const trending_products = computed(() => [
  { id: 1, items: store.products.filter((p) => p.trending).slice(0, 3) },
  { id: 2, items: store.products.filter((p) => p.trending).slice(3, 6) },
]);
const sale_products = computed(() => [
  { id: 1, items: store.products.filter((p) => p.saleOfPer).slice(0, 3) },
  { id: 2, items: store.products.filter((p) => p.saleOfPer).slice(3, 6) },
]);
const top_products = computed(() => [
  { id: 1, items: store.products.filter((p) => p.topRated).slice(0, 3) },
  { id: 2, items: store.products.filter((p) => p.topRated).slice(3, 6) },
]);
function handleNext() {
  slider_1.value?.next();
}
function handlePrev() {
  slider_1.value?.prev();
}
function handleNextTwo() {
  slider_2.value?.next();
}
function handlePrevTwo() {
  slider_2.value?.prev();
}
function handleNextThree() {
  slider_3.value?.next();
}
function handlePrevThree() {
  slider_3.value?.prev();
}
</script>

<style scoped>
.carousel__slide {
  display: block;
}
</style>
