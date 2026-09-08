/** 카테고리 타입 */
export interface CoCategoryType {
  categoryId: number; // 카테고리ID
  categoryCode?: string; // 카테고리코드 (필터/연동용)
  categoryName: string; // 카테고리명
  categoryLevel: number; // 카테고리 레벨
  parentCategory?: string; // 부모 카테고리 코드
}
