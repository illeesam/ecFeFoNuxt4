<template>
  <tr>
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <td class="product-thumbnail">
      <nuxt-link :to="`/product-details/${item.productId}`">
        <app-image :src="item.img" :alt="item.title" :img-style="{ width: '80px', height: '100px', objectFit: 'cover' }" :skeleton-style="{ width: '80px', height: '100px' }" />
      </nuxt-link>
    </td>
    <td class="product-name">
      <nuxt-link :to="`/product-details/${item.productId}`">
        <span v-html="item.title"></span>
      </nuxt-link>
    </td>
    <td class="product-price">
      <span class="amount">{{ formatPrice(item.price) }}</span>
    </td>
    <td class="product-quantity" @click.prevent="cartState.addStCartProduct(item)">
      <button class="os-btn os-btn-black" type="submit">장바구니에 담기</button>
    </td>
    <td class="product-subtotal">
      <span class="amount">{{ formatPrice(item.price) }}</span>
    </td>
    <td class="product-remove" @click.prevent="wishlistState.removeStWishlist(item)">
      <a href="#">
        <i class="fa fa-times"></i>
      </a>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('위시리스트 아이템');
import { type MbWishlistItemType } from "~/types/mbWishlistItemType";
import { useCartStore } from "~/store/useCartStore";
import { useWishlistStore } from "~/store/useWishlistStore";
import AppImage from "~/components/ui/AppImage.vue";

defineProps<{
  item: MbWishlistItemType;
}>();
const cartState = useCartStore();
const wishlistState = useWishlistStore();
const { formatPrice } = usePrice();
</script>
