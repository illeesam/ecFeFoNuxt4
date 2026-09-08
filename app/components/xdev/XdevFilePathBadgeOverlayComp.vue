<template>
  <div ref="panelRef" class="fp-panel" :class="{ 'fp-panel--collapsed': !isOpen, 'fp-panel--docked': isPanelsLocked }" :style="isPanelsLocked ? {} : panelStyle" @wheel.stop>
    <!-- 헤더 -->
    <div class="fp-header" :class="{ 'fp-header--docked': isPanelsLocked }" @pointerdown="!isPanelsLocked && startDrag($event)">
      <span class="fp-title">컴포넌트정보</span>
      <span class="fp-count">{{ filteredCount }}</span>
      <button class="fp-btn-all" @mousedown.stop @click.stop="allChecked ? deselectAll() : selectAllFiltered()">
        {{ allChecked ? "전체해제" : "전체선택" }}
      </button>
      <span class="fp-toggle" @mousedown.stop @click.stop="isOpen = !isOpen">
        {{ isOpen ? "▲" : "▼" }}
      </span>
      <button type="button" class="fp-btn-lock" :title="isPanelsLocked ? '잠금 해제' : '우측 고정'" @mousedown.stop @click.stop="isPanelsLocked = !isPanelsLocked">
        <span class="fp-lock-icon">{{ isPanelsLocked ? "🔓" : "🔒" }}</span>
      </button>
    </div>

    <!-- 트리 목록 -->
    <div v-show="isOpen" class="fp-list">
      <template v-for="node in flatNodesFiltered" :key="node.badge.id">
        <div
          class="fp-item"
          :class="{
            'fp-item--depth0': node.depth === 0,
            'fp-item--depth1': node.depth === 1,
            'fp-item--depth2plus': node.depth >= 2,
            'fp-item--checked': checkedIds.includes(node.badge.id),
            'fp-item--hovered': hoveredId === node.badge.id,
            'fp-item--active': activeBadgeId === node.badge.id,
          }"
          :style="{ paddingLeft: `${4 + node.depth * 13}px` }"
          @mouseenter="setHovered(node.badge.id)"
          @mouseleave="setHovered(null)"
        >
          <span class="fp-arrow" :class="{ 'fp-arrow--hidden': !node.hasChildren }" @click.stop="toggleCollapse(node.badge.id)">
            {{ collapsedIds.includes(node.badge.id) ? "▶" : "▼" }}
          </span>
          <input type="checkbox" :checked="checkedIds.includes(node.badge.id)" class="fp-checkbox" @change="toggleChecked(node.badge.id)" @click.stop />
          <button class="fp-props-icon" :class="{ 'fp-props-icon--active': openPropsId === node.badge.id }" title="Props 보기" @click.stop="togglePropsPanel(node.badge.id)">P</button>
          <button class="fp-data-icon" :class="{ 'fp-data-icon--active': openDataId === node.badge.id }" title="Data 보기" @click.stop="toggleDataPanel(node.badge.id)">D</button>
          <button v-if="node.hasChildren" class="fp-vscode-icon" :class="{ 'fp-vscode-icon--checked': checkedIds.includes(node.badge.id) }" title="자식 포함 선택/해제" @mousedown.stop @click.stop="toggleCheckedWithChildren(node.badge.id)">↗</button>
          <span v-else class="fp-vscode-icon-placeholder"></span>
          <span class="fp-level-id" title="더블클릭 → 소스 열기·활성" @dblclick.prevent.stop="openSourceAndSelect(node.badge.id, node.badge.filePath)">{{ levelIds.get(node.badge.id) }}</span>
          <span
            class="fp-path"
            :class="[node.depth <= 1 ? 'fp-path--bold' : '', getPathColorClass(node.badge.filePath), activeBadgeId === node.badge.id ? 'fp-path--active' : '']"
            :title="node.badge.filePath"
            @dblclick.prevent.stop="openSourceAndSelect(node.badge.id, node.badge.filePath)"
            @contextmenu.prevent="showPathContextMenu($event, node)"
            >{{ formatPathForDisplay(node.badge.filePath) }}</span
          >
          <span v-if="getDisplayTitle(node.badge)" class="fp-chip" :class="{ 'fp-chip--active': activeBadgeId === node.badge.id }" title="더블클릭 → 소스 열기·활성" @dblclick.prevent.stop="openSourceAndSelect(node.badge.id, node.badge.filePath)">{{ getDisplayTitle(node.badge) }}</span>
        </div>
      </template>
    </div>

    <!-- 하단 필터 바 -->
    <div v-show="isOpen" class="fp-filter-bar">
      <div class="fp-filter-label">
        <span class="fp-filter-label-text">숨김필터</span>
        <SelectMultiCheck v-model="selectedFilterKeys" :options="filterOptions" class="fp-filter-select-multi" summary-mode />
      </div>
      <label class="fp-filter-source">
        <span>소스오픈</span>
        <select v-model="defaultSourceEditor" class="fp-filter-select">
          <option value="vscode">vscode</option>
          <option value="cursor">cursor</option>
        </select>
      </label>
    </div>

    <!-- 크기 조절 핸들 -->
    <div class="fp-resize-handle" @mousedown.stop="startResize">⤡</div>
  </div>

  <!-- 경로 우클릭 컨텍스트 메뉴 -->
  <div v-if="pathContextMenu" ref="pathContextMenuRef" class="fp-path-context-menu" :style="{ left: pathContextMenu.x + 'px', top: pathContextMenu.y + 'px' }" @mousedown.stop @click.stop>
    <div class="fp-path-context-title">{{ pathContextMenu.node.badge.filePath }}</div>
    <div v-if="getDisplayTitle(pathContextMenu.node.badge)" class="fp-path-context-label">{{ getDisplayTitle(pathContextMenu.node.badge) }}</div>
    <div class="fp-path-context-sep"></div>
    <button type="button" class="fp-path-context-item" @click="contextMenuSource(pathContextMenu.node, 'vscode')">소스이동(vscode)</button>
    <button type="button" class="fp-path-context-item" @click="contextMenuSource(pathContextMenu.node, 'cursor')">소스이동(cursor)</button>
    <button type="button" class="fp-path-context-item" @click="contextMenuCopyPath(pathContextMenu.node)">경로복사</button>
    <button v-if="pathContextMenu.node.hasChildren" type="button" class="fp-path-context-item" @click="contextMenuToggleCollapse(pathContextMenu.node)">{{ collapsedIds.includes(pathContextMenu.node.badge.id) ? "펼치기" : "접기" }}</button>
    <button type="button" class="fp-path-context-item" @click="contextMenuToggleChecked(pathContextMenu.node)">{{ checkedIds.includes(pathContextMenu.node.badge.id) ? "체크해제" : "체크" }}</button>
    <button v-if="pathContextMenu.node.hasChildren" type="button" class="fp-path-context-item" @click="contextMenuToggleCheckedWithChildren(pathContextMenu.node)">현재와자식체크</button>
  </div>
