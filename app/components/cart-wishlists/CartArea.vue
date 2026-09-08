<template>
  <client-only>
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <section class="cart-area pt-100 pb-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row">
          <div class="col-12">
            <div v-if="state.cartProducts.length === 0" class="text-center">
              <h3>장바구니에 상품이 없습니다</h3>
              <nuxt-link class="os-btn os-btn-black mt-20" to="/shop"> 쇼핑하기 </nuxt-link>
            </div>
            <form v-if="state.cartProducts.length > 0" action="#">
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
                    <cart-item v-for="(cartItem, i) in state.cartProducts" :key="i" :item="cartItem" />
                  </tbody>
                </table>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="coupon-all">
                    <div class="coupon">
                      <input required id="coupon_code" class="input-text" name="coupon_code" value="" placeholder="쿠폰 코드" type="text" />
                      <button class="os-btn os-btn-black" name="apply_coupon" type="button">쿠폰 적용</button>
                    </div>
                    <div class="coupon2">
                      <button @click="state.clearStCart" class="os-btn os-btn-black" name="update_cart" type="button">장바구니 비우기</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-5 ms-auto">
                  <div class="cart-page-total">
                    <h2>장바구니 합계</h2>
                    <ul class="mb-20">
                      <li>
                        소계 <span>{{ formatPrice(state.getStTotalPriceQuantity.total) }}</span>
                      </li>
                      <li>
                        합계 <span>{{ formatPrice(state.getStTotalPriceQuantity.total) }}</span>
                      </li>
                    </ul>
                    <nuxt-link class="os-btn" href="/checkout">주문/결제하기</nuxt-link>
                  </div>
                </div>
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
useComponentTitle('장바구니');
import { useCartStore } from "~/store/useCartStore";
import CartItem from "./CartItem.vue";

const state = useCartStore();
const { formatPrice } = usePrice();
</script>
