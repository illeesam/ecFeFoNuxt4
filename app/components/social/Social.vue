<template>
  <li v-for="(item, i) in social_links" :key="i">
    <xdev-file-path-badge file-path="app/components/social/Social.vue" :absolute="true" />
    <a :href="item.link" :target="item.target">
      <i :class="item.icon"></i>
    </a>
  </li>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('소셜 링크');
</script>

<script lang="ts">
export default {
  data() {
    return {
      social_links: [
        {
          link: "http://facebook.com",
          target: "_blank",
          icon: "fab fa-facebook-f",
          name: "Facebook",
        },
        {
          link: "http://twitter.com",
          target: "_blank",
          icon: "fab fa-twitter",
          name: "Twitter",
        },
        {
          link: "https://www.behance.net/",
          target: "_blank",
          icon: "fab fa-behance",
          name: "Behance",
        },
        {
          link: "https://dribbble.com/",
          target: "_blank",
          icon: "fab fa-dribbble",
          name: "Dribbble",
        },
      ],
    };
  },
};
</script>
