<template>
  <section class="profile__menu pb-70 bg-gray-100">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div class="md:col-span-3">
          <div class="profile__menu-left bg-white mb-50 md:mb-0">
            <h3 class="profile__menu-title"><i class="fa fa-list-alt"></i> 메뉴</h3>
            <div class="profile__menu-tab">
              <div class="flex flex-col items-start text-left border-b border-gray-200" id="nav-tab" role="tablist">
                <button :class="['nav-link py-2 px-3 border-b-2 -mb-px', activeTab === 'account' ? 'border-theme text-theme' : 'border-transparent']" type="button" @click="activeTab = 'account'"><i class="fa fa-user"></i> 마이페이지</button>
                <button :class="['nav-link py-2 px-3 border-b-2 -mb-px', activeTab === 'order' ? 'border-theme text-theme' : 'border-transparent']" type="button" @click="activeTab = 'order'"><i class="fa fa-file"></i> 주문 내역</button>
                <button :class="['nav-link py-2 px-3 border-b-2 -mb-px', activeTab === 'password' ? 'border-theme text-theme' : 'border-transparent']" type="button" @click="activeTab = 'password'"><i class="fa fa-lock"></i> 비밀번호 변경</button>
                <button class="nav-link" @click="logout"><i class="fa fa-sign-out"></i> 로그아웃</button>
              </div>
            </div>
          </div>
        </div>
        <div class="md:col-span-9">
          <div class="profile__menu-right min-w-0">
            <div id="nav-tabContent">
              <div v-show="activeTab === 'account'" id="nav-account" role="tabpanel">
                <div class="profile__info">
                  <div class="profile__info-top flex justify-between items-center">
                    <h3 class="profile__info-title">프로필 정보</h3>
                    <button class="profile__info-btn" type="button" @click="openProfileEdit"><i class="fa-regular fa-pen-to-square"></i> 프로필 수정</button>
                  </div>
                  <div class="profile__info-wrapper white-bg">
                    <div class="profile__info-item">
                      <p>이름</p>
                      <h4>{{ authStore.user?.username ?? '-' }}</h4>
                    </div>
                    <div class="profile__info-item">
                      <p>이메일</p>
                      <h4>
                        <a v-if="authStore.user?.email" :href="`mailto:${authStore.user.email}`">{{ authStore.user.email }}</a>
                        <span v-else>-</span>
                      </h4>
                    </div>
                    <div class="profile__info-item">
                      <p>연락처</p>
                      <h4>{{ authStore.user?.phone ?? '-' }}</h4>
                    </div>
                    <div class="profile__info-item">
                      <p>주소</p>
                      <h4>{{ authStore.user?.address ?? '-' }}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="activeTab === 'order'" id="nav-order" role="tabpanel">
                <div class="order__info">
                  <div class="order__info-top flex justify-between items-center">
                    <h3 class="order__info-title">주문 내역</h3>
                    <button type="button" class="order__info-btn"><i class="fa-regular fa-trash-can"></i> 비우기</button>
                  </div>
                  <div class="order__list order__list--wide white-bg table-responsive">
                    <table class="table w-full">
                      <thead>
                        <tr>
                          <th scope="col" class="order__th-id">주문 번호</th>
                          <th scope="col" class="order__th-name">상품명</th>
                          <th scope="col" class="order__th-amount">금액</th>
                          <th scope="col" class="order__th-detail">상세</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="order__id">#3520</td>
                          <td>
                            <nuxt-link href="/product-details" class="order__title">대학 세미나 시리즈 글로벌.</nuxt-link>
                          </td>
                          <td>{{ formatPrice(144000) }}</td>
                          <td>
                            <nuxt-link href="/product-details" class="order__view-btn">보기</nuxt-link>
                          </td>
                        </tr>
                        <tr>
                          <td class="order__id">#2441</td>
                          <td>
                            <nuxt-link href="/product-details" class="order__title">웹 코딩과 아파치 기초</nuxt-link>
                          </td>
                          <td>{{ formatPrice(59540) }}</td>
                          <td>
                            <nuxt-link href="/product-details" class="order__view-btn">보기</nuxt-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div v-show="activeTab === 'password'" id="nav-password" role="tabpanel">
                <div class="password__change">
                  <div class="password__change-top">
                    <h3 class="password__change-title">비밀번호 변경</h3>
                  </div>
                  <div class="password__form white-bg">
                    <!-- 폼 시작 -->
                    <change-password-form />
                    <!-- 폼 끝 -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <profile-edit-modal ref="profileEditModalRef" />
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('마이페이지 메뉴');
import { ref } from "vue";
import ProfileEditModal from "../common/modals/ProfileEditModal.vue";
import ChangePasswordForm from "../forms/ChangePasswordForm.vue";
import { useAuthStore } from "~/store/useAuthStore";
import { useRouter } from "vue-router";

const { formatPrice } = usePrice();
const activeTab = ref("account");
const profileEditModalRef = ref<InstanceType<typeof ProfileEditModal> & { show(): void } | null>(null);
const authStore = useAuthStore();
const router = useRouter();

function openProfileEdit() {
  profileEditModalRef.value?.show();
}

function logout() {
  authStore.setStLogout();
  router.push("/");
}
</script>
