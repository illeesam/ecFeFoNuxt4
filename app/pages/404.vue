<template>
  <layout :transparent="true">
    <xdev-file-path-badge :file-path="currentFilePath" position="top-right" :absolute="true" />
    <breadcrumb-area title="페이지 없음" subtitle="페이지 없음" />
    <!-- 에러 영역 시작 -->
    <section class="error__area pt-60 pb-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row flex justify-center">
          <div class="col-xl-8 col-lg-8 col-12 mx-auto">
            <div class="error__content text-center">
              <div class="error__number">
                <h1>404</h1>
              </div>
              <span>페이지를 찾을 수 없습니다</span>
              <h2>찾으시는 페이지가 없습니다</h2>
              <p>
                요청하신 페이지가 이동되었거나 더 이상 존재하지 않습니다. 홈페이지로 돌아가시거나, 문제가 계속되면
                <span class="highlight comment">illeddam@gmail.com</span>으로 문의해 주세요.
              </p>
              <div class="error__search">
                <nuxt-link to="/" class="os-btn os-btn-3 os-btn-black"> 홈으로 돌아가기 </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 에러 영역 끝 -->
  </layout>
</template>

<script lang="ts" setup>
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
</script>
