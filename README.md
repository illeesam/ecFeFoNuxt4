# Outstock — Nuxt 4 + Tailwind CSS

> Vue 3 / Nuxt 4 기반 이커머스 프론트엔드 프로젝트

---

## 기술 스택

| 항목            | 버전 / 내용                                             |
| --------------- | ------------------------------------------------------- |
| Framework       | Nuxt 4 (Vue 3)                                          |
| CSS             | Tailwind CSS v3, SCSS                                   |
| 상태 관리       | Pinia                                                   |
| HTTP 클라이언트 | Axios                                                   |
| 유효성 검사     | Vee-Validate + Yup                                      |
| UI 컴포넌트     | vue3-carousel, @yeger/vue-masonry-wall, @vueform/slider |

---

## 설치

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

---

## 환경 파일(.env) 구성

Nuxt는 실행 명령에 따라 아래 파일을 자동 병합합니다. (하단이 우선 적용)

| 파일               | 적용 시점    | 설명                            |
| ------------------ | ------------ | ------------------------------- |
| `.env`             | 항상         | 공통 기본값 (모든 환경)         |
| `.env.development` | `nuxt dev`   | 개발 환경 자동 로드             |
| `.env.local`       | 항상         | 개인 로컬 오버라이드 (Git 제외) |
| `.env.production`  | `nuxt build` | 운영 환경 자동 로드             |

### 주요 환경 변수

| 변수명                 | 설명                       | 예시                    |
| ---------------------- | -------------------------- | ----------------------- |
| `NUXT_PUBLIC_CDN_BASE` | 이미지 CDN 기본 경로       | `/cdn/img`              |
| `NUXT_API_BASE_URL`    | 서버 내부 API URL (SSR용)  | `http://localhost:3000` |
| `NUXT_PUBLIC_API_BASE` | 클라이언트 API URL (CSR용) | `http://localhost:3000` |
| `PORT` / `NITRO_PORT`  | 서버 포트                  | `3000`                  |

---

## 실행 명령 전체 목록 (dotenv)

| run 명령            | 파일                                                | `MODE` 표시 | 용도                           |
| ------------------- | --------------------------------------------------- | ----------- | ------------------------------ |
| `npm run dev`       | _(자동)_ `.env` → `.env.development` → `.env.local` | `dev`       | 일반 개발 서버                 |
| `npm run dev:local` | `.env.local`                                        | `local`     | 로컬 개인 설정으로 개발 서버   |
| `npm run dev:prod`  | `.env.production`                                   | `prod`      | 운영 환경값으로 개발 서버 확인 |

| build 명령            | 파일                                               | `MODE` 표시 | 용도                |
| --------------------- | -------------------------------------------------- | ----------- | ------------------- |
| `npm run build`       | _(자동)_ `.env` → `.env.production` → `.env.local` | `prod`      | 기본 운영 빌드      |
| `npm run build:dev`   | `.env.development`                                 | `dev`       | 개발 환경 단독 빌드 |
| `npm run build:local` | `.env.local`                                       | `local`     | 로컬 설정으로 빌드  |
| `npm run build:prod`  | `.env.production`                                  | `prod`      | 운영 환경 단독 빌드 |

| preview 명령            | 파일                                | `MODE` 표시 | 용도                    |
| ----------------------- | ----------------------------------- | ----------- | ----------------------- |
| `npm run preview`       | _(자동)_ `.env` → `.env.production` | `prod`      | 빌드 결과 미리보기      |
| `npm run preview:local` | `.env.local`                        | `local`     | 로컬 설정 단독 미리보기 |
| `npm run preview:dev`   | `.env.development`                  | `dev`       | 개발 환경 단독 미리보기 |
| `npm run preview:prod`  | `.env.production`                   | `prod`      | 운영 환경 단독 미리보기 |

| generate 명령      | 파일                                | `MODE` 표시 | 용도                   |
| ------------------ | ----------------------------------- | ----------- | ---------------------- |
| `npm run generate` | _(자동)_ `.env` → `.env.production` | `prod`      | 정적 사이트 생성 (SSG) |

### 개발 서버

```bash
npm run dev          # 기본 개발 (.env.development 자동)
npm run dev:local    # 로컬 설정 적용
npm run dev:prod     # 운영 환경값으로 로컬 확인
```

### 빌드 / 배포

```bash
npm run build        # 기본 운영 빌드 (.env.production 자동)
npm run build:dev    # 개발 환경 단독 빌드
npm run build:local  # 로컬 설정으로 빌드
npm run build:prod   # 운영 환경 단독 빌드

npm run preview       # 빌드 결과 미리보기 (.env.production 자동)
npm run preview:dev   # 개발 환경 단독 미리보기
npm run preview:local # 로컬 설정 단독 미리보기
npm run preview:prod  # 운영 환경 단독 미리보기

npm run generate     # SSG 정적 사이트 생성
```

---

## 환경별 개발 흐름

| 단계                | 명령                                          | 비고                                         |
| ------------------- | --------------------------------------------- | -------------------------------------------- |
| 최초 설치           | `npm install`                                 |                                              |
| 로컬 개발           | `npm run dev`                                 | `.env.local`로 개인 설정 오버라이드 가능     |
| 운영 환경 로컬 확인 | `npm run dev:prod`                            | `.env.production` 값으로 동작 검증           |
| 운영 빌드 검증      | `npm run build:prod` + `npm run preview:prod` | `.env.production` 기준 최종 확인             |
| 운영 배포           | `npm run build:prod` → 서버 실행              | `.env.production` 실제 운영 값으로 교체 필요 |

---

## 데모 계정

로컬 개발용 임시 계정 (별도 백엔드 없이 사용 가능)

| 항목     | 값                                    |
| -------- | ------------------------------------- |
| 이메일   | `demo1@mail.com` ~ `demo99@mail.com`  |
| 비밀번호 | `123456`                              |
| 이름     | 홍길동1 ~ 홍길동99                    |
| 연락처   | `010-1234-0001` ~ `010-1234-0099`     |
| 주소     | 성남시 중원구 성남대로 997-1 ~ 997-99 |

---

더 자세한 내용은 [Nuxt 공식 문서](https://nuxt.com/docs)를 참고하세요.
