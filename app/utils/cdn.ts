/**
 * CDN 베이스 URL
 *
 * 환경변수 NUXT_PUBLIC_CDN_BASE 로 오버라이드 가능
 * - 서버(SSR): process.env.NUXT_PUBLIC_CDN_BASE 직접 참조
 * - 클라이언트: nuxt.config.ts runtimeConfig.public.cdnBase 를 useRuntimeConfig() 로 참조
 */
export const CDN: string = process.env.NUXT_PUBLIC_CDN_BASE ?? "/cdn/img";
export const MODE: string = process.env.NUXT_PUBLIC_MODE ?? "default";
