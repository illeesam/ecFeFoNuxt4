<template>
  <Teleport to="body">
    <!-- ── 메인 사이드바 / 플로팅 컨테이너 ── -->
    <div v-if="isVisible" class="fp-panels-root" :class="{ 'fp-panels-root--locked': isPanelsLocked }">
      <XdevFilePathBadgeOverlayPage />
      <XdevFilePathBadgeOverlayComp />
      <XdevFilePathBadgeOverlayProps />
      <XdevFilePathBadgeOverlayData />
    </div>

    <!-- ── 호버된 컴포넌트 배지 (체크된 것만 표시) ── -->
    <div
      v-if="isVisible && hoveredId && hoveredBadgeRect && checkedIds.includes(hoveredId)"
      class="fp-hover-badge"
      :style="{ top: `${hoveredBadgeRect.top + 4}px`, left: `${hoveredBadgeRect.left + 4}px` }"
    >
      <span class="fp-hover-badge-path">{{ shortPathById(hoveredId) }}</span>
      <span v-if="badgeById(hoveredId) && getTitleForBadge(badgeById(hoveredId)!)" class="fp-hover-badge-title">
        {{ getTitleForBadge(badgeById(hoveredId)!) }}
      </span>
    </div>

    <!-- ── 체크된 컴포넌트 오렌지 실선 (가려지지 않도록 레이어로 그림) ── -->
    <template v-for="id in checkedIds" :key="`outline-${id}`">
      <div
        v-if="isVisible && checkedBadgeRects[id] && rectHasSize(checkedBadgeRects[id]!)"
        class="fp-checked-outline"
        :style="rectToStyle(checkedBadgeRects[id]!)"
      />
    </template>

    <!-- ── 경로 더블클릭 시 활성 컴포넌트 두꺼운 초록 테두리 (체크된 것만, 한 개만) ── -->
    <div
      v-if="isVisible && activeBadgeId && checkedIds.includes(activeBadgeId) && activeBadgeRect && rectHasSize(activeBadgeRect)"
      class="fp-active-outline"
      :style="rectToStyle(activeBadgeRect)"
    />

    <!-- ── 체크된 컴포넌트 페이지 배지 ── -->
    <template v-for="id in checkedIds" :key="`pb-${id}`">
      <div
        v-if="isVisible && checkedBadgeRects[id]"
        class="fp-page-badge"
        :class="{ 'fp-page-badge--active': activeBadgeId === id, 'fp-page-badge--collapsed': isBadgeCollapsed(id) }"
        :style="getPageBadgeStyle(id)"
        @mousedown="onPageBadgeMouseDown(id, $event)"
      >
        <span
          class="fp-page-badge-drag"
          :class="{ 'fp-page-badge-drag--collapsed': isBadgeCollapsed(id) }"
          :title="isBadgeCollapsed(id) ? '더블클릭: 펼치기' : '드래그 이동 · 더블클릭: 접기'"
          @dblclick.stop="toggleBadgeCollapsed(id)"
        >
          {{ isBadgeCollapsed(id) ? "▶" : "⋮⋮" }}
        </span>
        <template v-if="!isBadgeCollapsed(id)">
          <button class="fp-page-badge-p" :class="{ 'fp-page-badge-p--active': openPropsId === id }" title="Props 보기" @click.stop="openPropsForBadge(id)">P</button>
          <button class="fp-page-badge-d" :class="{ 'fp-page-badge-d--active': openDataId === id }" title="Data 보기" @click.stop="openDataForBadge(id)">D</button>
          <span v-if="badgeLevelIds.get(id)" class="fp-page-badge-level">{{ badgeLevelIds.get(id) }}</span>
          <span class="fp-page-badge-path" :class="{ 'fp-page-badge-path--active': activeBadgeId === id }" title="더블클릭 → 소스 열기·활성" @dblclick.stop="onPageBadgePathDblclick(id)">{{ shortPathById(id) }}</span>
          <span v-if="badgeById(id) && getTitleForBadge(badgeById(id)!)" class="fp-page-badge-title" :class="{ 'fp-page-badge-title--active': activeBadgeId === id }">
            {{ getTitleForBadge(badgeById(id)!) }}
          </span>
        </template>
      </div>
    </template>

  </Teleport>
</template>

<script setup lang="ts">
import XdevFilePathBadgeOverlayPage from "~/components/xdev/XdevFilePathBadgeOverlayPage.vue";

const config = useRuntimeConfig()
const isLocal = config.public.mode === 'local'
const { showFilePathBadge } = useShowFilePathBadge()
const { isPanelsLocked, openPropsId, openDataId, activeBadgeId, defaultSourceEditor } = useXdevPanelsState()
const { badges, checkedIds, hoveredId, getTitleForBadge, getDomEl, badgeLevelIds } = useFilePathBadgeRegistry()

