<template>
  <div>
    <Header />
    <main class="box-white bg-gray-100 pt-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="box-white-inner">
          <div class="row">
            <div class="col-xl-12">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer-two />
    <back-to-top />
  </div>
</template>

<script setup lang="ts">
import Header from "./headers/Header.vue";
import FooterTwo from "./footers/FooterTwo.vue";
import BackToTop from "~/components/back-to-top/BackToTop.vue";
</script>
