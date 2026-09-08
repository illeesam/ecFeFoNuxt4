<template>
  <div ref="panelRef" class="fp-panel fp-panel--page" :class="{ 'fp-panel--collapsed': !dropdownOpen, 'fp-panel--docked': isPanelsLocked }" :style="isPanelsLocked ? {} : panelStyle" @wheel.stop>
    <!-- select처럼 한 줄: 라벨 + 펼치기 아이콘 클릭 시 드롭다운 -->
    <div class="fp-header fp-header--select" :class="{ 'fp-header--docked': isPanelsLocked }" @pointerdown="!isPanelsLocked && startDrag($event)">
      <span class="fp-title">페이지</span>
      <span class="fp-page-expand-icon" :class="{ 'fp-page-expand-icon--open': dropdownOpen }" title="펼치기" @mousedown.stop @click.stop="dropdownOpen = !dropdownOpen">
        {{ dropdownOpen ? "▲" : "▼" }}
      </span>
    </div>

    <div v-show="dropdownOpen" class="fp-page-body">
      <div class="fp-page-search-bar">
        <input v-model="searchQuery" type="text" class="fp-page-search" placeholder="검색 (경로·타이틀)" />
      </div>
      <SelectTree
        :items="rootTreeItems"
        :search-query="searchQuery"
        view-mode="tree"
        :initial-expanded-ids="rootExpandedIds"
        @select="onSelect"
      />
    </div>

    <div v-show="dropdownOpen" class="fp-resize-handle" @mousedown.stop="startResize">⤡</div>
  </div>
</template>

<script setup lang="ts">
import type { SelectTreeItem } from "~/components/ui/SelectTree.vue";
import SelectTree from "~/components/ui/SelectTree.vue";

const { isPanelsLocked } = useXdevPanelsState();

const dropdownOpen = ref(false);
const searchQuery = ref("");
const router = useRouter();

const rootExpandedIds = ["folder:root-components", "folder:root-pages"];

