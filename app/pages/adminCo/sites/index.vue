<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">사이트관리</h1>
    <AdminSearchBar show-reset :page-type="page.pageType" @search="onSearch" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">사이트명</span>
          <input v-model="search.siteNm" type="text" class="border rounded px-3 py-1.5 w-48" placeholder="사이트명" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">사용여부</span>
          <select v-model="search.useYn" class="border rounded px-3 py-1.5 w-28">
            <option value="">전체</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </label>
      </div>
    </AdminSearchBar>
    <AdminGrid
      v-model:selected-ids="selectedIds"
      :columns="columns"
      :rows="list"
      :card-rows="cardList"
      :page-type="page.pageType"
      row-key="siteId"
      title-column-key="siteNm"
      :show-detail-col="true"
      :show-edit-col="true"
      :detail-route="(row) => `/adminCo/sites/${row.siteId}`"
      :edit-route="(row) => `/adminCo/sites/${row.siteId}-edit`"
      :detail-open-new-tab="true"
      :detail-tab-title="(row) => `사이트상세(${row.siteId})`"
      :edit-tab-title="(row) => `사이트상세(${row.siteId})`"
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
import { PAGE_TYPE_DEFAULT } from "~/types/page";
definePageMeta({ layout: "admin" });
usePageTitle("사이트관리");

type SiteRow = { siteId: number; siteNm: string; useYn: string };

const columns = [
  { key: "siteId", label: "사이트ID" },
  { key: "siteNm", label: "사이트명" },
  { key: "useYn", label: "사용여부" },
];

const search = reactive({ siteNm: "", useYn: "" });
const list = reactive<SiteRow[]>([]);
const cardList = reactive<SiteRow[]>([]);
const selectedIds = reactive<(string | number)[]>([]);
const page = reactive({ pageNo: 1, pageSize: 10, totalCount: 0, pageType: PAGE_TYPE_DEFAULT as import("~/types/page").PageType });
const { isCardView } = useBreakpoint();
const cardPageNo = ref(1);
const loadingMore = ref(false);
const { openDetailTab } = useOpenDetailTab();

const rawList = computed(() =>
  [
    { siteId: 1, siteNm: "메인사이트", useYn: "Y" },
    { siteId: 2, siteNm: "테스트사이트", useYn: "N" },
  ].filter((r) => {
    if (search.siteNm && !r.siteNm.includes(search.siteNm)) return false;
    if (search.useYn && r.useYn !== search.useYn) return false;
    return true;
  })
);

const hasMoreCard = computed(() => cardList.length < page.totalCount);

function fetchPage(pageNo: number): SiteRow[] {
  const start = (pageNo - 1) * page.pageSize;
  return rawList.value.slice(start, start + page.pageSize);
}

function fetchList() {
  page.totalCount = rawList.value.length;
  list.splice(0, list.length, ...fetchPage(page.pageNo));
}

function onSearch() {
  page.pageNo = 1;
  fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
}

function loadMoreCard() {
  if (loadingMore.value || !hasMoreCard.value) return;
  loadingMore.value = true;
  const nextNo = cardPageNo.value + 1;
  cardList.push(...fetchPage(nextNo));
  cardPageNo.value = nextNo;
  loadingMore.value = false;
}

watch(isCardView, (card) => {
  if (card) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
});

function resetSearch() {
  search.siteNm = "";
  search.useYn = "";
  page.pageNo = 1;
  cardPageNo.value = 1;
  fetchList();
  if (isCardView.value) cardList.splice(0, cardList.length, ...fetchPage(1));
}

function goNew(e?: MouseEvent) {
  openDetailTab("/adminCo/sites/new", "사이트 등록", e?.ctrlKey ?? false);
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
  selectedIds.splice(0, selectedIds.length);
  fetchList();
}

onMounted(() => {
  fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
});
</script>
