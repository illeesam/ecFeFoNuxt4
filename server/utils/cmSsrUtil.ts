/**
 * cmSsrUtil.ts - 서버 전용 공통 유틸리티 함수 모음 (Nitro / SSR 컨텍스트)
 */

/**
 * 객체에서 지정한 키만 추려 새 객체로 반환 (VO/API 응답 복사용).
 * @param obj 원본 객체
 * @param keys 복사할 키 배열 (예: ['brandId', 'brandCode', 'brandName'])
 * @returns Pick<obj, keys> 형태의 새 객체
 */
export function voCopy<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) (out as Record<K, unknown>)[k] = obj[k];
  }
  return out;
}

/**
 * 화면 경로를 서버 콘솔에 출력합니다 (NUXT_PUBLIC_MODE === 'local' 일 때만 동작).
 * Nitro 이벤트 핸들러 / 서버 미들웨어에서 호출하세요.
 * @param path 출력할 경로 문자열 (예: '/shop', event.path 등)
 */
// export function printUiPath(path: string) {
//   const mode = useRuntimeConfig().public.mode as string;
//   if (mode !== "local") return;
//   console.log(` ---- ${path} [${mode}]`);
// }
