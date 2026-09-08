<template>
  <div
    ref="dataPanelRef"
    class="fp-data-float"
    :class="{ 'fp-data-float--docked': isPanelsLocked, 'fp-data-float--collapsed': !isOpen }"
    :style="isPanelsLocked ? {} : dataPanelStyle"
    @wheel.stop
  >
    <!-- 헤더 -->
    <div
      class="fp-data-head"
      :class="{ 'fp-data-head--docked': isPanelsLocked }"
      @pointerdown="!isPanelsLocked && startDataDrag($event)"
    >
      <span class="fp-data-head-title">Data</span>
      <span v-if="openDataId && badgeLevelIds.get(openDataId)" class="fp-data-head-level">{{ badgeLevelIds.get(openDataId) }}</span>
      <span v-if="selectedFilename" class="fp-data-head-file">
        {{ selectedFilename }}<span v-if="selectedTitle" class="fp-data-head-chip">{{ selectedTitle }}</span>
      </span>
      <div class="fp-data-tabs" @mousedown.stop>
        <button class="fp-data-tab" :class="{ 'fp-data-tab--active': dataActiveTab === 0 }" @click.stop="dataActiveTab = 0">트리</button>
        <button class="fp-data-tab" :class="{ 'fp-data-tab--active': dataActiveTab === 1 }" @click.stop="dataActiveTab = 1">JSON</button>
      </div>
      <button type="button" class="fp-btn-lock" :title="isPanelsLocked ? '잠금 해제' : '우측 고정'" @mousedown.stop @click.stop="isPanelsLocked = !isPanelsLocked">
        <span class="fp-lock-icon">{{ isPanelsLocked ? "🔓" : "🔒" }}</span>
      </button>
      <span class="fp-data-toggle" @mousedown.stop @click.stop="isOpen = !isOpen">{{ isOpen ? "▲" : "▼" }}</span>
      <button v-if="openDataId" class="fp-data-close" @mousedown.stop @click.stop="openDataId = null">✕</button>
    </div>

    <!-- 빈 상태 -->
    <div v-if="!openDataId" class="fp-data-empty">선택된 컴포넌트가 없습니다</div>

    <!-- 탭 1: Data 트리 (value 편집) -->
    <div v-show="openDataId && isOpen && dataActiveTab === 0" class="fp-data-tree">
      <template v-if="dataTreeNodes.length > 0">
        <div
          v-for="dnode in dataTreeNodes"
          :key="dnode.path.join('.')"
          class="fp-data-row"
          :style="{ paddingLeft: `${6 + dnode.depth * 14}px` }"
        >
          <span
            class="fp-ptree-arrow"
            :class="{ 'fp-ptree-arrow--hidden': !dnode.hasChildren }"
            @click.stop="toggleDataNode(dnode.path.join('.'))"
          >{{ collapsedDataPaths.includes(dnode.path.join('.')) ? '▶' : '▼' }}</span>
          <span class="fp-ptree-key">{{ dnode.key }}:</span>
          <template v-if="!dnode.hasChildren">
            <input
              v-if="editingDataPath === dnode.path.join('.')"
              ref="editingDataInputRef"
              v-model="editingDataValue"
              class="fp-ptree-input"
              @blur="applyDataInlineEdit(dnode)"
              @keydown.enter.stop="applyDataInlineEdit(dnode)"
              @keydown.escape.stop="cancelDataInlineEdit"
              @mousedown.stop
              @click.stop
            />
            <span
              v-else
              class="fp-ptree-value fp-ptree-value--editable"
              :class="`fp-ptree-value--${dnode.type}`"
              @click.stop="startDataInlineEdit(dnode)"
            >{{ formatValue(dnode) }}</span>
          </template>
          <template v-else>
            <span class="fp-ptree-complex">
              {{ dnode.type === 'array' ? `[${(dnode.value as unknown[]).length}]` : '{...}' }}
            </span>
          </template>
        </div>
      </template>
      <div v-else class="fp-data-empty">data 없음</div>
    </div>

    <!-- 탭 2: JSON 편집 + 저장 -->
    <div v-show="openDataId && isOpen && dataActiveTab === 1" class="fp-data-json-tab">
      <textarea v-model="dataJsonValue" class="fp-data-json-textarea" spellcheck="false" @mousedown.stop @click.stop></textarea>
      <div class="fp-data-json-actions" @mousedown.stop>
        <button class="fp-data-json-save" @click.stop="saveDataJsonEdit">저장</button>
      </div>
    </div>

    <!-- 크기 조절 핸들 -->
    <div v-show="openDataId && isOpen" class="fp-data-resize-handle" @mousedown.stop="startDataResize">⤡</div>
  </div>
