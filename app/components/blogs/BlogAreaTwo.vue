<template>
  <div class="blog__slider-area pt-100 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="container custom-container-2 mx-auto">
      <div class="row flex justify-center">
        <div class="col-xl-12">
          <div class="row flex justify-center">
            <div class="col-xl-12">
              <div class="section__wrapper text-center">
                <h3 class="section__title-2"><span> 블로그에서 </span></h3>
                <p>세계 최신 패션 트렌드를 만나보세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex justify-center mt-40">
        <div class="col-xl-12">
          <div class="blog__slider-active relative">
            <Carousel :items-to-show="2" :wrap-around="false" ref="slider_1">
              <Slide v-for="item in homeBlogs" :key="item.blogId" class="blog__slider-item">
                <div class="blog-thumb m-img">
                  <app-image
                    :src="item.img"
                    alt="blog-img"
                    wrap-class="w-img"
                    :skeleton-style="{ width: '100%', aspectRatio: '16/10' }"
                  />
                  <nuxt-link :to="`/blog-details/${item.blogId}`" class="btn">
                    <i class="fa fa-link"></i>
                  </nuxt-link>
                </div>
                <div class="blog__post-content">
                  <div class="blog__wrapper">
                    <h5 class="blog__post-title">
                      <nuxt-link :to="`/blog-details/${item.blogId}`">
                        <span v-html="item.title"></span>
                      </nuxt-link>
                    </h5>
                    <div class="article-meta flex justify-center">
                      <span class="article-author"> <span>By</span> Theme_pure Admin</span>
                      <span> /</span>
                      <span class="article-publish">
                        <i class="fa fa-calendar-o"></i>
                        {{ item.date }}
                      </span>
                    </div>
                  </div>
                </div>
              </Slide>
            </Carousel>
            <div class="owl-nav">
              <div class="owl-prev" @click="handlePrev">
                <button><i class="fal fa-angle-left"></i></button>
              </div>
              <div class="owl-next" @click="handleNext">
                <button><i class="fal fa-angle-right"></i></button>
              </div>
            </div>
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
useComponentTitle('블로그 영역 2');
import { ref, computed } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import { useBlogs } from "~/composables/useBlogs";
import AppImage from "~/components/ui/AppImage.vue";

const { blogs } = useBlogs();
const homeBlogs = computed(() => (blogs.value ?? []).filter((b) => b.blog === "홈-7"));

const slider_1 = ref<{ next(): void; prev(): void } | null>(null);
function handleNext() {
  slider_1.value?.next();
}
function handlePrev() {
  slider_1.value?.prev();
}
</script>

<style scoped>
.carousel__slide {
  display: block;
}
.blog__slider-area .carousel__slide.blog__slider-item {
  padding: 0 15px;
}
</style>
