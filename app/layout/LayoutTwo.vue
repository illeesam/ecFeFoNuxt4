<template>
  <div>
    <Header :header_big="true" />
    <slot></slot>
    <div class="box-25 box-pb-40">
      <Footer :box_style="true" />
    </div>
    <back-to-top />
  </div>
</template>

<script setup lang="ts">
import Header from "./headers/Header.vue";
import Footer from "./footers/Footer.vue";
import BackToTop from "~/components/back-to-top/BackToTop.vue";
</script>
