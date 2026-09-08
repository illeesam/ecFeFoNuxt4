<template>
  <div :class="`blog__item mb-60 ${style_2 ? '' : 'blog__border-bottom pb-60'}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="blog__thumb fix">
      <nuxt-link :to="`/blog-details/${blog.blogId}`" class="w-img">
        <app-image
          :src="blog.img"
          alt="blog"
          wrap-class="w-img"
          :skeleton-style="{ width: '100%', aspectRatio: '16/10' }"
        />
      </nuxt-link>
    </div>
    <div class="blog__content">
      <h4 :class="`${style_3 ? '' : 'blog__title'}`">
        <nuxt-link :to="`/blog-details/${blog.blogId}`">
          <span v-html="blog.title"></span>
        </nuxt-link>
      </h4>
      <div class="blog__meta">
        <span
          >By <a href="#">{{ blog.author }}</a></span
        >
        <span>/ {{ blog.date }}</span>
      </div>
      <p>{{ style_3 ? blog.desc.slice(0, 80) : blog.desc }} [...]</p>
      <nuxt-link :to="`/blog-details/${blog.blogId}`" class="os-btn">더 보기</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그 아이템');
import { type CoBlogType } from "~/types/coBlogType";
import AppImage from "~/components/ui/AppImage.vue";

defineProps<{
  blog: CoBlogType;
  style_2?: boolean;
  style_3?: boolean;
}>();
</script>
