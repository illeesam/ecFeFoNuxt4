/**
 * 목록 페이징 타입 (정상 화면 _ 반응형 줄였을 때)
 * L = List, C = Card, Paging / AutoLoad / ManualLoad / NextPrev
 */
export type PageType =
  | "L_Paging_L_Paging"
  | "L_Paging_L_AutoLoad"
  | "L_Paging_L_ManualLoad"
  | "L_Paging_L_NextPrev"
  | "L_Paging_C_AutoLoad"
  | "L_Paging_C_ManualLoad"
  | "L_Paging_C_NextPrev"
  | "L_NextPrev_L_NextPrev"
  | "L_AutoLoad_L_AutoLoad"
  | "L_ManualLoad_C_ManualLoad"
  | "NONE";

/** 상품관리: 목록+페이징 → 카드+자동더보기 */
export const PAGE_TYPE_PRODUCT: PageType = "L_Paging_C_AutoLoad";

/** 그 외 관리 목록: 목록+페이징 → 카드+수동더보기 (default) */
export const PAGE_TYPE_DEFAULT: PageType = "L_Paging_C_ManualLoad";
