<template>
  <div class="sidebar__wrapper">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="sidebar__widget mb-55">
      <div class="widget__search relative">
        <form action="#">
          <input type="text" placeholder="검색..." />
          <button type="submit"><i class="far fa-search"></i></button>
        </form>
      </div>
    </div>
    <div class="sidebar__widget mb-55">
      <div class="sidebar__widget-title mb-25">
        <h3>상품 카테고리</h3>
      </div>
      <div class="sidebar__widget-content">
        <div class="categories">
          <div class="category-list">
            <div v-for="(category, i) in categoryTreeData" :key="category.categoryId" class="category-item border-b border-gray-200">
              <div class="category-header flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded" @click="toggle(i)" role="button" :aria-expanded="expandedIndex === i">
                <span class="shop-accordion-btn flex-1 text-left">{{ category.parentTitle }}</span>
                <span class="arrow inline-block w-5 h-5 flex items-center justify-center transition-transform duration-200" :class="{ 'rotate-90': expandedIndex === i }" aria-hidden="true"> &gt; </span>
              </div>
              <div v-show="expandedIndex === i" class="category-children pl-3 pb-3">
                <div class="categories__list">
                  <ul>
                    <li v-for="(child, childIdx) in category.children" :key="childIdx">
                      <a href="#" class="block py-1.5 px-2 rounded text-sm hover:bg-gray-100">{{ catNameMap[child] ?? child }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar__widget mb-55">
      <div class="sidebar__widget-title mb-25">
        <h3>최신 글</h3>
      </div>
      <div class="sidebar__widget-content">
        <div class="rc__post-wrapper">
          <!-- 로딩 스켈레톤 -->
          <ul v-if="pending">
            <li v-for="n in 3" :key="n" class="d-flex mb-15">
              <div class="rc__post-thumb mr-20">
                <div class="skeleton-shimmer" style="width: 70px; height: 70px; border-radius: 4px;"></div>
              </div>
              <div class="rc__post-content flex-1">
                <div class="skeleton-shimmer mb-5" style="height: 14px; width: 80%; border-radius: 3px;"></div>
                <div class="skeleton-shimmer" style="height: 12px; width: 50%; border-radius: 3px;"></div>
              </div>
            </li>
          </ul>
          <!-- 최신 글 목록 -->
          <ul v-else>
            <li v-for="(blog, i) in recentBlogs" :key="i" class="d-flex">
              <div class="rc__post-thumb mr-20">
                <nuxt-link :to="`/blog-details/${blog.blogId}`">
                  <app-image
                    :src="blog.img"
                    :alt="blog.title"
                    :img-style="{ width: '70px', height: '70px', objectFit: 'cover' }"
                    :skeleton-style="{ width: '70px', height: '70px' }"
                  />
                </nuxt-link>
              </div>
              <div class="rc__post-content">
                <h6>
                  <nuxt-link :to="`/blog-details/${blog.blogId}`">
                    <span v-html="blog.title.slice(0, 20)"></span>
                  </nuxt-link>
                </h6>
                <div class="rc__meta">
                  <span>{{ blog.date }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sidebar__widget mb-55">
      <div class="sidebar__widget-title mb-25">
        <h3>최근 댓글</h3>
      </div>
      <div class="sidebar__widget-content">
        <div class="rc__comments">
          <ul>
            <li class="d-flex mb-20">
              <div class="rc__comments-avater mr-15">
                <app-image
                  src="/cdn/img/blog/comments/avater-3.png"
                  alt="김민수"
                  :img-style="{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }"
                  :skeleton-style="{ width: '40px', height: '40px', borderRadius: '50%' }"
                />
              </div>
              <div class="rc__comments-content">
                <h6>김민수</h6>
                <p>안녕하세요, 댓글입니다....</p>
                <span>글 <span class="highlight comment">안녕 세상!</span> 에</span>
              </div>
            </li>
            <li class="d-flex mb-20">
              <div class="rc__comments-avater mr-15">
                <app-image
                  src="/cdn/img/blog/comments/avater-3.png"
                  alt="이영희"
                  :img-style="{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }"
                  :skeleton-style="{ width: '40px', height: '40px', borderRadius: '50%' }"
                />
              </div>
              <div class="rc__comments-content">
                <h6>이영희</h6>
                <p>안녕하세요, 댓글입니다....</p>
                <span>글 <span class="highlight comment">안녕 세상!</span> 에</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sidebar__widget mb-55">
      <div class="sidebar__widget-title mb-25">
        <h3>아카이브</h3>
      </div>
      <div class="sidebar__widget-content">
        <div class="sidebar__links">
          <ul>
            <li><a href="#">2013년 12월</a></li>
            <li><a href="#">2013년 11월</a></li>
            <li><a href="#">2013년 9월</a></li>
            <li><a href="#">2012년 11월</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sidebar__widget mb-55">
      <div class="sidebar__widget-title mb-25">
        <h3>메타</h3>
      </div>
      <div class="sidebar__widget-content">
        <div class="sidebar__links">
          <ul>
            <li><a href="#">로그인</a></li>
            <li><a href="#">글 RSS</a></li>
            <li><a href="#">댓글 RSS</a></li>
            <li><a href="#">워드프레스</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그 사이드바');
import { ref, computed } from "vue";
import { useBlogs } from "~/composables/useBlogs";
import AppImage from "~/components/ui/AppImage.vue";
import { type CoCategoryTreeType } from "~/types/coCategoryTreeType";

const { blogs, pending } = useBlogs();

const recentBlogs = computed(() => (blogs.value ?? []).slice(3, 6));

const catNameMap: Record<string, string> = {
  category01: "조명",
  category02: "의자",
  category03: "의류",
  category07: "데코 & 악세서리",
  category08: "조명 & 의자",
  category09: "의류 & 오일",
  category10: "남성 패션",
  category11: "여성 패션",
};

const expandedIndex = ref<number>(0);

const categoryTreeData: CoCategoryTreeType[] = [
  {
    categoryId: "catSide01",
    parentTitle: "악세서리",
    value: "accessories",
    children: ["category01", "category02", "category03"],
  },
  {
    categoryId: "catSide02",
    parentTitle: "의류",
    value: "cloth",
    children: ["category01", "category02", "category03"],
  },
  {
    categoryId: "catSide03",
    parentTitle: "남성",
    value: "men",
    children: ["category01", "category02", "category03"],
  },
  {
    categoryId: "catSide04",
    parentTitle: "뮤직",
    value: "music",
    children: ["category01", "category02", "category03"],
  },
];

function toggle(i: number) {
  expandedIndex.value = expandedIndex.value === i ? -1 : i;
}
</script>

<style scoped>
.skeleton-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
