<template>
  <Teleport to="body">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div v-show="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" id="profile_edit_modal" aria-labelledby="profile_edit_modal">
      <div class="relative w-full max-w-lg rounded-lg bg-white shadow-xl profile__edit-wrapper">
        <div class="profile__edit-close absolute top-2 right-2">
          <button type="button" class="profile__edit-close-btn p-2" @click="close">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <profile-edit-form />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('프로필 수정 모달');
import { ref } from "vue";
import ProfileEditForm from "~/components/forms/ProfileEditForm.vue";

const visible = ref(false);
function show() {
  visible.value = true;
}
function close() {
  visible.value = false;
}
defineExpose({ show, close });
</script>
