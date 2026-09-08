/** 상품 옵션 타입 */
export interface PdOptionType {
  optionId: number; // 옵션ID
  optionCode?: string; // 옵션코드 (필터/연동용)
  optionName: string; // 옵션명
  optionType: string; // 옵션 유형 (색상/사이즈 등)
  optionLevel: number; // 옵션 레벨
}