</template>

<script setup lang="ts">
const { isPanelsLocked, openDataId, mainPanelRef } = useXdevPanelsState()
const { getInstanceData, applyDataEdit, badges, getTitleForBadge, badgeLevelIds } = useFilePathBadgeRegistry()

const isOpen = ref(true)

// ── 선택된 배지 정보 (헤더 표시용) ────────────────────
const selectedBadge = computed(() => badges.value.find(b => b.id === openDataId.value) ?? null)
const selectedFilename = computed(() => {
  if (!selectedBadge.value) return ''
  return selectedBadge.value.filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.vue$/i, '') ?? ''
})
const selectedTitle = computed(() => {
  if (!selectedBadge.value) return ''
  return getTitleForBadge(selectedBadge.value) ?? ''
})

interface DataTreeNode {
  path: string[]
  key: string
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  depth: number
  hasChildren: boolean
}

const currentDataData = ref<Record<string, unknown> | null>(null)
const collapsedDataPaths = reactive<string[]>([])
const editingDataPath = ref<string | null>(null)
const editingDataValue = ref('')
const editingDataInputRef = ref<HTMLInputElement | null>(null)
const dataActiveTab = ref(0)
const dataJsonValue = ref('')

function loadDataData() {
  if (!openDataId.value) return
  currentDataData.value = getInstanceData(openDataId.value)
  collapsedDataPaths.splice(0)
  editingDataPath.value = null
  dataActiveTab.value = 0
  dataJsonValue.value = JSON.stringify(currentDataData.value, null, 2)
  dataPos.top = NaN
  dataPos.left = NaN
}

onMounted(loadDataData)
watch(openDataId, (id) => { if (id) loadDataData() })
watch(dataActiveTab, (tab) => {
  if (tab === 1) dataJsonValue.value = JSON.stringify(currentDataData.value, null, 2)
})

watch(editingDataPath, async (path) => {
  if (path !== null) {
    await nextTick()
    editingDataInputRef.value?.focus()
    editingDataInputRef.value?.select()
  }
})

const dataTreeNodes = computed((): DataTreeNode[] => {
  const data = currentDataData.value
  if (!data) return []
  const result: DataTreeNode[] = []

  function traverse(obj: unknown, path: string[], depth: number) {
    if (obj === null || typeof obj !== 'object') return
    const isArr = Array.isArray(obj)
    const entries: [string, unknown][] = isArr
      ? (obj as unknown[]).map((v, i) => [String(i), v])
      : Object.entries(obj as Record<string, unknown>)
    for (const [key, val] of entries) {
      const nodePath = [...path, key]
      const isComplex = val !== null && typeof val === 'object'
      const hasChildren = isComplex && (
        Array.isArray(val) ? (val as unknown[]).length > 0 : Object.keys(val as object).length > 0
      )
      const type = (val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val) as DataTreeNode['type']
      result.push({ path: nodePath, key, value: val, type, depth, hasChildren })
      if (hasChildren && !collapsedDataPaths.includes(nodePath.join('.'))) traverse(val, nodePath, depth + 1)
    }
  }
  traverse(data, [], 0)
  return result
})

function toggleDataNode(pathStr: string) {
  const idx = collapsedDataPaths.indexOf(pathStr)
  if (idx === -1) collapsedDataPaths.push(pathStr)
  else collapsedDataPaths.splice(idx, 1)
}

function formatValue(node: DataTreeNode): string {
  if (node.type === 'null') return 'null'
  if (node.type === 'string') return `"${node.value as string}"`
  return String(node.value)
}

function startDataInlineEdit(node: DataTreeNode) {
  editingDataPath.value = node.path.join('.')
  editingDataValue.value = node.type === 'string' ? (node.value as string) : JSON.stringify(node.value)
}

function cancelDataInlineEdit() { editingDataPath.value = null }

