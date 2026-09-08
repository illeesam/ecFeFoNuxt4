<template>
  <div class="sidebar__widget mb-50">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget-title mb-25">
      <h3>브랜드</h3>
    </div>
    <div class="sidebar__widget-content">
      <div class="brand">
        <ul>
          <li v-for="(brand, i) in brands" :key="i">
            <a :class="`${state.activeCls === brand ? 'active' : ''}`" @click.prevent="state.handleStBrand(brand)" href="#">
              {{ getBrandLabel(brand) }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('브랜드 필터');
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import { useFilterLabels } from "~/composables/useFilterLabels";

const state = useProductsStore();
const { getBrandLabel } = useFilterLabels();
const brands = computed(() => [...new Set(state.products.map((p) => p.brand?.brandCode ?? String(p.brand?.brandId)))]);
</script>
