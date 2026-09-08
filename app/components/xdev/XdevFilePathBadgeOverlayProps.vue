<template>
  <div
    ref="propsPanelRef"
    class="fp-props-float"
    :class="{ 'fp-props-float--docked': isPanelsLocked, 'fp-props-float--collapsed': !isOpen }"
    :style="isPanelsLocked ? {} : propsPanelStyle"
    @wheel.stop
  >
    <!-- 헤더 -->
    <div
      class="fp-props-head"
      :class="{ 'fp-props-head--docked': isPanelsLocked }"
      @pointerdown="!isPanelsLocked && startPropsDrag($event)"
    >
      <span class="fp-props-head-title">Props</span>
      <span v-if="openPropsId && badgeLevelIds.get(openPropsId)" class="fp-props-head-level">{{ badgeLevelIds.get(openPropsId) }}</span>
      <span v-if="selectedFilename" class="fp-props-head-file">
        {{ selectedFilename }}<span v-if="selectedTitle" class="fp-props-head-chip">{{ selectedTitle }}</span>
      </span>
      <div class="fp-props-tabs" @mousedown.stop>
        <button class="fp-props-tab" :class="{ 'fp-props-tab--active': propsActiveTab === 0 }" @click.stop="propsActiveTab = 0">트리</button>
        <button class="fp-props-tab" :class="{ 'fp-props-tab--active': propsActiveTab === 1 }" @click.stop="propsActiveTab = 1">JSON</button>
      </div>
      <button type="button" class="fp-btn-lock" :title="isPanelsLocked ? '잠금 해제' : '우측 고정'" @mousedown.stop @click.stop="isPanelsLocked = !isPanelsLocked">
        <span class="fp-lock-icon">{{ isPanelsLocked ? "🔓" : "🔒" }}</span>
      </button>
      <span class="fp-props-toggle" @mousedown.stop @click.stop="isOpen = !isOpen">{{ isOpen ? "▲" : "▼" }}</span>
      <button v-if="openPropsId" class="fp-props-close" @mousedown.stop @click.stop="openPropsId = null">✕</button>
    </div>

    <!-- 선택 없음 -->
    <div v-if="!openPropsId" class="fp-props-empty">선택된 컴포넌트가 없습니다</div>

    <!-- 탭 1: Props 트리 -->
    <div v-else-if="isOpen && propsActiveTab === 0" class="fp-props-tree">
      <template v-if="propsTreeNodes.length > 0">
        <div
          v-for="node in propsTreeNodes"
          :key="node.path.join('.')"
          class="fp-props-row"
          :style="{ paddingLeft: `${6 + node.depth * 14}px` }"
        >
          <span
            class="fp-ptree-arrow"
            :class="{ 'fp-ptree-arrow--hidden': !node.hasChildren }"
            @click.stop="togglePropNode(node.path.join('.'))"
          >{{ collapsedPropPaths.includes(node.path.join('.')) ? '▶' : '▼' }}</span>
          <span class="fp-ptree-key">{{ node.key }}:</span>
          <template v-if="!node.hasChildren">
            <input
              v-if="editingPropPath === node.path.join('.')"
              ref="editingInputRef"
              v-model="editingPropValue"
              class="fp-ptree-input"
              @blur="applyInlineEdit(node)"
              @keydown.enter.stop="applyInlineEdit(node)"
              @keydown.escape.stop="cancelInlineEdit"
              @mousedown.stop
              @click.stop
            />
            <span
              v-else
              class="fp-ptree-value"
              :class="`fp-ptree-value--${node.type}`"
              @click.stop="startInlineEdit(node)"
            >{{ formatPropValue(node) }}</span>
          </template>
          <template v-else>
            <span class="fp-ptree-complex">
              {{ node.type === 'array' ? `[${(node.value as unknown[]).length}]` : '{...}' }}
            </span>
          </template>
        </div>
      </template>
      <div v-else class="fp-props-empty">props 없음</div>
    </div>

    <!-- 탭 2: JSON 편집 -->
    <div v-else-if="isOpen && propsActiveTab === 1" class="fp-props-json-tab">
      <textarea v-model="jsonEditValue" class="fp-props-json-textarea" spellcheck="false" @mousedown.stop @click.stop></textarea>
      <div class="fp-props-json-actions" @mousedown.stop>
        <button class="fp-props-json-save" @click.stop="saveJsonEdit">저장</button>
      </div>
    </div>

    <!-- 크기 조절 핸들 -->
    <div v-if="openPropsId && isOpen" class="fp-props-resize-handle" @mousedown.stop="startPropsResize">⤡</div>
  </div>
