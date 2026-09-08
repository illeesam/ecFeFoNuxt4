<template>
  <client-only>
    <header>
      <div
        id="header-sticky"
        :class="`header__area ${transparent ? 'header__transparent' : ''} ${header_big ? 'box-25' : !white_bg ? 'grey-bg' : ''} 
        ${isSticky ? 'sticky' : ''}`"
      >
        <div :class="`${header_big ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 header__inner'}`">
          <div class="flex flex-wrap sm:flex-nowrap items-center header__row">
            <div :class="`${header_big ? 'flex-1 lg:w-7/12 md:w-1/6 sm:w-1/12 w-1/6' : 'flex-1 min-w-0 header__menu-col'}`" style="order: 2;">
              <div class="header__right relative flex justify-center items-center">
                <div :class="`main-menu ${header_big ? 'main-menu-2 text-center' : ''} hidden lg:block`">
                  <nav>
                    <menus />
                  </nav>
                </div>
                <div @click.prevent="handleOffcanvas" class="mobile-menu-btn lg:hidden">
                  <a href="#" class="mobile-menu-toggle"><i class="fas fa-bars"></i></a>
                </div>
              </div>
            </div>
            <div :class="`${header_big ? 'w-full md:w-1/3 lg:w-3/12' : 'header__logo-col'}`" style="order: 1;">
              <div :class="`logo flex ${header_big ? 'justify-start' : 'justify-center'}`">
                <nuxt-link href="/">
                  <img src="/cdn/img/logo/logo.png" alt="logo" />
                </nuxt-link>
              </div>
            </div>
            <div v-if="!header_big" class="header__action-col" style="order: 3;">
              <div class="header__action">
                <ul>
                  <li>
                    <a @click.prevent="handleOpenSearchBar" href="#" class="search-toggle"> <i class="fas fa-search"></i> 검색 </a>
                  </li>
                  <li>
                    <a href="#" class="cart"
                      ><i class="fas fa-shopping-bag"></i> 장바구니
                      <span>({{ state.getStTotalPriceQuantity.quantity }})</span>
                    </a>
                    <!-- 장바구니 미니 시작 -->
                    <cart-mini />
                    <!-- 장바구니 미니 끝 -->
                  </li>
                  <li>
                    <div style="display:inline-flex;align-items:center;gap:8px;">
                      <user-dropdown />
                      <a href="#"><i class="far fa-bars"></i></a>
                    </div>
                    <extra-info />
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="header_big" class="w-full sm:w-10/12 md:w-1/2 lg:w-3/12" style="order: 3;">
              <div class="header__action header__action-2 ml-auto">
                <ul>
                  <li>
                    <a @click.prevent="handleOpenSearchBar" href="#" class="search-toggle"> <i class="fas fa-search"></i> 검색 </a>
                  </li>
                  <li>
                    <a href="#" class="cart"
                      ><i class="fas fa-shopping-bag"></i> 장바구니
                      <span>({{ state.getStTotalPriceQuantity.quantity }})</span>
                    </a>
                    <!-- 장바구니 미니 시작 -->
                    <cart-mini />
                    <!-- 장바구니 미니 끝 -->
                  </li>
                  <li>
                    <div style="display:inline-flex;align-items:center;gap:8px;">
                      <user-dropdown />
                      <a href="#"><i class="far fa-bars"></i></a>
                    </div>
                    <extra-info />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 검색 팝업 시작 -->
    <search-popup ref="search_popup" />
    <!-- 검색 팝업 끝 -->

    <!-- 오프캔버스 시작 -->
    <off-canvas ref="offcanvas" />
    <!-- 오프캔버스 끝 -->
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useCartStore } from "~/store/useCartStore";
import Menus from "./Menus.vue";
import CartMini from "./header-com/CartMini.vue";
import SearchPopup from "~/components/common/modals/SearchPopup.vue";
import UserDropdown from "./header-com/UserDropdown.vue";
import ExtraInfo from "./header-com/ExtraInfo.vue";
import OffCanvas from "~/components/common/sidebar/OffCanvas.vue";

defineProps({
  header_big: { type: Boolean, default: false },
  white_bg: { type: Boolean, default: false },
  transparent: { type: Boolean, default: false },
});
const state = useCartStore();
const isSticky = ref(false);
const search_popup = ref<{ openSearchPopup(): void } | null>(null);
const offcanvas = ref<{ OpenOffcanvas(): void } | null>(null);

function handleSticky() {
  isSticky.value = window.scrollY > 80;
}
function handleOpenSearchBar() {
  search_popup.value?.openSearchPopup();
}
function handleOffcanvas() {
  offcanvas.value?.OpenOffcanvas();
}

onMounted(() => {
  window.addEventListener("scroll", handleSticky);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleSticky);
});
</script>
