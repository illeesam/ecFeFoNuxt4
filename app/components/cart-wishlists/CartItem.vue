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
    <td class="product-quantity">
      <div class="cart-plus-minus">
        <input type="text" v-model="item.orderQuantity" />
        <div @click="state.setStQuantityDecrement(item)" class="dec qtybutton">-</div>
        <div @click="state.addStCartProduct(item)" class="inc qtybutton">+</div>
      </div>
    </td>
    <td class="product-subtotal">
      <span class="amount">{{ formatPrice((item.orderQuantity ?? 0) * item.price) }}</span>
    </td>
    <td class="product-remove" @click.prevent="state.removerStCartProducts(item)">
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
useComponentTitle('장바구니 아이템');
import { type OrCartItemType } from "~/types/orCartItemType";
import { useCartStore } from "~/store/useCartStore";
import AppImage from "~/components/ui/AppImage.vue";

defineProps<{
  item: OrCartItemType;
}>();
const state = useCartStore();
const { formatPrice } = usePrice();
</script>
