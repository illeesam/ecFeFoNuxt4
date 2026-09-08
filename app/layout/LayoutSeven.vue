<template>
  <div class="fix">
    <header-four />
    <slot></slot>
    <footer-three />
    <back-to-top />
  </div>
</template>

<script setup lang="ts">
import HeaderFour from "./headers/HeaderFour.vue";
import FooterThree from "./footers/FooterThree.vue";
import BackToTop from "~/components/back-to-top/BackToTop.vue";
</script>
