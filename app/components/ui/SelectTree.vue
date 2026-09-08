<template>
  <div class="select-tree">
    <!-- Flat list: path + title (search result style) -->
    <div v-if="viewMode === 'flat'" class="select-tree-list">
      <div
        v-for="item in flatFilteredItems"
        :key="item.id"
        class="select-tree-row select-tree-row--flat"
        @click="onSelect(item)"
      >
        <span class="select-tree-path">{{ item.pathLabel || item.path }}</span>
        <span class="select-tree-title">{{ item.title }}</span>
      </div>
      <div v-if="flatFilteredItems.length === 0" class="select-tree-empty">검색 결과 없음</div>
    </div>

    <!-- Tree: Windows Explorer style (folder 영문, file = title) -->
    <div v-else class="select-tree-list select-tree-list--tree">
      <template v-for="node in treeFiltered" :key="node.id">
        <div
          v-if="node.isFolder"
          class="select-tree-row select-tree-row--folder"
          :style="{ paddingLeft: `${12 + node.depth * 14}px` }"
          @click="toggleExpand(node.id)"
        >
          <span class="select-tree-arrow">{{ expandedList.includes(node.id) ? "▼" : "▶" }}</span>
          <span class="select-tree-folder">{{ node.folderName }}</span>
        </div>
        <div
          v-else
          class="select-tree-row select-tree-row--file"
          :style="{ paddingLeft: `${12 + node.depth * 14}px` }"
          @click="onSelectTreeFile(node)"
        >
          <span class="select-tree-arrow select-tree-arrow--hidden">▶</span>
          <span class="select-tree-title">{{ node.title }}</span>
        </div>
      </template>
      <div v-if="treeFiltered.length === 0" class="select-tree-empty">항목 없음</div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SelectTreeItem {
  id: string;
  path: string;
  title: string;
  pathLabel?: string;
  children?: SelectTreeItem[];
}

const props = withDefaults(
  defineProps<{
    items: SelectTreeItem[];
    searchQuery?: string;
    viewMode?: "flat" | "tree";
    initialExpandedIds?: string[];
  }>(),
  { searchQuery: "", viewMode: "flat", initialExpandedIds: () => [] },
);

const emit = defineEmits<{ (e: "select", item: SelectTreeItem): void }>();

const expandedIds = ref<Set<string>>(new Set());

// 초기 펼침: initialExpandedIds 또는 root 폴더들 (한 번만)
const expandedInited = ref(false);
watch(
  () => props.items,
  (items) => {
    if (expandedInited.value || !items?.length) return;
    expandedInited.value = true;
    if (props.initialExpandedIds?.length) {
      expandedIds.value = new Set(props.initialExpandedIds);
      return;
    }
    const rootFolders = new Set<string>();
    for (const n of items) {
      if (n.children?.length) rootFolders.add(`folder:${n.id}`);
    }
    if (rootFolders.size) expandedIds.value = rootFolders;
  },
  { immediate: true },
);

const expandedList = computed(() => Array.from(expandedIds.value));

// Flat list: all leaves with pathLabel; filter by search
const flatItems = computed(() => {
  const out: SelectTreeItem[] = [];
  function walk(nodes: SelectTreeItem[]) {
    for (const n of nodes) {
      if (n.children?.length) walk(n.children);
      else out.push(n);
    }
  }
  walk(props.items);
  return out;
});

const flatFilteredItems = computed(() => {
  const q = props.searchQuery.trim().toLowerCase();
  if (!q) return flatItems.value;
  return flatItems.value.filter(
    (item) =>
      (item.pathLabel || item.path).toLowerCase().includes(q) || item.title.toLowerCase().includes(q),
  );
});

// Tree view: build folder + file rows with depth; folders from path segments (English)
interface TreeRow {
  id: string;
  depth: number;
  isFolder: boolean;
  folderName?: string;
  path?: string;
  title?: string;
  pathLabel?: string;
}

function pathToFolderName(segment: string): string {
  if (segment === "index" || segment === "") return "home";
  return segment.replace(/-/g, " ");
}

const treeFiltered = computed((): TreeRow[] => {
  const rows: TreeRow[] = [];
  const q = props.searchQuery.trim().toLowerCase();

  function addFolder(id: string, name: string, depth: number) {
    rows.push({ id, depth, isFolder: true, folderName: name });
  }

  function walk(nodes: SelectTreeItem[], depth: number, parentPath: string) {
    for (const n of nodes) {
      if (n.children?.length) {
        const folderId = `folder:${parentPath}/${n.id}`;
        const name = pathToFolderName(n.id);
        addFolder(folderId, name, depth);
        if (expandedIds.value.has(folderId)) walk(n.children!, depth + 1, `${parentPath}/${n.id}`);
      } else {
        const match = !q || (n.pathLabel || n.path).toLowerCase().includes(q) || n.title.toLowerCase().includes(q);
        if (match) rows.push({ id: n.id, depth, isFolder: false, path: n.path, title: n.title, pathLabel: n.pathLabel });
      }
    }
  }

  // Top-level: treat items as roots; if item has children, show as folder
  for (const n of props.items) {
    if (n.children?.length) {
      const folderId = `folder:${n.id}`;
      addFolder(folderId, n.title, 0);
      if (expandedIds.value.has(folderId)) walk(n.children!, 1, n.id);
    } else {
      const match = !q || (n.pathLabel || n.path).toLowerCase().includes(q) || n.title.toLowerCase().includes(q);
      if (match) rows.push({ id: n.id, depth: 0, isFolder: false, path: n.path, title: n.title, pathLabel: n.pathLabel });
    }
  }
  return rows;
});

function toggleExpand(id: string) {
  const next = new Set(expandedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedIds.value = next;
}

function onSelect(item: SelectTreeItem) {
  if (item.path) emit("select", item);
}

function onSelectTreeFile(node: TreeRow) {
  if (node.path != null) emit("select", { id: node.id, path: node.path, title: node.title ?? node.id, pathLabel: node.pathLabel });
}
</script>

<style scoped>
.select-tree {
  width: 100%;
  font-size: 0.78rem;
}

.select-tree-list {
  max-height: 240px;
  overflow-y: auto;
  padding: 2px 0;
}

.select-tree-list--tree {
  overflow-x: hidden;
}

.select-tree-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  min-height: 24px;
  line-height: 1.3;
}

.select-tree-row:hover {
  background: #e5e7eb;
}

.select-tree-row--flat {
  flex-wrap: nowrap;
  border-bottom: 1px solid #f3f4f6;
}

.select-tree-path {
  flex: 0 1 55%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6b7280;
  direction: rtl;
  unicode-bidi: plaintext;
  font-size: 0.72rem;
}

.select-tree-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #111827;
  font-weight: 500;
}

.select-tree-row--folder .select-tree-folder {
  color: #374151;
  font-weight: 600;
  text-transform: lowercase;
}

.select-tree-row--file .select-tree-title {
  color: #1d4ed8;
}

.select-tree-arrow {
  flex-shrink: 0;
  width: 14px;
  font-size: 0.6rem;
  color: #6b7280;
  text-align: center;
}

.select-tree-arrow--hidden {
  visibility: hidden;
}

.select-tree-empty {
  padding: 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>
