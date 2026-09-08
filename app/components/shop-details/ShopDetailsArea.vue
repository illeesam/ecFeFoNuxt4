<template>
  <section class="shop__area pb-65">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="shop__top shop__top--white pt-100 pb-90">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row">
          <div class="col-xl-6 col-lg-6">
            <div class="product-details__gallery">
              <div class="product-details__thumbs">
                <div class="product-details__thumb-list" id="product-details" role="tablist">
                  <button v-for="(img, i) in item.relatedImages" :key="i" :class="['product-details__thumb-btn', img === active_img ? 'active' : '']" @click="handleActiveImg(img)" type="button">
                      <div class="product__nav-img w-img">
                        <app-image
                          :src="img"
                          alt="product-thumb"
                          :img-style="{ width: '95px', height: '120px', objectFit: 'cover', display: 'block', borderRadius: '2px' }"
                          :skeleton-style="{ width: '95px', height: '120px' }"
                        />
                      </div>
                    </button>
                  </div>
              </div>
              <div class="product-details__main-wrap" id="product-detailsContent">
                <div class="product__modal-img product__thumb w-img product-details__main-img">
                  <app-image
                    :src="active_img"
                    alt="product_img"
                    :skeleton-style="{ width: '100%', aspectRatio: '3/4' }"
                  />
                  <div class="product__sale">
                    <span class="new">new</span>
                    <span class="percent">-16%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <product-details-content :item="item" :style_2="true" />
          </div>
        </div>
      </div>
    </div>

    <div class="shop__bottom shop__bottom--white">
      <div class="detail-tab-sticky" ref="tabNavRef" :style="{ top: headerH + 'px' }">
        <div class="max-w-7xl mx-auto px-4">
          <div class="detail-tab-bar">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="detail-tab-btn"
              :class="{ 'detail-tab-btn--active': activeTab === tab.id }"
              @click="scrollToSection(tab.id)"
            >{{ tab.label }}</button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4">
        <!-- 상품설명 섹션 -->
        <div ref="secDes" id="sec-des" class="detail-section">
          <h2 class="detail-section__title">상품설명</h2>
          <div class="product__details-des">
            <p>{{ item.details?.detailsText }}</p>
            <div class="product__details-des-list mb-20">
              <ul>
                <li v-for="(list, i) in item.details?.detailsList || []" :key="i">
                  <span>{{ list }}</span>
                </li>
              </ul>
            </div>
            <p>{{ item.details?.detailsText2 }}</p>
          </div>
        </div>

        <!-- 추가정보 섹션 -->
        <div ref="secAdd" id="sec-add" class="detail-section">
          <h2 class="detail-section__title">추가 정보</h2>
          <div class="product__details-add">
            <ul>
              <li><span>무게</span></li>
              <li><span>.25 KG</span></li>
              <li><span>치수</span></li>
              <li><span>62 x 56 x 12 cm</span></li>
              <li><span>사이즈</span></li>
              <li><span>XL, XXL, LG, SM, MD</span></li>
            </ul>
          </div>
        </div>

        <!-- 리뷰 섹션 (타이틀은 ProductDetailsReview 내부에 있으므로 생략) -->
        <div ref="secReview" id="sec-review" class="detail-section detail-section--review">
          <product-details-review :item="item" />
        </div>
      </div>
    </div>
  </section>

  <!-- 관련 상품 시작 -->
  <related-products :item="item" />
  <!-- 관련 상품 끝 -->
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 상세');
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { type PdProductType } from "~/types/pdProductType";
import ProductDetailsContent from "./ProductDetailsContent.vue";
import ProductDetailsReview from "./ProductDetailsReview.vue";
import RelatedProducts from "./RelatedProducts.vue";
import AppImage from "~/components/ui/AppImage.vue";

const props = defineProps<{
  item: PdProductType;
}>();

const active_img = ref(props.item.img);
watch(
  () => props.item.img,
  (v) => { active_img.value = v; },
);
function handleActiveImg(img: string) {
  active_img.value = img;
}

