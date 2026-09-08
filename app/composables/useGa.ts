/**
 * Google Analytics 4 (GA4) 컴포저블.
 * - 상세 페이지에서 상세 조회 데이터(제목 등)로 page_view 전송 시 사용
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useGa() {
  const router = useRouter();

  function sendPageView(pageTitle?: string) {
    if (import.meta.server) return;
    if (typeof window === "undefined" || !window.gtag) return;
    const path = router.currentRoute.value.fullPath;
    const title = pageTitle ?? document.title ?? path;
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
    });
  }

  return { sendPageView };
}
