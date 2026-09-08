<template>
  <div class="shop__sidebar">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <!-- 상품 카테고리 시작 -->
    <product-category />
    <!-- 상품 카테고리 끝 -->

    <!-- 가격 필터 시작 -->
    <price-filter />
    <!-- 가격 필터 끝 -->

    <!-- 상품 사이즈 시작 -->
    <product-sizes />
    <!-- 상품 사이즈 끝 -->

    <!-- 상품 색상 시작 -->
    <product-color />
    <!-- 상품 색상 끝 -->

    <!-- 상품 브랜드 시작 -->
    <product-brands />
    <!-- 상품 브랜드 끝 -->

    <!-- 초기화 버튼 시작 -->
    <reset-button />
    <!-- 초기화 버튼 끝 -->

    <!-- 추천 상품 시작 -->
    <products-featured />
    <!-- 추천 상품 끝 -->
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('쇼핑 사이드바');
import PriceFilter from "./filter-widget/PriceFilter.vue";
import ProductBrands from "./filter-widget/ProductBrands.vue";
import ProductCategory from "./filter-widget/ProductCategory.vue";
import ProductColor from "./filter-widget/ProductColor.vue";
import ProductsFeatured from "./filter-widget/ProductsFeatured.vue";
import ProductSizes from "./filter-widget/ProductSizes.vue";
import ResetButton from "./filter-widget/ResetButton.vue";
</script>
