<template>
  <section class="slider__area slider__area-4 tp_hero relative">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <Carousel :items-to-show="1" :wrap-around="true" class="slider-active">
      <Slide v-for="item in slider_data" :key="item.heroSliderId" class="single-slider single-slider-2 slider__height-4 flex items-center" :style="{ backgroundImage: `url(${item.bgImg})` }">
        <div class="max-w-7xl mx-auto px-4">
          <div class="row">
            <div class="col-xl-7 col-lg-7 col-md-9 col-sm-11 w-full">
              <div class="slider__content slider__content-4">
                <h2 v-html="item.title"></h2>
                <p>{{ item.subtile }}</p>
                <a href="#" class="os-btn os-btn-2 hero-slider-btn">둘러보기</a>
              </div>
            </div>
          </div>
        </div>
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
  </section>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle("히어로 슬라이더 4");
import { reactive } from "vue";
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
import { Carousel, Slide, Pagination } from "vue3-carousel";
const currentFilePath = useCurrentFilePath();

import { type CoHeroSliderDataType } from "~/types/coHeroSliderDataType";
const slider_data = reactive<CoHeroSliderDataType[]>([
  {
    heroSliderId: "heroSliderId01",
    bgImg: "/cdn/img/slider/04/slider-01.jpg",
    title: "핸드메이드 <br /> 핸드카브 커피",
    subtile: "원두 본연의 풍부하고 독특한 맛을 담아낸 이 작은 스쿱은 매일 아침 당신의 아침 루틴을 특별한 순간으로 만들어 줄 것입니다.",
  },
  {
    heroSliderId: "heroSliderId02",
    bgImg: "/cdn/img/slider/slider-2.jpg",
    title: "다르게 생각하고 <br /> 다르게 실행하세요",
    subtile: "원두 본연의 풍부하고 독특한 맛을 담아낸 이 작은 스쿱은 매일 아침 당신의 아침 루틴을 특별한 순간으로 만들어 줄 것입니다.",
  },
  {
    heroSliderId: "heroSliderId03",
    bgImg: "/cdn/img/slider/slider-3.jpg",
    title: "하이빔<br /> by  태희",
    subtile: "원두 본연의 풍부하고 독특한 맛을 담아낸 이 작은 스쿱은 매일 아침 당신의 아침 루틴을 특별한 순간으로 만들어 줄 것입니다.",
  },
]);
</script>
