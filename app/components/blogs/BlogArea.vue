<template>
  <section :class="`blog__area ${style_2 ? 'pt-90' : ''} pb-70`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div :class="`${style_3 ? 'custom-container' : 'container'} mx-auto`">
      <div class="row flex justify-center">
        <div class="col-xl-12">
          <div class="section__title-wrapper text-center mb-55">
            <div class="section__title mb-10">
              <h2>블로그 글</h2>
            </div>
            <div class="section__sub-title">
              <p>다양한 블로그 글을 만나보세요.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex justify-center">
        <div class="col-xl-12">
          <!-- 로딩 중 스켈레톤 -->
          <div v-if="pending" class="grid grid-cols-3 gap-6">
            <skeleton-card v-for="n in 3" :key="n" />
          </div>

          <Carousel
            v-else
            :items-to-show="3"
            :wrap-around="true"
            :snapAlign="'center'"
            :breakpoints="{
              992: { itemsToShow: 3 },
              700: { itemsToShow: 2 },
              0:   { itemsToShow: 1 },
            }"
            class="blog__slider"
          >
            <Slide v-for="item in homeBlogs" :key="item.blogId">
              <blog-item :item="item" />
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
useComponentTitle('블로그 영역');
import { computed } from "vue";
import { Carousel, Slide } from "vue3-carousel";
import BlogItem from "./BlogItem.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";
import { useBlogs } from "~/composables/useBlogs";

defineProps({
  style_2: { type: Boolean, default: false },
  style_3: { type: Boolean, default: false },
});

const { blogs, pending } = useBlogs();
const homeBlogs = computed(() => (blogs.value ?? []).filter((b) => b.blog === "홈"));
</script>

<style scoped>
.blog__area .carousel__slide {
  padding: 0 15px;
}
</style>