function applyDataInlineEdit(node: DataTreeNode) {
  if (editingDataPath.value === null) return
  editingDataPath.value = null
  if (!currentDataData.value || !openDataId.value) return
  const dataData = JSON.parse(JSON.stringify(currentDataData.value)) as Record<string, unknown>
  let newValue: unknown = editingDataValue.value
  if (node.type !== 'string') {
    try { newValue = JSON.parse(editingDataValue.value) } catch { /* keep as string */ }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let target: any = dataData
  for (let i = 0; i < node.path.length - 1; i++) target = target[node.path[i]!]
  target[node.path[node.path.length - 1]!] = newValue
  applyDataEdit(openDataId.value, dataData)
  currentDataData.value = dataData
}

async function saveDataJsonEdit() {
  if (!openDataId.value) return
  try {
    const parsed = JSON.parse(dataJsonValue.value) as Record<string, unknown>
    applyDataEdit(openDataId.value, parsed)
    currentDataData.value = parsed
  } catch { await useAlert().openAlert('JSON 형식 오류') }
}

// ── 드래그 & 리사이즈 ──────────────────────────────────
const dataPanelRef = ref<HTMLElement | null>(null)
const dataPos = reactive({ top: NaN, left: NaN })
const dataPanelWidth = ref<number | null>(265)
const dataPanelHeight = ref<number | null>(null)

const dataPanelStyle = computed(() => {
  const w = dataPanelWidth.value ? { width: `${dataPanelWidth.value}px` } : {}
  const h = dataPanelHeight.value ? { height: `${dataPanelHeight.value}px` } : {}
  if (!isNaN(dataPos.left)) {
    return { top: `${dataPos.top}px`, left: `${dataPos.left}px`, right: 'auto', ...w, ...h }
  }
  if (!mainPanelRef.value) return { ...w, ...h }
  const rect = mainPanelRef.value.getBoundingClientRect()
  return { top: `${rect.top + 20}px`, right: `${window.innerWidth - rect.left + 6 + 277}px`, ...w, ...h }
})

function startDataDrag(e: MouseEvent) {
  if (isPanelsLocked.value) return
  if (dataPanelRef.value && isNaN(dataPos.left)) {
    const rect = dataPanelRef.value.getBoundingClientRect()
    dataPos.top = rect.top
    dataPos.left = rect.left
  }
  const startX = e.clientX - dataPos.left
  const startY = e.clientY - dataPos.top
  const onMove = (ev: MouseEvent) => { dataPos.left = ev.clientX - startX; dataPos.top = ev.clientY - startY }
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  e.preventDefault()
}

function startDataResize(e: MouseEvent) {
  if (dataPanelRef.value && isNaN(dataPos.left)) {
    const rect = dataPanelRef.value.getBoundingClientRect()
    dataPos.top = rect.top
    dataPos.left = rect.left
  }
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = dataPanelRef.value?.offsetWidth ?? 265
  const startHeight = dataPanelRef.value?.offsetHeight ?? 300
  const startLeft = dataPos.left
  const onMove = (ev: MouseEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    const newWidth = Math.max(200, startWidth - dx)
    dataPanelWidth.value = newWidth
    if (!isNaN(startLeft)) dataPos.left = startLeft + (startWidth - newWidth)
    dataPanelHeight.value = Math.max(120, startHeight + dy)
  }
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  e.preventDefault()
}
</script>

<style scoped>
.fp-data-float {
  position: fixed;
  z-index: 9997;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  min-height: 60px;
  height: 85vh;
  max-height: 85vh;
}
.fp-data-float--docked {
  position: static;
  flex: 1;
  min-height: 0;
  max-height: none;
  height: auto;
  width: 100%;
}
.fp-data-float--collapsed { height: auto; max-height: none; }
.fp-data-float--docked.fp-data-float--collapsed { flex: 0 0 auto; }

.fp-data-head {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  background: #ecfdf5;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 6px 6px 0 0;
  cursor: grab;
  user-select: none;
  flex-shrink: 0;
}
.fp-data-head:active { cursor: grabbing; }
.fp-data-head--docked { cursor: default; }

.fp-btn-lock { flex-shrink: 0; padding: 0 4px; border: none; background: transparent; cursor: pointer; font-size: 1rem; line-height: 1; opacity: 0.8; }
.fp-btn-lock:hover { opacity: 1; }
.fp-lock-icon { display: inline-block; }

.fp-data-head-title { flex-shrink: 0; font-weight: 700; font-size: 0.78rem; color: #065f46; pointer-events: none; }
.fp-data-head-level { flex-shrink: 0; font-size: 0.6rem; color: #059669; font-weight: 600; pointer-events: none; }

.fp-data-head-file {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.72rem;
  color: #4b5563;
  pointer-events: none;
}
.fp-data-head-chip {
  display: inline-block;
  margin-left: 4px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 6px;
  padding: 0 5px;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.6;
  vertical-align: middle;
}

.fp-data-toggle { color: #9ca3af; font-size: 0.62rem; cursor: pointer; padding: 2px 3px; flex-shrink: 0; }

.fp-data-close {
  flex-shrink: 0; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; background: transparent; border: none; cursor: pointer;
  color: #6b7280; border-radius: 3px; padding: 0; line-height: 1;
}
.fp-data-close:hover { background: #fecaca; color: #dc2626; }

.fp-data-tabs { display: flex; gap: 2px; flex-shrink: 0; }
.fp-data-tab {
  padding: 1px 8px; font-size: 0.68rem; background: #e5e7eb; border: 1px solid #d1d5db;
  border-radius: 3px; cursor: pointer; color: #4b5563; font-family: inherit; line-height: 1.6;
}
.fp-data-tab:hover { background: #d1d5db; }
.fp-data-tab--active { background: #059669; color: #fff; border-color: #059669; }

.fp-data-tree { flex: 1; overflow-y: auto; padding: 2px 0 20px; overscroll-behavior: contain; }

.fp-data-row { display: flex; align-items: center; gap: 4px; padding: 2px 6px 2px 0; line-height: 1.45; min-width: 0; }
.fp-data-row:hover { background: #f0fdf4; }

.fp-ptree-arrow { flex-shrink: 0; width: 10px; font-size: 0.5rem; color: #6b7280; cursor: pointer; text-align: center; }
.fp-ptree-arrow--hidden { visibility: hidden; pointer-events: none; }
.fp-ptree-key { flex-shrink: 0; color: #0369a1; font-weight: 500; }

.fp-ptree-value {
  flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  border-radius: 2px; padding: 0 3px;
}
.fp-ptree-value--editable { cursor: pointer; }
.fp-ptree-value--editable:hover { background: #d1fae5; outline: 1px solid #6ee7b7; }
.fp-ptree-value--string { color: #16a34a; }
.fp-ptree-value--number { color: #dc2626; }
.fp-ptree-value--boolean { color: #7c3aed; }
.fp-ptree-value--null { color: #9ca3af; font-style: italic; }

.fp-ptree-input {
  flex: 1; min-width: 40px; border: 1px solid #059669; border-radius: 2px;
  padding: 0 4px; font-family: inherit; font-size: inherit; color: #1f2937;
  outline: none; background: #ecfdf5; line-height: 1.4;
}
.fp-ptree-complex { color: #9ca3af; font-style: italic; font-size: 0.68rem; }
.fp-data-empty { padding: 10px 12px; color: #9ca3af; font-style: italic; font-size: 0.72rem; }

.fp-data-json-tab {
  flex: 1; display: flex; flex-direction: column; padding: 4px; gap: 4px;
  overflow: hidden; min-height: 200px;
}
.fp-data-json-textarea {
  flex: 1; resize: none; border: 1px solid #d1d5db; border-radius: 3px; padding: 6px;
  font-family: ui-monospace, "Cascadia Code", monospace; font-size: 0.72rem; color: #1f2937;
  outline: none; line-height: 1.5; background: #f9fafb; min-height: 160px;
  overscroll-behavior: contain;
}
.fp-data-json-textarea:focus { border-color: #059669; background: #fff; }
.fp-data-json-actions { display: flex; justify-content: flex-end; }
.fp-data-json-save {
  padding: 2px 12px; font-size: 0.72rem; background: #059669; color: #fff;
  border: none; border-radius: 3px; cursor: pointer; font-family: inherit; line-height: 1.7;
}
.fp-data-json-save:hover { background: #047857; }

.fp-data-resize-handle {
  position: absolute; bottom: 1px; left: 2px; width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  cursor: sw-resize; color: #9ca3af; font-size: 13px; user-select: none;
  transform: scaleX(-1); z-index: 1;
}
.fp-data-resize-handle:hover { color: #4b5563; }
</style>
