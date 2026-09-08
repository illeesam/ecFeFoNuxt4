<template>
  <div class="video__area-df" :style="{ backgroundImage: `url(${bg})` }">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="video__content text-center">
        <div class="video__button mb-60">
          <a @click.prevent="handleVideoPopup" href="#">
            <i class="fas fa-play"></i>
          </a>
        </div>
        <h5 class="video__title">영상 라이트박스</h5>
        <p>영상 라이트박스는 영상을 보여주는 라이트박스입니다.</p>
      </div>
    </div>
  </div>

  <!-- 비디오 모달 시작 -->
  <video-modal ref="video_modal" video-url="https://www.youtube.com/embed/7e90gBu4pas" />
  <!-- 비디오 모달 끝 -->
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('동영상');
import { ref } from "vue";
const bg = "/cdn/img/bg/bg-video.webp";
import VideoModal from "../common/modals/VideoModal.vue";

const video_modal = ref<InstanceType<typeof VideoModal> | null>(null);
function handleVideoPopup() {
  video_modal.value?.playVideo();
}
</script>
