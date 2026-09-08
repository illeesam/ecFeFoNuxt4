/**
 * CDN 베이스 URL (서버 전용)
 * 환경변수 NUXT_PUBLIC_CDN_BASE 로 오버라이드 가능
 */
export const CDN: string = process.env.NUXT_PUBLIC_CDN_BASE ?? "/cdn/img";
export const MODE: string = process.env.NUXT_PUBLIC_MODE ?? "default";
