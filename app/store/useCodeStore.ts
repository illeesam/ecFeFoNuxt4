/**
 * 공통 코드 Pinia 스토어.
 * grpCode / value / label 구조의 코드 목록을 /api/codes 에서 로드·캐시합니다.
 */
import { defineStore } from "pinia";
import { axiosCsr } from "~/utils/axiosCsr";
import { type SyCodeType } from "~/types/syCodeType";

export const useCodeStore = defineStore("code", {
  state: () => ({
    codes: [] as SyCodeType[],
    loaded: false,
  }),

  actions: {
    async loadStCodes() {
      if (this.loaded) return;
      try {
        const res = await axiosCsr.get<SyCodeType[]>("/api/codes");
        this.codes = res.data;
        this.loaded = true;
      } catch (err) {
        console.error("[useCodeStore] 코드 로드 실패:", err);
      }
    },
  },

  getters: {
    /**
     * 그룹별 코드 맵 { grpCode → SyCodeType[] }
     * 예: getCodes["YN"] → [{ value:"Y", label:"예" }, ...]
     */
    getStCodes: (state): Record<string, SyCodeType[]> =>
      state.codes.reduce(
        (acc, code) => {
          const key = code.grpCode.trim();
          if (!acc[key]) acc[key] = [];
          acc[key]!.push(code);
          return acc;
        },
        {} as Record<string, SyCodeType[]>,
      ),

    /**
     * "grpCode_value" → label 맵 (그룹+값으로 유일 조회)
     * 예: fullMap["COLOR-color01"] → "빨강"
     */
    getStLabel: (state): Record<string, string> => Object.fromEntries(state.codes.map((c) => [`${c.grpCode.trim()}-${c.value}`, c.label])),
  },
});
