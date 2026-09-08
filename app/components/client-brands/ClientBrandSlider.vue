<template>
  <section :class="`client__area ${style_2 ? '' : 'pt-15 pb-140'}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-12">
          <Carousel
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
            :class="`client__slider ${style_2 ? 'pt-80 pb-80 border-top-1' : ''} text-center`"
          >
            <Slide v-for="(brand, i) in brands" :key="i" class="client__thumb">
              <a style="cursor: pointer">
                <app-image
                  :src="brand"
                  alt="client"
                  :img-style="{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }"
                  :skeleton-style="{ width: '100%', height: '130px' }"
                />
              </a>
            </Slide>
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
useComponentTitle('브랜드 슬라이더');
import { Carousel, Slide } from "vue3-carousel";
import AppImage from "~/components/ui/AppImage.vue";
defineProps({
  style_2: { type: Boolean, default: false },
});
const brands = [
  "/cdn/img/client/client-1.jpg",
  "/cdn/img/client/client-2.jpg",
  "/cdn/img/client/client-3.jpg",
  "/cdn/img/client/client-4.jpg",
  "/cdn/img/client/client-5.jpg",
  "/cdn/img/client/client-2.jpg",
];
</script>
