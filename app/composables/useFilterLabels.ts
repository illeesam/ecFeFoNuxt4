/**
 * 필터 코드값(category01, size03, brand04 등)을 사용자에게 보여줄 라벨로 변환합니다.
 */

const CATEGORY_LABELS: Record<string, string> = {
  category01: "카테고리 01",
  category02: "카테고리 02",
  category03: "카테고리 03",
  category07: "데코 & 악세서리",
  category08: "조명 & 의자",
  category09: "의류 & 오일",
  category10: "남성 패션",
  category11: "여성 패션",
};

const SIZE_LABELS: Record<string, string> = {
  size01: "S",
  size02: "M",
  size03: "L",
  size04: "XL",
  size05: "XXL",
  size40: "40",
};

const BRAND_LABELS: Record<string, string> = {
  brand01: "브랜드 01",
  brand02: "브랜드 02",
  brand04: "브랜드 04",
  brand05: "브랜드 05",
};

function toDefaultCategoryLabel(code: string): string {
  if (CATEGORY_LABELS[code]) return CATEGORY_LABELS[code];
  const match = code.match(/^category(\d+)$/i);
  return match ? `카테고리 ${match[1]}` : code;
}

function toDefaultSizeLabel(code: string): string {
  if (SIZE_LABELS[code]) return SIZE_LABELS[code];
  const match = code.match(/^size(\d+)$/i);
  return match ? `사이즈 ${match[1]}` : code;
}

function toDefaultBrandLabel(code: string): string {
  if (BRAND_LABELS[code]) return BRAND_LABELS[code];
  const match = code.match(/^brand(\d+)$/i);
  return match ? `브랜드 ${match[1]}` : code;
}

export function useFilterLabels() {
  return {
    getCategoryLabel: toDefaultCategoryLabel,
    getSizeLabel: toDefaultSizeLabel,
    getBrandLabel: toDefaultBrandLabel,
  };
}
