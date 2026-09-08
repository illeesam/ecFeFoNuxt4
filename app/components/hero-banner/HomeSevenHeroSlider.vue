<template>
  <section class="slider__area slider__area-3 tp_hero relative">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="slider-active-3">
      <Carousel :items-to-show="1" :wrap-around="true" ref="slider_1">
        <Slide v-for="item in slider_data" :key="item.heroSliderId" class="single-slider single-slider-2 slider__height-6 flex items-center" :style="{ backgroundImage: `url(${item.bgImg})` }">
          <div class="container custom-container-2">
            <div class="row">
              <div class="col-xl-7 col-lg-7 col-md-10">
                <div class="slider__content slider__content-5">
                  <span :class="`${item.meta ? 'meta' : ''}`">{{ item.sm_title }}</span>
                  <h2 v-html="item.title"></h2>
                  <p v-html="item.subtitle"></p>
                  <nuxt-link href="/shop" class="os-btn-4 hero-slider-btn">쇼핑하기</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </Slide>
        <template #addons>
          <Pagination />
        </template>
      </Carousel>
      <div>
        <button @click="handlePrev" type="button" class="slick-prev slick-arrow">
          <i class="fal fa-angle-left"></i>
        </button>
        <button @click="handleNext" type="button" class="slick-next slick-arrow">
          <i class="fal fa-angle-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('히어로 슬라이더 7');
import { ref, reactive } from "vue";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import { type CoHeroSliderDataTypeThree } from "~/types/coHeroSliderDataTypeThree";
const slider_1 = ref<{ next(): void; prev(): void } | null>(null);
const slider_data = reactive<CoHeroSliderDataTypeThree[]>([
      {
        heroSliderId: "heroSliderId01",
        bgImg: "/cdn/img/slider/05/slide111.webp",
        sm_title: "최대 50% 할인",
        meta: true,
        title: "당신에게 필요한 <br/>라이프스타일.",
        subtitle: "다양한 라이프스타일을 경험해 보세요.",
      },
      {
        heroSliderId: "heroSliderId02",
        bgImg: "/cdn/img/slider/05/slide112.webp",
        sm_title: "빠른 배송",
        title: "크리에이티브 테마 <br/>어썸.",
        subtitle: "다양한 라이프스타일을 경험해 보세요.",
      },
      {
        heroSliderId: "heroSliderId03",
        bgImg: "/cdn/img/slider/05/slide113.webp",
        sm_title: "빠른 배송",
        title: "세상은<br/>만들어 갑니다.",
        subtitle: "다양한 라이프스타일을 경험해 보세요.",
      },
]);
function handleNext() {
  slider_1.value?.next();
}
function handlePrev() {
  slider_1.value?.prev();
}
</script>