</template>

<script setup lang="ts">
import type { BadgeEntry } from "~/composables/useFilePathBadgeRegistry";
import SelectMultiCheck from "~/components/ui/SelectMultiCheck.vue";

const { isPanelsLocked, openPropsId, openDataId, activeBadgeId, defaultSourceEditor, mainPanelRef } = useXdevPanelsState();
const { badges, checkedIds, hoveredId, componentTitles, toggleChecked, selectAll, deselectAll, setHovered, getTitleForBadge } = useFilePathBadgeRegistry();

const isOpen = ref(true);

// 숨김필터: 체크된 항목만 목록에 표시
const filterOptions = [
  { value: "appimage", label: "appimage" },
  { value: "productitem", label: "productitem" },
  { value: "blogitem", label: "blogitem" },
  { value: "backtotop", label: "backtotop" },
  { value: "searchpopup", label: "searchpopup" },
  { value: "hero-banner", label: "hero-banner" },
];
const selectedFilterKeys = ref<string[]>(["appimage", "backtotop", "searchpopup"]);

const showAppimage = computed(() => selectedFilterKeys.value.includes("appimage"));
const showProductitem = computed(() => selectedFilterKeys.value.includes("productitem"));
const showBlogitem = computed(() => selectedFilterKeys.value.includes("blogitem"));
const showBacktotop = computed(() => selectedFilterKeys.value.includes("backtotop"));
const showSearchpopup = computed(() => selectedFilterKeys.value.includes("searchpopup"));
const showHeroBanner = computed(() => selectedFilterKeys.value.includes("hero-banner"));

// 필터 적용 시: count·전체선택/해제는 필터된 목록 기준
const filteredCount = computed(() => flatNodesFiltered.value.length);

