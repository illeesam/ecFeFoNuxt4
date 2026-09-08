<template>
  <Form :validation-schema="schema" @submit="onSubmit">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="mb-20">
      <label for="name">사용자명 <span>**</span></label>
      <Field name="name" id="name" type="text" placeholder="사용자명 입력" />
      <ErrorMessage name="name" class="text-danger" />
    </div>

    <div class="mb-20">
      <label for="email-id">이메일 주소 <span>**</span></label>
      <Field name="email" id="email-id" type="text" placeholder="이메일 주소..." />
      <ErrorMessage name="email" class="text-danger" />
    </div>

    <div class="mb-20">
      <label for="pass">비밀번호 <span>**</span></label>
      <Field name="password" id="pass" type="password" placeholder="비밀번호 입력..." />
      <ErrorMessage name="password" class="text-danger" />
    </div>

    <div class="mt-10"></div>
    <button type="submit" class="os-btn w-full">회원가입</button>
    <div class="or-divide"><span>또는</span></div>
    <nuxt-link href="/login" class="os-btn os-btn-black w-full">로그인</nuxt-link>
  </Form>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('회원가입 폼');
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import type { MbMbRegisterFormType } from "~/types/mbMbRegisterFormType";

const schema = yup.object({
  name: yup.string().required("이름을 입력해 주세요").label("이름"),
  email: yup.string().required("이메일을 입력해 주세요").email("올바른 이메일 주소를 입력해 주세요").label("이메일"),
  password: yup.string().required("비밀번호를 입력해 주세요").min(6, "비밀번호는 6자 이상이어야 합니다").label("비밀번호"),
});

async function onSubmit(values: MbRegisterFormType, { resetForm }: { resetForm: () => void }) {
  await useAlert().openAlert(JSON.stringify(values, null, 2));
  resetForm();
}
</script>
