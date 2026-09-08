<template>
  <div class="testimonial__area bg-gray-100 pt-95 pb-95">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="container custom-container-2 mx-auto">
      <div class="row flex justify-center">
        <div class="col-lg-12">
          <div class="row flex justify-center">
            <div class="col-xl-12">
              <div class="section__wrapper text-center mb-40">
                <h3 class="section__title-2">추천 상품</h3>
                <p class="sub-title">당신의 하루를 조금 더 특별하게 만들어 줄 단 하나의 선택, 바로 이 상품입니다. 작은 차이가 큰 만족으로 이어지는 순간을 경험해보세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex justify-center">
        <div class="col-lg-12">
          <Carousel :items-to-show="1" :wrap-around="true" ref="slider_1" class="testimonial__slider-active">
            <Slide v-for="item in testimonial_data" :key="item.id" class="testimonail__slider-item">
              <div class="testimonial__image text-center mb-50">
                <app-image
                  :src="item.img"
                  alt=""
                  :img-style="{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto' }"
                  :skeleton-style="{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto' }"
                />
              </div>
              <div class="testimonial__content">
                <p v-html="item.desc"></p>
              </div>
            </Slide>
            <template #addons>
              <Pagination />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('추천 후기');
import { reactive } from "vue";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import AppImage from "~/components/ui/AppImage.vue";
interface TestimonialDataType {
  id: number;
  img: string;
  desc: string;
}

const testimonial_data = reactive<TestimonialDataType[]>([
  {
    id: 1,
    img: "/cdn/img/testimonial/testi1.webp",
    desc: "당신의 하루를 조금 더 특별하게 만들어 줄 단 하나의 선택, 바로 이 상품입니다. 작은 차이가 큰 만족으로 이어지는 순간을 경험해보세요.",
  },
  {
    id: 2,
    img: "/cdn/img/testimonial/testi2.webp",
    desc: "지금 이 상품은 단순한 제품이 아니라, 당신의 시간을 아끼고 삶의 질을 높여주는 해결책입니다. 꼭 필요한 순간에 가장 든든한 동반자가 되어줄 거예요",
  },
  {
    id: 3,
    img: "/cdn/img/testimonial/testi3.webp",
    desc: "많은 분들이 찾고 계신 바로 그 상품, 지금 이 순간에만 만나실 수 있습니다. 놓치면 다시는 같은 조건으로 만나기 어려울지도 모릅니다",
  },
]);
</script>

<style scoped>
.carousel__slide {
  display: block;
}
</style>
