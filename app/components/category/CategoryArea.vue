<template>
  <div :class="`banner__area ${style_2 ? 'pt-95' : ''} ${style_3 ? 'pt-20' : ''} ${style_4 ? 'pt-30' : ''}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div :class="`container mx-auto ${style_3 ? 'custom-container' : ''}`">
      <div :class="`${style_2 ? '' : !style_3 && !style_4 && 'banner__inner relative mt--95'} ${style_4 ? 'banner__inner-2 relative' : ''}`">
        <div class="row flex justify-center">
          <div v-for="item in categoryItems" :key="item.categoryId" class="col-xl-4 col-lg-4 col-md-6">
            <div class="banner__item mb-30 relative">
              <div class="banner__thumb fix">
                <nuxt-link href="/shop" class="w-img">
                  <app-image
                    :src="item.img"
                    alt="banner"
                    wrap-class="w-img"
                    :skeleton-style="{ width: '100%', aspectRatio: '4/3' }"
                  />
                </nuxt-link>
              </div>
              <div class="banner__content banner__content--center absolute transition-3">
                <h5>
                  <nuxt-link href="/shop">
                    <span v-html="item.parentTitle"></span>
                  </nuxt-link>
                </h5>
                <nuxt-link href="/shop" class="link-btn">둘러보기</nuxt-link>
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
useComponentTitle('카테고리');
import { computed } from "vue";
import { axiosSsr } from "~/utils/axiosSsr";
import AppImage from "~/components/ui/AppImage.vue";

defineProps({
  style_2: { type: Boolean, default: false },
  style_3: { type: Boolean, default: false },
  style_4: { type: Boolean, default: false },
});

interface CategoryTreeItem {
  categoryId: string;
  img: string;
  parentTitle: string;
  value: string;
  children: string[];
  smDesc?: string;
}

const { data: catData } = useAsyncData<{ categoryTree: CategoryTreeItem[] }>(
  "category-tree",
  () => axiosSsr.get<{ categoryTree: CategoryTreeItem[] }>("/api/category-tree").then((r) => r.data),
  { default: () => ({ categoryTree: [] }) }
);

const categoryItems = computed(() => (catData.value?.categoryTree ?? []).slice(0, 3));
</script>
