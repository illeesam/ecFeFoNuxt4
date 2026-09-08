<template>
  <Teleport to="body">
    <Transition name="alert-fade">
      <div
        v-show="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        @click.self="close"
      >
        <div class="alert-dialog relative w-full max-w-sm rounded-xl bg-white shadow-xl p-6">
          <h3 id="alert-dialog-title" class="text-lg font-semibold text-gray-900 mb-2">
            {{ title ?? "알림" }}
          </h3>
          <p class="text-gray-600 mb-6">{{ message }}</p>
          <div class="flex justify-end">
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              @click="close"
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
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}
</script>

<style scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.2s ease;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}
.alert-fade-enter-active .alert-dialog,
.alert-fade-leave-active .alert-dialog {
  transition: transform 0.2s ease;
}
.alert-fade-enter-from .alert-dialog,
.alert-fade-leave-to .alert-dialog {
  transform: scale(0.95);
}
</style>
