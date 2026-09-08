# 로그인 인증 + Redis 연동 가이드

정담(Outstock) 프로젝트에서 **로그인·로그아웃·인증 정보 조회·토큰 보관·리프레시 토큰 보관**을 Redis와 연동하는 방법을 정리합니다.

---

## 1. 개요

- **Redis 사용 여부**: `USE_REDIS=true` 로 설정하면 로그인 세션과 리프레시 토큰을 Redis에 보관합니다. `false`(기본)이면 JWT만 사용하며 Redis에 저장하지 않습니다.
- **기능**:
  - **로그인**: 이메일/비밀번호 검증 → 액세스 토큰(JWT) + (Redis 사용 시) 리프레시 토큰 발급, 세션·리프레시를 Redis에 저장.
  - **로그아웃**: Bearer 토큰으로 요청 시 Redis에서 해당 세션·리프레시 토큰 삭제, 클라이언트 토큰 제거.
  - **인증 정보 가져오기**: `GET /api/auth/me` — Bearer 토큰으로 사용자 정보 반환. Redis 사용 시 세션에서 조회.
  - **토큰 보관**: 클라이언트는 액세스 토큰을 `localStorage` + 쿠키에 저장.
  - **리프레시 토큰 보관**: Redis 사용 시 리프레시 토큰을 클라이언트 `localStorage`에 저장하고, 액세스 토큰 만료 시 `POST /api/auth/refresh`로 새 토큰 발급.

---

## 2. 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `USE_REDIS` | Redis 사용 여부 (`true` / `false` 또는 `1` / `0`) | `false` |
| `REDIS_URL` | Redis 연결 URL | `redis://localhost:6379` |
| `AUTH_JWT_SECRET` | JWT 서명용 시크릿 (로그인/리프레시 토큰 발급에 필수) | (없음) |
| `AUTH_ACCESS_TOKEN_TTL_MINUTES` | 액세스 토큰(JWT) 유효 시간(분) | `15` |
| `AUTH_REFRESH_TOKEN_TTL_DAYS` | 리프레시 토큰·세션 유효 시간(일). Redis 세션/리프레시 키 TTL | `7` |

- **액세스 토큰**: 15분이 지나면 만료되며, 클라이언트는 리프레시 토큰으로 `/api/auth/refresh` 호출해 새 액세스·리프레시 토큰을 받습니다.
- **리프레시 토큰·세션**: 7일 동안 유효하며, Redis에 보관된 세션·리프레시 키도 동일한 7일 TTL이 적용됩니다.

### 넣는 위치

- **`.env`** / **`.env.development`** / **`.env.local`** / **`.env.production`** 에 추가.
- **`.env.example`** 에는 변수명만 예시로 기재.

### 예시

```env
# Redis 미사용 (JWT만 사용)
USE_REDIS=false
REDIS_URL=redis://localhost:6379
AUTH_JWT_SECRET=your-secret-key-min-32-chars
AUTH_ACCESS_TOKEN_TTL_MINUTES=15
AUTH_REFRESH_TOKEN_TTL_DAYS=7

# Redis 사용 (세션·리프레시 토큰 보관)
USE_REDIS=true
REDIS_URL=redis://localhost:6379
AUTH_JWT_SECRET=your-secret-key-min-32-chars
AUTH_ACCESS_TOKEN_TTL_MINUTES=15
AUTH_REFRESH_TOKEN_TTL_DAYS=7
```

**주의**: `AUTH_JWT_SECRET`은 반드시 설정해야 합니다. 비어 있으면 `/api/auth/login`이 500을 반환합니다.

---

## 3. Redis 설정 (USE_REDIS=true 일 때)

### 3.1 Redis 설치 및 실행

