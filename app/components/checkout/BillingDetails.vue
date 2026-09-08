<template>
  <div class="row">
    <xdev-file-path-badge file-path="app/components/checkout/BillingDetails.vue" :absolute="true" />
    <div class="col-md-12">
      <country-select />
    </div>
    <div class="col-md-6">
      <div class="checkout-form-list">
        <label>이름 <span class="required">*</span></label>
        <input type="text" placeholder="이름" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="checkout-form-list">
        <label>성 <span class="required">*</span></label>
        <input type="text" placeholder="성" />
      </div>
    </div>
    <div class="col-md-12">
      <div class="checkout-form-list">
        <label>회사명</label>
        <input type="text" placeholder="회사명 (선택)" />
      </div>
    </div>
    <div class="col-md-12">
      <div class="checkout-form-list">
        <label>주소 <span class="required">*</span></label>
        <input type="text" placeholder="도로명 주소" />
      </div>
    </div>
    <div class="col-md-12">
      <div class="checkout-form-list">
        <input type="text" placeholder="상세 주소 (동, 호수 등, 선택)" />
      </div>
    </div>
    <div class="col-md-12">
      <div class="checkout-form-list">
        <label>시/군/구 <span class="required">*</span></label>
        <input type="text" placeholder="시/군/구" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="checkout-form-list">
        <label>시/도 <span class="required">*</span></label>
        <input type="text" placeholder="시/도" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="checkout-form-list">
        <label>우편번호 <span class="required">*</span></label>
        <input type="text" placeholder="우편번호" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="checkout-form-list">
        <label>이메일 <span class="required">*</span></label>
        <input type="email" placeholder="이메일" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="checkout-form-list">
        <label>연락처 <span class="required">*</span></label>
        <input type="text" placeholder="연락처" />
      </div>
    </div>
    <div class="col-md-12">
      <div class="checkout-form-list create-acc">
        <input @click="handleCreateAccount" id="cbox" type="checkbox" />
        <label for="cbox">계정을 만들까요?</label>
      </div>
      <div v-if="createAccount" id="cbox_info" class="checkout-form-list create-account">
        <p>아래 정보를 입력하여 계정을 만드세요. 기존 회원은 상단에서 로그인하세요.</p>
        <label>계정 비밀번호 <span class="required">*</span></label>
        <input type="password" placeholder="비밀번호" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('결제 정보');
</script>

<script lang="ts">
import CountrySelect from "./CountrySelect.vue";

export default {
  components: { CountrySelect },
  data() {
    return {
      createAccount: false,
    };
  },
  methods: {
    handleCreateAccount() {
      this.createAccount = !this.createAccount;
    },
  },
};
</script>