function pathToTitle(path: string): string {
  const segment = path.replace(/^\//, "").split("/").filter(Boolean).pop() ?? "index";
  if (segment === "index" || segment === "") return "홈";
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

function pathToPathLabel(path: string): string {
  const segments = path.replace(/^\//, "").split("/").filter(Boolean);
  if (segments.length === 0) return "pages / index";
  return "pages / " + segments.join(" / ");
}

// pages 폴더 구조에 맞는 트리 (파일 경로 기준)
const PAGES_FILE_MAP: { filePath: string; routePath: string }[] = [
  { filePath: "index.vue", routePath: "/" },
  { filePath: "404.vue", routePath: "/404" },
  { filePath: "contact.vue", routePath: "/contact" },
  { filePath: "login.vue", routePath: "/login" },
  { filePath: "login/oauth-success.vue", routePath: "/login/oauth-success" },
  { filePath: "register.vue", routePath: "/register" },
  { filePath: "account.vue", routePath: "/account" },
  { filePath: "cart.vue", routePath: "/cart" },
  { filePath: "checkout.vue", routePath: "/checkout" },
  { filePath: "checkout/success.vue", routePath: "/checkout/success" },
  { filePath: "checkout/fail.vue", routePath: "/checkout/fail" },
  { filePath: "compare.vue", routePath: "/compare" },
  { filePath: "wishlist.vue", routePath: "/wishlist" },
  { filePath: "shop.vue", routePath: "/shop" },
  { filePath: "shop-right.vue", routePath: "/shop-right" },
  { filePath: "shop-3-col.vue", routePath: "/shop-3-col" },
  { filePath: "shop-4-col.vue", routePath: "/shop-4-col" },
  { filePath: "blog.vue", routePath: "/blog" },
  { filePath: "blog-2-col.vue", routePath: "/blog-2-col" },
  { filePath: "blog-3-col.vue", routePath: "/blog-3-col" },
  { filePath: "blog-no-sidebar.vue", routePath: "/blog-no-sidebar" },
  { filePath: "blog-left-sidebar.vue", routePath: "/blog-left-sidebar" },
  { filePath: "blog-2-col-mas.vue", routePath: "/blog-2-col-mas" },
  { filePath: "blog-details/index.vue", routePath: "/blog-details" },
  { filePath: "blog-details/[id].vue", routePath: "/blog-details/:id" },
  { filePath: "product-details/index.vue", routePath: "/product-details" },
  { filePath: "product-details/[id].vue", routePath: "/product-details/:id" },
  { filePath: "home-2.vue", routePath: "/home-2" },
  { filePath: "home-3.vue", routePath: "/home-3" },
  { filePath: "home-4.vue", routePath: "/home-4" },
  { filePath: "home-5.vue", routePath: "/home-5" },
  { filePath: "home-6.vue", routePath: "/home-6" },
  { filePath: "home-7.vue", routePath: "/home-7" },
  // adminEc (이커머스 관리)
  { filePath: "adminEc/index.vue", routePath: "/adminEc" },
  { filePath: "adminEc/members/index.vue", routePath: "/adminEc/members" },
  { filePath: "adminEc/members/[id].vue", routePath: "/adminEc/members/:id" },
  { filePath: "adminEc/products/index.vue", routePath: "/adminEc/products" },
  { filePath: "adminEc/products/[id].vue", routePath: "/adminEc/products/:id" },
  { filePath: "adminEc/orders/index.vue", routePath: "/adminEc/orders" },
  { filePath: "adminEc/orders/[id].vue", routePath: "/adminEc/orders/:id" },
  // adminSy (시스템 관리)
  { filePath: "adminSy/users/index.vue", routePath: "/adminSy/users" },
  { filePath: "adminSy/users/[id].vue", routePath: "/adminSy/users/:id" },
  { filePath: "adminSy/notices/index.vue", routePath: "/adminSy/notices" },
  { filePath: "adminSy/notices/[id].vue", routePath: "/adminSy/notices/:id" },
  { filePath: "adminSy/menus/index.vue", routePath: "/adminSy/menus" },
  { filePath: "adminSy/menus/[id].vue", routePath: "/adminSy/menus/:id" },
  { filePath: "adminSy/codes/index.vue", routePath: "/adminSy/codes" },
  // adminCo (공통업무)
  { filePath: "adminCo/login.vue", routePath: "/adminCo/login" },
  { filePath: "adminCo/sites/index.vue", routePath: "/adminCo/sites" },
  { filePath: "adminCo/sites/[id].vue", routePath: "/adminCo/sites/:id" },
  // popupAdmin
  { filePath: "popupAdmin/sy/menuSelPopup.vue", routePath: "/popupAdmin/sy/menuSelPopup" },
  // xdev
  { filePath: "xdev-open-comp.vue", routePath: "/xdev-open-comp" },
];

function buildPagesTree(): SelectTreeItem[] {
  const leaves: SelectTreeItem[] = [];
  const dirMap = new Map<string, SelectTreeItem>();
  for (const { filePath, routePath } of PAGES_FILE_MAP) {
    const segments = filePath.replace(/\.vue$/, "").split("/");
    const title = pathToTitle(routePath);
    const pathLabel = "pages / " + segments.join(" / ");
    const id = routePath || "index";
    const item: SelectTreeItem = { id, path: routePath, title, pathLabel };
    if (segments.length === 1) {
      leaves.push(item);
    } else {
      const dir = segments[0]!;
      if (!dirMap.has(dir)) {
        dirMap.set(dir, {
          id: `pages-${dir}`,
          path: "",
          title: dir.replace(/-/g, " "),
          pathLabel: `pages / ${dir}`,
          children: [],
        });
      }
      dirMap.get(dir)!.children!.push(item);
    }
  }
  const dirOrder = [
    "index", "404", "contact", "login", "register", "account", "cart", "checkout", "compare", "wishlist",
    "shop", "shop-right", "shop-3-col", "shop-4-col", "blog", "blog-details", "product-details",
    "home-2", "home-3", "home-4", "home-5", "home-6", "home-7",
    "adminEc", "adminSy", "adminCo", "popupAdmin", "xdev-open-comp",
  ];
  const result: SelectTreeItem[] = [];
  const leafIds = new Set(leaves.map((l) => l.id));
  for (const key of dirOrder) {
    const folder = dirMap.get(key);
    if (folder) result.push(folder);
    else {
      const leaf = leaves.find((l) => l.path === (key === "index" ? "/" : `/${key}`));
      if (leaf) result.push(leaf);
    }
  }
  leaves.forEach((l) => {
    if (!result.some((r) => r.id === l.id)) result.push(l);
  });
  dirMap.forEach((folder) => {
    if (!result.some((r) => r.id === folder.id)) result.push(folder);
  });
  return result;
}

const pageTreeItems = computed(() => buildPagesTree());

// components 폴더 구조: app/components 하위 경로 (실제 구조 반영)
const COMPONENT_PATHS = [
  "back-to-top/BackToTop",
  "blog-details/BlogDetailsArea",
  "blogs/BlogArea",
  "blogs/BlogAreaTwo",
  "blogs/BlogItem",
  "blogs/BlogNoSidebarArea",
  "blogs/BlogStandardArea",
  "blogs/BlogStandardItem",
  "blogs/BlogThreeColArea",
  "blogs/BlogTwoColArea",
  "blogs/BlogTwoColMasonryArea",
  "cart-wishlists/CartArea",
  "cart-wishlists/CartItem",
  "cart-wishlists/WishlistArea",
  "cart-wishlists/WishlistItem",
  "category/CategoryArea",
  "category/CategoryAreaTwo",
  "checkout/BillingDetails",
  "checkout/CheckoutArea",
  "checkout/CountrySelect",
  "checkout/CouponArea",
  "checkout/DifferentAddress",
  "checkout/OrderArea",
  "client-brands/ClientBrandSlider",
  "client-brands/ClientBrandSliderTwo",
  "common/breadcrumb/BreadcrumbArea",
  "common/sidebar/OffCanvas",
  "common/modals/ProductModal",
  "common/modals/ProfileEditModal",
  "common/modals/SearchPopup",
  "common/modals/VideoModal",
  "common/sidebar/BlogSidebar",
  "common/sidebar/OffCanvas",
  "contact/ContactArea",
  "compare/CompareArea",
  "forms/BlogDetailsForm",
  "forms/ChangePasswordForm",
  "forms/ContactForm",
  "forms/LoginForm",
  "forms/ProfileEditForm",
  "forms/RegisterForm",
  "forms/ReviewForm",
  "hero-banner/HomeHeroSlider",
  "hero-banner/HomeTwoHeroSlider",
  "hero-banner/HomeFourHeroSlider",
  "hero-banner/HomeFiveHeroSlider",
  "hero-banner/HomeSevenHeroSlider",
  "login-register/LoginArea",
  "login-register/RegisterArea",
  "profile/ProfileArea",
  "profile/ProfileMenuArea",
  "products/BestSallerProducts",
  "products/FeaturedProducts",
  "products/OfferProductsSlider",
  "products/ProductItem",
  "products/ProductItemTwo",
  "products/ProductListItem",
  "products/ProductModal",
  "products/SaleOffAreaTwo",
  "products/SaleOffProduct",
  "products/SmProductItem",
  "products/TrendingProductTwo",
  "products/TrendingProductThree",
  "products/TrendingProducts",
  "shop/filter-widget/PriceFilter",
  "shop/filter-widget/ProductBrands",
  "shop/filter-widget/ProductCategory",
  "shop/filter-widget/ProductColor",
  "shop/filter-widget/ProductsFeatured",
  "shop/filter-widget/ResetButton",
  "shop/filter-widget/SortFiltering",
  "shop/filter-widget/ProductSizes",
  "shop/ShopArea",
  "shop/ShopFourCol",
  "shop/ShopSidebar",
  "shop/ShopThreeCol",
  "shop-banner/ShopBanner",
  "shop-details/ProductDetailsContent",
  "shop-details/ProductDetailsReview",
  "shop-details/RelatedProducts",
  "shop-details/ShopDetailsArea",
  "social/Social",
  "subscribe/SubscribeArea",
  "testimonial/HomeThreeTestimonial",
  "testimonial/HomeSevenTestimonial",
  "ui/AppImage",
  "ui/Pagination",
  "ui/SelectMultiCheck",
  "ui/SelectTree",
  "ui/SkeletonBlogDetail",
  "ui/SkeletonCard",
  "ui/SkeletonProductDetail",
  "video-box/VideoBox",
  "xdev/XdevFilePathBadge",
  "xdev/XdevFilePathBadgeOverlay",
  "xdev/XdevFilePathBadgeOverlayComp",
  "xdev/XdevFilePathBadgeOverlayData",
  "xdev/XdevFilePathBadgeOverlayProps",
  "xdev/XdevFilePathBadgeOverlayPage",
];

function buildComponentsTree(): SelectTreeItem[] {
  const byKey = new Map<string, SelectTreeItem>();
  function ensureDir(segments: string[]): SelectTreeItem {
    const key = segments.join("/");
    if (byKey.has(key)) return byKey.get(key)!;
    const segmentName = segments[segments.length - 1]!;
    const node: SelectTreeItem = {
      id: `comp-${key}`,
      path: "",
      title: segmentName,
      pathLabel: "components / " + segments.join(" / "),
      children: [],
    };
    byKey.set(key, node);
    if (segments.length > 1) {
      const parent = ensureDir(segments.slice(0, -1));
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }
    return node;
  }
  const rootLeaves: SelectTreeItem[] = [];
  for (const p of COMPONENT_PATHS) {
    const parts = p.split("/");
    const fileName = parts[parts.length - 1]!;
    const item: SelectTreeItem = {
      id: `comp-leaf-${p}`,
      path: p,
      title: `${fileName}.vue`,
      pathLabel: "components / " + p + ".vue",
    };
    if (parts.length === 1) {
      rootLeaves.push(item);
    } else {
      const parent = ensureDir(parts.slice(0, -1));
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }
  }
  const topLevelDirs = Array.from(byKey.entries())
    .filter(([key]) => !key.includes("/"))
    .map(([, n]) => n);
  const order = ["back-to-top", "blog-details", "blogs", "cart-wishlists", "category", "checkout", "client-brands", "common", "contact", "compare", "forms", "hero-banner", "login-register", "profile", "products", "shop", "shop-banner", "shop-details", "social", "subscribe", "testimonial", "ui", "video-box", "xdev"];
  const result: SelectTreeItem[] = [];
  for (const key of order) {
    const node = byKey.get(key);
    if (node) result.push(node);
  }
  topLevelDirs.forEach((node) => {
    if (!result.some((r) => r.id === node.id)) result.push(node);
  });
  rootLeaves.sort((a, b) => a.title.localeCompare(b.title));
  return [...rootLeaves, ...result];
}

const componentsTreeItems = computed(() => buildComponentsTree());

// root 트리: components + pages (표시에 folder 글자 없음)
const rootTreeItems = computed((): SelectTreeItem[] => {
  return [
    {
      id: "root-components",
      path: "",
      title: "components",
      pathLabel: "components",
      children: componentsTreeItems.value,
    },
    {
      id: "root-pages",
      path: "",
      title: "pages",
      pathLabel: "pages",
      children: pageTreeItems.value,
    },
  ];
});

function onSelect(item: SelectTreeItem) {
  if (!item.path) return;
  if (item.path.startsWith("/")) {
    const path = item.path.replace(/:\w+/g, "1");
    navigateTo(path);
  } else {
    navigateTo({ path: "/xdev-open-comp", query: { component: item.path } });
  }
}

// ── 패널 드래그 & 리사이즈 (컴포넌트정보와 동일 스타일) ───────────────────────
const panelRef = ref<HTMLElement | null>(null);
const pos = reactive({ top: 8, left: NaN });
const panelWidth = ref<number | null>(300);
const panelHeight = ref<number | null>(180);

const panelStyle = computed(() => {
  const style: Record<string, string> = {};
  if (!isNaN(pos.left)) {
    style.top = `${pos.top}px`;
    style.left = `${pos.left}px`;
    style.right = "auto";
  }
  if (panelWidth.value !== null) style.width = `${panelWidth.value}px`;
  if (!dropdownOpen.value) style.height = "auto";
  else if (panelHeight.value !== null) style.height = `${panelHeight.value}px`;
  return style;
});

function startDrag(e: MouseEvent) {
  if (isPanelsLocked.value) return;
  if (isNaN(pos.left) && panelRef.value) {
    const rect = panelRef.value.getBoundingClientRect();
    pos.top = rect.top;
    pos.left = rect.left;
  }
  const startX = e.clientX - pos.left;
  const startY = e.clientY - pos.top;
  const onMove = (ev: MouseEvent) => {
    pos.left = ev.clientX - startX;
    pos.top = ev.clientY - startY;
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  e.preventDefault();
}

function startResize(e: MouseEvent) {
  e.preventDefault();
  const startX = e.clientX;
  const startW = panelWidth.value ?? 300;
  const startH = panelHeight.value ?? 180;
  const onMove = (ev: MouseEvent) => {
    panelWidth.value = Math.max(200, startW + (ev.clientX - startX));
    if (dropdownOpen.value) panelHeight.value = Math.max(120, startH + (ev.clientY - e.clientY));
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}
</script>

<style scoped>
.fp-panel {
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 10000;
  min-width: 260px;
  max-width: 500px;
  height: auto;
  max-height: 85vh;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-family: ui-monospace, "Cascadia Code", monospace;
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
}
.fp-panel--docked {
  position: static;
  top: auto;
  right: auto;
  flex: 0 0 auto;
  min-height: 0;
  max-height: none;
  width: 100%;
  max-width: none;
}
.fp-panel--collapsed {
  height: auto;
  max-height: none;
  min-height: 36px;
}
.fp-panel--page {
  flex-shrink: 0;
}

.fp-header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-bottom: 1px solid #e5e7eb;
  user-select: none;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  cursor: grab;
}
.fp-header:active {
  cursor: grabbing;
}
.fp-header--docked {
  cursor: default;
}
.fp-header--docked:active {
  cursor: default;
}
.fp-title {
  flex: 1;
  font-weight: 700;
  font-size: 0.82rem;
  color: #111827;
  pointer-events: none;
}
.fp-toggle {
  color: #9ca3af;
  font-size: 0.62rem;
  cursor: pointer;
  padding: 2px 3px;
}

.fp-header--select {
  border-bottom: 1px solid #e5e7eb;
}

.fp-page-expand-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid transparent;
}
.fp-page-expand-icon:hover {
  background: #e5e7eb;
  color: #111827;
}
.fp-page-expand-icon--open {
  background: #e5e7eb;
}
</style>

<style scoped>

.fp-page-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 6px 8px;
  border-top: 1px solid #e5e7eb;
}

.fp-page-search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  flex-shrink: 0;
}

.fp-page-search {
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
  font-size: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
}

.fp-page-search:focus {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15);
}

.fp-resize-handle {
  flex-shrink: 0;
  padding: 2px;
  font-size: 0.65rem;
  color: #9ca3af;
  cursor: nwse-resize;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.fp-resize-handle:hover {
  background: #f3f4f6;
}
</style>
