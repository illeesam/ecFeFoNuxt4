<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="bg-white shadow flex flex-col flex-1 min-h-0 max-h-screen">
      <!-- iframe 안에 있을 땐 타이틀바 숨김 (레이어 쪽 타이틀만 사용) -->
      <div v-if="!inIframe" class="p-4 border-b border-gray-200 font-semibold flex items-center justify-between shrink-0">
        <span>상위 메뉴 선택</span>
        <button type="button" class="text-gray-500 hover:text-gray-700 text-2xl leading-none" @click="close">&times;</button>
      </div>
      <!-- 메뉴 키검색 -->
      <div class="p-3 border-b bg-gray-50 flex items-center gap-2 shrink-0">
        <label class="text-sm text-gray-600 shrink-0">메뉴 검색</label>
        <input v-model.trim="searchKeyword" type="text" class="border rounded px-3 py-2 flex-1 max-w-xs" placeholder="메뉴명 또는 메뉴ID로 검색" />
      </div>
      <!-- 윈도우 탐색기 형식: 왼쪽 트리 + 오른쪽 테이블 -->
      <div class="flex flex-1 min-h-0 overflow-hidden">
        <div class="w-64 border-r border-gray-200 flex flex-col overflow-hidden bg-white">
          <div class="p-2 border-b bg-gray-100 text-xs font-medium text-gray-600 shrink-0">메뉴</div>
          <div class="overflow-y-auto flex-1 p-1">
            <ul class="space-y-0">
              <li v-for="node in filteredTreeList" :key="node.menuId" class="select-none">
                <TreeNode :node="node" :selected-id="selectedId" :exclude-id="excludeId" :depth="0" @select="onSelect" @dblclick="onDblclick" />
              </li>
            </ul>
          </div>
        </div>
        <div class="flex-1 flex flex-col overflow-hidden min-w-0 bg-white">
          <div class="p-2 border-b bg-gray-100 text-xs font-medium text-gray-600 shrink-0">상세</div>
          <div class="overflow-auto flex-1 p-2">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="border-b bg-gray-50">
                  <th class="text-left p-2 w-28">메뉴ID</th>
                  <th class="text-left p-2">메뉴명</th>
                  <th class="text-left p-2">링크(URL)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="selectedItem" class="border-b hover:bg-amber-50" :class="{ 'bg-amber-100': true }">
                  <td class="p-2">{{ selectedItem.menuId }}</td>
                  <td class="p-2">{{ selectedItem.menuName }}</td>
                  <td class="p-2 text-gray-600 break-all">{{ selectedItem.url || "—" }}</td>
                </tr>
                <tr v-else>
                  <td colspan="3" class="p-4 text-gray-400 text-center">트리에서 메뉴를 선택하세요.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="p-4 border-t border-gray-200 flex justify-between items-center shrink-0 bg-white">
        <div class="text-sm text-gray-500">
          <template v-if="selectedItem"> 선택: {{ selectedItem.menuName }} ({{ selectedItem.menuId }}) </template>
          <template v-else> 메뉴를 선택하세요. </template>
        </div>
        <div class="flex gap-2">
          <button type="button" class="px-4 py-2 border rounded hover:bg-gray-50" @click="close">취소</button>
          <button type="button" class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!selectedItem" @click="confirmSelect">선택</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h, type Component, type VNode } from "vue";

definePageMeta({ layout: false });

/** 독립 윈도우: opener 에 선택 결과 전달 후 닫기 */
const route = useRoute();
const excludeId = computed(() => (route.query.excludeId as string) ?? "");
const initialMenuId = computed(() => (route.query.menuId as string) ?? null);

const inIframe = ref(false);
const searchKeyword = ref("");
const selectedId = ref<string | null>(null);

/** sy_menu 스키마 필드로 구성 (menu_id, up_menu_id 로 계층) */
type SyMenuRow = {
  menu_id: string;
  menu_name: string;
  up_menu_id: string;
  order_num: number;
  url: string;
};

