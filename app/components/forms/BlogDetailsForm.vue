<template>
  <Form :validation-schema="schema" @submit="onSubmit" id="contacts-form" class="conatct-post-form" action="#">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="row">
      <div class="col-xl-6 col-lg-6 col-md-6">
        <div class="contact-icon relative contacts-name">
          <Field name="name" type="text" placeholder="이름" />
          <ErrorMessage name="name" class="text-danger" />
        </div>
      </div>
      <div class="col-xl-6 col-lg-6 col-md-6">
        <div class="contact-icon relative contacts-name">
          <Field name="email" type="email" placeholder="이메일" />
          <ErrorMessage name="email" class="text-danger" />
        </div>
      </div>
      <div class="col-xl-12">
        <div class="contact-icon relative contacts-email">
          <Field name="subject" type="text" placeholder="제목" />
          <ErrorMessage name="subject" class="text-danger" />
        </div>
      </div>
      <div class="col-xl-12">
        <div class="contact-icon relative contacts-message">
          <Field name="msg" v-slot="{ field }">
            <textarea v-bind="field" name="msg" cols="30" rows="10" placeholder="내용"></textarea>
          </Field>
          <ErrorMessage name="msg" class="text-danger" />
        </div>
      </div>
      <div class="col-xl-12">
        <button class="os-btn os-btn-black" type="submit">댓글 등록</button>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그 댓글 폼');
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("이름을 입력해 주세요").label("이름"),
  email: yup.string().required("이메일을 입력해 주세요").email("올바른 이메일 주소를 입력해 주세요").label("이메일"),
  subject: yup.string().required("제목을 입력해 주세요").min(10, "제목은 10자 이상이어야 합니다").label("제목"),
  msg: yup.string().required("메시지를 입력해 주세요").min(20, "메시지는 20자 이상이어야 합니다").label("메시지"),
});

async function onSubmit(values: object, { resetForm }: { resetForm: () => void }) {
  await useAlert().openAlert(JSON.stringify(values, null, 2));
  resetForm();
}
</script>
