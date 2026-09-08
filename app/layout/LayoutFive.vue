<template>
  <div>
    <header-two />
    <slot></slot>
    <Footer />
    <back-to-top />
  </div>
</template>

<script setup lang="ts">
import HeaderTwo from "./headers/HeaderTwo.vue";
import Footer from "./footers/Footer.vue";
import BackToTop from "~/components/back-to-top/BackToTop.vue";
</script>
