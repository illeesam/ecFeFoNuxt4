/**
 * 상품 비교 Pinia 스토어.
 * 비교할 상품 목록을 관리하고 localStorage와 동기화합니다.
 */
import { defineStore } from "pinia";
import { type PdProductType } from "~/types/pdProductType";

export const useCompareStore = defineStore("compare", {
  state: () => ({
    compare: [] as PdProductType[], // 비교 대상 상품 목록
  }),
  actions: {
    addStCompareProduct(payload: PdProductType) {
      // 비교에 추가 또는 이미 있으면 제거 (토글)
      const isAdded = this.compare.findIndex((p) => p.productId === payload.productId);
      if (isAdded !== -1) {
        this.compare = this.compare.filter((p) => p.productId !== payload.productId);
        useNuxtApp().$toast.error(`${payload.title} 비교에서 제거됨`);
      } else {
        this.compare.unshift(payload);
        useNuxtApp().$toast.success(`${payload.title} 비교에 추가됨`);
      }
      localStorage.setItem("compare_products", JSON.stringify(this.compare));
    },
    removeStCompare(payload: PdProductType) {
      // 해당 상품을 비교 목록에서 제거
      this.compare = this.compare.filter((p) => p.productId !== payload.productId);
      useNuxtApp().$toast.error(`${payload.title} 비교에서 제거됨`);
      localStorage.setItem("compare_products", JSON.stringify(this.compare));
    },
  },
  getters: {
    getStCompareProducts: (state) => {
      // localStorage에서 비교 목록 불러와 state 동기화
      if (process.client) {
        const data = localStorage.getItem("compare_products");
        if (data) {
          return (state.compare = JSON.parse(data));
        } else {
          localStorage.setItem("compare_products", JSON.stringify([]));
          return (state.compare = []);
        }
      } else {
        return state.compare;
      }
    },
  },
});
