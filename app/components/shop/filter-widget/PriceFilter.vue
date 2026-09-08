<template>
  <client-only>
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget mb-55">
      <div class="sidebar__widget-title mb-30">
        <h3>가격별 필터</h3>
      </div>
      <div class="sidebar__widget-content">
        <div class="price__slider">
          <div id="slider-range"></div>
          <div>
            <form @submit.prevent="state.getStFilterPrice">
              <Slider v-model="state.priceRange" :tooltips="false" @change="state.onChangeRange" :max="500000" />
              <button type="submit">필터</button>
              <label for="amount">가격: {{ formatPrice(state.priceRange[0]) }} - {{ formatPrice(state.priceRange[1]) }}</label>
            </form>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('가격 필터');
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";
import { useProductsStore } from "~/store/useProductsStore";

const state = useProductsStore();
const { formatPrice } = usePrice();
</script>

<style scoped></style>
