/** 메뉴 트리 타입 */
export interface SyMenuTreeType {
  menuTreeId: number; // 메뉴트리ID
  menuId?: number; // 메뉴ID (기존 호환)
  link: string; // 링크
  title: string; // 메뉴명
  hasDropdown?: boolean; // 드롭다운 여부
  megamenu?: boolean; // 메가메뉴 여부
  dropdownItems?: {
    link: string; // 링크
    title: string; // 메뉴명
    dropdownMenu?: {
      link: string; // 링크
      title: string; // 메뉴명
    }[];
  }[];
}
