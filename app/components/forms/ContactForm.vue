<template>
  <Form :validation-schema="schema" @submit="onSubmit" id="contact-form">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="row">
      <div class="col-xl-6 col-lg-6">
        <div class="contact__input mb-20">
          <label>이름 <span class="required">*</span></label>
          <Field name="name" type="text" />
          <ErrorMessage name="name" class="text-danger" />
        </div>
      </div>
      <div class="col-xl-6 col-lg-6">
        <div class="contact__input mb-20">
          <label>이메일 <span class="required">*</span></label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" class="text-danger" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="contact__input mb-20">
          <label>제목 <span class="required">*</span></label>
          <Field name="subject" type="text" />
          <ErrorMessage name="subject" class="text-danger" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="contact__input mb-45">
          <label>메시지</label>
          <Field name="msg" v-slot="{ field }">
            <textarea v-bind="field" name="msg" cols="30" rows="10"></textarea>
          </Field>
          <ErrorMessage name="msg" class="text-danger" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="contact__submit">
          <button type="submit" class="os-btn os-btn-black">메시지 보내기</button>
        </div>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('문의 폼');
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import type { CoInquiryType } from "~/types/coInquiryType";

const schema = yup.object({
  name: yup.string().required("이름을 입력해 주세요").label("이름"),
  email: yup.string().required("이메일을 입력해 주세요").email("올바른 이메일 주소를 입력해 주세요").label("이메일"),
  subject: yup.string().required("제목을 입력해 주세요").min(10, "제목은 10자 이상이어야 합니다").label("제목"),
  msg: yup.string().required("메시지를 입력해 주세요").min(20, "메시지는 20자 이상이어야 합니다").label("메시지"),
});

async function onSubmit(values: CoInquiryType, { resetForm }: { resetForm: () => void }) {
  await useAlert().openAlert(JSON.stringify(values, null, 2));
  resetForm();
}
</script>
