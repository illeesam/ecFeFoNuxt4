<template>
  <div class="blog__item mb-30">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="blog__thumb fix">
      <nuxt-link :to="`/blog-details/${item.blogId}`" class="w-img">
        <!-- AppImage: 스켈레톤 + noImage 내장 -->
        <app-image
          :src="item.img"
          alt="blog"
          wrap-class="w-img"
          :skeleton-style="{ width: '100%', aspectRatio: '16/10' }"
        />
      </nuxt-link>
    </div>
    <div class="blog__content text-center">
      <h4>
        <nuxt-link :to="`/blog-details/${item.blogId}`">
          <span v-html="item.title"></span>
        </nuxt-link>
      </h4>
      <div class="blog__meta">
        <span>By <a href="#">{{ item.author }}</a></span>
        <span> / {{ item.date }}</span>
      </div>
      <div v-if="!style_2">
        <p>{{ item.desc }}</p>
        <nuxt-link :to="`/blog-details/${item.blogId}`" class="os-btn">더 읽기</nuxt-link>
      </div>
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
  item: CoBlogType;
  style_2?: boolean;
}>();
</script>
