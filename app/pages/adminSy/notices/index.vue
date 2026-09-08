<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">공지사항관리</h1>
    <AdminSearchBar show-reset :page-type="page.pageType" @search="onSearch" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">공지제목</span>
          <input v-model="search.noticeTitle" type="text" class="border rounded px-3 py-1.5 w-48" placeholder="공지제목" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">공지유형</span>
          <select v-model="search.noticeType" class="border rounded px-3 py-1.5 w-28">
            <option value="">전체</option>
            <option value="1">알림</option>
            <option value="2">공지</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">공지상태</span>
          <select v-model="search.status" class="border rounded px-3 py-1.5 w-28">
            <option value="">전체</option>
            <option value="0">정상</option>
            <option value="1">비표시</option>
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
      row-key="noticeId"
      title-column-key="noticeTitle"
      :show-detail-col="true"
      :show-edit-col="true"
      :detail-route="(row) => `/adminSy/notices/${row.noticeId}`"
      :edit-route="(row) => `/adminSy/notices/${row.noticeId}-edit`"
      :detail-open-new-tab="true"
      :detail-tab-title="(row) => `공지상세(${row.noticeId})`"
      :edit-tab-title="(row) => `공지상세(${row.noticeId})`"
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
usePageTitle("공지사항관리");

const columns = [
  { key: "noticeId", label: "공지ID" },
  { key: "noticeTitle", label: "공지제목" },
  { key: "noticeType", label: "공지유형" },
  { key: "status", label: "공지상태" },
  { key: "createBy", label: "생성자" },
  { key: "createTime", label: "생성시간" },
];

const search = reactive({ noticeTitle: "", noticeType: "", status: "" });
const list = reactive<NoticeRow[]>([]);
const cardList = reactive<NoticeRow[]>([]);
const selectedIds = reactive<(string | number)[]>([]);
const page = reactive({ pageNo: 1, pageSize: 10, totalCount: 0, pageType: PAGE_TYPE_DEFAULT as import("~/types/page").PageType });
const { isCardView } = useBreakpoint();
const cardPageNo = ref(1);
const loadingMore = ref(false);
const { openDetailTab } = useOpenDetailTab();

const hasMoreCard = computed(() => cardList.length < page.totalCount);

type NoticeRow = {
  noticeId: string;
  noticeTitle: string;
  noticeType: string;
  noticeContent?: string;
  status: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
};

async function fetchPage(pageNo: number): Promise<NoticeRow[]> {
  const q = new URLSearchParams();
  q.set("pageNo", String(pageNo));
  q.set("pageSize", String(page.pageSize));
  if (search.noticeTitle) q.set("noticeTitle", search.noticeTitle);
  if (search.noticeType) q.set("noticeType", search.noticeType);
  if (search.status !== "") q.set("status", search.status);
  const res = await $fetch<{ list: NoticeRow[]; totalCount: number }>(`/api/sy/notices?${q}`);
  page.totalCount = res.totalCount ?? 0;
  return res.list ?? [];
}

async function fetchList() {
  try {
    const items = await fetchPage(page.pageNo);
    list.splice(0, list.length, ...items);
  } catch {
    list.splice(0, list.length);
    page.totalCount = 0;
  }
}

function onSearch() {
  page.pageNo = 1;
  fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    fetchPage(1).then((items) => cardList.splice(0, cardList.length, ...items)).catch(() => cardList.splice(0, cardList.length));
  }
}

async function loadMoreCard() {
  if (loadingMore.value || !hasMoreCard.value) return;
  loadingMore.value = true;
  try {
    const items = await fetchPage(cardPageNo.value + 1);
    cardPageNo.value += 1;
    cardList.push(...items);
  } finally {
    loadingMore.value = false;
  }
}

watch(isCardView, (card) => {
  if (card) {
    cardPageNo.value = 1;
    fetchPage(1).then((items) => cardList.splice(0, cardList.length, ...items)).catch(() => cardList.splice(0, cardList.length));
  }
});

function resetSearch() {
  search.noticeTitle = "";
  search.noticeType = "";
  search.status = "";
  page.pageNo = 1;
  cardPageNo.value = 1;
  fetchList();
  if (isCardView.value) {
    fetchPage(1).then((items) => cardList.splice(0, cardList.length, ...items)).catch(() => cardList.splice(0, cardList.length));
  }
}

function goNew(e?: MouseEvent) {
  openDetailTab("/adminSy/notices/new", "공지사항 등록", e?.ctrlKey ?? false);
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
  try {
    for (const id of selectedIds) {
      await $fetch(`/api/sy/notices/${id}`, { method: "DELETE" });
    }
    selectedIds.splice(0, selectedIds.length);
    await fetchList();
  } catch (err: any) {
    await useAlert().openAlert(err?.data?.message || "삭제에 실패했습니다.");
  }
}

onMounted(() => {
  fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    fetchPage(1).then((items) => cardList.splice(0, cardList.length, ...items)).catch(() => cardList.splice(0, cardList.length));
  }
});
</script>
