<template>
  <section class="testimonial__area box-m-15 pt-100 pb-140" :style="{ backgroundImage: `url(${bg})` }">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-8 offset-xl-2 col-lg-8 offset-lg-2">
          <Carousel :items-to-show="3" :wrap-around="true" v-model="currentSlide" ref="carousel" class="testimonial__nav">
            <Slide v-for="item in nav_data" :key="item.id">
              <div @click="slideTo(item.id - 1)" class="testimonial__nav-thumb item-1">
                <app-image
                  :src="item.img"
                  alt="person"
                  :img-style="{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', display: 'block' }"
                  :skeleton-style="{ width: '60px', height: '60px', borderRadius: '50%' }"
                />
              </div>
            </Slide>
          </Carousel>

          <Carousel class="testimonial__wrapper mt-40" :items-to-show="1" :wrap-around="false" v-model="currentSlide">
            <Slide v-for="item in testimonial_data" :key="item.id" class="testimonial__item item-1">
              <div class="avater__info mb-15">
                <h6>{{ item.title }}</h6>
                <span>{{ item.name }}</span>
              </div>
              <p>
                {{ item.desc }}
              </p>
            </Slide>

            <template #addons>
              <Pagination />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('후기');
import { ref } from "vue";
import { Carousel, Slide, Pagination } from "vue3-carousel";
import AppImage from "~/components/ui/AppImage.vue";
const bg = "/cdn/img/testimonial/testimonial-bg.jpg";

const currentSlide = ref(0);
const nav_data = [
  { id: 1, img: "/cdn/img/testimonial/person-1.jpg" },
  { id: 2, img: "/cdn/img/testimonial/person-2.jpg" },
  { id: 3, img: "/cdn/img/testimonial/person-3.jpg" },
  { id: 4, img: "/cdn/img/testimonial/person-4.jpg" },
];
const testimonial_data = [
  {
    id: 1,
    name: "Mason Robinson",
    title: "UX 디자이너",
    desc: "명확한 가독성과 사용자 경험을 고려한 디자인이 인상적이었습니다. 많은 조사가 독자들이 더 나은 경험을 선호한다는 것을 보여줍니다.",
  },
  {
    id: 2,
    name: "David Cruso",
    title: "웹 개발자",
    desc: "구조가 분명하고 유지보수가 쉽습니다. 실제 사용자 조사 결과도 긍정적이었고, 서비스 품질에 만족합니다.",
  },
  {
    id: 3,
    name: "Naim Ahmed",
    title: "웹 개발자",
    desc: "직관적인 구성과 빠른 반응 속도가 좋았습니다. 재방문률이 높은 이유를 체험으로 이해했습니다.",
  },
  {
    id: 4,
    name: "Salim Rana",
    title: "워드프레스 전문가",
    desc: "전문성과 세심한 배려가 돋보이는 서비스였습니다. 추천할 만한 퀄리티라고 자신 있게 말씀드립니다.",
  },
];
function slideTo(val: number) {
  currentSlide.value = val;
}
</script>

<style scoped lang="scss">
.carousel__track {
  transform-style: preserve-3d;
}

.testimonial__area {
  & .testimonial__nav {
    & .carousel__slide--active {
      & .testimonial__nav-thumb {
        & :deep(img) {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }
}
</style>
