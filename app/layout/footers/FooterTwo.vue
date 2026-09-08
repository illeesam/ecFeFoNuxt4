<template>
  <section class="footer__area bg-gray-100 relative">
    <div class="footer__top pt-75 pb-60">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row flex justify-center">
          <div v-for="(item, i) in widget_data" :key="i" class="col-xl-3 col-lg-3 col-md-3 col-sm-6 w-full">
            <div class="footer__widget mb-30">
              <div class="footer__widget-title footer__widget-title-2 mb-25">
                <h5>{{ item.title }}</h5>
              </div>
              <div class="footer__widget-content">
                <div class="footer__links footer__links-2">
                  <ul>
                    <li v-for="(list, i) in item.links" :key="i">
                      <a href="#">{{ list.list }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__bottom footer__bottom-2">
      <div class="max-w-7xl mx-auto px-4">
        <div class="footer__bottom-inner footer__bottom-inner-2">
          <div class="row flex justify-center items-center">
            <div class="col-xl-6 col-lg-7">
              <div class="footer__copyright footer__copyright-2">
                <p>저작권 {{ new Date().getFullYear() }} © <nuxt-link href="/">정담</nuxt-link> 모든 권리 보유. <nuxt-link href="/">jungdam</nuxt-link> 제작</p>
              </div>
            </div>
            <div class="col-xl-6 col-lg-5">
              <div class="footer__social footer__social-2 ml-auto">
                <ul>
                  <social />
                  <li>
                    <a href="#"><i class="fas fa-share-alt"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Social from "~/components/social/Social.vue";

const widget_data = [
      {
        id: 1,
        title: "마이페이지",
        links: [
          { link: "#", list: "마이페이지" },
          { link: "#", list: "주문/결제" },
          { link: "#", list: "장바구니" },
          { link: "#", list: "위시리스트" },
          { link: "#", list: "맞춤 링크" },
        ],
      },
      {
        id: 2,
        title: "바로가기",
        links: [
          { link: "#", list: "매장 위치" },
          { link: "#", list: "마이페이지" },
          { link: "#", list: "주문 조회" },
          { link: "#", list: "사이즈 가이드" },
          { link: "#", list: "자주 묻는 질문" },
        ],
      },
      {
        id: 3,
        title: "안내",
        links: [
          { link: "#", list: "회사 소개" },
          { link: "#", list: "채용" },
          { link: "#", list: "배송 안내" },
          { link: "#", list: "개인정보처리방침" },
          { link: "#", list: "이용약관" },
        ],
      },
      {
        id: 4,
        title: "고객센터",
        links: [
          { link: "#", list: "배송 정책" },
          { link: "#", list: "도움말 및 문의" },
          { link: "#", list: "반품 및 환불" },
          { link: "#", list: "온라인 스토어" },
          { link: "#", list: "이용약관" },
        ],
  },
];
</script>
