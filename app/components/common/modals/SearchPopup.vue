<template>
  <section :class="`header__search white-bg transition-3 ${showSearch ? 'search-opened' : ''}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-wrap">
        <div class="w-full">
          <div class="header__search-inner text-center">
            <form action="#">
              <div class="header__search-btn" @click="showSearch = false">
                <a href="#" class="header__search-btn-close">
                  <i class="fal fa-times"></i>
                </a>
              </div>
              <div class="header__search-header">
                <h3>검색</h3>
              </div>
              <div class="header__search-categories">
                <ul class="search-category">
                  <li><nuxt-link href="/shop">전체 카테고리</nuxt-link></li>
                  <li><nuxt-link href="/shop">악세서리</nuxt-link></li>
                  <li><nuxt-link href="/shop">의자</nuxt-link></li>
                  <li><nuxt-link href="/shop">태블릿</nuxt-link></li>
                  <li><nuxt-link href="/shop">남성</nuxt-link></li>
                  <li><nuxt-link href="/shop">여성</nuxt-link></li>
                </ul>
              </div>
              <div class="header__search-input relative">
                <input type="text" placeholder="상품 검색..." />
                <button type="submit"><i class="far fa-search"></i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 배경 오버레이 시작 -->
  <div @click="showSearch = false" :class="`body-overlay transition-3 ${showSearch ? 'opened' : ''}`"></div>
  <!-- 배경 오버레이 끝 -->
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('검색 팝업');
import { ref } from "vue";

const showSearch = ref(false);
function openSearchPopup() {
  showSearch.value = true;
}
defineExpose({ openSearchPopup });
</script>
