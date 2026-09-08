<template>
  <client-only>
    <header>
      <div id="header-sticky" :class="`header__area header__transparent header__transparent-2 pt-15 pb-15 box-25 ${isSticky ? 'sticky' : ''}`">
        <div class="container-fluid">
          <div class="row items-center">
            <div class="col-xl-2 col-lg-2 col-md-4 col-sm-3">
              <div class="logo">
                <nuxt-link href="/">
                  <img src="/cdn/img/logo/log-3.webp" alt="logo" />
                </nuxt-link>
              </div>
            </div>
            <div class="col-xl-7 col-lg-6 col-md-1 col-sm-1">
              <div class="main-menu main-menu-3 hidden lg:block relative">
                <nav>
                  <menus />
                </nav>
              </div>
            </div>
            <div class="col-xl-3 col-lg-4 col-md-7 col-sm-8">
              <div class="header__right relative flex justify-between sm:justify-end items-center">
                <div @click.prevent="handleOffcanvas" class="mobile-menu-btn lg:hidden">
                  <a href="#" class="mobile-menu-toggle"><i class="fas fa-bars"></i></a>
                </div>
                <div class="header__action">
                  <ul>
                    <li>
                      <a @click.prevent="handleOpenSearchBar" href="#" class="search-toggle">
                        <i class="fas fa-search"></i>
                      </a>
                    </li>
                    <li>
                      <div style="display:inline-flex;align-items:center;gap:8px;">
                        <user-dropdown />
                        <a href="#"><i class="far fa-bars"></i></a>
                      </div>
                      <extra-info />
                    </li>
                    <li>
                      <a href="#" class="cart">
                        <i class="fas fa-cart-plus"></i>
                        <span class="cart-number-2">{{ state.getStTotalPriceQuantity.quantity }}</span>
                      </a>
                      <!-- 장바구니 미니 시작 -->
                      <cart-mini />
                      <!-- 장바구니 미니 끝 -->
                    </li>
                  </ul>
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
import UserDropdown from "./header-com/UserDropdown.vue";
import ExtraInfo from "./header-com/ExtraInfo.vue";
import SearchPopup from "~/components/common/modals/SearchPopup.vue";
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
