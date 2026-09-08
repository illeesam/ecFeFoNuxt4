/** 카테고리 트리 타입 */
export interface CoCategoryTreeType {
  categoryId: string; // 카테고리ID
  id?: string; // ID (기존 호환, categoryId와 동일)
  img?: string; // 이미지
  parentTitle: string; // 부모 제목
  value: string; // 값(코드)
  children?: string[]; // 자식 ID 목록
  smDesc?: string; // 짧은 설명
}
