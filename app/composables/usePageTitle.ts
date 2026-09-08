/**
 * 페이지 타이틀을 컴포넌트 정보 오버레이에 표시합니다.
 *
 * @param label - 직접 지정할 한글명 (미입력 시 document.title 자동 사용)
 *
 * @example
 * // 한글명 직접 지정 (권장)
 * usePageTitle('상품 상세')
 *
 * @example
 * // document.title 자동 사용 (useHead 이후 호출)
 * useHead({ title: '상품 상세 | Outstock' })
 * usePageTitle()
 */
export function usePageTitle(label?: string) {
  const config = useRuntimeConfig();
  if (config.public.mode !== "local") return;

  const instance = getCurrentInstance();
  if (!instance) return;

  const { setComponentTitle, setPageTitleByPath } = useFilePathBadgeRegistry();
  const currentFilePath = useCurrentFilePath();

  if (label) {
    setComponentTitle(instance.uid, label);
    if (currentFilePath) setPageTitleByPath(currentFilePath, label);
  } else {
    onMounted(async () => {
      await nextTick();
      const title = document.title;
      if (title) {
        setComponentTitle(instance.uid, title);
        if (currentFilePath) setPageTitleByPath(currentFilePath, title);
      }
    });
  }

  onUnmounted(() => {
    setComponentTitle(instance.uid, null);
    if (currentFilePath) setPageTitleByPath(currentFilePath, null);
  });
}
