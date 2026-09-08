<template>
  <div class="pt-4 px-4 sm:pt-6 sm:px-6 pb-4 min-w-0 overflow-visible">
    <div class="flex items-center gap-2 mb-4">
      <a href="/adminEc/orders" class="text-gray-500 hover:text-gray-700" @click.prevent="goToList('/adminEc/orders', '주문관리')">← 목록</a>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">{{ mode === 'new' ? '주문 등록' : mode === 'edit' ? '주문 수정' : '주문 상세' }}</h1>
    <div class="bg-white rounded-lg border border-gray-200 shadow p-4 sm:p-6 w-full max-w-full overflow-visible">
      <!-- 상세(보기): 라벨 5.5rem + 값 min-w-0 -->
      <template v-if="mode === 'view' && order">
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">주문ID</dt>
            <dd class="min-w-0 break-words">{{ order.orderId }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">주문번호</dt>
            <dd class="min-w-0 break-words">{{ order.orderNo }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">회원명</dt>
            <dd class="min-w-0 break-words">{{ order.memberName }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">금액</dt>
            <dd class="min-w-0 break-words">{{ order.amount != null ? order.amount.toLocaleString() + "원" : "-" }}</dd>
          </div>
          <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
            <dt class="text-gray-500 shrink-0">상태</dt>
            <dd class="min-w-0 break-words">{{ order.status }}</dd>
          </div>
        </dl>
        <div class="flex gap-2 mt-6">
          <NuxtLink :to="`/adminEc/orders/${order.orderId}-edit`" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">수정</NuxtLink>
        </div>
      </template>
      <!-- 신규/수정 폼: 라벨 5.5rem + 입력 min-w-0 -->
      <template v-else-if="mode === 'edit' || mode === 'new'">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div v-if="mode === 'edit'" class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">주문ID</label>
              <input :value="order?.orderId" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full bg-gray-100 text-gray-600" disabled />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">주문번호</label>
              <input v-model="form.orderNo" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">회원명</label>
              <input v-model="form.memberName" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">금액</label>
              <input v-model.number="form.amount" type="number" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
            <div class="grid grid-cols-[5.5rem_1fr] gap-2 items-center min-w-0 overflow-hidden pr-1">
              <label class="text-sm text-gray-500 shrink-0">상태</label>
              <input v-model="form.status" type="text" class="border rounded px-3 py-2 min-w-[8rem] w-full max-w-full" />
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">저장</button>
            <NuxtLink :to="mode === 'new' ? '/adminEc/orders' : `/adminEc/orders/${entityId}`" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">취소</NuxtLink>
          </div>
        </form>
      </template>
      <p v-if="mode === 'view' && !order && !loading" class="text-gray-500">데이터가 없습니다.</p>
      <p v-if="loading" class="text-gray-500">로딩 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageTitle } from "~/composables/usePageTitle";
import { useAdminListNav } from "~/composables/useAdminListNav";
definePageMeta({ layout: "admin" });
usePageTitle("주문 상세");
const { goToList } = useAdminListNav();

const route = useRoute();
const rawId = computed(() => (route.params.id as string) ?? "");

const mode = computed(() => {
  if (rawId.value === "new") return "new";
  if (rawId.value.endsWith("-edit")) return "edit";
  return "view";
});
const entityId = computed(() => (rawId.value === "new" ? "" : rawId.value.replace(/-edit$/, "")));

const order = ref<{ orderId: number; orderNo: string; memberName: string; amount: number; status: string } | null>(null);
const loading = ref(false);
const form = reactive({ orderNo: "", memberName: "", amount: 0, status: "" });

const pageTitle = computed(() => {
  if (mode.value === "new") return "주문 등록";
  if (order.value) return `주문상세(${order.value.orderId})`;
  return entityId.value ? `주문상세(${entityId.value})` : "주문 상세";
});
useHead(() => ({ title: pageTitle.value }));

async function load() {
  if (mode.value === "new") return;
  if (!entityId.value) return;
  loading.value = true;
  try {
    // TODO: API /adminEc/orders/:id
    order.value = {
      orderId: Number(entityId.value),
      orderNo: "ORD-2024-001",
      memberName: "김회원",
      amount: 50000,
      status: "결제완료",
    };
    if (order.value && mode.value === "edit") {
      form.orderNo = order.value.orderNo;
      form.memberName = order.value.memberName;
      form.amount = order.value.amount;
      form.status = order.value.status;
    }
  } finally {
    loading.value = false;
  }
}

async function save() {
  // TODO: API POST/PUT
  await useAlert().openAlert("저장 기능은 API 연동 후 구현됩니다.");
}

watch([rawId, mode], load, { immediate: true });
</script>