</template>

<script setup lang="ts">
const { isPanelsLocked, openPropsId, mainPanelRef } = useXdevPanelsState()
const { getInstanceProps, applyPropsEdit, badges, getTitleForBadge, badgeLevelIds } = useFilePathBadgeRegistry()

const isOpen = ref(true)

// ── 선택된 배지 정보 (헤더 표시용) ────────────────────
const selectedBadge = computed(() => badges.value.find(b => b.id === openPropsId.value) ?? null)
const selectedFilename = computed(() => {
  if (!selectedBadge.value) return ''
  return selectedBadge.value.filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.vue$/i, '') ?? ''
})
const selectedTitle = computed(() => {
  if (!selectedBadge.value) return ''
  return getTitleForBadge(selectedBadge.value) ?? ''
})

interface PropTreeNode {
  path: string[]
  key: string
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  depth: number
  hasChildren: boolean
}

const currentPropsData = ref<Record<string, unknown> | null>(null)
const collapsedPropPaths = reactive<string[]>([])
const editingPropPath = ref<string | null>(null)
const editingPropValue = ref('')
const editingInputRef = ref<HTMLInputElement | null>(null)
const propsActiveTab = ref(0)
const jsonEditValue = ref('')

function loadPropsData() {
  if (!openPropsId.value) return
  currentPropsData.value = getInstanceProps(openPropsId.value)
  collapsedPropPaths.splice(0)
  editingPropPath.value = null
  propsActiveTab.value = 0
  jsonEditValue.value = JSON.stringify(currentPropsData.value, null, 2)
  propsPos.top = NaN
  propsPos.left = NaN
}

watch(openPropsId, (id) => { if (id) loadPropsData() })

watch(editingPropPath, async (path) => {
  if (path !== null) {
    await nextTick()
    editingInputRef.value?.focus()
    editingInputRef.value?.select()
  }
})

watch(propsActiveTab, (tab) => {
  if (tab === 1) jsonEditValue.value = JSON.stringify(currentPropsData.value, null, 2)
})

const propsTreeNodes = computed((): PropTreeNode[] => {
  const data = currentPropsData.value
  if (!data) return []
  const result: PropTreeNode[] = []

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
      const type = (val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val) as PropTreeNode['type']
      result.push({ path: nodePath, key, value: val, type, depth, hasChildren })
      if (hasChildren && !collapsedPropPaths.includes(nodePath.join('.'))) traverse(val, nodePath, depth + 1)
    }
  }
  traverse(data, [], 0)
  return result
})

function togglePropNode(pathStr: string) {
  const idx = collapsedPropPaths.indexOf(pathStr)
  if (idx === -1) collapsedPropPaths.push(pathStr)
  else collapsedPropPaths.splice(idx, 1)
}

function formatPropValue(node: PropTreeNode): string {
  if (node.type === 'null') return 'null'
  if (node.type === 'string') return `"${node.value as string}"`
  return String(node.value)
}

function startInlineEdit(node: PropTreeNode) {
  editingPropPath.value = node.path.join('.')
  editingPropValue.value = node.type === 'string' ? (node.value as string) : JSON.stringify(node.value)
}

function cancelInlineEdit() { editingPropPath.value = null }

async function saveJsonEdit() {
  if (!openPropsId.value) return
  try {
    const parsed = JSON.parse(jsonEditValue.value) as Record<string, unknown>
    applyPropsEdit(openPropsId.value, parsed)
    currentPropsData.value = parsed
  } catch { await useAlert().openAlert('JSON 형식 오류') }
}

