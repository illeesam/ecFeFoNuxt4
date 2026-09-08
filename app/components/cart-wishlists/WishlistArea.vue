<template>
  <client-only>
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <section class="cart-area pt-100 pb-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row">
          <div class="col-12">
            <div v-if="state.wishlists.length === 0" class="text-center">
              <h3>위시리스트에 담긴 상품이 없습니다</h3>
              <nuxt-link class="os-btn os-btn-black mt-20" to="/shop"> 쇼핑하기 </nuxt-link>
            </div>
            <form v-if="state.wishlists.length > 0" action="#">
              <div class="table-content table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th class="product-thumbnail">이미지</th>
                      <th class="cart-product-name">상품</th>
                      <th class="product-price">단가</th>
                      <th class="product-quantity">수량</th>
                      <th class="product-subtotal">합계</th>
                      <th class="product-remove">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    <wishlist-item v-for="(item, i) in state.wishlists" :key="i" :item="item" />
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('위시리스트');
import { onMounted } from "vue";
import { useWishlistStore } from "~/store/useWishlistStore";
import WishlistItem from "./WishlistItem.vue";

const state = useWishlistStore();
onMounted(() => {
  state.getStWishlistProducts;
});
</script>
