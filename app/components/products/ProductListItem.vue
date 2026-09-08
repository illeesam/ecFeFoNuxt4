<template>
  <div class="product__wrapper mb-40">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="row">
      <div class="col-xl-4 col-lg-4">
        <div class="product__thumb">
          <nuxt-link :to="`/product-details/${item.productId}`" class="w-img">
            <app-image :src="item.img" alt="product-img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '3/4' }" />
            <app-image img-class="product__thumb-2" :src="item.thumbImg" alt="product-img" wrap-class="w-img" />
          </nuxt-link>
          <div v-if="item.saleOfPer || item.new" class="product__sale">
            <span v-if="item.new || item.saleOfPer" class="new">신상품</span>
            <span v-if="item.saleOfPer" class="percent">-{{ item.saleOfPer }}%</span>
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-lg-8">
        <div class="product__content relative">
          <div class="product__content-inner list">
            <h4>
              <nuxt-link :to="`/product-details/${item.productId}`">
                <span v-html="item.title"></span>
              </nuxt-link>
            </h4>
            <div class="product__price-2 mb-10">
              <span>{{ formatPrice(item.price) }}</span>
              <span v-if="item.oldPrice" class="old-price">{{ formatPrice(item.oldPrice) }}</span>
            </div>
            <p>{{ item.smDesc }}</p>
            <div class="product__list mb-30">
              <ul>
                <li v-for="(list, i) in item.details.detailsList?.slice(0, 3)" :key="i">
                  <span>{{ list }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="add-cart-list flex flex-wrap items-center">
            <a @click.prevent="store.addStCartProduct(item)" href="#" class="add-cart-btn mr-10">+ 장바구니 추가</a>
            <div class="product__action-2 transition-3 mr-20">
              <a @click.prevent="wishlistState.addStWishlistProduct(item)" href="#" title="위시리스트에 담기">
                <i class="fal fa-heart"></i>
              </a>
              <a @click.prevent="compareState.addStCompareProduct(item)" href="#" title="비교하기">
                <i class="fal fa-sliders-h"></i>
              </a>
              <a @click.prevent="openQuickView" href="#">
                <i class="fal fa-search"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <product-modal ref="productModalRef" :item="item" :list="true" />
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 목록 아이템');
import { ref } from "vue";
import { type PdProductType } from "~/types/pdProductType";
import ProductModal from "../common/modals/ProductModal.vue";
import AppImage from "~/components/ui/AppImage.vue";
import { useCartStore } from "~/store/useCartStore";
import { useCompareStore } from "~/store/useCompareStore";
import { useWishlistStore } from "~/store/useWishlistStore";

defineProps<{
  item: PdProductType;
}>();
const store = useCartStore();
const compareState = useCompareStore();
const wishlistState = useWishlistStore();
const { formatPrice } = usePrice();
const productModalRef = ref<(InstanceType<typeof ProductModal> & { show(): void }) | null>(null);
function openQuickView() {
  store.initialStOrderQuantity();
  productModalRef.value?.show();
}
</script>

<style scoped></style>
