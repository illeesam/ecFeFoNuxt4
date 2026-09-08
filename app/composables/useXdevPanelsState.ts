// dev-only 패널 공유 상태 (module-level, client-only)
const _isPanelsLocked = ref(true);
const _openPropsId = ref<string | null>(null);
const _openDataId = ref<string | null>(null);
const _activeBadgeId = ref<string | null>(null); // 경로 더블클릭 시 한 개만 활성화 → 화면 초록 테두리
const _defaultSourceEditor = ref<"vscode" | "cursor">("cursor");
const _mainPanelRef = ref<HTMLElement | null>(null);

export function useXdevPanelsState() {
  return {
    isPanelsLocked: _isPanelsLocked,
    openPropsId: _openPropsId,
    openDataId: _openDataId,
    activeBadgeId: _activeBadgeId,
    defaultSourceEditor: _defaultSourceEditor,
    mainPanelRef: _mainPanelRef,
  };
}
