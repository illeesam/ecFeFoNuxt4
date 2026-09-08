/**
 * cmUtil.ts - 공통 유틸리티 함수 모음
 */

/** document.cookie에 값 저장 */
export function setCookie(name: string, value: string, days = 30) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * days}`;
}

/** document.cookie 삭제 */
export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

/** hex 색상이 밝은 색(흰색 계열)인지 판별 */
export function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}
