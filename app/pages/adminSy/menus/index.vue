<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-4">메뉴관리</h1>
    <AdminSearchBar show-reset :page-type="page.pageType" @search="onSearch" @reset="resetSearch">
      <div class="flex flex-wrap gap-4 items-end">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">메뉴명</span>
          <input v-model="search.menuName" type="text" class="border rounded px-3 py-1.5 w-48" placeholder="메뉴명" />
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-sm text-gray-600">상위메뉴</span>
          <div class="flex items-stretch gap-1">
            <input
              :value="search.upMenuName ? `${search.upMenuName} (${search.upMenuId || '0'})` : (search.upMenuId || '')"
              type="text"
              class="border rounded px-3 py-1.5 w-48 bg-gray-50"
              placeholder="선택 안 함"
              readonly
            />
            <button
              type="button"
              class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm shrink-0"
              title="상위메뉴 선택"
              @click="openUpMenuPopup"
            >
              선택
            </button>
            <button
              v-if="search.upMenuId || search.upMenuName"
              type="button"
              class="px-2 py-1.5 text-gray-500 hover:text-red-600 shrink-0"
              title="선택 해제"
              @click="clearUpMenu"
            >
              ×
            </button>
          </div>
        </label>
      </div>
    </AdminSearchBar>
    <AdminIframeLayer
      v-model="upMenuPopupVisible"
      :src="upMenuPopupSrc"
      title="상위 메뉴 선택"
      :width="900"
      :height="620"
      select-message-type="menuSelPopup:select"
      close-message-type="menuSelPopup:close"
      :on-select="onUpMenuSelect"
      @update:model-value="upMenuPopupVisible = false"
    />
    <AdminGrid
      v-model:selected-ids="selectedIds"
      :columns="columns"
      :rows="list"
      :card-rows="cardList"
      :page-type="page.pageType"
      row-key="menuId"
      title-column-key="menuName"
      :show-detail-col="true"
      :show-edit-col="true"
      :detail-route="(row) => `/adminSy/menus/${row.menuId}`"
      :edit-route="(row) => `/adminSy/menus/${row.menuId}-edit`"
      :detail-open-new-tab="true"
      :detail-tab-title="(row) => `메뉴상세(${row.menuId})`"
      :edit-tab-title="(row) => `메뉴상세(${row.menuId})`"
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
import AdminIframeLayer from "~/components/admin/AdminIframeLayer.vue";
import { PAGE_TYPE_DEFAULT } from "~/types/page";
definePageMeta({ layout: "admin" });
usePageTitle("메뉴관리");

const columns = [
  { key: "menuId", label: "메뉴ID" },
  { key: "menuName", label: "메뉴명" },
  { key: "upMenuId", label: "상위메뉴ID" },
  { key: "orderNum", label: "정렬순서" },
  { key: "url", label: "URL" },
  { key: "visible", label: "표시여부" },
  { key: "status", label: "상태" },
];

const search = reactive<{ menuName: string; upMenuId: string; upMenuName: string }>({ menuName: "", upMenuId: "", upMenuName: "" });
const upMenuPopupVisible = ref(false);
const upMenuPopupSrc = ref("");

function openUpMenuPopup() {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const q = new URLSearchParams();
  if (search.upMenuId) q.set("menuId", search.upMenuId);
  upMenuPopupSrc.value = `${base}/popupAdmin/sy/menuSelPopup${q.toString() ? `?${q.toString()}` : ""}`;
  upMenuPopupVisible.value = true;
}

function onUpMenuSelect(payload: unknown) {
  const p = payload as { menuId?: string; menuName?: string };
  if (p?.menuId !== undefined) search.upMenuId = p.menuId ?? "";
  if (p?.menuName !== undefined) search.upMenuName = p.menuName ?? "";
  upMenuPopupVisible.value = false;
}

function clearUpMenu() {
  search.upMenuId = "";
  search.upMenuName = "";
}
const list = reactive<MenuRow[]>([]);
const cardList = reactive<MenuRow[]>([]);
const selectedIds = reactive<(string | number)[]>([]);
const page = reactive({ pageNo: 1, pageSize: 10, totalCount: 0, pageType: PAGE_TYPE_DEFAULT as import("~/types/page").PageType });
const { isCardView } = useBreakpoint();
const cardPageNo = ref(1);
const loadingMore = ref(false);
const { openDetailTab } = useOpenDetailTab();

const rawMenuList = computed(() => {
  const raw: MenuRow[] = [
    { menuId: "M001", menuName: "시스템관리", upMenuId: "0", orderNum: 1, url: "#", visible: "0", status: "0" },
    { menuId: "M002", menuName: "사용자관리", upMenuId: "M001", orderNum: 1, url: "/adminSy/users", visible: "0", status: "0" },
    { menuId: "M003", menuName: "코드관리", upMenuId: "M001", orderNum: 2, url: "/adminSy/codes", visible: "0", status: "0" },
  ];
  return raw.filter((r) => {
    if (search.menuName && !r.menuName.includes(search.menuName)) return false;
    if (search.upMenuId && (r.upMenuId || "0") !== search.upMenuId) return false;
    return true;
  });
});

const hasMoreCard = computed(() => cardList.length < page.totalCount);

function fetchPage(pageNo: number): MenuRow[] {
  const start = (pageNo - 1) * page.pageSize;
  return rawMenuList.value.slice(start, start + page.pageSize);
}

type MenuRow = {
  menuId: string;
  menuName: string;
  upMenuId?: string;
  orderNum?: number;
  url?: string;
  target?: string;
  menuType?: string;
  visible?: string;
  isRefresh?: string;
  perms?: string;
  icon?: string;
  path?: string;
  component?: string;
  query?: string;
  status?: string;
  isFrame?: string;
  isCache?: string;
  remark?: string;
};

function fetchList() {
  page.totalCount = rawMenuList.value.length;
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
  search.menuName = "";
  search.upMenuId = "";
  search.upMenuName = "";
  page.pageNo = 1;
  cardPageNo.value = 1;
  fetchList();
  if (isCardView.value) cardList.splice(0, cardList.length, ...fetchPage(1));
}

function goNew(e?: MouseEvent) {
  openDetailTab("/adminSy/menus/new", "메뉴 등록", e?.ctrlKey ?? false);
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
