<template>
  <div class="sidebar__widget mb-55">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget-title mb-30">
      <h3>사이즈</h3>
    </div>
    <div class="sidebar__widget-content">
      <div class="size">
        <ul>
          <li v-for="(size, i) in allSizes" :key="i" :class="`${state.activeCls === size ? 'active' : ''}`">
            <a @click.prevent="state.handleStSize(size)" href="#">{{ getSizeLabel(size) }}</a>
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
useComponentTitle('사이즈 필터');
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";
import { useFilterLabels } from "~/composables/useFilterLabels";

const state = useProductsStore();
const { getSizeLabel } = useFilterLabels();
const allSizes = computed(() => {
  const optionIds = new Set<string>();
  state.products.forEach((product) => {
    product.optionSizes?.forEach((opt) => optionIds.add(opt.optionCode ?? String(opt.optionId)));
  });
  return Array.from(optionIds);
});
</script>
