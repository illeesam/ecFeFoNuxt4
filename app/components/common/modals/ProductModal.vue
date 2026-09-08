<template>
  <Teleport to="body">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div v-show="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" :id="`${list ? `productModalListId-${item.productId}` : `productModalId-${item.productId}`}`" role="dialog" aria-hidden="true" @click.self="close">
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto product-modal rounded-lg bg-white shadow-xl">
        <div class="product__modal-wrapper relative p-6">
          <div class="product__modal-close absolute top-4 right-4 z-10">
            <button type="button" @click="close" class="p-2 hover:bg-gray-100 rounded"><i class="fal fa-times"></i></button>
          </div>
          <div class="product__modal-inner">
            <div class="modal-grid">
              <div>
                <div class="product__modal-box">
                  <div class="mb-5" id="nav-tabContent">
                    <div class="product__modal-img w-img">
                      <app-image :src="active_img" alt="product_img" wrap-class="w-img" :skeleton-style="{ width: '100%', aspectRatio: '1/1' }" />
                    </div>
                  </div>
                  <nav>
                    <div class="flex justify-between gap-2 flex-wrap">
                      <button v-for="(img, i) in item.relatedImages || []" :key="i" :class="`p-1 border rounded ${img === active_img ? 'border-theme ring-1 ring-theme' : 'border-gray-200'}`" @click="handleActiveImg(img)">
                        <app-image :src="img" alt="image" :img-style="{ width: '90px', height: '90px', objectFit: 'cover' }" :skeleton-style="{ width: '90px', height: '90px' }" />
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
              <div style="min-width: 0;">
                <product-details-content :item="item" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 모달');
import { ref, watch } from "vue";
import ProductDetailsContent from "~/components/shop-details/ProductDetailsContent.vue";
import { type PdProductType } from "~/types/pdProductType";
import AppImage from "~/components/ui/AppImage.vue";

const props = defineProps<{
  item: PdProductType;
  list?: boolean;
}>();
const visible = ref(false);
const active_img = ref(props.item.img);
watch(() => props.item.img, (v) => { active_img.value = v; });

function handleActiveImg(img: string) {
  active_img.value = img;
}
function show() {
  active_img.value = props.item.img;
  visible.value = true;
}
function close() {
  visible.value = false;
}
defineExpose({ show, close });
</script>

<style scoped>
.modal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) {
  .modal-grid {
    grid-template-columns: 5fr 7fr;
  }
}
</style>
