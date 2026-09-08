<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminEc/products" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminEc/products', '상품관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '상품 등록' : mode === 'edit' ? '상품 수정' : '상품 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <!-- 상세(보기): 라벨 고정폭(5.5rem) + 값 영역 min-w-0 으로 정렬·넘침 방지 -->
      <template v-if="mode === 'view' && product">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">상품ID</dt>
            <dd class="min-w-0 break-words">{{ product.productId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">상품명</dt>
            <dd class="min-w-0 break-words">{{ product.title }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">가격</dt>
            <dd class="min-w-0 break-words">{{ Number(product.price).toLocaleString() }}원</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">수량</dt>
            <dd class="min-w-0 break-words">{{ product.quantity }}</dd>
          </div>
        </dl>
        <p class="mt-4">
          <NuxtLink :to="`/product-details/${product.productId}`" class="text-amber-600 hover:underline">프론트 상품페이지 보기</NuxtLink>
        </p>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminEc/products/${product.productId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <!-- 신규/수정 폼: 라벨 고정폭(5.5rem) + 입력 min-w-0 으로 정렬·영역 밖 넘침 방지 -->
      <template v-else-if="mode === 'edit' || mode === 'new'">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">상품ID</label>
              <input :value="product?.productId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">상품명 <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">가격</label>
              <input v-model.number="form.price" type="number" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">수량</label>
              <input v-model.number="form.quantity" type="number" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminEc/products' : `/adminEc/products/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !product && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { usePageTitle } from "~/composables/usePageTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });
usePageTitle("상품 상세");
const { goToList } = useAdminListNav();

const productSchema = yup.object({
  title: yup.string().required("상품명을 입력해 주세요").label("상품명"),
});

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

const product = ref<{ productId: number; title: string; price: number; quantity: number } | null>(null);
const loading = ref(false);
const form = reactive({ title: "", price: 0, quantity: 0 });

const pageTitle = computed(() => {
  if (mode.value === "new") return "상품 등록";
  if (product.value) return `상품상세(${product.value.productId})`;
  return entityId.value ? `상품상세(${entityId.value})` : "상품 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function load() {
  if (mode.value === "new") return;
  if (!entityId.value) return;
  loading.value = true;
  try {
    const res = await $fetch<{ productId: number; title: string; price: number; quantity: number }>(`/api/products/${entityId.value}`);
    product.value = res ?? null;
    if (product.value && mode.value === "edit") {
      form.title = product.value.title;
      form.price = product.value.price;
      form.quantity = product.value.quantity;
    }
  } catch {
    product.value = null;
  } finally {
    loading.value = false;
  }
}

async function save() {
  try {
    await productSchema.validate({ title: form.title });
  } catch (e: unknown) {
    const err = e as yup.ValidationError;
    await useAlert().openAlert(err.message ?? "입력값을 확인해 주세요.");
    return;
  }
  // TODO: API POST/PUT
  await useAlert().openAlert("저장 기능은 API 연동 후 구현됩니다.");
}

watch([rawId, mode], load, { immediate: true });
</script>
