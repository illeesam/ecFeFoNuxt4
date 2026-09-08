<template>
  <div class="features__product-wrapper flex mb-20">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="features__product-thumb mr-15">
      <nuxt-link :to="`/product-details/${prd.productId}`">
        <app-image :src="prd.img" alt="pro-sm-1" :img-style="{ width: '86px', height: '110px', objectFit: 'cover' }" :skeleton-style="{ width: '86px', height: '110px' }" />
      </nuxt-link>
    </div>
    <div class="features__product-content">
      <h5>
        <nuxt-link :to="`/product-details/${prd.productId}`">
          <span v-html="prd.title"></span>
        </nuxt-link>
      </h5>
      <div v-if="prd.topRated" class="rating rating-shop mb-5">
        <ul>
          <li>
            <span><i class="fas fa-star"></i></span>
          </li>
          <li>
            <span><i class="fas fa-star"></i></span>
          </li>
          <li>
            <span><i class="fas fa-star"></i></span>
          </li>
          <li>
            <span><i class="fas fa-star"></i></span>
          </li>
          <li>
            <span><i class="fal fa-star"></i></span>
          </li>
        </ul>
      </div>
      <div class="price">
        <span>{{ formatPrice(prd.price) }}</span>
        <span v-if="prd.saleOfPer" class="price-old">
          {{ formatPrice(prd.price - (prd.price * prd.saleOfPer) / 100) }}
        </span>
        <div class="add-cart absolute transition-3">
          <a @click.prevent="state.addStCartProduct(prd)" href="#">+ 장바구니 추가</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 아이템 (소)');
import { useCartStore } from "~/store/useCartStore";
import { type PdProductType } from "~/types/pdProductType";
import AppImage from "~/components/ui/AppImage.vue";

defineProps<{
  prd: PdProductType;
}>();
const state = useCartStore();
const { formatPrice } = usePrice();
</script>
