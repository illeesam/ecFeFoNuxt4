# 구글 로그인 (Google OAuth 2.0) 연동 가이드

정담(Outstock) 프로젝트에서 **구글 로그인**을 사용하기 위한 인증 설정, 환경 변수, 테스트 방법을 정리합니다.

---

## 1. 개요

- **방식**: OAuth 2.0 Authorization Code
- **역할**: 사용자가 구글 계정으로 로그인하면, 구글이 인증 후 우리 서버로 `code`를 보내고, 서버가 액세스 토큰·사용자 정보를 받아 앱 전용 토큰을 발급합니다.
- **필요 정보**: Client ID, Client Secret (Google Cloud Console에서 발급)

---

## 2. Google Cloud Console에서 프로젝트 및 키 발급

### 2.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속 후 로그인.
2. 상단 프로젝트 선택 → **새 프로젝트** → 프로젝트 이름 입력 후 만들기.

### 2.2 OAuth 동의 화면 설정

1. 왼쪽 메뉴 **API 및 서비스** → **OAuth 동의 화면**.
2. **외부** 사용자 유형 선택 후 만들기.
3. 앱 이름, 사용자 지원 이메일, 개발자 연락처 정보 입력 후 저장.
4. **범위**에서 **범위 추가 또는 삭제** → `openid`, `email`, `profile` 추가 후 저장.

### 2.3 사용자 인증 정보(키) 만들기

1. **API 및 서비스** → **사용자 인증 정보**.
2. **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**.
3. 애플리케이션 유형: **웹 애플리케이션**.
4. **승인된 리디렉션 URI**에 아래 주소를 **반드시** 추가:
   - 로컬: `http://localhost:3000/api/auth/google/callback`
   - 개발/운영: `https://your-domain.com/api/auth/google/callback`
5. 만들기 후 **클라이언트 ID**와 **클라이언트 보안 비밀**을 복사.

---

## 3. 환경 변수 등록

| 변수 | 설명 | 노출 |
|------|------|------|
| `GOOGLE_CLIENT_ID` | 클라이언트 ID (`.apps.googleusercontent.com` 로 끝남) | 서버 전용 |
| `GOOGLE_CLIENT_SECRET` | 클라이언트 보안 비밀 | 서버 전용 |

### 넣는 위치

- **`.env`** / **`.env.development`** / **`.env.local`**: 개발·테스트용 값
- **`.env.production`**: 운영 도메인 기준으로 사용하는 값
- **`.env.example`**: 변수명만 예시로 기재 (실제 키 값은 넣지 않음)

### 예시

```env
GOOGLE_CLIENT_ID=123456789-xxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4. 프로젝트 내 동작 요약

| 구분 | 경로/역할 |
|------|-----------|
| 로그인 시작 | 사용자가 "구글 로그인" 클릭 → `GET /api/auth/google` → 구글 로그인 페이지로 리다이렉트 |
| 콜백 | 구글 → `GET /api/auth/google/callback?code=...` → 서버가 토큰 교환·회원정보 조회 후 `oauth_` 토큰으로 `/login/oauth-success?token=...` 리다이렉트 |
| 프론트 | `/login/oauth-success`에서 토큰 저장 후 메인(/)으로 이동 |

---

## 5. 테스트 방법

1. **env 설정**: `.env` 또는 `.env.local`에 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 입력.
2. **리디렉션 URI**: Google Console에 `http://localhost:3000/api/auth/google/callback` 등록.
3. **실행**: `npm run dev` 후 브라우저에서 `http://localhost:3000/login` 접속.
4. **구글 로그인** 버튼 클릭 → 구글 계정 선택/로그인 → 동의 후 앱으로 돌아오면 로그인 완료.
5. **실패 시**: `/login?error=...` 로 돌아오면, LoginForm에서 에러 메시지 확인. Console 리디렉션 URI와 서버 로그를 확인.

---

## 6. 참고 링크

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [사용자 인증 정보 (Console)](https://console.cloud.google.com/apis/credentials)