// ── 탭 & 섹션 스크롤 ─────────────────────────────
type TabId = 'des' | 'add' | 'review';
const tabs = computed(() => {
  const list = props.item.reviews ?? [];
  const n = list.reduce((sum, r) => sum + 1 + (r.replies?.length ?? 0), 0);
  return [
    { id: 'des' as TabId, label: '상품설명' },
    { id: 'add' as TabId, label: '추가 정보' },
    { id: 'review' as TabId, label: `리뷰 (${n})` },
  ];
});

const activeTab  = ref<TabId>('des');
const tabNavRef  = ref<HTMLElement | null>(null);
const secDes     = ref<HTMLElement | null>(null);
const secAdd     = ref<HTMLElement | null>(null);
const secReview  = ref<HTMLElement | null>(null);
const headerH    = ref(0);

function scrollToSection(id: TabId) {
  activeTab.value = id;
  const elMap: Record<TabId, HTMLElement | null> = {
    des:    secDes.value,
    add:    secAdd.value,
    review: secReview.value,
  };
  const el = elMap[id];
  if (!el) return;
  const navH  = tabNavRef.value?.offsetHeight ?? 52;
  const total = headerH.value + navH + 12;
  const top   = el.getBoundingClientRect().top + window.scrollY - total;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

// IntersectionObserver: 스크롤 중 활성 탭 자동 변경
let observer: IntersectionObserver | null = null;
let headerObserver: ResizeObserver | null = null;
onMounted(() => {
  // 고정 헤더 높이 추적
  const headerEl = document.getElementById('header-sticky');
  if (headerEl) {
    headerH.value = headerEl.offsetHeight;
    headerObserver = new ResizeObserver(() => {
      headerH.value = headerEl.offsetHeight;
    });
    headerObserver.observe(headerEl);
  }

  const entries: { id: TabId; el: HTMLElement | null }[] = [
    { id: 'des',    el: secDes.value },
    { id: 'add',    el: secAdd.value },
    { id: 'review', el: secReview.value },
  ];
  observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        if (record.isIntersecting) {
          const id = record.target.id.replace('sec-', '') as TabId;
          activeTab.value = id;
        }
      }
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
  );
  entries.forEach(({ el }) => { if (el) observer!.observe(el); });
});
onUnmounted(() => {
  observer?.disconnect();
  headerObserver?.disconnect();
});
</script>

<style scoped>
.shop__top--white,
.shop__bottom--white {
  background-color: #fff;
}

/* 썸네일 왼쪽, 큰 이미지 오른쪽 */
.product-details__gallery {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}
.product-details__thumbs { grid-column: 1; }
.product-details__thumb-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0; padding: 0; list-style: none;
}
.product-details__thumb-btn {
  margin: 0; padding: 0;
  border: 2px solid transparent;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  display: block;
}
.product-details__thumb-btn.active { border-color: #bc8246; }
.product-details__thumb-btn img {
  display: block; width: 95px; height: 120px;
  object-fit: cover; border-radius: 2px;
}
.product-details__main-wrap { grid-column: 2; min-width: 0; }
.product-details__main-img {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

/* ── 탭 네비게이션 (스크롤 시 상단 고정은 사용 안 함) ── */
.detail-tab-sticky {
  position: sticky;
  top: 0; /* JS가 :style로 top 덮어씀 (headerH) */
  z-index: 40;
  background: #fff;
  border-bottom: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 52px;
}
.detail-tab-bar {
  display: flex;
  gap: 0;
}
.detail-tab-btn {
  padding: 16px 28px;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.detail-tab-btn:hover { color: #374151; }
.detail-tab-btn--active {
  color: #bc8246;
  border-bottom-color: #bc8246;
  font-weight: 700;
}

/* ── 섹션 (탭 클릭 시 스무스 스크롤 대상) ── */
.detail-section {
  padding: 48px 0 40px;
  border-bottom: 1px solid #f0f0f0;
  scroll-margin-top: 120px; /* 고정 헤더+탭바 아래로 보이도록 */
}
.detail-section:last-child { border-bottom: none; }

.detail-section__title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

/* 리뷰 섹션: 타이틀 없으므로 상단 여백만 추가 */
.detail-section--review {
  padding-top: 56px;
}
</style>
