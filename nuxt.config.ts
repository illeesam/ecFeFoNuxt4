// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-12-12",
  vite: {
    server: {
      open: "chrome",
    },
  },
  css: ["vue3-carousel/dist/carousel.css", "~/assets/scss/main.scss"],
  modules: [
    "@nuxtjs/tailwindcss",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
  ],
  app: {
    head: {
      title: "jungdam",
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
        },
      ],
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  // 하이브리드 렌더링: SEO 필요 페이지만 SSR, 나머지는 CSR
  routeRules: {
    "/**": { ssr: false }, // 기본: CSR (SPA)
    "/shop": { ssr: true }, // 상품 목록: SSR + SEO
    "/product-details/**": { ssr: true }, // 상품 상세 (/:id): SSR + SEO
    "/blog-details/**": { ssr: true }, // 블로그 상세 (/:id): SSR + SEO
  },
  // CDN: app/assets/img 폴더를 /cdn/img 경로로 정적 서빙 (절대경로로 해석 보장)
  nitro: {
    publicAssets: [
      {
        dir: fileURLToPath(new URL("app/assets/img", import.meta.url)),
        baseURL: "/cdn/img",
        maxAge: 31536000,
      },
      {
        dir: fileURLToPath(new URL("public/uploads", import.meta.url)),
        baseURL: "/uploads",
        maxAge: 86400,
      },
    ],
  },
  // 런타임 설정 (환경변수로 오버라이드 가능)
  // .env 파일 우선순위: .env.local > .env.[mode] > .env
  // - NUXT_API_BASE_URL      → runtimeConfig.apiBaseUrl
  // - NUXT_PUBLIC_CDN_BASE   → runtimeConfig.public.cdnBase
  // - NUXT_PUBLIC_API_BASE   → runtimeConfig.public.apiBase
  // - NUXT_PUBLIC_MODE       → runtimeConfig.public.mode
  // - NUXT_PUBLIC_ENV_NM     → runtimeConfig.public.envNm
  // - NUXT_PUBLIC_APP_TITLE  → runtimeConfig.public.appTitle
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL ?? "http://localhost:3000",
    /** 토스페이먼츠 시크릿 키 (서버 전용, 결제 승인 API용) */
    tossPaymentsSecretKey: process.env.TOSSPAYMENTS_SECRET_KEY ?? "",
    /** 소셜 로그인 (서버 전용) */
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    naverClientId: process.env.NAVER_CLIENT_ID ?? "",
    naverClientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    kakaoClientId: process.env.KAKAO_CLIENT_ID ?? "",
    kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    appleClientId: process.env.APPLE_CLIENT_ID ?? "",
    appleTeamId: process.env.APPLE_TEAM_ID ?? "",
    appleKeyId: process.env.APPLE_KEY_ID ?? "",
    applePrivateKey: process.env.APPLE_PRIVATE_KEY ?? "",
    /** Redis 사용 여부 (로그인 세션/리프레시 토큰) */
    useRedis: process.env.USE_REDIS === "true" || process.env.USE_REDIS === "1",
    /** Redis 연결 URL */
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    /** JWT 서명용 시크릿 (API 로그인/리프레시 시) */
    authJwtSecret: process.env.AUTH_JWT_SECRET ?? "",
    /** 액세스 토큰 유효 시간(초). 기본 15분 */
    authAccessTokenTtlSec: Number(process.env.AUTH_ACCESS_TOKEN_TTL_MINUTES ?? 15) * 60,
    /** 리프레시 토큰·세션 유효 시간(초). 기본 7일 */
    authRefreshTokenTtlSec: Number(process.env.AUTH_REFRESH_TOKEN_TTL_DAYS ?? 7) * 24 * 60 * 60,
    public: {
      cdnBase: process.env.NUXT_PUBLIC_CDN_BASE ?? "/cdn/img",
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "",
      mode: process.env.NUXT_PUBLIC_MODE ?? "default",
      envNm: process.env.NUXT_PUBLIC_ENV_NM ?? ".env",
      appTitle: process.env.NUXT_PUBLIC_APP_TITLE ?? "정담",
      /** 토스페이먼츠 클라이언트 키 (결제창 호출용, 테스트/라이브 구분) */
      tossPaymentClientKey: process.env.NUXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY ?? "",
      /** Google Analytics 4 측정 ID (G-XXXXXXXXXX). 비어 있으면 스크립트 미로드 */
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
    },
  },
  hooks: {
    ready(nuxt) {
      const port = nuxt.options.devServer?.port ?? 3000;
      const host = (nuxt.options.devServer?.host === "0.0.0.0" ? "localhost" : nuxt.options.devServer?.host) ?? "localhost";
      const swaggerUrl = `http://${host}:${port}/api/docs`;
      console.log("\n[Env] NUXT_* 환경변수:");
      Object.keys(process.env)
        .filter((k) => k.startsWith("NUXT_"))
        .sort()
        .forEach((k) => console.log(`  ${k}=${process.env[k] ?? ""}`));
      console.log("[Env] useRuntimeConfig().public.NAME (적용값):", {
        cdnBase: process.env.NUXT_PUBLIC_CDN_BASE ?? "/cdn/img",
        apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "",
        mode: process.env.NUXT_PUBLIC_MODE ?? "default",
        envNm: process.env.NUXT_PUBLIC_ENV_NM ?? ".env",
        appTitle: process.env.NUXT_PUBLIC_APP_TITLE ?? "정담",
      });
      console.log("\n[Swagger] API 문서:", swaggerUrl, "\n");
    },
  },
});
