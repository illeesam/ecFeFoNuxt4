<template>
  <div class="different-address">
    <xdev-file-path-badge file-path="app/components/checkout/DifferentAddress.vue" :absolute="true" />
    <div class="ship-different-title">
      <h3>
        <label for="ship-box">배송지가 다르면 체크</label>
        <input @click="handleShipBox" id="ship-box" type="checkbox" />
      </h3>
    </div>
    <div v-if="shipBox" id="ship-box-info">
      <div class="row">
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
      </div>
    </div>
    <!-- <ClientOnly> -->
    <div class="order-notes">
      <div class="checkout-form-list">
        <label>배송 메모</label>

        <textarea id="checkout-mess" cols="30" rows="10" placeholder="주문/배송 시 요청사항을 입력하세요." />
      </div>
    </div>
    <!-- </ClientOnly> -->
  </div>
</template>

<script setup lang="ts">
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('다른 배송지');
</script>

<script lang="ts">
import CountrySelect from "./CountrySelect.vue";

export default {
  components: { CountrySelect },
  data() {
    return {
      shipBox: false,
    };
  },
  methods: {
    handleShipBox() {
      this.shipBox = !this.shipBox;
    },
  },
};
</script>