const allChecked = computed(() => flatNodesFiltered.value.length > 0 && flatNodesFiltered.value.every((n) => checkedIds.value.includes(n.badge.id)));

function selectAllFiltered() {
  const toAdd = flatNodesFiltered.value.map((n) => n.badge.id);
  checkedIds.value = [...new Set([...checkedIds.value, ...toAdd])];
}

function deselectAllFiltered() {
  const idsInFilter = new Set(flatNodesFiltered.value.map((n) => n.badge.id));
  checkedIds.value = checkedIds.value.filter((id) => !idsInFilter.has(id));
}

// 필터 변경 시 전체해제
watch(
  selectedFilterKeys,
  () => {
    deselectAll();
  },
  { deep: true },
);

// ── 메인 패널 드래그 & 리사이즈 ───────────────────────
const panelRef = ref<HTMLElement | null>(null);
watchEffect(() => {
  mainPanelRef.value = panelRef.value;
});

const pos = reactive({ top: 8, left: NaN });
const isDragging = ref(false);
const panelWidth = ref<number | null>(300);
const panelHeight = ref<number | null>(null);

const panelStyle = computed(() => {
  const style: Record<string, string> = {};
  if (!isNaN(pos.left)) {
    style.top = `${pos.top}px`;
    style.left = `${pos.left}px`;
    style.right = "auto";
  }
  if (panelWidth.value !== null) {
    style.width = `${panelWidth.value}px`;
    style.maxWidth = "none";
    style.minWidth = "none";
  }
  if (!isOpen.value) {
    style.height = "auto";
    style.maxHeight = "none";
    style.minHeight = "0";
  } else if (panelHeight.value !== null) {
    style.height = `${panelHeight.value}px`;
    style.maxHeight = "none";
  }
  return style;
});

