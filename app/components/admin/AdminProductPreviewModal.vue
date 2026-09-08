<template>
  <Teleport to="body">
    <div
      v-show="visible"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-product-preview-title"
      @click.self="close"
    >
      <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div class="sticky top-0 flex justify-end p-2 bg-white border-b z-10">
          <button type="button" class="p-2 hover:bg-gray-100 rounded-full" aria-label="닫기" @click="close">
            <i class="fal fa-times text-lg"></i>
          </button>
        </div>
        <div class="p-6">
          <h2 id="admin-product-preview-title" class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            쇼핑몰 상품상세 미리보기
          </h2>
          <div v-if="loading" class="py-12 text-center text-gray-500">로딩 중...</div>
          <template v-else-if="product">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  v-if="product.img"
                  :src="product.img"
                  :alt="product.title"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-gray-400 text-sm">이미지 없음</span>
              </div>
              <div class="flex flex-col">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.title }}</h3>
                <div class="text-2xl font-bold text-amber-600 mb-4">
                  {{ Number(product.price).toLocaleString() }}원
                </div>
                <dl class="space-y-2 text-sm">
                  <div class="flex">
                    <dt class="w-24 text-gray-500 shrink-0">상품ID</dt>
                    <dd>{{ product.productId }}</dd>
                  </div>
                  <div class="flex">
                    <dt class="w-24 text-gray-500 shrink-0">재고수량</dt>
                    <dd>{{ product.quantity }}</dd>
                  </div>
                  <div v-if="product.smDesc" class="flex flex-col mt-4">
                    <dt class="text-gray-500 mb-1">설명</dt>
                    <dd class="text-gray-700">{{ product.smDesc }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface ProductRow {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  img?: string;
  smDesc?: string;
}

const visible = ref(false);
const loading = ref(false);
const product = ref<ProductRow | null>(null);

async function loadProduct(id: number) {
  loading.value = true;
  product.value = null;
  try {
    const res = await $fetch<ProductRow & { img?: string; smDesc?: string }>(`/api/products/${id}`);
    product.value = res ?? { productId: id, title: "-", price: 0, quantity: 0 };
  } catch {
    product.value = { productId: id, title: "(조회 실패)", price: 0, quantity: 0 };
  } finally {
    loading.value = false;
  }
}

function show(rowOrId: ProductRow | number) {
  visible.value = true;
  if (typeof rowOrId === "number") {
    loadProduct(rowOrId);
  } else {
    product.value = { ...rowOrId };
    loading.value = false;
  }
}

function close() {
  visible.value = false;
}

defineExpose({ show, close });
</script>
