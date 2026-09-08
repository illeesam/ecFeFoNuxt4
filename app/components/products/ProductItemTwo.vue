<template>
  <div class="product__wrapper">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="product__thumb">
      <nuxt-link :to="`/product-details/${item.productId}`" class="w-img">
        <app-image :src="item.img" alt="product-img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '3/4' }" />
        <app-image img-class="product__thumb-2" :src="item.thumbImg" alt="product-img" wrap-class="w-img" />
      </nuxt-link>
      <div class="product__action-3 transition-3">
        <a @click.prevent="store.addStCartProduct(item)" href="#" class="action-btn"> <i class="fal fa-plus"></i>장바구니 담기 </a>
        <a @click.prevent="openQuickView" href="#" class="action-btn">
          <i class="fal fa-eye"></i>
        </a>
      </div>
      <div v-if="item.saleOfPer || item.new" class="product__sale product__sale-3">
        <span v-if="item.new || item.saleOfPer" class="new">신상품</span>
        <span v-if="item.saleOfPer" class="percent">-{{ item.saleOfPer }}%</span>
      </div>
    </div>
    <div class="product__content product__content-2 relative text-center">
      <div class="product__content-inner">
        <div class="rating">
          <a href="#"><i class="fal fa-star"></i></a>
          <a href="#"><i class="fal fa-star"></i></a>
          <a href="#"><i class="fal fa-star"></i></a>
          <a href="#"><i class="fal fa-star"></i></a>
          <a href="#"><i class="fal fa-star"></i></a>
        </div>
        <h4>
          <nuxt-link :to="`/product-details/${item.productId}`">
            <span v-html="item.title"></span>
          </nuxt-link>
        </h4>
        <div class="product__price-3">
          <span>{{ formatPrice(item.price) }}</span>
          <span v-if="item.oldPrice" class="old-price"
            ><del>{{ formatPrice(item.oldPrice) }}</del></span
          >
        </div>
      </div>
    </div>
  </div>

  <product-modal ref="productModalRef" :item="item" />
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 아이템 2');
import { ref } from "vue";
import { type PdProductType } from "~/types/pdProductType";
import { useCartStore } from "~/store/useCartStore";
import ProductModal from "../common/modals/ProductModal.vue";
import AppImage from "~/components/ui/AppImage.vue";

defineProps<{
  item: PdProductType;
}>();
const store = useCartStore();
const { formatPrice } = usePrice();
const productModalRef = ref<(InstanceType<typeof ProductModal> & { show(): void }) | null>(null);
function openQuickView() {
  store.initialStOrderQuantity();
  productModalRef.value?.show();
}
</script>
