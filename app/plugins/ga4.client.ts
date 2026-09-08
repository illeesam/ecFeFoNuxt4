/**
 * Google Analytics 4 (GA4) 클라이언트 플러그인.
 * - NUXT_PUBLIC_GA_MEASUREMENT_ID 가 있으면 gtag 로드 및 page_view 전송
 * - 라우트 변경 시 page_path, page_title(상세 페이지는 해당 데이터 기준) 전송
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public as { gaMeasurementId?: string };
  const id = config.gaMeasurementId?.trim();
  if (!id) return;

  const router = useRouter();

  // gtag 스크립트 로드 및 초기 config
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
        async: true,
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: false });
        `,
        type: "text/javascript",
      },
    ],
  });

  function sendPageView(path: string, title?: string) {
    if (typeof window === "undefined" || !window.gtag) return;
    const pageTitle = title ?? (typeof document !== "undefined" ? document.title : "");
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: pageTitle || path,
    });
  }

  // 상세 페이지 경로: 해당 페이지에서 useGa().sendPageView(제목) 로 전송
  const isDetailRoute = (path: string) =>
    /^\/product-details\/[^/]+/.test(path) || /^\/blog-details\/[^/]+/.test(path);

  // 초기 페이지 (클라이언트 마운트 후)
  router.isReady().then(() => {
    nextTick(() => {
      const path = router.currentRoute.value.fullPath;
      if (!isDetailRoute(path)) sendPageView(path);
    });
  });

  // 라우트 변경 시 (상세 페이지 제외; 상세는 해당 페이지에서 조회 데이터로 전송)
  router.afterEach((to) => {
    nextTick(() => {
      if (!isDetailRoute(to.fullPath)) sendPageView(to.fullPath);
    });
  });
});
