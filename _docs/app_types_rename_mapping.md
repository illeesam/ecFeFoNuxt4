# app/types 파일 이름 변경 매핑

아래는 `app/types/` 내 타입 파일의 이전 이름 → 새 이름 매핑입니다.
(접두사: mb=회원, sy=시스템, co=공통/콘텐츠, or=주문, pd=상품, dv=배송)

| 이전 파일명 | 새 파일명 |
|------------|----------|
| addrType.ts | mbAddrType.ts |
| authType.ts | syAuthType.ts |
| blogType.ts | coBlogType.ts |
| brandType.ts | coBrandType.ts |
| cartType.ts | orCartType.ts (→ orCartItemType.ts + orCartStateType.ts) |
| categoryTreeType.ts | coCategoryTreeType.ts |
| categoryType.ts | coCategoryType.ts |
| claimItemType.ts | orClaimItemType.ts |
| claimType.ts | orClaimType.ts |
| codeType.ts | syCodeType.ts |
| deliveryItemType.ts | dvDeliveryItemType.ts |
| deliveryType.ts | dvDeliveryType.ts |
| HeroSliderDataType.ts | coHeroSliderDataType.ts + coHeroSliderDataTypeTwo.ts + coHeroSliderDataTypeThree.ts |
| inquiryType.ts | coInquiryType.ts + coContactInfoItemType.ts |
| loginType.ts | syLoginType.ts (→ syLoginFormType.ts + syCheckoutLoginFormType.ts) |
| memberType.ts | mbMemberType.ts |
| menuTreeType.ts | syMenuTreeType.ts |
| optionType.ts | pdOptionType.ts |
| orderItemType.ts | orOrderItemType.ts |
| orderType.ts | orOrderType.ts |
| paymentType.ts | orPaymentType.ts |
| productType.ts | pdProductType.ts |
| reviewType.ts | pdReviewType.ts |
| userType.ts | syUserType.ts |
| wishlistType.ts | mbWishlistType.ts (→ mbWishlistItemType.ts + mbWishlistStateType.ts) |

**인터페이스 명 = 파일명 기준 PascalCase** (예: mbAddrType.ts → `MbAddrType`, pdProductType.ts → `PdProductType`).  
**파일당 인터페이스 1개**로 통일되어, 복합 타입은 아래처럼 분리됨.

| 추가된 파일 | 인터페이스 |
|------------|-----------|
| mbRegisterFormType.ts | MbRegisterFormType |
| mbWishlistItemType.ts | MbWishlistItemType (type alias of PdProductType) |
| mbWishlistStateType.ts | MbWishlistStateType |
| orCartItemType.ts | OrCartItemType |
| orCartStateType.ts | OrCartStateType |
| coContactInfoItemType.ts | CoContactInfoItemType |
| coInquiryType.ts | CoInquiryType |
| syLoginFormType.ts | SyLoginFormType |
| syCheckoutLoginFormType.ts | SyCheckoutLoginFormType |
| coHeroSliderDataTypeTwo.ts | CoHeroSliderDataTypeTwo |
| coHeroSliderDataTypeThree.ts | CoHeroSliderDataTypeThree |

삭제된 파일: orCartType.ts, mbWishlistType.ts, syLoginType.ts (위 분리 파일로 대체)

import 경로 예: `~/types/productType` → `~/types/pdProductType`, 타입명 `ProductType` → `PdProductType`
