# 카카오 로그인 (카카오 OAuth 2.0) 연동 가이드

정담(Outstock) 프로젝트에서 **카카오 로그인**을 사용하기 위한 앱 등록, 환경 변수, 테스트 방법을 정리합니다.

---

## 1. 개요

- **방식**: 카카오 OAuth 2.0
- **필요 정보**: REST API 키(Client ID), Client Secret (선택)

---

## 2. 카카오 개발자 콘솔에서 앱 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속 후 로그인.
2. **내 애플리케이션** → **애플리케이션 추가하기**.
3. **앱 키** 탭에서 **REST API 키** 복사 → Client ID로 사용.
4. **제품 설정** → **카카오 로그인** → **활성화** ON.
5. **Redirect URI** 등록: `http://localhost:3000/api/auth/kakao/callback`
6. **동의 항목**에서 이메일, 프로필(닉네임) 필요 시 설정.

---

## 3. 환경 변수 등록

| 변수 | 설명 |
|------|------|
| `KAKAO_CLIENT_ID` | REST API 키 |
| `KAKAO_CLIENT_SECRET` | 시크릿 키 (선택) |

`.env`, `.env.development`, `.env.local`, `.env.production`에 추가.

---

## 4. 테스트 방법

1. env에 `KAKAO_CLIENT_ID` (필수), 필요 시 `KAKAO_CLIENT_SECRET` 입력.
2. 콘솔에 Redirect URI `http://localhost:3000/api/auth/kakao/callback` 등록.
3. `npm run dev` → `http://localhost:3000/login` → **카카오 로그인** 클릭.
4. 카카오 로그인/동의 후 앱으로 돌아오면 로그인 완료.

---

## 5. 참고 링크

- [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [내 애플리케이션](https://developers.kakao.com/console/app)