const flatMenus: SyMenuRow[] = [
  { menu_id: "0", menu_name: "최상위", up_menu_id: "", order_num: 0, url: "#" },
  { menu_id: "M001", menu_name: "시스템관리", up_menu_id: "0", order_num: 1, url: "#" },
  { menu_id: "M011", menu_name: "사용자관리", up_menu_id: "M001", order_num: 1, url: "/adminSy/users" },
  { menu_id: "M012", menu_name: "코드관리", up_menu_id: "M001", order_num: 2, url: "/adminSy/codes" },
  { menu_id: "M013", menu_name: "공지사항관리", up_menu_id: "M001", order_num: 3, url: "/adminSy/notices" },
  { menu_id: "M014", menu_name: "메뉴관리", up_menu_id: "M001", order_num: 4, url: "/adminSy/menus" },
  { menu_id: "M002", menu_name: "공통업무", up_menu_id: "0", order_num: 2, url: "#" },
  { menu_id: "M021", menu_name: "사이트관리", up_menu_id: "M002", order_num: 1, url: "/adminCo/sites" },
  { menu_id: "M022", menu_name: "로그관리", up_menu_id: "M002", order_num: 2, url: "#" },
  { menu_id: "M003", menu_name: "이커머스", up_menu_id: "0", order_num: 3, url: "#" },
  { menu_id: "M031", menu_name: "회원관리", up_menu_id: "M003", order_num: 1, url: "/adminEc/members" },
  { menu_id: "M032", menu_name: "상품관리", up_menu_id: "M003", order_num: 2, url: "/adminEc/products" },
  { menu_id: "M033", menu_name: "주문관리", up_menu_id: "M003", order_num: 3, url: "/adminEc/orders" },
  { menu_id: "M004", menu_name: "모니터링", up_menu_id: "0", order_num: 4, url: "#" },
  { menu_id: "M041", menu_name: "운영로그", up_menu_id: "M004", order_num: 1, url: "#" },
  { menu_id: "M042", menu_name: "로그인로그", up_menu_id: "M004", order_num: 2, url: "#" },
  { menu_id: "M005", menu_name: "시스템도구", up_menu_id: "0", order_num: 5, url: "#" },
  { menu_id: "M051", menu_name: "폼빌드", up_menu_id: "M005", order_num: 1, url: "tool/build.html" },
  { menu_id: "M052", menu_name: "소스생성", up_menu_id: "M005", order_num: 2, url: "tool/gen.html" },
  { menu_id: "M053", menu_name: "스웨거", up_menu_id: "M005", order_num: 3, url: "swagger-ui/index.html" },
  { menu_id: "M006", menu_name: "설정", up_menu_id: "0", order_num: 6, url: "#" },
];

function getItemById(id: string): SyMenuRow | undefined {
  return flatMenus.find((m) => m.menu_id === id);
}

function getVisibleIds(): Set<string> {
  const kw = searchKeyword.value.toLowerCase();
  if (!kw) return new Set(flatMenus.map((m) => m.menu_id));
  const matched = new Set<string>();
  flatMenus.forEach((m) => {
    if (m.menu_name.toLowerCase().includes(kw) || m.menu_id.toLowerCase().includes(kw)) {
      matched.add(m.menu_id);
      let pid = m.up_menu_id;
      while (pid) {
        matched.add(pid);
        const p = flatMenus.find((x) => x.menu_id === pid);
        pid = p?.up_menu_id ?? "";
      }
    }
  });
  return matched;
}

interface TreeNodeType {
  menuId: string;
  menuName: string;
  children: TreeNodeType[];
}

function buildTree(parentId: string, visibleIds: Set<string>): TreeNodeType[] {
  return flatMenus
    .filter((m) => m.up_menu_id === parentId && m.menu_id !== "0" && visibleIds.has(m.menu_id))
    .sort((a, b) => a.order_num - b.order_num)
    .map((m) => ({
      menuId: m.menu_id,
      menuName: m.menu_name,
      children: buildTree(m.menu_id, visibleIds),
    }));
}

const visibleIds = computed(() => getVisibleIds());

const filteredTreeList = computed(() => {
  const ids = visibleIds.value;
  const root: TreeNodeType = { menuId: "0", menuName: "최상위", children: buildTree("0", ids) };
  if (!ids.has("0")) return [];
  return [root];
});

