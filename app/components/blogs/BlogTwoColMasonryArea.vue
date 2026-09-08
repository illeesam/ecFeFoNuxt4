<template>
  <section class="blog__area pt-100 pb-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <!-- 로딩 중 스켈레톤 -->
      <div v-if="pending" class="row">
        <div v-for="n in 4" :key="n" class="col-xl-6 col-lg-6 col-md-6">
          <skeleton-card />
        </div>
      </div>
      <div v-else class="row grid">
        <masonry-wall :items="masonryBlogs" :gap="30">
          <template #default="{ item }">
            <div class="blog__wrapper">
              <div class="blog__item mb-60">
                <div class="blog__thumb fix">
                  <nuxt-link :to="`/blog-details/${item.blogId}`" class="w-img">
                    <app-image
                      :src="item.img"
                      alt="blog"
                      wrap-class="w-img"
                      :skeleton-style="{ width: '100%', aspectRatio: '16/10' }"
                    />
                  </nuxt-link>
                </div>
                <div class="blog__content">
                  <h4>
                    <nuxt-link :to="`/blog-details/${item.blogId}`">
                      <span v-html="item.title"></span>
                    </nuxt-link>
                  </h4>
                  <div class="blog__meta">
                    <span
                      >By <a href="#">{{ item.author }}</a></span
                    >
                    <span>/ {{ item.date }}</span>
                  </div>
                  <p>{{ item.desc }} [...]</p>
                  <nuxt-link :to="`/blog-details/${item.blogId}`" class="os-btn">더 보기</nuxt-link>
                </div>
              </div>
            </div>
          </template>
        </masonry-wall>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그 2단 메이슨리');
import { computed } from "vue";
import { useBlogs } from "~/composables/useBlogs";
import AppImage from "~/components/ui/AppImage.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";

const { blogs, pending } = useBlogs();
const masonryBlogs = computed(() => (blogs.value ?? []).filter((b) => b.blog === "블로그-메이슨리"));
</script>