const isVisible = computed(() => isLocal && showFilePathBadge.value)

// ── 페이지 배지 접기/펼치기 & 드래그 위치 ──────────────────
const badgeCollapsed = ref<Record<string, boolean>>({})
const badgeCustomPosition = ref<Record<string, { top: number; left: number }>>({})
let dragBadgeId: string | null = null
let dragStartX = 0
let dragStartY = 0
let dragStartLeft = 0
let dragStartTop = 0

function isBadgeCollapsed(id: string) {
  return !!badgeCollapsed.value[id]
}

function toggleBadgeCollapsed(id: string) {
  badgeCollapsed.value = { ...badgeCollapsed.value, [id]: !badgeCollapsed.value[id] }
}

function getPageBadgeStyle(id: string): { top: string; left: string } {
  const custom = badgeCustomPosition.value[id]
  const rect = checkedBadgeRects.value[id]
  if (custom) {
    return { top: `${custom.top}px`, left: `${custom.left}px` }
  }
  if (rect) {
    return { top: `${rect.top + 4}px`, left: `${rect.left + 4}px` }
  }
  return { top: '0px', left: '0px' }
}

function onPageBadgeMouseDown(id: string, e: MouseEvent) {
  if (e.button !== 0) return
  const rect = checkedBadgeRects.value[id]
  const custom = badgeCustomPosition.value[id]
  const left = custom ? custom.left : (rect ? rect.left + 4 : 0)
  const top = custom ? custom.top : (rect ? rect.top + 4 : 0)
  dragBadgeId = id
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartLeft = left
  dragStartTop = top

  const onMove = (ev: MouseEvent) => {
    if (dragBadgeId !== id) return
    badgeCustomPosition.value = {
      ...badgeCustomPosition.value,
      [id]: {
        left: dragStartLeft + (ev.clientX - dragStartX),
        top: dragStartTop + (ev.clientY - dragStartY),
      },
    }
  }
  const onUp = () => {
    if (dragBadgeId === id) dragBadgeId = null
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

// ── body 클래스 (잠금 시 오른쪽 여백) ──────────────────
watch(
  isPanelsLocked,
  (locked) => {
    if (typeof document === 'undefined') return
    if (locked) document.body.classList.add('fp-panels-locked')
    else document.body.classList.remove('fp-panels-locked')
  },
  { immediate: true }
)
onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.classList.remove('fp-panels-locked')
})

// ── 체크된/호버된/활성 컴포넌트 DOM 위치 추적 (RAF) ──────────
interface BadgeRect { top: number; left: number; width: number; height: number }
const checkedBadgeRects = ref<Record<string, BadgeRect | null>>({})
const hoveredBadgeRect = ref<{ top: number; left: number } | null>(null)
const activeBadgeRect = ref<BadgeRect | null>(null)
let _rafId: number | null = null

function _updateCheckedRects() {
  const result: Record<string, BadgeRect | null> = {}
  for (const id of checkedIds.value) {
    const el = getDomEl(id)
    if (el) {
      const r = el.getBoundingClientRect()
      result[id] = { top: r.top, left: r.left, width: r.width, height: r.height }
    } else {
      result[id] = null
    }
  }
  checkedBadgeRects.value = result

  const hId = hoveredId.value
  if (hId) {
    const el = getDomEl(hId)
    hoveredBadgeRect.value = el ? { top: el.getBoundingClientRect().top, left: el.getBoundingClientRect().left } : null
  } else {
    hoveredBadgeRect.value = null
  }

  const aId = activeBadgeId.value
  if (aId) {
    const el = getDomEl(aId)
    if (el) {
      const r = el.getBoundingClientRect()
      activeBadgeRect.value = { top: r.top, left: r.left, width: r.width, height: r.height }
    } else {
      activeBadgeRect.value = null
    }
  } else {
    activeBadgeRect.value = null
  }

  _rafId = requestAnimationFrame(_updateCheckedRects)
}

