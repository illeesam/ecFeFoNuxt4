/**
 * axiosCsr.ts
 * CSR(브라우저) 전용 HTTP 클라이언트 (axios 기반)
 * - Pinia 스토어 액션, onMounted, 이벤트 핸들러 등 클라이언트 사이드에서 사용
 * - 브라우저가 baseURL을 자동 결정하므로 상대 경로(/api/xxx) 그대로 사용 가능
 */
import axios from "axios";

const axiosCsr = axios.create();

// ─── 요청 인터셉터 ───────────────────────────────────────────────────────────

axiosCsr.interceptors.request.use(
  (config) => {
    const paramStr = config.params ? JSON.stringify(config.params) : "";
    console.log(
      `[axiosCsr] ▶ 요청: ${config.method?.toUpperCase()} ${config.url}`,
      paramStr || ""
    );
    return config;
  },
  (error) => {
    console.error("[axiosCsr] ✖ 요청 설정 오류:", error?.message ?? error);
    console.error("[axiosCsr]   상세:", error);
    return Promise.reject(error);
  }
);

// ─── 응답 인터셉터 ───────────────────────────────────────────────────────────

axiosCsr.interceptors.response.use(
  (response) => {
    console.log(
      `[axiosCsr] ◀ 응답 성공: ${response.status} ${response.config.url}`,
      Array.isArray(response.data)
        ? `[${response.data.length}건]`
        : typeof response.data === "object" && response.data !== null
          ? `id=${(response.data as any).id ?? "-"}`
          : response.data
    );
    return response;
  },
  (error) => {
    const status  = error?.response?.status  ?? "NETWORK";
    const method  = error?.config?.method?.toUpperCase() ?? "-";
    const url     = error?.config?.url ?? "-";
    const message = error?.message ?? String(error);
    const resData = error?.response?.data;

    console.error(`[axiosCsr] ✖ 응답 오류 [${status}] ${method} ${url} — ${message}`);
    if (resData !== undefined) {
      console.error("[axiosCsr]   서버 응답 데이터:", resData);
    }
    return Promise.reject(error);
  }
);

export { axiosCsr };
export default axiosCsr;
