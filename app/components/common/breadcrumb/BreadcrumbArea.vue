<template>
  <section class="page__title relative flex items-center" :style="{ backgroundImage: `url(${bg})` }">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-12">
          <div class="page__title-inner text-center">
            <h1>{{ title }}</h1>
            <div class="page__title-breadcrumb">
              <nav aria-label="브레드크럼">
                <ol class="breadcrumb justify-center">
                  <li class="breadcrumb-item"><nuxt-link href="/">홈</nuxt-link></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ subtitle }}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('브레드크럼');
const bg = "/cdn/img/page-title/page-title-1.jpg";

defineProps<{
  title: string;
  subtitle: string;
}>();
</script>
