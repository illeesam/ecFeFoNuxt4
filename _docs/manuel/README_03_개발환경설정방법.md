# README_03 - 개발 환경 설정 방법

## 1. 필요 사항

- **Node.js**: 20.x LTS 권장 ([nodejs.org](https://nodejs.org))
- **패키지 매니저**: npm / yarn / pnpm 중 하나
- **에디터**: VS Code 권장 (Vue/Nuxt 확장 사용 시 유리)

## 2. 저장소 클론 및 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd outstock_vue_nuxt4_tailwind

# 의존성 설치 (npm)
npm install

# 또는 yarn
yarn install

# 또는 pnpm
pnpm install
```

## 3. 개발 서버 실행

```bash
npm run dev
```

- 기본 주소: **http://localhost:3000**
- 코드 변경 시 HMR로 자동 반영

## 4. 주요 npm 스크립트

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 개발 서버 실행 (기본 3000 포트) |
| `npm run build` | 프로덕션 빌드 (.output 생성) |
| `npm run generate` | 정적 사이트 생성 (SSG) |
| `npm run preview` | 프로덕션 빌드 로컬 미리보기 |

## 5. 환경 변수 (선택)

- API URL 등이 필요하면 프로젝트 루트에 `.env` 생성
- Nuxt 3/4에서는 `runtimeConfig` 사용 권장 (`nuxt.config.ts`에 설정 후 `useRuntimeConfig()`로 접근)

## 6. 문제 해결

- **의존성 오류**: `node_modules` 삭제 후 `npm install` 재실행
- **Nuxt 준비**: `postinstall` 시 `nuxt prepare` 자동 실행됨
- **포트 변경**: `nuxt dev --port 3001` 등으로 지정 가능
