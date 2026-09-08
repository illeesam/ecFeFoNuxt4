<template>
  <NuxtPage />
  <XdevFilePathBadgeOverlay />
  <!-- 전역 확인/알림 다이얼로그 (useConfirm / useAlert) -->
  <ConfirmDialog
    :open="confirmState.open"
    :title="confirmState.title"
    :message="confirmState.message"
    :confirm-text="confirmState.confirmText"
    :cancel-text="confirmState.cancelText"
    :variant="confirmState.variant"
    @confirm="confirmHandleConfirm"
    @cancel="confirmHandleCancel"
  />
  <AlertDialog
    :open="alertState.open"
    :title="alertState.title"
    :message="alertState.message"
    :confirm-text="alertState.confirmText"
    @close="alertHandleClose"
  />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import ConfirmDialog from "~/components/ui/ConfirmDialog.vue";
import AlertDialog from "~/components/ui/AlertDialog.vue";

const { public: { appTitle } } = useRuntimeConfig();

const { state: confirmState, handleConfirm: confirmHandleConfirm, handleCancel: confirmHandleCancel } = useConfirm();
const { state: alertState, handleClose: alertHandleClose } = useAlert();
useHead({
  titleTemplate: (title) => title ? `${title} | ${appTitle}` : appTitle,
});
import { useCartStore } from "~/store/useCartStore";
import { useProductsStore } from "~/store/useProductsStore";
import { useCodeStore } from "~/store/useCodeStore";
import { useAuthStore } from "~/store/useAuthStore";

const cartStore = useCartStore();
const productsStore = useProductsStore();
const codeStore = useCodeStore();
const authStore = useAuthStore();

onMounted(async () => {
  // 장바구니 복원 (localStorage)
  void cartStore.loadStCartProducts;

  // 공통 코드 (색상·사이즈 옵션) 로드
  await codeStore.loadStCodes();

  // 토큰 로드 후 사용자 정보 조회
  authStore.loadStToken();
  await authStore.loadStAuthInfo();

  // 상품 목록 로드 (CSR)
  productsStore.loadStProducts();
});
</script>
