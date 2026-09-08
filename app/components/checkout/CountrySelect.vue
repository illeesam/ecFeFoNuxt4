<template>
  <div class="country-select">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <label>국가 <span class="required">*</span></label>
    <select>
      <option value="">선택하세요</option>
      <option value="kr">대한민국</option>
      <option value="bangladesh">방글라데시</option>
      <option value="Algeria">알제리</option>
      <option value="Afghanistan">아프가니스탄</option>
      <option value="Ghana">가나</option>
      <option value="Albania">알바니아</option>
      <option value="Bahrain">바레인</option>
      <option value="Colombia">콜롬비아</option>
      <option value="Dominican Republic">도미니카 공화국</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('국가 선택');
</script>
