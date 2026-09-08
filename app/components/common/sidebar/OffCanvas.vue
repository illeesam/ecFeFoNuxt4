<template>
  <section :class="`extra__info transition-3 ${showSidebar ? 'info-opened' : ''}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="extra__info-inner">
      <div class="extra__info-close text-end" @click="showSidebar = false">
        <a @click.prevent="showSidebar = false" href="#" class="extra__info-close-btn">
          <i class="fal fa-times"></i>
        </a>
      </div>

      <!-- 모바일 사이드 메뉴 시작 -->
      <nav class="side-mobile-menu block lg:hidden mm-menu">
        <ul>
          <template v-for="(menu, i) in mobile_menus" :key="i">
            <li
              v-if="menu.dropdownMenu"
              :class="`menu-item-has-children has-droupdown 
              ${activeMenu === menu.title ? 'active' : ''}`"
            >
              <a @click.prevent="handleOpenMenu(menu.title)">
                {{ menu.title }}
              </a>
              <ul @click.prevent="showSidebar = false" :class="`sub-menu ${activeMenu === menu.title ? 'active' : ''}`">
                <li v-for="(sub_m, index) in menu.dropdownMenu" :key="index">
                  <nuxt-link :to="`${sub_m.link}`">
                    {{ sub_m.title }}
                  </nuxt-link>
                </li>
              </ul>
            </li>

            <li v-if="!menu.dropdownMenu">
              <nuxt-link :to="`${menu.link}`">{{ menu.title }}</nuxt-link>
            </li>
          </template>
        </ul>
      </nav>
      <!-- 모바일 사이드 메뉴 끝 -->
    </div>
  </section>

  <!--  body overlay  -->
  <div @click="showSidebar = false" :class="`body-overlay transition-3 ${showSidebar ? 'opened' : ''}`"></div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('오프캔버스 메뉴');
import { ref } from "vue";

type MenuDataType = {
  title: string;
  link?: string;
  dropdown?: boolean;
  dropdownMenu?: {
    link: string;
    title: string;
  }[];
};

const activeMenu = ref("");
const showSidebar = ref(false);
const mobile_menus: MenuDataType[] = [
      {
        title: "홈",
        dropdown: true,
        dropdownMenu: [
          { link: "/", title: "홈 스타일 1" },
          { link: "/home-2", title: "홈 스타일 2" },
          { link: "/home-3", title: "홈 스타일 3" },
          { link: "/home-4", title: "홈 스타일 4" },
          { link: "/home-5", title: "홈 스타일 5" },
          { link: "/home-6", title: "홈 스타일 6" },
          { link: "/home-7", title: "홈 스타일 7" },
        ],
      },
      {
        title: "쇼핑",
        dropdown: true,
        dropdownMenu: [
          { link: "/shop", title: "기본 쇼핑" },
          { link: "/shop-right", title: "쇼핑 (우측 사이드바)" },
          { link: "/shop-4-col", title: "쇼핑 4단" },
          { link: "/shop-3-col", title: "쇼핑 3단" },
          { link: "/product-details", title: "상품 상세" },
        ],
      },
      {
        title: "기타 페이지",
        dropdown: true,
        dropdownMenu: [
          { link: "/wishlist", title: "위시리스트" },
          { link: "/cart", title: "장바구니" },
          { link: "/compare", title: "비교" },
          { link: "/checkout", title: "주문/결제" },
          { link: "/register", title: "회원가입" },
          { link: "/login", title: "로그인" },
          { link: "/account", title: "마이페이지" },
        ],
      },
      {
        title: "블로그",
        dropdown: true,
        dropdownMenu: [
          { link: "/blog", title: "블로그" },
          { link: "/blog-left-sidebar", title: "블로그 (좌측 사이드바)" },
          { link: "/blog-no-sidebar", title: "블로그 (사이드바 없음)" },
          { link: "/blog-2-col", title: "블로그 2단" },
          { link: "/blog-3-col", title: "블로그 3단" },
          { link: "/blog-2-col-mas", title: "블로그 2단 메이슨리" },
          { link: "/blog-details", title: "블로그 상세" },
        ],
      },
  {
    title: "문의하기",
    dropdown: false,
    link: "/contact",
  },
];

function OpenOffcanvas() {
  showSidebar.value = true;
}
function handleOpenMenu(navTitle: string) {
  if (navTitle === activeMenu.value) {
    activeMenu.value = "";
  } else {
    activeMenu.value = navTitle;
  }
}
defineExpose({ OpenOffcanvas });
</script>
