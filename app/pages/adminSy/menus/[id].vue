<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminSy/menus" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminSy/menus', '메뉴관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '메뉴 등록' : mode === 'edit' ? '메뉴 수정' : '메뉴 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <template v-if="mode === 'view' && menu">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">메뉴ID</dt>
            <dd class="min-w-0 break-words">{{ menu.menuId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">메뉴명</dt>
            <dd class="min-w-0 break-words">{{ menu.menuName }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">상위메뉴ID</dt>
            <dd class="min-w-0 break-words">{{ menu.upMenuId ?? "0" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">정렬순서</dt>
            <dd class="min-w-0 break-words">{{ menu.orderNum ?? 0 }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">URL</dt>
            <dd class="min-w-0 break-words">{{ menu.url ?? "#" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">target</dt>
            <dd class="min-w-0 break-words">{{ menu.target || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">메뉴유형</dt>
            <dd class="min-w-0 break-words">{{ menu.menuType || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">표시여부</dt>
            <dd class="min-w-0 break-words">{{ menu.visible === "0" ? "표시" : "숨김" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">새로고침</dt>
            <dd class="min-w-0 break-words">{{ menu.isRefresh === "1" ? "Y" : "N" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">권한코드</dt>
            <dd class="min-w-0 break-words">{{ menu.perms || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">아이콘</dt>
            <dd class="min-w-0 break-words">{{ menu.icon || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">path</dt>
            <dd class="min-w-0 break-words">{{ menu.path || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">component</dt>
            <dd class="min-w-0 break-words">{{ menu.component || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">상태</dt>
            <dd class="min-w-0 break-words">{{ menu.status || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">프레임</dt>
            <dd class="min-w-0 break-words">{{ menu.isFrame || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">캐시</dt>
            <dd class="min-w-0 break-words">{{ menu.isCache || "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
            <dt class="text-gray-500 shrink-0">설명</dt>
            <dd class="min-w-0 break-words">{{ menu.remark || "-" }}</dd>
          </div>
        </dl>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminSy/menus/${menu.menuId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <template v-else-if="mode === 'edit' || mode === 'new'">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">메뉴ID</label>
              <input :value="menu?.menuId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">메뉴명 <span class="text-red-500">*</span></label>
              <input v-model="form.menuName" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="50" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">상위메뉴ID</label>
              <div class="flex items-center gap-2 flex-wrap min-w-0">
                <span class="text-gray-600 truncate">{{ form.upMenuName || "—" }}</span>
                <span class="text-gray-400 shrink-0">{{ form.upMenuId || "0" }}</span>
                <button type="button" class="p-1.5 border border-amber-600 text-amber-600 rounded hover:bg-amber-50 inline-flex items-center justify-center shrink-0" title="상위 메뉴 선택" aria-label="상위 메뉴 선택" @click="openMenuSelWindow">
                  <i class="fa fa-search text-xs" aria-hidden="true" />
                </button>
                <button type="button" class="p-1.5 border border-gray-300 text-gray-500 rounded hover:bg-gray-100 inline-flex items-center justify-center shrink-0" title="상위 메뉴 초기화" aria-label="상위 메뉴 초기화" @click="clearUpMenu">
                  <i class="fa fa-times text-xs" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">정렬순서</label>
              <input v-model.number="form.orderNum" type="number" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">URL</label>
              <input v-model="form.url" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="200" placeholder="#" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">target</label>
              <input v-model="form.target" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="20" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">메뉴유형</label>
              <input v-model="form.menuType" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="1" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">표시여부</label>
              <select v-model="form.visible" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full">
                <option value="0">표시</option>
                <option value="1">숨김</option>
              </select>
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">새로고침</label>
              <select v-model="form.isRefresh" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full">
                <option value="1">Y</option>
                <option value="0">N</option>
              </select>
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">권한코드</label>
              <input v-model="form.perms" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="100" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">아이콘</label>
              <input v-model="form.icon" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="100" placeholder="#" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">path</label>
              <input v-model="form.path" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="200" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">component</label>
              <input v-model="form.component" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="100" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">상태</label>
              <input v-model="form.status" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="20" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">프레임</label>
              <input v-model="form.isFrame" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="1" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">캐시</label>
              <input v-model="form.isCache" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="1" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-2">
              <label class="text-sm text-gray-500 shrink-0">설명</label>
              <input v-model="form.remark" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" maxlength="500" />
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminSy/menus' : `/adminSy/menus/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !menu && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
    <AdminIframeLayer
      v-model="menuSelLayerVisible"
      :src="menuSelIframeUrl"
      title="상위 메뉴 선택"
      :width="900"
      :height="620"
      select-message-type="menuSelPopup:select"
      close-message-type="menuSelPopup:close"
      :on-select="onUpMenuSelect"
      :on-close="closeMenuSelLayer"
      @update:model-value="onIframeLayerClose"
    />
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { useComponentTitle } from "~/composables/useComponentTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });
useComponentTitle("메뉴 상세");
const { goToList } = useAdminListNav();

const menuSchema = yup.object({
  menuName: yup.string().required("메뉴명을 입력해 주세요").label("메뉴명"),
});

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

type Menu = {
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

const menu = ref<Menu | null>(null);
const loading = ref(false);
const menuSelLayerVisible = ref(false);
const menuSelIframeUrl = ref("");
const form = reactive({
  menuName: "",
  upMenuId: "0",
  upMenuName: "",
  upMenu: null as { menuId: string; menuName: string } | null,
  orderNum: 0,
  url: "#",
  target: "",
  menuType: "",
  visible: "0",
  isRefresh: "1",
  perms: "",
  icon: "#",
  path: "",
  component: "",
  status: "",
  isFrame: "",
  isCache: "",
  remark: "",
});

const pageTitle = computed(() => {
  if (mode.value === "new") return "메뉴 등록";
  if (menu.value) return `메뉴상세(${menu.value.menuId})`;
  return entityId.value ? `메뉴상세(${entityId.value})` : "메뉴 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function load() {
  if (mode.value === "new") return;
  if (!entityId.value) return;
  loading.value = true;
  try {
    // TODO: API /api/sy/menus/:id
    menu.value = {
      menuId: entityId.value,
      menuName: "시스템관리",
      upMenuId: "0",
      orderNum: 1,
      url: "#",
      target: "",
      menuType: "",
      visible: "0",
      isRefresh: "1",
      perms: "",
      icon: "#",
      path: "",
      component: "",
      status: "0",
      isFrame: "",
      isCache: "",
      remark: "",
    };
    if (menu.value && mode.value === "edit") {
      form.menuName = menu.value.menuName;
      form.upMenuId = menu.value.upMenuId ?? "0";
      form.upMenuName = form.upMenuId === "0" ? "최상위" : ""; // API에서 상위 메뉴명 조회 가능 시 설정
      form.upMenu = { menuId: form.upMenuId, menuName: form.upMenuName };
      form.orderNum = menu.value.orderNum ?? 0;
      form.url = menu.value.url ?? "#";
      form.target = menu.value.target ?? "";
      form.menuType = menu.value.menuType ?? "";
      form.visible = menu.value.visible ?? "0";
      form.isRefresh = menu.value.isRefresh ?? "1";
      form.perms = menu.value.perms ?? "";
      form.icon = menu.value.icon ?? "#";
      form.path = menu.value.path ?? "";
      form.component = menu.value.component ?? "";
      form.status = menu.value.status ?? "";
      form.isFrame = menu.value.isFrame ?? "";
      form.isCache = menu.value.isCache ?? "";
      form.remark = menu.value.remark ?? "";
    }
  } finally {
    loading.value = false;
  }
}

async function save() {
  try {
    await menuSchema.validate({ menuName: form.menuName });
  } catch (e: unknown) {
    const err = e as yup.ValidationError;
    await useAlert().openAlert(err.message ?? "입력값을 확인해 주세요.");
    return;
  }
  // TODO: API POST/PUT
  await useAlert().openAlert("저장 기능은 API 연동 후 구현됩니다.");
}

function onUpMenuSelect(payload: unknown) {
  const v = payload as { menuId: string; menuName: string } | null | undefined;
  if (v?.menuId) {
    form.upMenuId = v.menuId;
    form.upMenuName = v.menuName;
    form.upMenu = v;
  } else {
    form.upMenuId = "0";
    form.upMenuName = "";
    form.upMenu = null;
  }
}

function onIframeLayerClose(v: boolean) {
  if (!v) menuSelIframeUrl.value = "";
}

function closeMenuSelLayer() {
  menuSelLayerVisible.value = false;
  menuSelIframeUrl.value = "";
}

function openMenuSelWindow() {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const q = new URLSearchParams();
  if (entityId.value) q.set("excludeId", entityId.value);
  if (form.upMenuId) q.set("menuId", form.upMenuId);
  const url = `${base}/popupAdmin/sy/menuSelPopup${q.toString() ? `?${q.toString()}` : ""}`;
  menuSelIframeUrl.value = url;
  menuSelLayerVisible.value = true;
}

function clearUpMenu() {
  form.upMenuId = "0";
  form.upMenuName = "최상위";
  form.upMenu = null;
}

watch([rawId, mode], load, { immediate: true });
</script>
