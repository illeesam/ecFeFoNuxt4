/**
 * currentFilePath 배지 표시 여부 토글 (local 전용).
 * 드롭다운 등에서 토글로 제어하고, 페이지/컴포넌트 배지는 이 값을 참조합니다.
 */
const KEY = "showFilePathBadge";

export function useShowFilePathBadge() {
  const show = useState<boolean>(KEY, () => true);
  return {
    showFilePathBadge: show,
    toggleShowFilePathBadge: () => {
      show.value = !show.value;
    },
  };
}
