/**
 * 관리자 상세 페이지에서 "목록" 클릭 시:
 * - iframe(mainFrame) 안이면 현재 탭 닫고 목록 탭으로 전환(이미 열려 있으면 새로고침)
 * - 단일 창이면 navigateTo로 목록 페이지 이동
 */
export function useAdminListNav() {
  function goToList(listPath: string, tabTitle: string) {
    if (typeof window !== "undefined" && window !== window.top) {
      window.parent.postMessage(
        { type: "closeTabAndGoTo", url: listPath, title: tabTitle },
        "*"
      );
      return;
    }
    navigateTo(listPath);
  }
  return { goToList };
}
