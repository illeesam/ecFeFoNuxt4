<template>
  <section class="compare__area pt-120 pb-120">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-12">
          <client-only>
            <div v-if="state.compare.length === 0" class="text-center">
              <h3>비교할 상품이 없습니다</h3>
              <nuxt-link class="os-btn os-btn-black mt-20" to="/shop"> 쇼핑하기 </nuxt-link>
            </div>
            <div v-if="state.compare.length > 0" class="tp-compare-table text-center">
              <table class="table table-responsive">
                <tbody>
                  <tr>
                    <th>상품</th>
                    <td v-for="(item, i) in state.compare" :key="i">
                      <div class="tp-compare-thumb">
                        <app-image :src="item.img" :alt="item.title" :skeleton-style="{ width: '100%', aspectRatio: '1/1' }" />
                        <h4 class="tp-compare-product-title">
                          <a href="#" v-html="item.title"></a>
                        </h4>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>설명</th>
                    <td v-for="(item, i) in state.compare" :key="i">
                      <div class="tp-compare-desc">
                        <p>{{ item.smDesc }}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>가격</th>
                    <td v-for="(item, i) in state.compare" :key="i">
                      <div class="tp-compare-price">
                        <span>{{ formatPrice(item.price) }}</span>
                        <span v-if="item.oldPrice" class="old-price">{{ formatPrice(item.oldPrice) }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>장바구니 담기</th>
                    <td v-for="(item, i) in state.compare" :key="i">
                      <div @click.prevent="cartState.addStCartProduct(item)" class="tp-compare-add-to-cart">
                        <a href="#" class="os-btn os-btn-black">장바구니에 담기</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>평점</th>
                    <td v-for="(item, i) in state.compare" :key="i">
                      <div class="tp-compare-rating">
                        <span><i class="fas fa-star"></i></span>
                        <span><i class="fas fa-star"></i></span>
                        <span><i class="fas fa-star"></i></span>
                        <span><i class="fas fa-star"></i></span>
                        <span><i class="fas fa-star"></i></span>
                        <strong class="mx-2">{{ item.rating }}</strong>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>삭제</th>
                    <td v-for="(item, i) in state.compare" :key="i">
                      <div class="tp-compare-remove">
                        <button @click="state.removeStCompare(item)">
                          <i class="fal fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 비교');
import { onMounted } from "vue";
import { useCartStore } from "~/store/useCartStore";
import { useCompareStore } from "~/store/useCompareStore";
import AppImage from "~/components/ui/AppImage.vue";

const state = useCompareStore();
const cartState = useCartStore();
const { formatPrice } = usePrice();
onMounted(() => {
  state.getStCompareProducts;
});
</script>
