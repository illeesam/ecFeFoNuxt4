-- 메뉴 (menuData.ts) → sy_menu_tree
-- 상하 관계: 1차 메뉴 → dropdownItems → dropdownMenu(쇼핑만)
-- menu_id=1 홈(7개), 2 쇼핑(메가메뉴 3그룹·각 그룹 하위 7개), 3 블로그(7개), 4 페이지(7개), 5 문의하기(드롭다운 없음)
INSERT INTO db2603ec.sy_menu_tree (menu_id, link, title, has_dropdown, megamenu, dropdown_items) VALUES
(1, '/', '홈', true, false,
 '[
  {"link":"/","title":"홈 스타일 1"},
  {"link":"/home-2","title":"홈 스타일 2"},
  {"link":"/home-3","title":"홈 스타일 3"},
  {"link":"/home-4","title":"홈 스타일 4"},
  {"link":"/home-5","title":"홈 스타일 5"},
  {"link":"/home-6","title":"홈 스타일 6"},
  {"link":"/home-7","title":"홈 스타일 7"}
 ]'::jsonb),
(2, '/shop', '쇼핑', true, true,
 '[
  {"link":"/shop","title":"쇼핑 페이지","dropdownMenu":[
   {"link":"/shop","title":"기본 쇼핑"},
   {"link":"/shop-right","title":"쇼핑 (우측 사이드바)"},
   {"link":"/shop-4-col","title":"쇼핑 4단"},
   {"link":"/shop-3-col","title":"쇼핑 3단"},
   {"link":"/shop","title":"쇼핑 페이지"},
   {"link":"/shop","title":"쇼핑 페이지"},
   {"link":"/shop","title":"쇼핑 무한스크롤"}
  ]},
  {"link":"/shop","title":"상품 페이지","dropdownMenu":[
   {"link":"/product-details","title":"상품 상세"},
   {"link":"/product-details","title":"상품 페이지 V2"},
   {"link":"/product-details","title":"상품 페이지 V3"},
   {"link":"/product-details","title":"상품 페이지 V4"},
   {"link":"/product-details","title":"단일 상품"},
   {"link":"/product-details","title":"옵션 상품"},
   {"link":"/product-details","title":"외부 상품"}
  ]},
  {"link":"/shop","title":"기타 쇼핑","dropdownMenu":[
   {"link":"/wishlist","title":"위시리스트"},
   {"link":"/compare","title":"비교"},
   {"link":"/cart","title":"장바구니"},
   {"link":"/checkout","title":"주문/결제"},
   {"link":"/register","title":"회원가입"},
   {"link":"/login","title":"로그인"}
  ]}
 ]'::jsonb),
(3, '/blog', '블로그', true, false,
 '[
  {"link":"/blog","title":"블로그"},
  {"link":"/blog-left-sidebar","title":"블로그 (좌측 사이드바)"},
  {"link":"/blog-no-sidebar","title":"블로그 (사이드바 없음)"},
  {"link":"/blog-2-col","title":"블로그 2단"},
  {"link":"/blog-2-col-mas","title":"블로그 2단 메이슨리"},
  {"link":"/blog-3-col","title":"블로그 3단"},
  {"link":"/blog-details","title":"블로그 상세"}
 ]'::jsonb),
(4, '/shop', '페이지', true, false,
 '[
  {"link":"/wishlist","title":"위시리스트"},
  {"link":"/cart","title":"장바구니"},
  {"link":"/checkout","title":"주문/결제"},
  {"link":"/account","title":"마이페이지"},
  {"link":"/register","title":"회원가입"},
  {"link":"/login","title":"로그인"},
  {"link":"/404","title":"오류 404"}
 ]'::jsonb),
(5, '/contact', '문의하기', false, false, NULL);
