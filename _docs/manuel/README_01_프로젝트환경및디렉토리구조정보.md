# README_01 - 프로젝트 환경 및 디렉토리 구조 정보

## 1. 프로젝트 개요

- **프로젝트명**: Outstock - Vue/Nuxt 이커머스 템플릿
- **타입**: 프론트엔드 SPA/SSR (Nuxt 4)
- **용도**: 전자상거래(쇼핑몰) 프론트엔드 템플릿

## 2. 기술 스택 (프로젝트 환경)

| 구분 | 기술 | 버전/비고 |
|------|------|-----------|
| 런타임 | Node.js | 20.x 권장 (LTS) |
| 프레임워크 | Nuxt | 4.x (compatibilityVersion: 4) |
| UI 프레임워크 | Vue | 3.x (Nuxt 내장) |
| 스타일 | Tailwind CSS | @nuxtjs/tailwindcss 6.x |
| 스타일 보조 | Sass (SCSS) | 1.58.x |
| 상태관리 | Pinia | 3.x (@pinia/nuxt) |
| 폼/검증 | VeeValidate, Yup | 4.x, 1.x |
| 기타 UI | vue3-carousel, vue3-toastify, @vueform/slider 등 | - |

## 3. 디렉토리 구조

```
outstock_vue_nuxt4_tailwind/
├── app/
│   ├── assets/           # 정적 에셋 (SCSS, 이미지 등)
│   │   └── scss/         # 전역 스타일 (_variables, _common, main 등)
│   ├── components/       # Vue 컴포넌트
│   │   ├── hero-banner/  # 메인 히어로 슬라이더
│   │   ├── category/     # 카테고리 영역
│   │   ├── products/     # 상품 관련 (ProductItem, SaleOff 등)
│   │   ├── shop/         # 쇼핑몰 (ShopArea, ShopSidebar, 필터 위젯)
│   │   ├── shop-details/ # 상품 상세 (RelatedProducts 등)
│   │   ├── cart-wishlists/# 장바구니·위시리스트
│   │   ├── checkout/     # 결제·주문
│   │   ├── blogs/        # 블로그 영역
│   │   ├── forms/        # 로그인, 리뷰, 프로필 등 폼
│   │   ├── login-register/
│   │   ├── profile/      # 마이페이지
│   │   ├── contact/      # 문의
│   │   ├── common/       # 공통 (모달, BackToTop 등)
│   │   └── ...
│   ├── composables/      # Nuxt 컴포저블 (usePrice 등)
│   ├── data/             # 정적 데이터 (productData, blog-data 등)
│   ├── layout/           # 레이아웃
│   │   ├── Layout.vue, LayoutTwo.vue ~ LayoutSeven.vue
│   │   ├── headers/      # HeaderOne ~ HeaderThree
│   │   ├── footers/      # FooterOne ~ FooterThree
│   │   └── Menus.vue
│   ├── mixins/           # 믹스인 (menuData 등)
│   ├── pages/            # 파일 기반 라우팅
│   ├── plugins/          # Nuxt 플러그인 (toastify, masonry 등)
│   ├── store/            # Pinia 스토어 (useCart, useProducts, useWishlist)
│   ├── types/            # TypeScript 타입 정의
│   └── ui/               # UI 공통 컴포넌트 (Pagination 등)
├── docs/                 # 문서 (본 README 시리즈, 메뉴얼)
├── scripts/              # 유틸 스크립트
├── nuxt.config.ts        # Nuxt 설정
├── tailwind.config.ts    # Tailwind 설정
├── tsconfig.json
└── package.json
```

## 4. 주요 설정 파일

- **nuxt.config.ts**: Nuxt 설정 (CSS, 모듈, app.head, compatibilityVersion 등)
- **tailwind.config.ts**: Tailwind 테마/플러그인
- **package.json**: 의존성 및 스크립트 (dev, build, generate, preview)

## 5. 참고

- Nuxt 4 호환 모드 사용 (`future.compatibilityVersion: 4`).
- 라우팅은 `app/pages/` 디렉토리 구조에 따라 자동 생성됩니다.
