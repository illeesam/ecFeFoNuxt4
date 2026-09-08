<template>
  <div class="mini-cart">
    <div v-if="store.cartProducts.length === 0">
      <h5>장바구니가 비어 있습니다</h5>
    </div>
    <div v-if="store.cartProducts.length > 0" class="mini-cart-inner">
      <ul :class="`mini-cart-list ${store.cartProducts.length === 1 ? 'slider-height_1' : store.cartProducts.length === 2 ? 'slider-height_2' : 'slider-height'}`">
        <li v-for="(item, i) in store.cartProducts" :key="i">
          <div class="cart-img f-left">
            <nuxt-link :to="`/product-details/${item.productId}`">
              <app-image :src="item.img" :alt="item.title" :img-style="{ width: '60px', height: '75px', objectFit: 'cover' }" :skeleton-style="{ width: '60px', height: '75px' }" />
            </nuxt-link>
          </div>
          <div class="cart-content f-left text-left">
            <h5>
              <nuxt-link :to="`/product-details/${item.productId}`">
                <span v-html="item.title"></span>
              </nuxt-link>
            </h5>
            <div class="cart-price">
              <span class="ammount">{{ item.orderQuantity }}<i class="fal fa-times"></i></span>
              <span class="price">{{ formatPrice(item.price) }}</span>
            </div>
          </div>
          <div class="del-icon ml-auto mt-30" @click="store.removerStCartProducts(item)">
            <a href="#">
              <i class="fal fa-times"></i>
            </a>
          </div>
        </li>
      </ul>
      <div class="total-price flex justify-between mb-30">
        <span>소계:</span>
        <span>{{ formatPrice(store.getStTotalPriceQuantity.total) }}</span>
      </div>
      <div class="checkout-link">
        <nuxt-link href="/cart" class="os-btn">장바구니 보기</nuxt-link>
        <nuxt-link class="os-btn os-btn-black" href="/checkout">주문하기</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/store/useCartStore";
import AppImage from "~/components/ui/AppImage.vue";

const store = useCartStore();
const { formatPrice } = usePrice();
</script>