function applyInlineEdit(node: PropTreeNode) {
  if (editingPropPath.value === null) return
  editingPropPath.value = null
  if (!currentPropsData.value || !openPropsId.value) return
  const propsData = JSON.parse(JSON.stringify(currentPropsData.value)) as Record<string, unknown>
  let newValue: unknown = editingPropValue.value
  if (node.type !== 'string') {
    try { newValue = JSON.parse(editingPropValue.value) } catch { /* keep as string */ }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let target: any = propsData
  for (let i = 0; i < node.path.length - 1; i++) target = target[node.path[i]!]
  target[node.path[node.path.length - 1]!] = newValue
  applyPropsEdit(openPropsId.value, propsData)
  currentPropsData.value = propsData
}

// ── 드래그 & 리사이즈 ──────────────────────────────────
const propsPanelRef = ref<HTMLElement | null>(null)
const propsPos = reactive({ top: NaN, left: NaN })
const propsPanelWidth = ref<number | null>(265)
const propsPanelHeight = ref<number | null>(null)

const propsPanelStyle = computed(() => {
  const w = propsPanelWidth.value ? { width: `${propsPanelWidth.value}px` } : {}
  const h = propsPanelHeight.value ? { height: `${propsPanelHeight.value}px` } : {}
  if (!isNaN(propsPos.left)) {
    return { top: `${propsPos.top}px`, left: `${propsPos.left}px`, right: 'auto', ...w, ...h }
  }
  if (!mainPanelRef.value) return { ...w, ...h }
  const rect = mainPanelRef.value.getBoundingClientRect()
  return { top: `${rect.top}px`, right: `${window.innerWidth - rect.left + 6}px`, ...w, ...h }
})

function startPropsDrag(e: MouseEvent) {
  if (isPanelsLocked.value) return
  if (propsPanelRef.value && isNaN(propsPos.left)) {
    const rect = propsPanelRef.value.getBoundingClientRect()
    propsPos.top = rect.top
    propsPos.left = rect.left
  }
  const startX = e.clientX - propsPos.left
  const startY = e.clientY - propsPos.top
  const onMove = (ev: MouseEvent) => { propsPos.left = ev.clientX - startX; propsPos.top = ev.clientY - startY }
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  e.preventDefault()
}

function startPropsResize(e: MouseEvent) {
  if (propsPanelRef.value && isNaN(propsPos.left)) {
    const rect = propsPanelRef.value.getBoundingClientRect()
    propsPos.top = rect.top
    propsPos.left = rect.left
  }
  const startX = e.clientX
  const startY = e.clientY
  const startWidth = propsPanelRef.value?.offsetWidth ?? 320
  const startHeight = propsPanelRef.value?.offsetHeight ?? 300
  const startLeft = propsPos.left
  const onMove = (ev: MouseEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    const newWidth = Math.max(200, startWidth - dx)
    propsPanelWidth.value = newWidth
    if (!isNaN(startLeft)) propsPos.left = startLeft + (startWidth - newWidth)
    propsPanelHeight.value = Math.max(120, startHeight + dy)
  }
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  e.preventDefault()
}
</script>

<style scoped>
.fp-props-float {
  position: fixed;
  z-index: 9998;
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
.fp-props-float--docked {
  position: static;
  flex: 1;
  min-height: 0;
  max-height: none;
  height: auto;
  width: 100%;
}
.fp-props-float--collapsed { height: auto; max-height: none; }
.fp-props-float--docked.fp-props-float--collapsed { flex: 0 0 auto; }

.fp-props-head {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  background: #f0f4ff;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 6px 6px 0 0;
  cursor: grab;
  user-select: none;
  flex-shrink: 0;
}
.fp-props-head:active { cursor: grabbing; }
.fp-props-head--docked { cursor: default; }
.fp-props-head--docked:active { cursor: default; }

.fp-btn-lock { flex-shrink: 0; padding: 0 4px; border: none; background: transparent; cursor: pointer; font-size: 1rem; line-height: 1; opacity: 0.8; }
.fp-btn-lock:hover { opacity: 1; }
.fp-lock-icon { display: inline-block; }

.fp-props-head-title { flex-shrink: 0; font-weight: 700; font-size: 0.78rem; color: #3730a3; pointer-events: none; }
.fp-props-head-level { flex-shrink: 0; font-size: 0.6rem; color: #6366f1; font-weight: 600; pointer-events: none; }

.fp-props-head-file {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.72rem;
  color: #4b5563;
  pointer-events: none;
}
.fp-props-head-chip {
  display: inline-block;
  margin-left: 4px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 6px;
  padding: 0 5px;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.6;
  vertical-align: middle;
}

.fp-props-toggle { color: #9ca3af; font-size: 0.62rem; cursor: pointer; padding: 2px 3px; flex-shrink: 0; }

.fp-props-close {
  flex-shrink: 0; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; background: transparent; border: none; cursor: pointer;
  color: #6b7280; border-radius: 3px; padding: 0; line-height: 1;
}
.fp-props-close:hover { background: #fecaca; color: #dc2626; }

.fp-props-tabs { display: flex; gap: 2px; flex-shrink: 0; }
.fp-props-tab {
  padding: 1px 8px; font-size: 0.68rem; background: #e5e7eb; border: 1px solid #d1d5db;
  border-radius: 3px; cursor: pointer; color: #4b5563; font-family: inherit; line-height: 1.6;
}
.fp-props-tab:hover { background: #d1d5db; }
.fp-props-tab--active { background: #6366f1; color: #fff; border-color: #6366f1; }

.fp-props-tree { flex: 1; overflow-y: auto; padding: 2px 0 20px; overscroll-behavior: contain; }

.fp-props-row { display: flex; align-items: center; gap: 4px; padding: 2px 6px 2px 0; line-height: 1.45; min-width: 0; }
.fp-props-row:hover { background: #f8faff; }

.fp-ptree-arrow { flex-shrink: 0; width: 10px; font-size: 0.5rem; color: #6b7280; cursor: pointer; text-align: center; }
.fp-ptree-arrow--hidden { visibility: hidden; pointer-events: none; }
.fp-ptree-key { flex-shrink: 0; color: #0369a1; font-weight: 500; }

.fp-ptree-value {
  flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  cursor: pointer; border-radius: 2px; padding: 0 3px;
}
.fp-ptree-value:hover { background: #e0f2fe; outline: 1px solid #7dd3fc; }
.fp-ptree-value--string { color: #16a34a; }
.fp-ptree-value--number { color: #dc2626; }
.fp-ptree-value--boolean { color: #7c3aed; }
.fp-ptree-value--null { color: #9ca3af; font-style: italic; }

.fp-ptree-input {
  flex: 1; min-width: 40px; border: 1px solid #6366f1; border-radius: 2px;
  padding: 0 4px; font-family: inherit; font-size: inherit; color: #1f2937;
  outline: none; background: #f0f9ff; line-height: 1.4;
}
.fp-ptree-complex { color: #9ca3af; font-style: italic; font-size: 0.68rem; }
.fp-props-empty { padding: 10px 12px; color: #9ca3af; font-style: italic; font-size: 0.72rem; }

.fp-props-json-tab {
  flex: 1; display: flex; flex-direction: column; padding: 4px; gap: 4px;
  overflow: hidden; min-height: 200px;
}
.fp-props-json-textarea {
  flex: 1; resize: none; border: 1px solid #d1d5db; border-radius: 3px; padding: 6px;
  font-family: ui-monospace, "Cascadia Code", monospace; font-size: 0.72rem; color: #1f2937;
  outline: none; line-height: 1.5; background: #f9fafb; min-height: 160px;
  overscroll-behavior: contain;
}
.fp-props-json-textarea:focus { border-color: #6366f1; background: #fff; }
.fp-props-json-actions { display: flex; justify-content: flex-end; }
.fp-props-json-save {
  padding: 2px 12px; font-size: 0.72rem; background: #6366f1; color: #fff;
  border: none; border-radius: 3px; cursor: pointer; font-family: inherit; line-height: 1.7;
}
.fp-props-json-save:hover { background: #4f46e5; }

.fp-props-resize-handle {
  position: absolute; bottom: 1px; left: 2px; width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  cursor: sw-resize; color: #9ca3af; font-size: 13px; user-select: none;
  transform: scaleX(-1); z-index: 1;
}
.fp-props-resize-handle:hover { color: #4b5563; }
</style>
