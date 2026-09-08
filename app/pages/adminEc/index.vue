<template>
  <div class="pt-6 px-6 pb-4">
    <h1 class="text-xl font-bold text-gray-800 mb-6">대시보드</h1>

    <!-- 요약 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p class="text-sm text-gray-500">오늘 주문</p>
        <p class="text-2xl font-bold text-gray-800">{{ summary.todayOrders }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p class="text-sm text-gray-500">오늘 매출</p>
        <p class="text-2xl font-bold text-amber-600">{{ summary.todaySales.toLocaleString() }}원</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p class="text-sm text-gray-500">이번 달 신규 회원</p>
        <p class="text-2xl font-bold text-gray-800">{{ summary.monthNewMembers }}</p>
      </div>
      <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <p class="text-sm text-gray-500">미처리 클래임</p>
        <p class="text-2xl font-bold text-red-600">{{ summary.pendingClaims }}</p>
      </div>
    </div>

    <!-- 차트 그리드 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 주문실적 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-800 mb-4">주문실적 (최근 7일)</h2>
        <AdminChartBar
          :labels="chartLabels.week"
          :datasets="[{ label: '주문건수', data: orderData }]"
        />
      </div>
      <!-- 판매현황 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-800 mb-4">판매현황 (최근 7일, 만원)</h2>
        <AdminChartLine
          :labels="chartLabels.week"
          :datasets="[{ label: '일매출', data: salesData }]"
        />
      </div>
      <!-- 회원가입현황 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-800 mb-4">회원가입현황 (월별)</h2>
        <AdminChartBar
          :labels="chartLabels.month"
          :datasets="[{ label: '가입수', data: memberJoinData, backgroundColor: 'rgba(34, 197, 94, 0.6)' }]"
        />
      </div>
      <!-- 회원탈퇴현황 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 class="text-base font-semibold text-gray-800 mb-4">회원탈퇴현황 (월별)</h2>
        <AdminChartBar
          :labels="chartLabels.month"
          :datasets="[{ label: '탈퇴수', data: memberLeaveData, backgroundColor: 'rgba(239, 68, 68, 0.6)' }]"
        />
      </div>
      <!-- 클래임현황 -->
      <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm lg:col-span-2">
        <h2 class="text-base font-semibold text-gray-800 mb-4">클래임현황 (월별)</h2>
        <AdminChartLine
          :labels="chartLabels.month"
          :datasets="[
            { label: '접수', data: claimReceiveData },
            { label: '처리완료', data: claimDoneData },
            { label: '미처리', data: claimPendingData },
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageTitle } from "~/composables/usePageTitle";
definePageMeta({ layout: "admin" });
usePageTitle("이커머스 대시");

// 정적 데이터
const summary = reactive({
  todayOrders: 42,
  todaySales: 3850000,
  monthNewMembers: 128,
  pendingClaims: 7,
});

const chartLabels = {
  week: ["월", "화", "수", "목", "금", "토", "일"],
  month: ["1월", "2월", "3월", "4월", "5월", "6월"],
};

const orderData = [32, 45, 38, 52, 48, 61, 55];
const salesData = [320, 410, 380, 520, 480, 610, 550];
const memberJoinData = [85, 92, 78, 105, 98, 112];
const memberLeaveData = [12, 8, 15, 10, 9, 11];
const claimReceiveData = [18, 22, 19, 25, 21, 24];
const claimDoneData = [16, 20, 18, 23, 20, 22];
const claimPendingData = [2, 2, 1, 2, 1, 2];
</script>