function rectHasSize(r: BadgeRect) {
  return r.width > 0 && r.height > 0
}
function rectToStyle(r: BadgeRect) {
  return {
    top: `${r.top}px`,
    left: `${r.left}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  }
}

onMounted(() => { _rafId = requestAnimationFrame(_updateCheckedRects) })
onUnmounted(() => { if (_rafId !== null) cancelAnimationFrame(_rafId) })

// ── 헬퍼 ────────────────────────────────────────────────
function badgeById(id: string) {
  return badges.value.find(b => b.id === id)
}

function shortPathById(id: string): string {
  const badge = badgeById(id)
  if (!badge) return ''
  const parts = badge.filePath.replace(/\\/g, '/').split('/')
  return parts.slice(-2).join('/')
}

function openInEditor(filePath: string) {
  if (!filePath) return
  $fetch(`/api/__xdev/open-editor?file=${encodeURIComponent(filePath)}&editor=${defaultSourceEditor.value}`, { method: 'GET' }).catch(() => {})
}

function openPropsForBadge(id: string) {
  openPropsId.value = openPropsId.value === id ? null : id
}

function openDataForBadge(id: string) {
  openDataId.value = openDataId.value === id ? null : id
}

// 화면 컴포넌트 경로 더블클릭: 소스 열기 + 활성(초록 테두리) + [P][D] 열기
function onPageBadgePathDblclick(id: string) {
  openInEditor(badgeById(id)?.filePath ?? '')
  activeBadgeId.value = id
  openPropsId.value = id
  openDataId.value = id
  if (!checkedIds.value.includes(id)) checkedIds.value = [...checkedIds.value, id]
}
</script>

<style>
body.fp-panels-locked { padding-right: 320px; }
</style>

<style scoped>
.fp-panels-root {
  position: static;
}
.fp-panels-root--locked {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: #f3f4f6;
  border-left: 1px solid #d1d5db;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
}

/* ── 호버된 컴포넌트 배지 ── */
.fp-hover-badge {
  position: fixed;
  z-index: 9996;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(99, 102, 241, 0.78);
  color: #fff;
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 3px;
  pointer-events: none;
  white-space: nowrap;
  max-width: 360px;
  overflow: hidden;
  user-select: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}
.fp-hover-badge-path { opacity: 0.92; }
.fp-hover-badge-title {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.18);
  padding: 0 5px;
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 600;
}

/* ── 체크된 컴포넌트 오렌지 실선 (레이어로 그려서 가려지지 않음) ── */
.fp-checked-outline {
  position: fixed;
  z-index: 9995;
  pointer-events: none;
  border: 3px solid #f59e0b;
  border-radius: 2px;
  box-sizing: border-box;
}

/* ── 경로 더블클릭 시 활성 컴포넌트 두꺼운 초록 테두리 (한 개만) ── */
.fp-active-outline {
  position: fixed;
  z-index: 9996;
  pointer-events: none;
  border: 5px dotted #16a34a;
  border-radius: 2px;
  box-sizing: border-box;
}

/* ── 체크된 컴포넌트 페이지 배지 ── */
.fp-page-badge {
  position: fixed;
  z-index: 9997;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(99, 102, 241, 0.92);
  color: #fff;
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.68rem;
  padding: 2px 6px 2px 3px;
  border-radius: 3px;
  pointer-events: auto;
  white-space: nowrap;
  max-width: 360px;
  overflow: hidden;
  user-select: none;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  cursor: grab;
}
.fp-page-badge:active {
  cursor: grabbing;
}
.fp-page-badge--collapsed {
  padding: 2px 5px 2px 3px;
  max-width: none;
}
.fp-page-badge-drag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 2px;
  font-size: 0.6rem;
  opacity: 0.95;
  cursor: grab;
  border-radius: 2px;
  line-height: 1;
}
.fp-page-badge-drag:hover {
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
}
.fp-page-badge-drag--collapsed {
  margin-right: 0;
}
.fp-page-badge-p {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  font-size: 0.6rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  line-height: 1;
}
.fp-page-badge-p:hover { background: rgba(0, 0, 0, 0.45); color: #fff; }
.fp-page-badge-p--active { background: #059669; border-color: #047857; color: #fff; box-shadow: 0 0 0 1px #fff; }
.fp-page-badge-d {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  font-size: 0.6rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  line-height: 1;
}
.fp-page-badge-d:hover { background: rgba(0, 0, 0, 0.45); color: #fff; }
.fp-page-badge-d--active { background: #059669; border-color: #047857; color: #fff; box-shadow: 0 0 0 1px #fff; }
.fp-page-badge-level {
  flex-shrink: 0;
  font-size: 0.58rem;
  opacity: 0.75;
  white-space: nowrap;
}
.fp-page-badge-path {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
  cursor: pointer;
}
.fp-page-badge-path--active {
  color: #86efac;
  font-weight: 700;
  opacity: 1;
}
.fp-page-badge-title {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.18);
  padding: 0 5px;
  border-radius: 2px;
  font-size: 0.65rem;
  font-weight: 600;
}
.fp-page-badge-title--active {
  background: rgba(134, 239, 172, 0.35);
  color: #86efac;
  font-weight: 700;
}
</style>
