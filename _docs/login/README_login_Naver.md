# 네이버 로그인 (네이버 OAuth 2.0) 연동 가이드

정담(Outstock) 프로젝트에서 **네이버 로그인**을 사용하기 위한 앱 등록, 환경 변수, 테스트 방법을 정리합니다.

---

## 1. 개요

- **방식**: 네이버 로그인 API (OAuth 2.0)
- **역할**: 사용자가 네이버 계정으로 로그인하면, 네이버가 인증 후 우리 서버로 `code`를 보내고, 서버가 액세스 토큰·회원정보를 받아 앱 전용 토큰을 발급합니다.
- **필요 정보**: Client ID, Client Secret (네이버 개발자센터에서 발급)

---

## 2. 네이버 개발자센터에서 앱 등록 및 키 발급

### 2.1 앱 등록

1. [네이버 개발자센터](https://developers.naver.com/) 접속 후 로그인.
2. **Application** → **애플리케이션 등록**.
3. **애플리케이션 이름**, **사용 API**에서 **네이버 로그인** 선택.
4. **비로그인 오류 시 호출할 URL** 등 필요 시 설정.

### 2.2 로그인 API 환경 설정

1. 등록한 앱 선택 → **API 설정** 탭.
2. **네이버 로그인** → **환경 추가**.
3. **웹** 환경 선택 후:
   - **서비스 URL**: `http://localhost:3000` (개발), 운영 시 `https://your-domain.com`
   - **콜백 URL**: `http://localhost:3000/api/auth/naver/callback` (개발), 운영 시 `https://your-domain.com/api/auth/naver/callback`
4. 저장 후 **클라이언트 ID**, **클라이언트 시크릿** 확인.

---

## 3. 환경 변수 등록

| 변수 | 설명 | 노출 |
|------|------|------|
| `NAVER_CLIENT_ID` | 클라이언트 ID | 서버 전용 |
| `NAVER_CLIENT_SECRET` | 클라이언트 시크릿 | 서버 전용 |

### 넣는 위치

- **`.env`** / **`.env.development`** / **`.env.local`**: 개발용
- **`.env.production`**: 운영용
- **`.env.example`**: 변수명만 예시

### 예시

```env
NAVER_CLIENT_ID=xxxxxxxxxxxxxxxxxx
NAVER_CLIENT_SECRET=xxxxxxxxxx
```

---

## 4. 프로젝트 내 동작 요약

| 구분 | 경로/역할 |
|------|-----------|
| 로그인 시작 | "네이버 로그인" 클릭 → `GET /api/auth/naver` → 네이버 로그인 페이지로 리다이렉트 |
| 콜백 | 네이버 → `GET /api/auth/naver/callback?code=...` → 서버가 토큰·회원정보 조회 후 `/login/oauth-success?token=...` 리다이렉트 |

---

## 5. 테스트 방법

1. **env 설정**: `.env` 또는 `.env.local`에 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 입력.
2. **콜백 URL**: 개발자센터에 `http://localhost:3000/api/auth/naver/callback` 정확히 등록.
3. **실행**: `npm run dev` → `http://localhost:3000/login` → **네이버 로그인** 클릭.
4. 네이버 로그인/동의 후 앱으로 돌아오면 로그인 완료.
5. **실패 시**: `/login?error=...` 로 돌아오면 에러 메시지 확인. 콜백 URL과 env 값 재확인.

---

## 6. 참고 링크

- [네이버 로그인 API 소개](https://developers.naver.com/docs/login/api/api.md)
- [애플리케이션 등록](https://developers.naver.com/apps/)