- **로컬**: [Redis 다운로드](https://redis.io/download) 후 `redis-server` 실행.
- **Docker**: `docker run -d -p 6379:6379 redis`
- **Windows**: WSL2 또는 Redis for Windows 사용.

### 3.2 REDIS_URL 형식

- 기본: `redis://localhost:6379`
- 비밀번호: `redis://:password@localhost:6379`
- 원격: `redis://host:6379/0`

---

## 4. API 요약

| API | 방법 | 설명 |
|-----|------|------|
| `/api/auth/login` | POST | body: `{ email, password }` → `{ token, refreshToken?, user }` |
| `/api/auth/logout` | POST | Header: `Authorization: Bearer <token>` → Redis에서 세션·리프레시 삭제 후 `{ ok: true }` |
| `/api/auth/me` | GET | Header: `Authorization: Bearer <token>` → 사용자 정보 반환 |
| `/api/auth/refresh` | POST | body: `{ refreshToken }` → Redis 사용 시에만 새 `token`·`refreshToken`·`user` 반환 |

- **로그인**: 데모 계정 `demo1@mail.com` ~ `demo99@mail.com` / 비밀번호 `123456` 으로 테스트 가능.
- **Redis 미사용**: `login`은 JWT만 반환(`refreshToken` 없음). `me`는 JWT payload에서 사용자 복원. `refresh`는 400. `logout`은 Redis 미사용이면 서버 저장소 삭제 없이 `{ ok: true }`만 반환.

---

## 5. 클라이언트 동작 (Auth Store)

- **토큰 보관**: 로그인 성공 시 `auth_token`을 `localStorage`와 쿠키에 저장.
- **리프레시 토큰 보관**: API가 `refreshToken`을 주면 `auth_refresh_token`을 `localStorage`에 저장.
- **인증 정보 가져오기**: `loadStAuthInfo()` — 데모/OAuth 토큰은 로컬에서 복원, API(JWT) 토큰은 `/api/auth/me` 호출. 401이면 `auth_refresh_token`으로 `/api/auth/refresh` 호출 후 새 토큰 저장하고 `/api/auth/me` 재시도.
- **로그아웃**: `setStLogout()` — API 토큰(JWT)이면 `POST /api/auth/logout` 호출 후, `auth_token`·`auth_refresh_token`·쿠키 제거.

---

## 6. Redis 키 구조 (참고)

- **세션**: `auth:session:<sessionId>` → `{ user, refreshToken }` (JSON), TTL **7일** (`AUTH_REFRESH_TOKEN_TTL_DAYS`).
- **리프레시**: `auth:refresh:<refreshToken>` → `{ sessionId, userId, email }` (JSON), TTL **7일** (`AUTH_REFRESH_TOKEN_TTL_DAYS`).

로그아웃 시 해당 세션 키와 연결된 리프레시 키가 삭제됩니다.

---

## 7. 테스트 방법

### 7.1 Redis 없이 (USE_REDIS=false)

1. `.env`에 `USE_REDIS=false`, `AUTH_JWT_SECRET=test-secret-at-least-32-characters-long` 설정.
2. `npm run dev` 후 `/login`에서 `demo1@mail.com` / `123456` 로 로그인.
3. 로그인 성공 시 토큰만 발급되고, `/api/auth/me`로 사용자 정보 조회 가능.
4. 로그아웃 시 클라이언트만 토큰 제거(Redis 없음).

### 7.2 Redis 사용 (USE_REDIS=true)

1. Redis 서버 실행 (`redis-server` 또는 Docker).
2. `.env`에 `USE_REDIS=true`, `REDIS_URL=redis://localhost:6379`, `AUTH_JWT_SECRET=...` 설정.
3. `npm run dev` 후 `/login`에서 `demo1@mail.com` / `123456` 로 로그인.
4. 응답에 `token`과 `refreshToken`이 포함되는지 확인.
5. `redis-cli KEYS "auth:*"` 로 세션·리프레시 키가 생겼는지 확인.
6. 로그아웃 후 동일 키가 삭제되었는지 확인.
7. 액세스 토큰 만료 후(또는 수동으로 토큰 삭제 후) 새로고침 시 리프레시로 새 토큰 발급되는지 확인.

### 7.3 API 직접 호출 예시

```bash
# 로그인
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo1@mail.com","password":"123456"}'

# 인증 정보 (위에서 받은 token 사용)
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <token>"

# 로그아웃
curl -X POST http://localhost:3000/api/auth/logout -H "Authorization: Bearer <token>"

# 리프레시 (Redis 사용 시)
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

## 8. 토큰 유효 시간 요약

| 구분 | 환경 변수 | 기본값 | 비고 |
|------|-----------|--------|------|
| 액세스 토큰 | `AUTH_ACCESS_TOKEN_TTL_MINUTES` | **15분** | JWT 만료 시간. 만료 후 리프레시로 갱신. |
| 리프레시 토큰·세션 | `AUTH_REFRESH_TOKEN_TTL_DAYS` | **7일** | Redis 세션/리프레시 키 TTL. |

---

## 9. 참고

- Redis 미사용 시에도 `AUTH_JWT_SECRET`은 필요합니다 (로그인·me 검증용).
- 리프레시 토큰은 **Redis 사용 시에만** 발급·갱신됩니다.
- 데모 계정·OAuth 로그인은 기존처럼 클라이언트에서만 처리되며, Redis 세션에는 저장되지 않습니다. API 로그인(`/api/auth/login`)을 통한 토큰만 Redis와 연동됩니다.