function startDrag(e: MouseEvent) {
  if (isPanelsLocked.value) return;
  if (isNaN(pos.left) && panelRef.value) {
    const rect = panelRef.value.getBoundingClientRect();
    pos.top = rect.top;
    pos.left = rect.left;
  }
  const startX = e.clientX - pos.left;
  const startY = e.clientY - pos.top;
  isDragging.value = true;
  const onMove = (ev: MouseEvent) => {
    pos.left = ev.clientX - startX;
    pos.top = ev.clientY - startY;
  };
  const onUp = () => {
    isDragging.value = false;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  e.preventDefault();
}

function startResize(e: MouseEvent) {
  if (isNaN(pos.left) && panelRef.value) {
    const rect = panelRef.value.getBoundingClientRect();
    pos.top = rect.top;
    pos.left = rect.left;
  }
  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = panelRef.value?.offsetWidth ?? 280;
  const startHeight = panelRef.value?.offsetHeight ?? 400;
  const startLeft = pos.left;
  const onMove = (ev: MouseEvent) => {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    const newWidth = Math.max(200, startWidth - dx);
    panelWidth.value = newWidth;
    if (!isNaN(startLeft)) pos.left = startLeft + (startWidth - newWidth);
    panelHeight.value = Math.max(120, startHeight + dy);
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  e.preventDefault();
}

onUnmounted(() => {
  isDragging.value = false;
});

// ── 트리 접힘 ──────────────────────────────────────────
const collapsedIds = reactive<string[]>([]);
function toggleCollapse(id: string) {
  const idx = collapsedIds.indexOf(id);
  if (idx === -1) collapsedIds.push(id);
  else collapsedIds.splice(idx, 1);
}

// ── 자식 포함 체크 토글 ────────────────────────────────
function getDescendantIds(id: string): string[] {
  const node = badges.value.find((b) => b.id === id);
  if (!node || node.instanceUid === undefined) return [];
  const children = badges.value.filter((b) => b.parentInstanceUid === node.instanceUid);
  const result: string[] = [];
  for (const child of children) {
    result.push(child.id);
    result.push(...getDescendantIds(child.id));
  }
  return result;
}

function toggleCheckedWithChildren(id: string) {
  const shouldCheck = !checkedIds.value.includes(id);
  for (const nodeId of [id, ...getDescendantIds(id)]) {
    if (checkedIds.value.includes(nodeId) !== shouldCheck) toggleChecked(nodeId);
  }
}

// ── 컴포넌트 트리 빌드 ─────────────────────────────────
interface FlatNode {
  badge: BadgeEntry;
  depth: number;
  hasChildren: boolean;
}

const flatNodes = computed((): FlatNode[] => {
  const list = badges.value;
  const uidSet = new Set(list.map((b) => b.instanceUid).filter((u): u is number => u !== undefined));
  const roots = list.filter((b) => b.parentInstanceUid === undefined || !uidSet.has(b.parentInstanceUid));
  function getChildren(badge: BadgeEntry) {
    if (badge.instanceUid === undefined) return [];
    return list.filter((b) => b.parentInstanceUid === badge.instanceUid);
  }
  const result: FlatNode[] = [];
  const visited = new Set<string>();
  function traverse(items: BadgeEntry[], depth: number) {
    for (const badge of items) {
      if (visited.has(badge.id)) continue;
      visited.add(badge.id);
      const children = getChildren(badge);
      result.push({ badge, depth, hasChildren: children.length > 0 });
      if (!collapsedIds.includes(badge.id) && children.length > 0) traverse(children, depth + 1);
    }
  }
  traverse(roots, 0);
  return result;
});

// 숨김필터: 체크된 항목에 해당하는 컴포넌트는 목록에서 숨김
const flatNodesFiltered = computed((): FlatNode[] => {
  const pathLower = (p: string) => p.replace(/\\/g, "/").toLowerCase();
  return flatNodes.value.filter((node) => {
    const p = pathLower(node.badge.filePath);
    if (showAppimage.value && (p.includes("appimage") || p.includes("app-image"))) return false;
    if (showProductitem.value && p.includes("productitem")) return false;
    if (showBlogitem.value && p.includes("blogitem")) return false;
    if (showBacktotop.value && (p.includes("backtotop") || p.includes("back-to-top"))) return false;
    if (showSearchpopup.value && p.includes("searchpopup")) return false;
    if (showHeroBanner.value && (p.includes("hero-banner") || p.includes("herobanner"))) return false;
    return true;
  });
});

// ── 트리 항목 표시 헬퍼 ────────────────────────────────
function getDisplayTitle(badge: BadgeEntry): string | undefined {
  const fromRegistry = getTitleForBadge(badge);
  if (fromRegistry) return fromRegistry;
  const fp = badge.filePath.replace(/\\/g, "/");
  const pagesIdx = fp.indexOf("/pages/");
  if (pagesIdx === -1) return undefined;
  return fp.slice(pagesIdx + 7).replace(/\.vue$/, "") || undefined;
}

function getPathColorClass(filePath: string): string {
  const name = filePath.replace(/\\/g, "/").split("/").pop() ?? "";
  if (name === "AppImage.vue") return "fp-path--dim";
  if (/(?:Popup|Modal)\.vue$/.test(name)) return "fp-path--orange";
  return "";
}

function formatPathForDisplay(filePath: string): string {
  return (
    filePath
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      ?.replace(/\.vue$/i, "") ?? filePath
  );
}

// ── 경로 우클릭 컨텍스트 메뉴 ─────────────────────────
const pathContextMenu = ref<{ node: FlatNode; x: number; y: number } | null>(null);
const pathContextMenuRef = ref<HTMLElement | null>(null);

function showPathContextMenu(e: MouseEvent, node: FlatNode) {
  pathContextMenu.value = { node, x: e.clientX, y: e.clientY };
  nextTick(() => {
    const el = pathContextMenuRef.value;
    if (el && pathContextMenu.value) {
      const r = el.getBoundingClientRect();
      let { x, y } = pathContextMenu.value;
      if (r.right > window.innerWidth) x = window.innerWidth - r.width - 4;
      if (r.bottom > window.innerHeight) y = window.innerHeight - r.height - 4;
      pathContextMenu.value = { node: pathContextMenu.value.node, x, y };
    }
    setTimeout(() => document.addEventListener("click", closePathContextMenu, { once: true }), 0);
  });
}

function closePathContextMenu() {
  pathContextMenu.value = null;
}
function contextMenuSource(node: FlatNode, editor: "vscode" | "cursor") {
  openInEditor(node.badge.filePath, editor);
  openPropsId.value = node.badge.id;
  openDataId.value = node.badge.id;
  closePathContextMenu();
}
function contextMenuCopyPath(node: FlatNode) {
  navigator.clipboard.writeText(node.badge.filePath).catch(() => {});
  closePathContextMenu();
}
function contextMenuToggleCollapse(node: FlatNode) {
  toggleCollapse(node.badge.id);
  closePathContextMenu();
}
function contextMenuToggleChecked(node: FlatNode) {
  toggleChecked(node.badge.id);
  closePathContextMenu();
}
function contextMenuToggleCheckedWithChildren(node: FlatNode) {
  toggleCheckedWithChildren(node.badge.id);
  closePathContextMenu();
}

// ── 에디터로 파일 열기 ─────────────────────────────────
function openInEditor(filePath: string, editor: "vscode" | "cursor" = "vscode") {
  if (!filePath) return;
  $fetch(`/api/__xdev/open-editor?file=${encodeURIComponent(filePath)}&editor=${editor}`, { method: "GET" }).catch(() => {});
}

// 소스이동 + P/D 패널 자동 선택 + 활성 경로(화면 초록 테두리) + 체크
function openSourceAndSelect(id: string, filePath: string) {
  openInEditor(filePath, defaultSourceEditor.value);
  openPropsId.value = id;
  openDataId.value = id;
  activeBadgeId.value = id;
  if (!checkedIds.value.includes(id)) checkedIds.value = [...checkedIds.value, id];
}

// ── 레벨 ID 계산 ───────────────────────────────────────
const levelIds = computed((): Map<string, string> => {
  const ids = new Map<string, string>();
  const counters: number[] = [];
  for (const node of flatNodesFiltered.value) {
    const d = node.depth;
    counters.length = d + 1;
    if (counters[d] === undefined) counters[d] = 0;
    counters[d]!++;
    ids.set(node.badge.id, counters.join(".") + ")");
  }
  return ids;
});

// ── Props / Data 패널 토글 ─────────────────────────────
function togglePropsPanel(id: string) {
  openPropsId.value = openPropsId.value === id ? null : id;
}
function toggleDataPanel(id: string) {
  openDataId.value = openDataId.value === id ? null : id;
}
</script>

<style scoped>
.fp-panel {
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 9999;
  min-width: 260px;
  max-width: 500px;
  height: 85vh;
  max-height: 85vh;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
}
.fp-panel--docked {
  position: static;
  top: auto;
  right: auto;
  flex: 1;
  min-height: 0;
  max-height: none;
  width: 100%;
  max-width: none;
}
.fp-panel--collapsed {
  height: auto;
  max-height: none;
}
.fp-panel--docked.fp-panel--collapsed {
  flex: 0 0 auto;
}

.fp-header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-bottom: 1px solid #e5e7eb;
  user-select: none;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  cursor: grab;
}
.fp-header:active {
  cursor: grabbing;
}
.fp-header--docked {
  cursor: default;
}
.fp-header--docked:active {
  cursor: default;
}

.fp-btn-lock {
  flex-shrink: 0;
  padding: 0 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  opacity: 0.8;
}
.fp-btn-lock:hover {
  opacity: 1;
}
.fp-lock-icon {
  display: inline-block;
}

.fp-title {
  flex: 1;
  font-weight: 700;
  font-size: 0.82rem;
  color: #111827;
  pointer-events: none;
}
.fp-count {
  background: #6366f1;
  color: #fff;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.7;
  pointer-events: none;
}
.fp-btn-all {
  font-size: 0.7rem;
  padding: 1px 7px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
  color: #374151;
  white-space: nowrap;
  line-height: 1.6;
}
.fp-btn-all:hover {
  background: #e5e7eb;
}
.fp-toggle {
  color: #9ca3af;
  font-size: 0.62rem;
  cursor: pointer;
  padding: 2px 3px;
}

.fp-list {
  flex: 1;
  overflow-y: auto;
  padding: 1px 0;
  overscroll-behavior: contain;
}

.fp-item {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px 2px 4px;
  line-height: 1.4;
  min-width: 0;
}
.fp-item:hover {
  background: #f5f5f5;
}
.fp-item--depth0 {
  background: rgba(34, 197, 94, 0.09);
}
.fp-item--depth0:hover {
  background: rgba(34, 197, 94, 0.17);
}
.fp-item--depth2plus {
  background: rgba(14, 165, 233, 0.07);
}
.fp-item--depth2plus:hover {
  background: rgba(14, 165, 233, 0.14);
}
.fp-item--checked {
  background: #fffbeb;
}
.fp-item--checked:hover {
  background: #fef3c7;
}
.fp-item--hovered {
  background: #eef2ff;
}

.fp-arrow {
  flex-shrink: 0;
  width: 11px;
  font-size: 0.55rem;
  color: #6b7280;
  cursor: pointer;
  text-align: center;
  line-height: 1;
}
.fp-arrow--hidden {
  visibility: hidden;
  pointer-events: none;
}

.fp-checkbox {
  flex-shrink: 0;
  cursor: pointer;
  accent-color: #f59e0b;
  width: 12px;
  height: 12px;
}

.fp-props-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1;
  background: #e5e7eb;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
  color: #374151;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
.fp-props-icon:hover {
  background: #d1d5db;
}
.fp-props-icon--active {
  background: #059669;
  color: #fff;
  border-color: #059669;
}

.fp-data-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1;
  background: #e5e7eb;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
  color: #374151;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
.fp-data-icon:hover {
  background: #d1d5db;
}
.fp-data-icon--active {
  background: #059669;
  color: #fff;
  border-color: #059669;
}

.fp-vscode-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  font-size: 0.72rem;
  line-height: 1;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 3px;
  cursor: pointer;
  color: #1d4ed8;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
.fp-vscode-icon:hover {
  background: #bfdbfe;
  color: #1e40af;
}
.fp-vscode-icon--checked {
  background: #fde68a;
  border-color: #f59e0b;
  color: #92400e;
}
.fp-vscode-icon--checked:hover {
  background: #fcd34d;
  color: #78350f;
}
.fp-vscode-icon-placeholder {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.fp-level-id {
  flex-shrink: 0;
  font-size: 0.58rem;
  color: #9ca3af;
  min-width: 24px;
  text-align: right;
  line-height: 1;
  user-select: none;
  cursor: pointer;
}
.fp-level-id:hover {
  color: #6b7280;
}

.fp-path {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;
  unicode-bidi: plaintext;
  color: #374151;
  user-select: text;
  cursor: text;
  font-size: 0.78rem;
}
.fp-path:hover {
  color: #111;
}
.fp-path--bold {
  font-weight: 700;
}
.fp-path--dim {
  color: #c0c4cc !important;
}
.fp-path--dim:hover {
  color: #9ca3af !important;
}
.fp-path--orange {
  color: #f97316 !important;
}
.fp-path--orange:hover {
  color: #ea6b00 !important;
}
.fp-path--active {
  color: #16a34a !important;
  font-weight: 700;
}
.fp-path--active:hover {
  color: #15803d !important;
}

.fp-chip {
  flex-shrink: 0;
  padding: 0 5px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 8px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
  user-select: text;
  cursor: pointer;
  line-height: 1.7;
}
.fp-chip:hover {
  background: #bfdbfe;
}
.fp-chip--active {
  background: #dcfce7;
  color: #16a34a !important;
}

.fp-filter-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.72rem;
  color: #374151;
}
.fp-filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.fp-filter-label-text {
  flex-shrink: 0;
  font-weight: 600;
  color: #374151;
}
.fp-filter-select-multi {
  flex: 1;
  min-width: 140px;
  max-width: 200px;
}
.fp-filter-source {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: #374151;
}
.fp-filter-select {
  padding: 2px 6px;
  font-size: 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-family: inherit;
}

.fp-resize-handle {
  position: absolute;
  bottom: 1px;
  left: 2px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: sw-resize;
  color: #9ca3af;
  font-size: 13px;
  user-select: none;
  transform: scaleX(-1);
}
.fp-resize-handle:hover {
  color: #4b5563;
}

.fp-path-context-menu {
  position: fixed;
  z-index: 10000;
  min-width: 160px;
  max-width: 360px;
  padding: 6px 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 0.75rem;
  font-family: ui-monospace, "Cascadia Code", monospace;
}
.fp-path-context-title {
  padding: 4px 10px 2px;
  color: #374151;
  word-break: break-all;
  font-size: 0.7rem;
  line-height: 1.4;
}
.fp-path-context-label {
  padding: 0 10px 6px;
  color: #6366f1;
  font-weight: 600;
  font-size: 0.72rem;
}
.fp-path-context-sep {
  height: 1px;
  margin: 2px 6px;
  background: #e5e7eb;
}
.fp-path-context-item {
  display: block;
  width: 100%;
  padding: 4px 10px;
  text-align: left;
  border: none;
  background: transparent;
  color: #374151;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: inherit;
}
.fp-path-context-item:hover {
  background: #f3f4f6;
}
</style>
