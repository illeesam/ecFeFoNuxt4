<template>
  <section :class="`subscribe__area ${style_2 ? 'grey-bg box-m-15' : ''} pb-100 ${style_3 ? 'p-relative' : ''}`">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div :class="`${style_3 ? 'custom-container' : 'container'} mx-auto`">
      <div :class="`subscribe__inner ${style_2 ? 'subscribe__inner-2 pt-120' : 'pt-95'}`">
        <div class="row flex justify-center">
          <div class="col-xl-8 col-lg-8 col-12 mx-auto">
            <div class="subscribe__content text-center">
              <h2>할인 정보 받기</h2>
              <p>정담 뉴스레터에 구독하시면 신상품, 특가 및 할인 정보를 받아보실 수 있습니다.</p>
              <div class="subscribe__form">
                <form @submit.prevent="handleFormSubmit">
                  <input required type="email" v-model="inputVal" placeholder="뉴스레터 구독 이메일..." />
                  <button class="os-btn os-btn-2 os-btn-3">구독하기</button>
                </form>
              </div>
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
useComponentTitle('구독');
import { ref } from "vue";

defineProps({
  style_2: { type: Boolean, default: false },
  style_3: { type: Boolean, default: false },
});
const inputVal = ref("");
function handleFormSubmit() {
  console.log(inputVal.value);
}
</script>
