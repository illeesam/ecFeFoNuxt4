<template>
  <div class="product__slider-area pt-95 pb-60">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="container custom-container-2 mx-auto">
      <div class="row flex justify-center">
        <div class="col-xl-12">
          <div class="section__wrapper text-center">
            <h3 class="section__title-2"><span>추천 상품</span></h3>
            <p>Claritas est etiam processus dynamicus, qui sequitur.</p>
          </div>
        </div>
      </div>
      <div class="row flex justify-center mt-40">
        <div class="col-lg-12">
          <div class="product__slider-active relative">
            <Carousel
              ref="slider_1"
              :items-to-show="3"
              :wrap-around="true"
              :breakpoints="{
                1200: {
                  itemsToShow: 3,
                },
                992: {
                  itemsToShow: 3,
                },
                700: {
                  itemsToShow: 2,
                },
                0: {
                  itemsToShow: 1,
                },
              }"
            >
              <Slide v-for="(item, i) in products" :key="i" class="product__slider-item">
                <div class="product__item mb-40">
                  <product-item-two :item="item" />
                </div>
              </Slide>
            </Carousel>
            <div class="owl-nav">
              <div @click="handlePrev" class="owl-prev">
                <button><i class="fal fa-angle-left"></i></button>
              </div>
              <div @click="handleNext" class="owl-next">
                <button><i class="fal fa-angle-right"></i></button>
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
useComponentTitle('추천 상품');
import { ref, computed } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import ProductItemTwo from "./ProductItemTwo.vue";
import { useProductsStore } from "~/store/useProductsStore";

const slider_1 = ref<{ next(): void; prev(): void } | null>(null);
const store = useProductsStore();
const products = computed(() => store.products.filter((p) => p.bestSeller).filter((p) => !p.bigImg));
function handleNext() {
  slider_1.value?.next();
}
function handlePrev() {
  slider_1.value?.prev();
}
</script>

<style scoped>
.product__slider-area .carousel__slide.product__slider-item {
  padding: 0 15px;
}
</style>
