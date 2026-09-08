<template>
  <div class="sidebar__widget mb-60">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget-title mb-20">
      <h3>색상 선택</h3>
    </div>
    <div class="sidebar__widget-content">
      <div class="color__pick">
        <form>
          <ul>
            <li v-for="(color, i) in allColor?.slice(0, 8)" :key="color">
              <button @click.prevent="state.handleStColor(color)" type="button" :class="`color color-${Number(i) + 1} ${state.activeCls === color ? `active-${Number(i) + 1}` : ''}`"></button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('색상 필터');
import { computed } from "vue";
import { useProductsStore } from "~/store/useProductsStore";

const state = useProductsStore();
const allColor = computed(() => {
  const optionIds = new Set<string>();
  state.products.forEach((product) => {
    product.optionColors?.forEach((opt) => optionIds.add(opt.optionCode ?? String(opt.optionId)));
  });
  return Array.from(optionIds);
});
</script>
