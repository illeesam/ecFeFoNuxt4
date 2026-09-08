/**
 * 상세 화면 오픈: mainFrame 탭 또는 새 창.
 * newWindow true(또는 Ctrl+클릭)면 항상 새 창으로 연다.
 */
export function useOpenDetailTab() {
  function openDetailTab(path: string, title: string = "상세", newWindow?: boolean) {
    if (import.meta.server) return;
    const origin = window.location.origin;
    const fullUrl = path.startsWith("http") ? path : `${origin}${path.startsWith("/") ? path : `/${path}`}`;

    if (newWindow) {
      window.open(fullUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const inIframe = window !== window.top;

    if (inIframe) {
      try {
        const parent = window.parent as Window & { $?: { modal?: { openTab?: (t: string, u: string) => void } } };
        if (parent?.$?.modal?.openTab) {
          parent.$.modal.openTab(title, fullUrl);
          return;
        }
      } catch {
        // same-origin이 아니면 parent 접근 시 예외
      }
      window.parent.postMessage({ type: "openTab", url: fullUrl, title }, origin);
      return;
    }

    try {
      const w = window as Window & { $?: { modal?: { openTab?: (t: string, u: string) => void } } };
      if (w?.$?.modal?.openTab) {
        w.$.modal.openTab(title, fullUrl);
        return;
      }
    } catch {
      // ignore
    }
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  }
  return { openDetailTab };
}
