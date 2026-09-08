<template>
  <section class="coupon-area pt-100 pb-30">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-md-6">
          <div class="coupon-accordion">
            <!-- 아코디언 시작 -->
            <h3>
              기존 회원이신가요?
              <span @click="handleCheckoutLogin" id="showlogin">로그인하려면 클릭</span>
            </h3>
            <div v-if="checkoutLogin" id="checkout-login" class="coupon-content">
              <div class="coupon-info">
                <p class="coupon-text">기존 회원은 로그인 후 주문을 이어가실 수 있습니다.</p>
                <form @submit.prevent="handleSubmit">
                  <p class="form-row-first">
                    <label>아이디 또는 이메일 <span class="required">*</span></label>
                    <input type="text" v-model="formValue.name_or_email" />
                  </p>
                  <p class="form-row-last">
                    <label>비밀번호 <span class="required">*</span></label>
                    <input type="text" v-model="formValue.password" />
                  </p>
                  <p class="form-row">
                    <button class="os-btn os-btn-black" type="submit">로그인</button>
                    <label>
                      <input type="checkbox" v-model="formValue.isChecked" />
                      로그인 상태 유지
                    </label>
                  </p>
                  <p class="lost-password">
                    <nuxt-link href="/login">비밀번호를 잊으셨나요?</nuxt-link>
                  </p>
                </form>
              </div>
            </div>
            <!-- 아코디언 끝 -->
          </div>
        </div>
        <div class="col-md-6">
          <div class="coupon-accordion">
            <!-- 아코디언 시작 -->
            <h3>
              쿠폰이 있으신가요?
              <span @click="handleCheckoutCoupon" id="showcoupon">쿠폰 코드 입력하기</span>
            </h3>
            <div v-if="checkoutCoupon" id="checkout_coupon" class="coupon-checkout-content">
              <div class="coupon-info">
                <form @submit.prevent="handleCouponSubmit">
                  <p class="checkout-coupon">
                    <input v-model="couponVal" type="text" placeholder="쿠폰 코드" />
                    <button class="os-btn os-btn-black" type="submit">쿠폰 적용</button>
                  </p>
                </form>
              </div>
            </div>
            <!-- 아코디언 끝 -->
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
useComponentTitle('쿠폰');
import { ref, reactive } from "vue";
import type { SySyCheckoutLoginFormType } from "~/types/sySyCheckoutLoginFormType";

const checkoutLogin = ref(false);
const checkoutCoupon = ref(false);
const formValue = reactive<SyCheckoutLoginFormType>({
  name_or_email: "",
  password: "",
  isChecked: false,
});
const couponVal = ref("");

function handleCheckoutLogin() {
  checkoutLogin.value = !checkoutLogin.value;
}
function handleCheckoutCoupon() {
  checkoutCoupon.value = !checkoutCoupon.value;
}
function handleSubmit() {
  formValue.name_or_email = "";
  formValue.password = "";
  formValue.isChecked = false;
}
function handleCouponSubmit() {
  console.log(couponVal.value);
  couponVal.value = "";
}
</script>
