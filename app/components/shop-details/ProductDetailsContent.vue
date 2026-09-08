<template>
  <div :class="`product__modal-content ${style_2 ? 'product__modal-content-2' : ''}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <h4>
      <nuxt-link :to="`/product-details/${item.productId}`">
        <span v-html="item.title"></span>
      </nuxt-link>
    </h4>
    <div class="rating rating-shop mb-15">
      <ul>
        <li>
          <span><i class="fas fa-star"></i></span>
        </li>
        <li>
          <span><i class="fas fa-star"></i></span>
        </li>
        <li>
          <span><i class="fas fa-star"></i></span>
        </li>
        <li>
          <span><i class="fas fa-star"></i></span>
        </li>
        <li>
          <span><i class="fal fa-star"></i></span>
        </li>
      </ul>
      <span class="rating-no ml-10"> {{ item.rating }}개 평점 </span>
    </div>
    <div class="product__price-2 mb-25">
      <span>{{ formatPrice(item.price) }}</span>
      <span v-if="item.oldPrice" class="old-price">{{ formatPrice(item.oldPrice) }}</span>
    </div>
    <div class="product__modal-des mb-30">
      <p>{{ item.smDesc }}</p>
    </div>
    <div class="product__modal-form">
      <form action="#">
        <!-- 색상 선택 (위) -->
        <div class="product__modal-input color mb-20">
          <label>색상 선택</label>
          <div class="color-swatches">
            <button
              v-for="opt in item.optionColors"
              :key="opt.optionCode ?? opt.optionId"
              type="button"
              :title="opt.optionName"
              class="color-swatch"
              :class="{ selected: selectedColor === (opt.optionCode ?? String(opt.optionId)) }"
              :style="{ '--swatch-color': colorMap[opt.optionCode ?? ''] ?? '#ccc' }"
              @click="selectedColor = opt.optionCode ?? String(opt.optionId)"
            ></button>
          </div>
          <span v-if="selectedColor" class="selected-label">선택: {{ item.optionColors.find((o) => (o.optionCode ?? String(o.optionId)) === selectedColor)?.optionName }}</span>
        </div>
        <!-- 사이즈 선택 (아래) -->
        <div class="product__modal-input size mb-20">
          <label>사이즈 <i class="fas fa-star-of-life"></i></label>
          <div class="size-chips">
            <span v-if="!item.optionSizes?.length" class="size-none">사이즈 없음</span>
            <button
              v-for="opt in item.optionSizes"
              :key="opt.optionCode ?? opt.optionId"
              type="button"
              class="size-chip"
              :class="{ selected: selectedSize === (opt.optionCode ?? String(opt.optionId)) }"
              @click="selectedSize = opt.optionCode ?? String(opt.optionId)"
            >
              {{ opt.optionName }}
            </button>
          </div>
        </div>
        <div class="product__modal-required mb-5">
          <span>필수 입력 항목 *</span>
        </div>
        <div class="pro-quan-area flex flex-nowrap items-center gap-3">
          <div class="product-quantity-title shrink-0">
            <label>수량</label>
          </div>
          <div class="product-quantity shrink-0">
            <div class="cart-plus-minus">
              <input type="text" v-model="state.orderQuantity" />
              <div @click="state.orderQuantity > 1 ? state.orderQuantity-- : (state.orderQuantity = 1)" class="dec qtybutton">-</div>
              <div @click="state.orderQuantity++" class="inc qtybutton">+</div>
            </div>
          </div>
          <div class="pro-cart-btn shrink-0">
            <a @click.prevent="state.addStCartProduct(item)" href="#" class="os-btn os-btn-black os-btn-3">+ 장바구니 추가</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle("상품 상세 내용");
import { ref } from "vue";
import { type PdProductType } from "~/types/pdProductType";
import { useCartStore } from "~/store/useCartStore";

defineProps<{
  item: PdProductType;
  style_2?: boolean;
}>();
const state = useCartStore();
const { formatPrice } = usePrice();

const selectedColor = ref("");
const selectedSize = ref("");

const colorMap: Record<string, string> = {
  color01: "#E74C3C", // 빨강
  color02: "#3498DB", // 파랑
  color03: "#2ECC71", // 초록
  color04: "#F1C40F", // 노랑
  color05: "#9B59B6", // 보라
  color06: "#1A1A1A", // 검정
  color07: "#95A5A6", // 회색
  color08: "#F8F9FA", // 흰색
  color09: "#8B6347", // 갈색
  color10: "#000000", // 블랙
};
</script>

<style scoped>
/* ── 색상 스와치 ── */
.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 8px;
}

.color-swatch {
  --swatch-color: #ccc;
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  background: var(--swatch-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.14);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.color-swatch:hover {
  transform: scale(1.12);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-swatch.selected {
  transform: scale(1.12);
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #555,
    0 2px 6px rgba(0, 0, 0, 0.2);
}

.selected-label {
  font-size: 12px;
  color: #666;
  margin-left: 2px;
}

/* ── 사이즈 칩 ── */
.size-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.size-chip {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1.5px solid #d0d0d0;
  background: #fafafa;
  font-size: 13px;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s;
  letter-spacing: 0.02em;
}

.size-chip:hover {
  border-color: #888;
  background: #f0f0f0;
  color: #222;
}

.size-chip.selected {
  border-color: #222;
  background: #222;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.size-none {
  font-size: 13px;
  color: #aaa;
}
</style>
