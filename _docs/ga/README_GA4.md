# Google Analytics 4 (GA4) 연동 가이드

정담(Outstock) 프로젝트에 **Google Analytics 4**를 연동하기 위한 측정 ID 발급, 환경 변수 설정, 테스트 방법을 정리합니다.

---

## 1. 개요

- **GA4**: Google이 제공하는 웹/앱 분석 서비스. 측정 ID 형식은 `G-XXXXXXXXXX`입니다.
- **공통**: 전역에서 gtag 스크립트 로드, 라우트 변경 시 `page_view` 자동 전송 (경로·제목).
- **상세 페이지**: 상품 상세(`/product-details/:id`), 블로그 상세(`/blog-details/:id`)는 **해당 페이지의 상세 조회 데이터**로 `page_title`을 설정해 전송합니다.

---

## 2. GA4 측정 ID 발급 (Google Analytics 설정)

### 2.1 Google Analytics 접속

1. [Google Analytics](https://analytics.google.com/) 접속 후 로그인.
2. **관리** (톱니바퀴) → **속성**에서 기존 속성 선택 또는 **속성 만들기**.

### 2.2 GA4 속성 생성(없는 경우)

1. **속성 만들기** → 속성 이름(예: 정담 웹) 입력.
2. 보고 시간대, 통화 설정 후 **다음**.
3. **비즈니스 규모** 선택 후 **다음**.
4. **비즈니스 목표** 선택 후 **속성 만들기**.

### 2.3 데이터 스트림(웹) 추가

1. **관리** → **데이터 스트림** → **스트림 추가**.
2. **웹** 선택.
3. **웹사이트 URL**: 개발 시 `http://localhost:3000`, 운영 시 `https://your-domain.com`.
4. **스트림 이름** 입력(예: 정담 웹) 후 **스트림 만들기**.
5. **웹 스트림 세부정보** 화면에서 **측정 ID** 복사 → `G-XXXXXXXXXX` 형식.

---

## 3. 환경 변수 등록

| 변수 | 설명 | 노출 |
|------|------|------|
| `NUXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 측정 ID (`G-XXXXXXXXXX`) | 클라이언트(공개) |

### 넣는 위치

- **`.env`** / **`.env.development`** / **`.env.local`**: 개발·로컬 테스트용.
- **`.env.production`**: 운영용 측정 ID.
- **`.env.example`**: 변수명만 예시 (실제 ID 값은 넣지 않음).

### 예시

```env
# Google Analytics 4
NUXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**비워 두면** GA 스크립트는 로드되지 않고, `page_view`도 전송되지 않습니다.

---

## 4. 프로젝트 내 동작 요약

| 구분 | 동작 |
|------|------|
| **공통** | `app/plugins/ga4.client.ts`에서 측정 ID가 있으면 gtag 로드, `send_page_view: false`로 초기 config 후, 라우트 변경 시 `page_view` 전송 (경로·`document.title`). |
| **상세 페이지** | `/product-details/:id`, `/blog-details/:id`는 플러그인에서 자동 전송하지 않고, 해당 페이지에서 **상세 조회 데이터** 로드 후 `useGa().sendPageView(제목)`으로 전송. |
| **composable** | `useGa().sendPageView(pageTitle?)`: 현재 경로와 (선택) 제목으로 `page_view` 1회 전송. |

---

## 5. 테스트 방법

### 5.1 측정 ID 적용

1. `.env` 또는 `.env.local`에 `NUXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` 설정.
2. `npm run dev` 또는 `npm run dev:local` 실행 후 사이트 접속.

### 5.2 실시간 보고서로 확인

1. Google Analytics → **보고서** → **실시간**.
2. 브라우저에서 페이지 이동(홈 → 쇼핑 → 상품 상세 등).
3. 실시간 보고서에 **사용자 1명** 등으로 표시되는지 확인.

### 5.3 디버그 뷰(권장)

1. 브라우저에 [Google Analytics 디버거](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) 확장 프로그램 설치.
2. 확장 프로그램 **ON** 후 사이트에서 페이지 이동.
3. GA **관리** → **디버그뷰**에서 `page_view` 이벤트와 `page_title`, `page_path` 확인.
4. 상품/블로그 상세 페이지는 **상세 조회 데이터의 제목**이 `page_title`로 나오는지 확인.

### 5.4 개발자 도구로 확인

1. 브라우저 **개발자 도구** → **네트워크** 탭.
2. `google-analytics.com` 또는 `googletagmanager.com` 요청이 나가는지 확인.
3. 콘솔에서 `window.gtag`가 정의되어 있는지 확인 (측정 ID가 설정된 경우).

---

## 6. 상세 페이지 제목 동작

- **상품 상세** (`/product-details/[id]`): API로 조회한 상품의 `title`을 사용해 `page_view` 전송 (예: `나무 보울 | Outstock`).
- **블로그 상세** (`/blog-details/[id]`): API로 조회한 블로그의 `title`을 사용해 전송 (예: `제목 | Outstock 블로그`).
- 그 외 페이지: 라우트 변경 시점의 `document.title`로 전송.

---

## 7. 참고 링크

- [Google Analytics 4 시작하기](https://support.google.com/analytics/answer/9304153)
- [GA4 속성 및 데이터 스트림](https://support.google.com/analytics/answer/9303318)
- [gtag.js 개발자 가이드](https://developers.google.com/tag-platform/gtagjs)
