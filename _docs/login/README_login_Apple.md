# Apple 로그인 (Sign in with Apple) 연동 가이드

정담(Outstock) 프로젝트에서 **Apple 로그인**을 사용하기 위한 Apple Developer 설정, 환경 변수, 테스트 방법을 정리합니다.

---

## 1. 개요

- **방식**: Sign in with Apple (OAuth 2.0 유사)
- **역할**: 사용자가 Apple ID로 로그인하면, Apple이 인증 후 우리 서버로 `code` 및 `id_token`(JWT)을 **form POST**로 보냅니다. 서버는 `id_token` payload에서 사용자 식별자·이메일을 추출해 앱 전용 토큰을 발급합니다.
- **필요 정보**: Service ID(Client ID), Team ID, Key ID, Private Key (Apple Developer에서 발급)

---

## 2. Apple Developer에서 설정

### 2.1 App ID (Bundle ID)

1. [Apple Developer](https://developer.apple.com/) 로그인 → **Certificates, Identifiers & Profiles** → **Identifiers**.
2. **App IDs**에서 앱용 Bundle ID가 있어야 합니다. 없으면 생성.

### 2.2 Sign in with Apple 활성화

1. 해당 App ID 선택 → **Sign in with Apple** 체크 → **Edit** → **Enable as a primary App ID** 등 설정 후 저장.

### 2.3 Services ID (웹용 Client ID)

1. **Identifiers** → **+** → **Services IDs** 선택.
2. **Description**, **Identifier** 입력 (예: `com.yourcompany.jungdam.service`). 이 **Identifier**가 우리가 쓰는 **Client ID**입니다.
3. **Configure** 클릭:
   - **Domains and Subdomains**: `localhost`(개발), 운영 도메인 (예: `your-domain.com`).
   - **Return URLs**:  
     - 개발: `http://localhost:3000/api/auth/apple/callback`  
     - 운영: `https://your-domain.com/api/auth/apple/callback`
4. 저장 후 **Continue** → **Register**.

### 2.4 키(Key) 생성 (Private Key)

1. **Keys** → **+** → 이름 입력 후 **Sign in with Apple** 체크 → **Configure** → 해당 **Primary App ID** 선택.
2. **Register** 후 **Download**로 `.p8` 파일 받기. **한 번만** 다운로드 가능하므로 안전한 곳에 보관.
3. **Key ID** 확인 (Keys 목록에 표시).

### 2.5 Team ID, Client ID 정리

- **Team ID**: Apple Developer 계정 상단 또는 Membership 메뉴에서 확인.
- **Client ID**: 위에서 만든 **Services ID** (예: `com.yourcompany.jungdam.service`).
- **Key ID**: 방금 만든 키의 Key ID.
- **Private Key**: `.p8` 파일 내용 전체 (-----BEGIN PRIVATE KEY----- ~ -----END PRIVATE KEY-----).

> **참고**: 현재 구현은 콜백에서 **id_token**만 사용해 사용자 정보를 복원합니다. `code`로 서버 간 토큰 교환을 하려면 이 키로 JWT 클라이언트 시크릿을 만들어 Apple 토큰 엔드포인트에 요청하는 추가 구현이 필요합니다. 여기서는 id_token 디코딩만 사용합니다.

---

## 3. 환경 변수 등록

| 변수 | 설명 | 노출 |
|------|------|------|
| `APPLE_CLIENT_ID` | Services ID (Identifier) | 서버 전용 |
| `APPLE_TEAM_ID` | Apple Developer Team ID | 서버 전용 |
| `APPLE_KEY_ID` | Sign in with Apple용 Key ID | 서버 전용 |
| `APPLE_PRIVATE_KEY` | .p8 파일 내용 (줄바꿈은 `\n` 또는 실제 줄바꿈) | 서버 전용 |

### 넣는 위치

- **`.env`** / **`.env.development`** / **`.env.local`**: 개발용
- **`.env.production`**: 운영용
- **`.env.example`**: 변수명만 예시

### 예시

```env
APPLE_CLIENT_ID=com.yourcompany.jungdam.service
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_KEY_ID=YYYYYYYYYY
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
...
-----END PRIVATE KEY-----"
```

멀티라인은 따옴표로 감싸고, 실제 줄바꿈을 넣거나 `\n`으로 이스케이프합니다.

---

## 4. 프로젝트 내 동작 요약

| 구분 | 경로/역할 |
|------|-----------|
| 로그인 시작 | "Apple 로그인" 클릭 → `GET /api/auth/apple` → Apple 로그인 페이지로 리다이렉트 |
| 콜백 | Apple → **POST** `/api/auth/apple/callback` (form_post, `code`, `id_token`, `user` 등) → 서버가 `id_token` 디코딩 후 `/login/oauth-success?token=...` 리다이렉트 |

---

## 5. 테스트 방법

1. **env 설정**: `.env` 또는 `.env.local`에 `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` 입력.
2. **Return URL**: Apple Developer에 `http://localhost:3000/api/auth/apple/callback` 등록. (로컬 테스트 시 도메인은 `localhost`.)
3. **실행**: `npm run dev` → `http://localhost:3000/login` → **Apple 로그인** 클릭.
4. Apple ID 로그인/동의 후 앱으로 돌아오면 로그인 완료.
5. **실패 시**: `/login?error=...` 로 돌아오면 에러 메시지 확인. Return URL, Services ID, 키 설정을 재확인.

### 주의

- Apple은 **운영 환경**에서 **HTTPS** 및 **등록된 Return URL**만 허용합니다.
- 로컬은 `http://localhost` 가능하지만, Return URL에 `http://localhost:3000/api/auth/apple/callback`을 정확히 넣어야 합니다.

---

## 6. 참고 링크

- [Sign in with Apple (웹)](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js)
- [Apple Developer](https://developer.apple.com/)
