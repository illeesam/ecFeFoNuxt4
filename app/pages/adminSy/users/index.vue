<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">사용자관리</h1>
    <AdminSearchBar show-reset :page-type="page.pageType" @search="onSearch" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">사용자명</span>
          <input v-model="search.name" type="text" class="border rounded px-3 py-1.5 w-40" placeholder="이름" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">아이디</span>
          <input v-model="search.loginId" type="text" class="border rounded px-3 py-1.5 w-40" placeholder="ID" />
        </label>
      </div>
    </AdminSearchBar>
    <AdminGrid
      v-model:selected-ids="selectedIds"
      :columns="columns"
      :rows="list"
      :card-rows="cardList"
      :page-type="page.pageType"
      row-key="userId"
      title-column-key="name"
      :show-detail-col="true"
      :show-edit-col="true"
      :detail-route="(row) => `/adminSy/users/${row.userId}`"
      :edit-route="(row) => `/adminSy/users/${row.userId}-edit`"
      :detail-open-new-tab="true"
      :detail-tab-title="(row) => `사용자상세(${row.userId})`"
      :edit-tab-title="(row) => `사용자상세(${row.userId})`"
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
usePageTitle("사용자관리");

type UserRow = { userId: number; loginId: string; name: string; email: string; role: string };

const columns = [
  { key: "userId", label: "사용자ID" },
  { key: "loginId", label: "로그인ID" },
  { key: "name", label: "이름" },
  { key: "email", label: "이메일" },
  { key: "role", label: "역할" },
];

const search = reactive({ name: "", loginId: "" });
const list = reactive<UserRow[]>([]);
const cardList = reactive<UserRow[]>([]);
const selectedIds = reactive<(string | number)[]>([]);
const page = reactive({ pageNo: 1, pageSize: 10, totalCount: 0, pageType: PAGE_TYPE_DEFAULT as import("~/types/page").PageType });
const { isCardView } = useBreakpoint();
const cardPageNo = ref(1);
const loadingMore = ref(false);
const { openDetailTab } = useOpenDetailTab();

const rawList = computed(() => {
  const raw: UserRow[] = [
    { userId: 1, loginId: "admin", name: "관리자", email: "admin@example.com", role: "ADMIN" },
    { userId: 2, loginId: "user1", name: "홍길동", email: "user1@example.com", role: "USER" },
  ];
  return raw.filter((r) => {
    if (search.name && !r.name.includes(search.name)) return false;
    if (search.loginId && !r.loginId.includes(search.loginId)) return false;
    return true;
  });
});

const hasMoreCard = computed(() => cardList.length < page.totalCount);

function fetchPage(pageNo: number): UserRow[] {
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
  search.name = "";
  search.loginId = "";
  page.pageNo = 1;
  cardPageNo.value = 1;
  fetchList();
  if (isCardView.value) cardList.splice(0, cardList.length, ...fetchPage(1));
}

function goNew(e?: MouseEvent) {
  openDetailTab("/adminSy/users/new", "사용자 등록", e?.ctrlKey ?? false);
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
