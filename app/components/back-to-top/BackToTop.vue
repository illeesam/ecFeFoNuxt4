<template>
  <div class="scroll-top" id="scroll" style="display: none">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <a href="#"><i class="fas fa-level-up-alt"></i></a>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('맨 위로');
import { onMounted } from "vue";

onMounted(() => {
  const result = document.querySelector<HTMLElement>(".scroll-top");
  if (result) {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        result.style.display = "block";
      } else {
        result.style.display = "none";
      }
    });
    result.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
</script>
