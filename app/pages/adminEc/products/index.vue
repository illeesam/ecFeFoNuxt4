<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">상품관리</h1>
    <AdminSearchBar show-reset :page-type="page.pageType" @search="onSearch" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">상품명</span>
          <input v-model="search.title" type="text" class="border rounded px-3 py-1.5 w-48" placeholder="상품명" />
        </label>
      </div>
    </AdminSearchBar>
    <AdminGrid
      v-model:selected-ids="selectedIds"
      :columns="columns"
      :rows="list"
      :card-rows="cardList"
      :page-type="page.pageType"
      row-key="productId"
      title-column-key="title"
      :show-detail-col="true"
      :show-edit-col="true"
      :detail-route="(row: any) => `/adminEc/products/${row.productId}`"
      :edit-route="(row: any) => `/adminEc/products/${row.productId}-edit`"
      :detail-open-new-tab="true"
      :detail-tab-title="(row: any) => `상품상세(${row.productId})`"
      :edit-tab-title="(row: any) => `상품상세(${row.productId})`"
      selectable
      @select-change="(ids) => selectedIds.splice(0, selectedIds.length, ...ids)"
    >
      <template #toolbar>
        <button type="button" class="px-3 py-1.5 bg-amber-600 text-white rounded text-sm hover:bg-amber-700" @click="goNew($event)">
          신규
        </button>
        <button type="button" class="px-3 py-1.5 border border-red-400 text-red-600 rounded text-sm hover:bg-red-50" @click="doDelete">
          삭제
        </button>
      </template>
      <template #row-actions="{ row }">
        <button
          type="button"
          class="text-sky-600 hover:underline font-medium bg-transparent border-0 cursor-pointer p-0"
          @click="openPreview(row)"
        >
          미리보기
        </button>
      </template>
      <template #cell-price="{ value }">
        {{ Number(value).toLocaleString() }}원
      </template>
    </AdminGrid>
    <AdminPagination
      :page-no="page.pageNo"
      :page-size="page.pageSize"
      :total-count="page.totalCount"
      :page-type="page.pageType"
      :has-more-card="hasMoreCard"
      :loading-more="loadingMore"
      @update:page-no="(v) => { page.pageNo = v; fetchList(); }"
      @update:page-size="(v) => { page.pageSize = v; page.pageNo = 1; fetchList(); }"
      @load-more="loadMoreCard"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { usePageTitle } from "~/composables/usePageTitle";
import { PAGE_TYPE_PRODUCT } from "~/types/page";
definePageMeta({ layout: "admin" });
usePageTitle("상품관리");

type ProductRow = { productId: number; title: string; price: number; quantity: number };

const columns = [
  { key: "productId", label: "상품ID" },
  { key: "title", label: "상품명" },
  { key: "price", label: "가격" },
  { key: "quantity", label: "수량" },
];

const search = reactive({ title: "" });
const list = reactive<ProductRow[]>([]);
const productFullList = ref<ProductRow[]>([]);
const cardList = reactive<ProductRow[]>([]);
const selectedIds = reactive<(string | number)[]>([]);
const page = reactive({ pageNo: 1, pageSize: 10, totalCount: 0, pageType: PAGE_TYPE_PRODUCT as import("~/types/page").PageType });
const { isCardView } = useBreakpoint();
const cardPageNo = ref(1);
const loadingMore = ref(false);
const { openDetailTab } = useOpenDetailTab();

const hasMoreCard = computed(() => cardList.length < page.totalCount);

async function fetchFull() {
  const res = await $fetch<ProductRow[]>("/api/products");
  let items = res ?? [];
  if (search.title) items = items.filter((p) => p.title?.toLowerCase().includes(search.title.toLowerCase()));
  productFullList.value = items;
  page.totalCount = items.length;
  return items;
}

function fetchPage(pageNo: number): ProductRow[] {
  const start = (pageNo - 1) * page.pageSize;
  return productFullList.value.slice(start, start + page.pageSize);
}

async function fetchList() {
  try {
    await fetchFull();
    list.splice(0, list.length, ...fetchPage(page.pageNo));
  } catch {
    list.splice(0, list.length);
    productFullList.value = [];
    page.totalCount = 0;
  }
}

function onSearch() {
  page.pageNo = 1;
  fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
}

async function loadMoreCard() {
  if (loadingMore.value || !hasMoreCard.value) return;
  loadingMore.value = true;
  try {
    const nextNo = cardPageNo.value + 1;
    cardList.push(...fetchPage(nextNo));
    cardPageNo.value = nextNo;
  } finally {
    loadingMore.value = false;
  }
}

watch(isCardView, (card) => {
  if (card) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
});

async function resetSearch() {
  search.title = "";
  page.pageNo = 1;
  cardPageNo.value = 1;
  await fetchList();
  if (isCardView.value) cardList.splice(0, cardList.length, ...fetchPage(1));
}

function goNew(e?: MouseEvent) {
  openDetailTab("/adminEc/products/new", "상품 등록", e?.ctrlKey ?? false);
}

function openPreview(row: { productId: number }) {
  const w = 1900;
  const h = 1000;
  const margin = 24;
  const left = Math.max(0, (typeof screen !== "undefined" ? screen.availWidth : 1920) - w - margin);
  const top = margin;
  const url = `${window.location.origin}/product-details/${row.productId}`;
  window.open(url, "product-preview", `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
}

async function doDelete() {
  if (selectedIds.length === 0) {
    await useAlert().openAlert("삭제할 항목을 선택하세요.");
    return;
  }
  const ok = await useConfirm().openConfirm({
    title: "삭제 확인",
    message: `${selectedIds.length}건 삭제할까요?`,
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
  });
  if (!ok) return;
  // TODO: API 삭제 후 fetchList()
  selectedIds.splice(0, selectedIds.length);
  fetchList();
}

onMounted(async () => {
  await fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
});
</script>
