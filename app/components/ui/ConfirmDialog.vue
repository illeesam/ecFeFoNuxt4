<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div
        v-show="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        @click.self="cancel"
      >
        <div class="confirm-dialog relative w-full max-w-sm rounded-xl bg-white shadow-xl p-6">
          <h3 id="confirm-dialog-title" class="text-lg font-semibold text-gray-900 mb-2">
            {{ title ?? '확인' }}
          </h3>
          <p class="text-gray-600 mb-6">{{ message }}</p>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                variant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800',
              ]"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function confirm() {
  emit('confirm');
}
function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
.confirm-fade-enter-active .confirm-dialog,
.confirm-fade-leave-active .confirm-dialog {
  transition: transform 0.2s ease;
}
.confirm-fade-enter-from .confirm-dialog,
.confirm-fade-leave-to .confirm-dialog {
  transform: scale(0.95);
}
</style>
