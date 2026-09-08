import type { MbWishlistItemType } from "~/types/mbWishlistItemType";

/** 위시리스트 스토어 상태 */
export interface MbWishlistStateType {
  wishlists: MbWishlistItemType[]; // 위시리스트 목록
}
