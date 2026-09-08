<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">회원관리</h1>
    <AdminSearchBar show-reset :page-type="page.pageType" @search="onSearch" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">회원명</span>
          <input v-model="search.name" type="text" class="border rounded px-3 py-1.5 w-40" placeholder="이름" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">이메일</span>
          <input v-model="search.email" type="text" class="border rounded px-3 py-1.5 w-40" placeholder="이메일" />
        </label>
      </div>
    </AdminSearchBar>
    <AdminGrid
      :columns="columns"
      :rows="list"
      :card-rows="cardList"
      :page-type="page.pageType"
      row-key="memberId"
      title-column-key="name"
      :show-detail-col="true"
      :show-edit-col="true"
      :detail-route="(row: any) => `/adminEc/members/${row.memberId}`"
      :edit-route="(row: any) => `/adminEc/members/${row.memberId}-edit`"
      :detail-open-new-tab="true"
      :detail-tab-title="(row: any) => `회원상세(${row.memberId})`"
      :edit-tab-title="(row: any) => `회원상세(${row.memberId})`"
    >
      <template #toolbar>
        <button type="button" class="px-3 py-1.5 bg-amber-600 text-white rounded text-sm hover:bg-amber-700" @click="goNew($event)">
          신규
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
usePageTitle("회원관리");

type MemberRow = { memberId: number; name: string; email: string; phone: string; status: string };

const columns = [
  { key: "memberId", label: "회원ID" },
  { key: "name", label: "이름" },
  { key: "email", label: "이메일" },
  { key: "phone", label: "연락처" },
  { key: "status", label: "상태" },
];

const search = reactive({ name: "", email: "" });
const list = reactive<MemberRow[]>([]);
const cardList = reactive<MemberRow[]>([]);
const page = reactive({ pageNo: 1, pageSize: 10, totalCount: 0, pageType: PAGE_TYPE_DEFAULT as import("~/types/page").PageType });
const { isCardView } = useBreakpoint();
const cardPageNo = ref(1);
const loadingMore = ref(false);
const { openDetailTab } = useOpenDetailTab();

const rawList = computed(() => {
  const raw: MemberRow[] = [
    { memberId: 1, name: "김회원", email: "member1@example.com", phone: "010-1111-2222", status: "정상" },
    { memberId: 2, name: "이회원", email: "member2@example.com", phone: "010-3333-4444", status: "정상" },
  ];
  return raw.filter((r) => {
    if (search.name && !r.name.includes(search.name)) return false;
    if (search.email && !r.email.includes(search.email)) return false;
    return true;
  });
});

const hasMoreCard = computed(() => cardList.length < page.totalCount);

function fetchPage(pageNo: number): MemberRow[] {
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
  search.email = "";
  page.pageNo = 1;
  cardPageNo.value = 1;
  fetchList();
  if (isCardView.value) cardList.splice(0, cardList.length, ...fetchPage(1));
}

function goNew(e?: MouseEvent) {
  openDetailTab("/adminEc/members/new", "회원 등록", e?.ctrlKey ?? false);
}

onMounted(() => {
  fetchList();
  if (isCardView.value) {
    cardPageNo.value = 1;
    cardList.splice(0, cardList.length, ...fetchPage(1));
  }
});
</script>
