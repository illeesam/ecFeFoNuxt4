# README_02 - 프로젝트 기능 정보

## 1. 페이지 구성 (라우팅)

| 경로 | 설명 |
|------|------|
| `/` | 메인 (index) - 히어로, 카테고리, 트렌딩 상품, 배너, 블로그, 구독 |
| `/home-2` ~ `/home-7` | 메인 변형 (다양한 레이아웃/슬라이더) |
| `/shop` | 쇼핑몰 목록 (사이드바) |
| `/shop-3-col`, `/shop-4-col` | 3열/4열 상품 그리드 |
| `/shop-right` | 사이드바 오른쪽 배치 |
| `/product-details/[id]` | 상품 상세 |
| `/cart` | 장바구니 |
| `/wishlist` | 위시리스트 |
| `/compare` | 상품 비교 |
| `/checkout` | 주문/결제 |
| `/login`, `/register` | 로그인·회원가입 |
| `/account` | 마이페이지(프로필) |
| `/blog`, `/blog-2-col`, `/blog-3-col` 등 | 블로그 목록/레이아웃 |
| `/contact` | 문의하기 |
| `/404` | 404 페이지 |

## 2. 핵심 기능

### 2.1 상품

- **목록**: 카테고리·가격·색상·사이즈·브랜드 필터, 정렬(신상품/인기/가격 등)
- **상세**: 이미지, 옵션, 수량, 장바구니/위시리스트 담기, 리뷰 폼
- **상태**: Pinia `useProductsStore` (products, filterProducts, 필터/정렬 액션)

### 2.2 장바구니·위시리스트

- **장바구니**: 담기/수량 변경/삭제, 합계, localStorage 연동
- **위시리스트**: 찜하기/해제
- **상태**: `useCartStore`, `useWishlist`

### 2.3 결제·주문

- **체크아웃**: 배송지, 청구 정보, 주문 요약
- **컴포넌트**: CheckoutArea, BillingDetails, OrderArea 등

### 2.4 회원·프로필

- **로그인/회원가입**: LoginForm, RegisterArea
- **마이페이지**: 프로필 보기/수정, 비밀번호 변경 (ProfileArea, ProfileEditForm 등)

### 2.5 블로그

- **목록**: 표준/2열/3열/메이슨리 레이아웃
- **상세**: BlogDetailsArea, 댓글/리뷰 폼

### 2.6 기타

- **레이아웃**: 7종 레이아웃, 헤더/푸터/메뉴 조합
- **공통**: 검색 팝업, 상품 모달, 비디오 모달, BackToTop, 토스트 알림

## 3. 데이터·상태

- **상품/블로그 목록**: `app/data/` (productData.js, blog-data.ts) — 필요 시 API 연동으로 교체 가능
- **상태**: Pinia 스토어 (products, cart, wishlist)
- **폼 검증**: VeeValidate + Yup

## 4. UI/UX

- 반응형 (Tailwind 브레이크포인트)
- 그리드/리스트 뷰 전환 (쇼핑몰)
- 페이지네이션 (Pagination.vue)
- 토스트 알림 (vue3-toastify)
