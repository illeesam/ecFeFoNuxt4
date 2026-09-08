<template>
  <section class="profile__area pt-120 pb-50 bg-gray-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="profile__basic-inner pb-20 bg-white">
        <div class="row items-center">
          <div class="col-xxl-6 col-md-6">
            <div class="profile__basic d-md-flex items-center">
              <div class="profile__basic-thumb mr-30">
                <app-image
                  :src="profileImg"
                  alt=""
                  :img-style="{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', display: 'block' }"
                  :skeleton-style="{ width: '80px', height: '80px', borderRadius: '50%' }"
                />
              </div>
              <div class="profile__basic-content">
                <h3 class="profile__basic-title">다시 오신 것을 환영합니다 <span>{{ authStore.user?.username ?? '사용자' }}</span></h3>
                <p>{{ state.cartProducts.length }}개 상품 담김 <nuxt-link href="/cart">장바구니 보기</nuxt-link></p>
              </div>
            </div>
          </div>
          <div class="col-xxl-6 col-md-6">
            <div class="profile__basic-cart flex items-center justify-content-md-end">
              <div class="cart-info mr-10">
                <nuxt-link href="/cart">장바구니 보기</nuxt-link>
              </div>
              <div class="cart-item">
                <nuxt-link href="/cart">
                  <i class="fa-regular fa-basket-shopping"></i>
                  <span class="cart-quantity">{{ state.cartProducts.length }}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('프로필');
import { useCartStore } from "~/store/useCartStore";
import { useAuthStore } from "~/store/useAuthStore";
import AppImage from "~/components/ui/AppImage.vue";

const state = useCartStore();
const authStore = useAuthStore();
const profileImg = "/cdn/img/testimonial/person-1.jpg";
</script>
