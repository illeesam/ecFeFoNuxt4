<template>
  <section class="product__area pt-60 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div :class="`${style_2 ? 'custom-container' : style_3 ? 'container-fluid' : 'container'} mx-auto max-w-7xl px-4`">
      <div class="row">
        <div class="col-xl-12">
          <div :class="`section__title-wrapper text-center mb-55 ${style_2 ? 'p-relative' : ''}`">
            <div class="section__title mb-10">
              <h2>인기 상품</h2>
            </div>
            <div class="section__sub-title">
              <p>다양한 트렌드를 반영한 인기 상품을 만나보세요.</p>
            </div>
          </div>
        </div>
      </div>
      <div :class="`product__slider ${style_2 ? 'product__slider-4' : ''}`">
        <div class="row">
          <div v-for="item in trending_prd.slice(0, perView)" :key="item.productId" :class="`${style_3 ? 'col-xl-2 col-lg-3 col-md-4' : 'col-lg-3 col-md-4'} product__item`">
            <product-item :item="item" />
          </div>
        </div>
      </div>
      <div class="row" v-if="perView < trending_prd.length">
        <div class="col-xl-12">
          <div class="product__load-btn text-center mt-25">
            <a @click.prevent="handleLoadMore" href="#" class="os-btn os-btn-3">더 보기</a>
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
useComponentTitle('트렌드 상품');
import { ref, computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import ProductItem from "./ProductItem.vue";

const props = defineProps({
  style_2: { type: Boolean, default: false },
  style_3: { type: Boolean, default: false },
});
const store = useProductsStore();
const trending_prd = computed(() => store.products.filter((p) => p.trending));
const perView = ref(props.style_3 ? 12 : 8);
function handleLoadMore() {
  perView.value += 2;
}
</script>
