<template>
  <section class="contact__area pb-100 pt-95">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-6 col-lg-6">
          <div class="contact__info">
            <h3>찾아오시는 길</h3>
            <ul class="mb-55">
              <li v-for="(item, i) in contactInfo" :key="i" class="d-flex mb-35">
                <div class="contact__info-icon mr-20">
                  <i :class="item.icon"></i>
                </div>
                <div class="contact__info-content">
                  <h6>{{ item.title }}:</h6>
                  <span>{{ item.subtitle }}</span>
                </div>
              </li>
            </ul>
            <p>정담은 고급 관리 기능을 갖춘 프리미엄 템플릿 테마입니다. It’s 맞춤 설정이 쉽고, 반응형이며 레티나 디스플레이를 지원합니다.</p>

            <div class="contact__social">
              <ul>
                <social />
              </ul>
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-lg-6">
          <div class="contact__form">
            <h3>문의하기</h3>
            <!-- 폼 시작 -->
            <contact-form />
            <!-- 폼 끝 -->
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
useComponentTitle('문의하기');
import ContactForm from "../forms/ContactForm.vue";
import Social from "../social/Social.vue";
import type { CoContactInfoItemType } from "~/types/coContactInfoItemType";

const contactInfo: CoContactInfoItemType[] = [
  {
    icon: "fal fa-map-marker-alt",
    title: "주소",
    subtitle: "성남시 중원구 성남대로 997 (여수동)",
  },
  {
    icon: "fal fa-envelope-open-text",
    title: "이메일",
    subtitle: "illeesam@gmail.com",
  },
  {
    icon: "fal fa-phone-alt",
    title: "연락처",
    subtitle: "(010) 3805 0206",
  },
];
</script>
