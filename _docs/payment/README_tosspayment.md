# 토스페이먼츠 간편결제 연동 가이드

이 문서는 정담(Outstock) 프로젝트에 토스페이먼츠 결제창(카드/간편결제)을 연동하는 방법, 환경 변수 설정, 테스트 방법을 정리합니다.

---

## 1. 토스페이먼츠 개발자센터 가입

1. **회원가입**
   - [토스페이먼츠 개발자센터](https://developers.tosspayments.com/) 접속 후 **회원가입** 클릭.
   - 또는 [회원가입 페이지](https://app.tosspayments.com/signup)에서 **이메일**만으로 가입 가능합니다.
   - 사업자번호 없이도 **테스트 키**로 결제 연동 테스트가 가능합니다.

2. **로그인**
   - 가입한 이메일로 [로그인](https://developers.tosspayments.com/signin) 후 개발자센터를 사용합니다.

---

## 2. API 키 발급 및 확인

1. **API 키 페이지 이동**
   - 로그인 후 **[API 키](https://developers.tosspayments.com/my/api-keys)** 메뉴로 이동합니다.

2. **키 종류**
   - **테스트 키** (개발/테스트용)
     - `test_ck_...` (클라이언트 키)
     - `test_sk_...` (시크릿 키)
     - 실제 결제가 발생하지 않으며, 회원가입만 해도 발급됩니다.
   - **라이브 키** (실서비스용)
     - `live_ck_...`, `live_sk_...`
     - 전자결제 신청·상점 개설 후 사용합니다.

3. **클라이언트 키 / 시크릿 키**
   - **클라이언트 키**: 브라우저에서 결제창 SDK 초기화 시 사용. 프론트에 노출되어도 됨.
   - **시크릿 키**: 서버에서 결제 승인 API 호출 시 사용. **반드시 서버만 사용, 외부 노출 금지.**

---

## 3. 프로젝트에 키 등록 (환경 변수)

다음 환경 변수를 각 env 파일에 넣습니다.

| 변수명 | 설명 | 노출 |
|--------|------|------|
| `NUXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY` | 클라이언트 키 (결제창 호출용) | 클라이언트 O |
| `TOSSPAYMENTS_SECRET_KEY` | 시크릿 키 (결제 승인 API용) | 서버 전용 |

### 3.1 넣는 위치

- **`.env`**  
  기본값. 테스트 키 예시를 넣어 두면 로컬에서 바로 테스트 가능.

- **`.env.development`**  
  `nuxt dev` 시 사용. 개발 시 테스트 키 사용.

- **`.env.local`**  
  로컬 오버라이드용 (`.gitignore` 대상). 본인 테스트 키를 여기 넣어 두면 됨.

- **`.env.production`**  
  운영 빌드/실서비스 시 사용. **라이브 키**로 교체 후 배포.

- **`.env.example`**  
  팀원용 예시. 실제 키 값은 넣지 말고, 변수명과 주석만 유지.

### 3.2 예시 (테스트 키)

```env
# 토스페이먼츠 (테스트 키)
NUXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TOSSPAYMENTS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

실제 값은 개발자센터 [API 키](https://developers.tosspayments.com/my/api-keys)에서 복사해 넣습니다.

### 3.3 예시 (운영용)

```env
# 토스페이먼츠 (라이브 키)
NUXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=live_ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TOSSPAYMENTS_SECRET_KEY=live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4. 테스트 방법

### 4.1 사전 준비

1. `.env` 또는 `.env.local`에 **테스트** 클라이언트 키·시크릿 키를 넣었는지 확인.
2. `npm run dev` (또는 `nuxt dev`)로 앱 실행.
3. 장바구니에 상품을 넣고 **주문/결제** 페이지(`/checkout`)로 이동.

### 4.2 결제 플로우

1. **주문하기** 버튼 클릭  
   - 주문 합계(장바구니 소계 + 선택한 배송비)가 0원보다 크고, 클라이언트 키가 설정되어 있으면 토스페이먼츠 결제창이 열립니다.

2. **결제창에서 테스트 결제**
   - 테스트 환경에서는 토스페이먼츠에서 제공하는 **테스트 카드/간편결제**로 결제할 수 있습니다.
   - 자세한 테스트 카드 번호·비밀번호 등은 [토스페이먼츠 결제 테스트 가이드](https://docs.tosspayments.com/guides/v2/test-card)를 참고하세요.

3. **성공 시**
   - `successUrl`로 리다이렉트되며, 이 프로젝트에서는 `/checkout/success?paymentKey=...&orderId=...&amount=...` 형태입니다.
   - 성공 페이지에서 서버 API `/api/payments/confirm`를 호출해 **결제 승인**을 수행하고, 승인 완료 시 "결제가 완료되었습니다" 메시지를 표시합니다.

4. **실패 시**
   - `failUrl`로 리다이렉트되며, `/checkout/fail?code=...&message=...` 형태입니다.
   - 실패 페이지에서 에러 코드와 메시지를 확인할 수 있습니다.

### 4.3 테스트 시 유의사항

- **테스트 키**를 사용하는 동안에는 실제 결제(실제 청구)가 이루어지지 않습니다.
- 클라이언트 키가 비어 있으면 "결제 설정이 없습니다" 알림이 뜨며, 결제창이 열리지 않습니다.
- 주문 합계가 0원 이하이면 "주문 금액을 확인해 주세요" 알림이 뜹니다.
- 시크릿 키가 없거나 잘못되면 결제 성공 리다이렉트 후 "결제 승인 처리에 실패했습니다"가 나올 수 있으므로, 서버 env에 시크릿 키가 올바르게 설정되었는지 확인하세요.

---

## 5. 프로젝트 내 연동 요약

| 구분 | 경로/역할 |
|------|-----------|
| 결제창 호출 | 체크아웃 폼 제출 시 `app/components/checkout/CheckoutArea.vue` → `useTossPayments()` → `requestCardPayment()` |
| 결제 승인 API | `server/api/payments/confirm.post.ts` (시크릿 키 사용) |
| 성공 페이지 | `app/pages/checkout/success.vue` (쿼리로 받은 paymentKey, orderId, amount로 승인 API 호출) |
| 실패 페이지 | `app/pages/checkout/fail.vue` (code, message 표시) |
| 환경 변수 노출 | `nuxt.config.ts`의 `runtimeConfig.public.tossPaymentClientKey`, `runtimeConfig.tossPaymentsSecretKey` |

---

## 6. 참고 링크

- [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)
- [API 키 관리](https://developers.tosspayments.com/my/api-keys)
- [결제창 연동 가이드](https://docs.tosspayments.com/guides/v2/get-started/payment-flow)
- [결제 승인 API](https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8)
- [테스트 카드 정보](https://docs.tosspayments.com/guides/v2/test-card)
