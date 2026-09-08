<template>
  <ul class="extra-info">
    <li>
      <div class="env-badge">
        <span>{{ config.public.envNm }}</span>
        <span class="env-mode">{{ config.public.mode }}</span>
      </div>
      <div v-if="isLocal" class="file-path-badge-row">
        <span class="current-page-path">{{ currentPagePath }}</span>
        <label class="path-toggle">
          <input v-model="showFilePathBadge" type="checkbox" />
          <span>경로 표시</span>
        </label>
      </div>
    </li>
    <li>
      <div class="my-account">
        <div class="extra-title">
          <h5 class="extra-title__heading">내 계정</h5>
        </div>
        <ul>
          <li><nuxt-link href="/account">내 계정</nuxt-link></li>
          <li><nuxt-link href="/wishlist">위시리스트</nuxt-link></li>
          <li><nuxt-link href="/cart">장바구니</nuxt-link></li>
          <li><nuxt-link href="/checkout">결제</nuxt-link></li>
          <li><nuxt-link href="/register">회원가입</nuxt-link></li>
        </ul>
      </div>
    </li>
    <li>
      <div class="lang">
        <div class="extra-title">
          <h5 class="extra-title__heading">언어</h5>
        </div>
        <ul>
          <li><a href="#">영어</a></li>
          <li><a href="#">프랑스어</a></li>
          <li><a href="#">독일어</a></li>
          <li><a href="#">벵골어</a></li>
        </ul>
      </div>
    </li>
    <li>
      <div class="currency">
        <div class="extra-title">
          <h5 class="extra-title__heading">통화</h5>
        </div>
        <ul>
          <li><a href="#">USD - 미국 달러</a></li>
          <li><a href="#">EUR - 유로</a></li>
          <li><a href="#">GBP - 영국 파운드</a></li>
          <li><a href="#">INR - 인도 루피</a></li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const isLocal = config.public.mode === "local";

const route = useRoute();
const currentPagePath = computed(() => {
  const path = route.path === "/" ? "/index" : route.path;
  return `app/pages${path}.vue`;
});

const { showFilePathBadge } = useShowFilePathBadge();
</script>

<style scoped>
.env-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 4px 4px;
  font-size: 0.72rem;
  color: #999;
  border-bottom: 1px dashed #e5e5e5;
  margin-bottom: 2px;
}
.env-mode {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 20px;
  background: #f0f0f0;
  color: #555;
  font-weight: 600;
  font-size: 0.7rem;
}
.file-path-badge-row {
  padding: 6px 4px 8px;
  border-bottom: 1px dashed #e5e5e5;
  margin-bottom: 2px;
}
.file-path-badge-row .current-page-path {
  display: block;
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 6px;
  word-break: break-all;
}
.file-path-badge-row .path-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: #666;
  cursor: pointer;
}
.file-path-badge-row .path-toggle input {
  cursor: pointer;
}
.extra-title__heading {
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: -0.02em;
  color: var(--heading-color, #201f1f);
}
</style>
