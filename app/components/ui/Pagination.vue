<template>
  <div :class="`shop-pagination-wrapper ${style_2 ? '' : 'd-md-flex justify-between items-center'}`">
    <div class="basic-pagination">
      <ul>
        <li class="page-item" :class="{ disabled: currPage === 1 }" @click.prevent="setPage(currPage - 1)">
          <a href="#">
            <i class="fal fa-angle-left"></i>
          </a>
        </li>

        <li class="page-item" v-for="n in totalPage" @click.prevent="setPage(n)" :key="n">
          <a :class="[`page-link`, { active: currPage === n }]" href="">
            {{ n }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currPage === totalPage }" @click.prevent="setPage(currPage + 1)">
          <a href="#">
            <i class="fal fa-angle-right"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  countOfPage: { type: Number, default: 8 },
  paginationClass: { type: String },
  style_2: { type: Boolean, default: false },
});
const emit = defineEmits<{ (e: "paginatedData", rows: unknown[], start: number, count: number): void }>();

const currPage = ref(1);
const filteredRows = computed(() => props.items);
const pageStart = computed(() => (currPage.value - 1) * props.countOfPage);
const totalPage = computed(() => Math.ceil((filteredRows.value?.length ?? 0) / props.countOfPage));

function emitPaginated() {
  emit("paginatedData", filteredRows.value ?? [], pageStart.value, props.countOfPage);
}

function setPage(idx: number) {
  if (idx <= 0 || idx > totalPage.value) return;
  currPage.value = idx;
  window.scrollTo(0, 0);
  emitPaginated();
}

onMounted(() => {
  emitPaginated();
});

// API 등으로 items가 나중에 로드되면 목록에 반영
watch(
  () => props.items,
  () => {
    currPage.value = 1;
    emitPaginated();
  },
  { deep: true }
);
</script>
