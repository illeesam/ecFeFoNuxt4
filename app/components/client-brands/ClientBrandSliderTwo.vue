<template>
  <div class="brand__area pb-90">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="container custom-container-2">
      <div class="brand__slider-active relative">
        <Carousel
          ref="slider_1"
          :items-to-show="5"
          :wrap-around="true"
          :snapAlign="'center'"
          :breakpoints="{
            1200: {
              itemsToShow: 5,
            },
            992: {
              itemsToShow: 3,
            },
            700: {
              itemsToShow: 2,
            },
            0: {
              itemsToShow: 1,
            },
          }"
        >
          <Slide v-for="(brand, i) in brands" :key="i" class="brand__slider-item">
            <div class="brand__image">
              <app-image
                :src="brand"
                alt="client"
                :img-style="{ maxWidth: '160px', height: '60px', objectFit: 'contain', display: 'block', margin: '0 auto' }"
                :skeleton-style="{ width: '160px', height: '60px', margin: '0 auto' }"
              />
            </div>
          </Slide>
        </Carousel>
        <div class="owl-nav">
          <div @click="handlePrev" class="owl-prev">
            <button><i class="fal fa-angle-left"></i></button>
          </div>
          <div @click="handleNext" class="owl-next">
            <button><i class="fal fa-angle-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('브랜드 슬라이더 2');
import { ref } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import AppImage from "~/components/ui/AppImage.vue";
const slider_1 = ref<{ next(): void; prev(): void } | null>(null);
const brands = [
  "/cdn/img/client/client-1.jpg",
  "/cdn/img/client/client-2.jpg",
  "/cdn/img/client/client-3.jpg",
  "/cdn/img/client/client-4.jpg",
  "/cdn/img/client/client-5.jpg",
  "/cdn/img/client/client-2.jpg",
];
function handleNext() {
  slider_1.value?.next();
}
function handlePrev() {
  slider_1.value?.prev();
}
</script>
