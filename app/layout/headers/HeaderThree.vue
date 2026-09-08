<template>
  <client-only>
    <header>
      <div id="header__transparent" class="header__area header__transparent">
        <div class="max-w-7xl mx-auto px-4">
          <div class="header__top header__top-2">
            <div class="row items-center">
              <div class="col-xl-4 col-lg-4 col-md-3 col-sm-12">
                <div class="header__welcome">
                  <span>정담에 오신 것을 환영합니다!</span>
                </div>
              </div>
              <div class="col-xl-4 col-lg-4 col-md-3 col-sm-5">
                <div class="logo logo__6 text-md-center">
                  <nuxt-link href="/">
                    <img src="/cdn/img/logo/logo.png" alt="logo" />
                  </nuxt-link>
                </div>
              </div>
              <div class="col-xl-4 col-lg-4 col-md-6 col-sm-7">
                <div class="header__right relative flex justify-between sm:justify-end items-center">
                  <div @click.prevent="handleOffcanvas" class="mobile-menu-btn lg:hidden">
                    <a href="#" class="mobile-menu-toggle"><i class="fas fa-bars"></i></a>
                  </div>
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
              </div>
            </div>
          </div>
          <div id="header-sticky" :class="`header__bottom ${isSticky ? 'sticky' : ''}`">
            <div class="row">
              <div class="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
                <div class="main-menu d-none d-lg-flex justify-center relative">
                  <nav>
                    <menus />
                  </nav>
                </div>
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
