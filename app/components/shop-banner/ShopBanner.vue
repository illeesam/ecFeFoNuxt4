<template>
  <div class="banner__area-2 pb-60">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div :class="`container-fluid ${style_2 ? '' : 'p-0'}`">
      <div class="row g-0">
        <div v-for="item in store.products.filter((p) => p.banner).slice(0, 2)" :key="item.productId" class="col-xl-6 col-lg-6">
          <div :class="`banner__item-2 banner-${item.productId === 1 ? 'right' : 'left'} relative mb-30 p${item.productId === 1 ? 'r' : 'l'}-15`">
            <div class="banner__thumb fix">
              <nuxt-link :to="`/product-details/${item.productId}`" class="w-img">
                <app-image :src="item.bannerImg" alt="banner" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '16/9' }" />
              </nuxt-link>
            </div>
            <div :class="`banner__content-2 ${style_3 ? 'banner__content-4' : ''} ${item.productId !== 1 && style_3 ? 'banner__content-4-right' : ''} absolute transition-3`">
              <span>상품 {{ item.category.categoryName }}</span>
              <h4>
                <nuxt-link :to="`/product-details/${item.productId}`">{{ item.title }}</nuxt-link>
              </h4>
              <p class="sm_desc">
                {{ style_3 ? item.smDesc.slice(0, 50) : item.smDesc }}
              </p>
              <nuxt-link :to="`/product-details/${item.productId}`" class="os-btn os-btn-2">
                구매하기 /
                <span>{{ formatPrice(item.price) }}</span>
              </nuxt-link>
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
useComponentTitle('쇼핑 배너');
import { useProductsStore } from "~/store/useProductsStore";
import AppImage from "~/components/ui/AppImage.vue";

defineProps<{ style_2?: boolean; style_3?: boolean }>();
const store = useProductsStore();
const { formatPrice } = usePrice();
</script>

<style scoped>
.banner__area-2 .sm_desc {
  max-width: 450px;
}
.banner__content-4 .sm_desc {
  max-width: 250px;
}
</style>
