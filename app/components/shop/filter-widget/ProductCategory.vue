<template>
  <div class="sidebar__widget mb-55">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget-title mb-25">
      <h3>상품 카테고리</h3>
    </div>
    <div class="sidebar__widget-content">
      <div class="categories">
        <div class="shop-category-accordion">
          <div class="card" v-for="(item, i) in parentCategories" :key="item.categoryId">
            <div class="card-header white-bg">
              <h5 class="mb-0">
                <button
                  type="button"
                  @click="toggle(i); state.handleStParentCategory(item.value)"
                  :class="['shop-accordion-btn', expanded[i] ? '' : 'collapsed', state.activeCls === item.value ? 'active' : '']"
                  :aria-expanded="!!expanded[i]"
                >
                  {{ item.parentTitle }}
                </button>
              </h5>
            </div>
            <div class="shop-category-collapse" :class="{ show: expanded[i] }">
              <div class="card-body">
                <div class="categories__list">
                  <ul>
                    <li v-for="(childId, j) in item.children" :key="j">
                      <a @click.prevent="state.handleStCategory(childId)" href="#" :class="[state.activeCls === childId ? 'active' : '']">
                        {{ categoryIdToName[childId] ?? childId }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 카테고리');
import { reactive, computed } from "vue";
import { axiosSsr } from "~/utils/axiosSsr";
import { useProductsStore } from "~/store/useProductsStore";

const state = useProductsStore();

interface CategoryTreeItem {
  categoryId: string;
  parentTitle: string;
  value: string;
  children: string[];
}
interface CategoryTreeResponse {
  categoryTree: CategoryTreeItem[];
  categoryIdToName: Record<string, string>;
}

const { data: catData } = useAsyncData<CategoryTreeResponse>(
  "category-tree",
  () => axiosSsr.get<CategoryTreeResponse>("/api/category-tree").then((r) => r.data),
  { default: () => ({ categoryTree: [], categoryIdToName: {} }) }
);

const categoryIdToName = computed(() => catData.value?.categoryIdToName ?? {});

const parentCategories = computed(() => {
  const seen = new Set<string>();
  return (catData.value?.categoryTree ?? []).filter((arr) => {
    if (seen.has(arr.parentTitle)) return false;
    seen.add(arr.parentTitle);
    return true;
  });
});

const expanded = reactive<Record<number, boolean>>({});
function toggle(i: number) {
  expanded[i] = !expanded[i];
}
</script>
