<template>
  <div id="video-overlay" class="video-overlay" @click="closeVideo">
    <xdev-file-path-badge file-path="app/components/common/modals/VideoModal.vue" :absolute="true" />
    <a class="video-overlay-close" @click.prevent="closeVideo">x</a>
  </div>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('동영상 모달');
</script>

<script lang="ts">
export default {
  props: {
    videoUrl: {
      type: String,
      default: "https://www.youtube.com/embed/EW4ZYb3mCZk",
      required: true,
    },
  },
  methods: {
    playVideo() {
      const videoOverlay = document.querySelector("#video-overlay");
      let iframeElement = document.createElement("iframe");

      iframeElement.setAttribute("src", this.videoUrl);
      iframeElement.style.width = "60%";
      iframeElement.style.height = "80%";

      videoOverlay?.classList.add("open");
      videoOverlay.appendChild(iframeElement);
    },
    closeVideo() {
      const videoOverlay = document.querySelector("#video-overlay.open"),
        iframeElement = document.querySelector("#video-overlay.open iframe");

      videoOverlay?.classList.remove("open");
      iframeElement?.remove();
    },
  },
};
</script>