const selectedItem = computed(() => {
  if (!selectedId.value) return null;
  const row = getItemById(selectedId.value);
  return row ? { menuId: row.menu_id, menuName: row.menu_name, url: row.url } : selectedId.value === "0" ? { menuId: "0", menuName: "최상위", url: "#" } : null;
});

onMounted(() => {
  inIframe.value = typeof window !== "undefined" && window !== window.top;
  selectedId.value = initialMenuId.value || null;
});

function canSelect(node: TreeNodeType): boolean {
  return excludeId.value ? node.menuId !== excludeId.value : true;
}

function onSelect(node: TreeNodeType) {
  if (!canSelect(node)) return;
  selectedId.value = node.menuId;
}

function onDblclick(node: TreeNodeType) {
  if (!canSelect(node)) return;
  selectedId.value = node.menuId;
  confirmSelect();
}

const POST_MESSAGE_TYPE = "menuSelPopup:select";
const POST_MESSAGE_CLOSE = "menuSelPopup:close";

function getMessageTarget(): Window | null {
  if (typeof window === "undefined") return null;
  if (window !== window.top) return window.parent;
  if (window.opener) return window.opener;
  return null;
}

function isInIframe(): boolean {
  return typeof window !== "undefined" && window !== window.top;
}

function confirmSelect() {
  const item = selectedItem.value;
  if (!item) return;
  const target = getMessageTarget();
  if (target) {
    try {
      target.postMessage({ type: POST_MESSAGE_TYPE, payload: { menuId: item.menuId, menuName: item.menuName } }, window.location.origin);
    } catch {
      // cross-origin 등
    }
  }
  if (!isInIframe()) window.close();
}

function close() {
  const target = getMessageTarget();
  if (target && isInIframe()) {
    try {
      target.postMessage({ type: POST_MESSAGE_CLOSE }, window.location.origin);
    } catch {
      // cross-origin 등
    }
  } else if (!isInIframe()) {
    window.close();
  }
}

// 재귀 트리 노드 컴포넌트 (script setup에서 선언 시 템플릿에 자동 노출)
const TreeNode: Component = defineComponent({
  name: "TreeNode",
  props: {
    node: { type: Object as () => TreeNodeType, required: true },
    selectedId: { type: String, default: null },
    excludeId: { type: String, default: "" },
    depth: { type: Number, default: 0 },
  },
  emits: ["select", "dblclick"],
  setup(props, { emit }) {
    function canSelect(): boolean {
      return props.excludeId ? props.node.menuId !== props.excludeId : true;
    }
    function onClick() {
      if (!canSelect()) return;
      emit("select", props.node);
    }
    function onDblclick() {
      if (!canSelect()) return;
      emit("dblclick", props.node);
    }
    function renderChild(child: TreeNodeType): VNode {
      return h(TreeNode, {
        node: child,
        selectedId: props.selectedId,
        excludeId: props.excludeId,
        depth: props.depth + 1,
        onSelect: (n: TreeNodeType) => emit("select", n),
        onDblclick: (n: TreeNodeType) => emit("dblclick", n),
      });
    }
    return (): VNode => {
      const node = props.node as TreeNodeType;
      const isSelected = props.selectedId === node.menuId;
      const disabled = !canSelect();
      const paddingLeft = 8 + props.depth * 20;
      return h("div", { class: "pl-0" }, [
        h(
          "div",
          {
            class: ["flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer text-sm border border-transparent", isSelected ? "bg-amber-100 border-amber-300" : "hover:bg-gray-100", disabled && "opacity-50 cursor-not-allowed"],
            style: { paddingLeft: `${paddingLeft}px` },
            onClick,
            onDblclick,
          },
          [node.children.length ? h("span", { class: "text-gray-400 w-4 shrink-0" }, "▼") : h("span", { class: "text-gray-300 w-4 shrink-0" }, "•"), h("span", { class: "text-gray-800 truncate" }, node.menuName)],
        ),
        node.children.length ? h("ul", { class: "space-y-0" }, node.children.map(renderChild)) : null,
      ]);
    };
  },
});
</script>
