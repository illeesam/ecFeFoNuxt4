<template>
  <Form :validation-schema="schema" @submit="onSubmit">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="profile__edit-input">
      <p>이름</p>
      <Field name="name" type="text" placeholder="이름" />
      <ErrorMessage name="name" class="text-danger" />
    </div>
    <div class="profile__edit-input">
      <p>이메일</p>
      <Field name="email" type="email" placeholder="이메일" />
      <ErrorMessage name="email" class="text-danger" />
    </div>
    <div class="profile__edit-input">
      <p>연락처</p>
      <Field name="phone" type="text" placeholder="연락처" />
      <ErrorMessage name="phone" class="text-danger" />
    </div>
    <div class="profile__edit-input">
      <p>주소</p>
      <Field name="address" type="text" placeholder="주소" />
      <ErrorMessage name="address" class="text-danger" />
    </div>
    <div class="profile__edit-input">
      <button type="submit" class="os-btn os-btn-black w-full">수정</button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('프로필 수정 폼');
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import type { MbMemberType } from "~/types/mbMemberType";

const schema = yup.object({
  name: yup.string().required("이름을 입력해 주세요").label("이름"),
  email: yup.string().required("이메일을 입력해 주세요").email("올바른 이메일 주소를 입력해 주세요").label("이메일"),
  phone: yup.string().required("연락처를 입력해 주세요").min(11, "연락처는 11자 이상이어야 합니다").label("연락처"),
  address: yup.string().required("주소를 입력해 주세요").min(3, "주소는 3자 이상이어야 합니다").label("주소"),
});

async function onSubmit(values: Partial<MbMemberType>, { resetForm }: { resetForm: () => void }) {
  await useAlert().openAlert(JSON.stringify(values, null, 2));
  resetForm();
}
</script>
