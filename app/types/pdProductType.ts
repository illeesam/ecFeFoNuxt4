import type { PdOptionType } from "~/types/pdOptionType";
import type { CoCategoryType } from "~/types/coCategoryType";
import type { CoBrandType } from "~/types/coBrandType";
import type { PdReviewType } from "~/types/pdReviewType";

/** 상품 타입 */
export interface PdProductType {
  productId: number; // 상품ID
  img: string; // 대표 이미지
  trending?: boolean; // 트렌딩 여부
  topRated?: boolean; // 베스트 평점 여부
  bestSeller?: boolean; // 베스트셀러 여부
  new?: boolean; // 신상품 여부
  banner?: boolean; // 배너 노출 여부
  bannerImg?: string; // 배너 이미지
  saleOfPer?: number; // 할인율(%)
  relatedImages?: string[]; // 관련 이미지 목록
  thumbImg?: string; // 썸네일 이미지
  bigImg?: string; // 큰 이미지
  parentCategory: CoCategoryType; // 부모 카테고리
  category: CoCategoryType; // 카테고리
  brand: CoBrandType; // 브랜드
  title: string; // 상품명
  price: number; // 판매가
  oldPrice?: number; // 정가
  rating: number; // 평점
  quantity: number; // 재고 수량
  orderQuantity?: number; // 주문 수량
  smDesc: string; // 짧은 설명
  optionSizes?: PdOptionType[]; // 사이즈 옵션 목록
  optionColors: PdOptionType[]; // 컬러 옵션 목록
  weight?: number; // 무게
  dimension?: string; // 치수
  reviews?: PdReviewType[]; // 리뷰 목록
  details: {
    detailsText: string; // 상세 설명 텍스트
    detailsList?: string[]; // 상세 설명 목록
    detailsText2?: string; // 상세 설명 텍스트2
  };
}
