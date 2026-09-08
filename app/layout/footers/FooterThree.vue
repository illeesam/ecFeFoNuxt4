<template>
  <section class="footer__area dark-soft-bg">
    <div class="footer__top pt-100 pb-50">
      <div class="container custom-container-2 mx-auto">
        <div class="row flex justify-center">
          <div class="col-xl-12">
            <div class="footer__social-list mb-60">
              <ul>
                <li>
                  <a target="_blank" href="http://facebook.com">Facebook</a>
                </li>
                <li>
                  <a target="_blank" href="http://twitter.com">Twitter</a>
                </li>
                <li>
                  <a target="_blank" href="https://www.instagram.com/">Instagram</a>
                </li>
                <li>
                  <a target="_blank" href="https://www.pinterest.com/">Pinterest</a>
                </li>
                <li>
                  <a target="_blank" href="https://www.youtube.com/">Youtube</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row flex justify-center">
          <div class="col-xl-4 col-lg-6 col-md-6 w-full">
            <div class="footer__widget mb-30">
              <div class="footer__widget-title mb-25">
                <nuxt-link href="/">
                  <img src="/cdn/img/logo/log-3.webp" alt="logo" />
                </nuxt-link>
              </div>
              <div class="footer__widget-content">
                <p>정담은 고급 관리 기능을 갖춘 프리미엄 템플릿 테마입니다. 맞춤 설정이 쉽고, 반응형이며 레티나 디스플레이를 지원합니다.</p>
                <div class="footer__contact">
                  <ul>
                    <li>
                      <div class="icon">
                        <i class="fal fa-map-marker-alt"></i>
                      </div>
                      <div class="text">
                        <span>주소: 성남시 중원구 성남대로 997 (여수동)</span>
                      </div>
                    </li>
                    <li>
                      <div class="icon">
                        <i class="fal fa-envelope-open-text"></i>
                      </div>
                      <div class="text">
                        <span>이메일: illeesam@gmail.com</span>
                      </div>
                    </li>
                    <li>
                      <div class="icon">
                        <i class="fal fa-phone-alt"></i>
                      </div>
                      <div class="text">
                        <span>연락처: (010) 3805 0206</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-lg-3 col-md-3 w-full">
            <div class="footer__widget mb-30">
              <div class="footer__widget-title">
                <h5>안내</h5>
              </div>
              <div class="footer__widget-content">
                <div class="footer__links">
                  <ul>
                    <li><a href="#">회사 소개</a></li>
                    <li><a href="#">채용</a></li>
                    <li><a href="#">배송 안내</a></li>
                    <li><a href="#">개인정보처리방침</a></li>
                    <li><a href="#">이용약관</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-lg-3 col-md-3 w-full">
            <div class="footer__widget mb-30">
              <div class="footer__widget-title mb-25">
                <h5>고객센터</h5>
              </div>
              <div class="footer__widget-content">
                <div class="footer__links">
                  <ul>
                    <li><a href="#">배송 정책</a></li>
                    <li><a href="#">도움말 및 문의</a></li>
                    <li><a href="#">반품 및 환불</a></li>
                    <li><a href="#">온라인 스토어</a></li>
                    <li><a href="#">이용약관</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-lg-3 col-md-6 w-full">
            <div class="footer__widget mb-30">
              <div class="footer__widget-title mb-25">
                <h5>뉴스레터</h5>
              </div>
              <div class="footer__widget-content">
                <p>발행 시마다 무료 소식을 받아보세요. 1,000명 이상이 구독 중입니다.</p>
                <div class="form-group">
                  <input class="border border-gray-300 rounded px-3 py-2 w-full" id="newsletter-input" type="email" name="contact[email]" placeholder="이메일 주소를 입력하세요..." />
                  <button class="ss-btn btnNewsletter" type="submit">구독하기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__bottom footer__bottom-3">
      <div class="max-w-7xl mx-auto px-4">
        <div class="row flex justify-center items-center">
          <div class="col-xl-6 col-lg-7 col-md-8">
            <div class="footer__copyright footer__copyright-3">
              <p>
                저작권권 © {{ new Date().getFullYear() }} <nuxt-link href="/" class="link">정담</nuxt-link> 모든 권리 보유.
                <nuxt-link href="/" class="link">jungdam</nuxt-link>
              </p>
            </div>
          </div>
          <div class="col-xl-6 col-lg-5 col-md-4">
            <div class="footer__payment">
              <a href="#"><img src="/cdn/img/payment/paypal_logo.webp" alt="" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
