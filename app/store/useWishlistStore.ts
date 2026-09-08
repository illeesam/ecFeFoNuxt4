/**
 * 위시리스트(찜) Pinia 스토어.
 * 찜한 상품 목록을 관리하고 localStorage와 동기화합니다.
 */
import { defineStore } from "pinia";
import { type PdProductType } from "~/types/pdProductType";
import { type MbWishlistItemType } from "~/types/mbWishlistItemType";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    wishlists: [] as MbWishlistItemType[], // 위시리스트에 담긴 상품 목록
  }),
  actions: {
    addStWishlistProduct(payload: PdProductType) {
      // 위시리스트에 추가 또는 이미 있으면 제거 (토글)
      const isAdded = this.wishlists.findIndex((p) => p.productId === payload.productId);
      if (isAdded !== -1) {
        this.wishlists = this.wishlists.filter((p) => p.productId !== payload.productId);
        useNuxtApp().$toast.error(`${payload.title} 위시리스트에서 제거됨`);
      } else {
        this.wishlists.push(payload);
        useNuxtApp().$toast.success(`${payload.title} 위시리스트에 추가됨`);
      }
      localStorage.setItem("wishlist_products", JSON.stringify(this.wishlists));
    },
    removeStWishlist(payload: PdProductType) {
      // 해당 상품을 위시리스트에서 제거
      this.wishlists = this.wishlists.filter((p) => p.productId !== payload.productId);
      useNuxtApp().$toast.error(`${payload.title} 위시리스트에서 제거됨`);
      localStorage.setItem("wishlist_products", JSON.stringify(this.wishlists));
    },
  },
  getters: {
    getStWishlistProducts: (state) => {
      // localStorage에서 위시리스트 불러와 state 동기화
      if (process.client) {
        const data = localStorage.getItem("wishlist_products");
        if (data) {
          return (state.wishlists = JSON.parse(data));
        } else {
          localStorage.setItem("wishlist_products", JSON.stringify([]));
          return (state.wishlists = []);
        }
      } else {
        return state.wishlists;
      }
    },
  },
});
