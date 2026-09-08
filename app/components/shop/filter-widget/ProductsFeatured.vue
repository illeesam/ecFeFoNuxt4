<template>
  <div class="sidebar__widget">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget-title mb-30">
      <h3>추천 상품</h3>
    </div>
    <div class="sidebar__widget-content">
      <div class="features__product">
        <ul>
          <li v-for="(item, i) in featured_prd" :key="i" class="mb-20">
            <div class="featires__product-wrapper d-flex">
              <div class="features__product-thumb mr-15">
                <nuxt-link :to="`/product-details/${item.productId}`">
                  <app-image :src="item.img" alt="pro-sm-1" :img-style="{ width: '86px', height: '110px', objectFit: 'cover' }" :skeleton-style="{ width: '86px', height: '110px' }" />
                </nuxt-link>
              </div>
              <div class="features__product-content">
                <h5>
                  <nuxt-link :to="`/product-details/${item.productId}`">
                    <span v-html="item.title"></span>
                  </nuxt-link>
                </h5>
                <div class="price">
                  <span>{{ formatPrice(item.price) }}</span>
                  <span v-if="item.oldPrice" class="old-price">
                    <del>{{ formatPrice(item.oldPrice) }}</del>
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import AppImage from "~/components/ui/AppImage.vue";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('추천 상품 필터');

const store = useProductsStore();
const { formatPrice } = usePrice();
const featured_prd = computed(() => store.products.filter((p) => p.trending).slice(0, 2));
</script>
