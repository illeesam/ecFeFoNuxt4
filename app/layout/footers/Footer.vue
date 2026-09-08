<template>
  <section :class="`footer__area footer-bg ${box_style ? 'box-m-15' : ''}`">
    <div class="footer__top pt-100 pb-60">
      <div class="max-w-7xl mx-auto px-4">
        <!-- 푸터 3열 레이아웃: Outstock(50%) | 안내(25%) | 고객센터(25%) -->
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2rem;">
          <!-- 1열: Outstock 로고 + 연락처 -->
          <div>
            <div class="footer__widget mb-30">
              <div class="footer__widget-title mb-25">
                <nuxt-link href="/">
                  <img src="/cdn/img/logo/logo-2.png" alt="logo" />
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
          <!-- 2열: 안내 -->
          <div>
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
          <!-- 3열: 고객센터 -->
          <div>
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
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-wrap items-center justify-center">
          <div class="w-full lg:w-7/12">
            <div class="footer__copyright">
              <p>저작권권 {{ new Date().getFullYear() }} © <nuxt-link href="/">정담</nuxt-link> 모든 권리 보유. <nuxt-link href="/">jungdam</nuxt-link> 제작</p>
            </div>
          </div>
          <div class="w-full lg:w-5/12">
            <div class="footer__social ml-auto">
              <ul>
                <li><a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
                <li><a href="#" title="Twitter에 공유" @click.prevent="shareTwitter"><i class="fab fa-twitter"></i></a></li>
                <li><a href="https://www.behance.net/" target="_blank" title="Behance"><i class="fab fa-behance"></i></a></li>
                <li><a href="https://dribbble.com/" target="_blank" title="Dribbble"><i class="fab fa-dribbble"></i></a></li>
                <li><a href="#" title="카카오톡으로 공유" @click.prevent="shareKakao" style="color: #FAE100;"><i class="fas fa-comment-dots"></i></a></li>
                <li><a href="#" title="이메일로 공유" @click.prevent="shareMail"><i class="fas fa-envelope"></i></a></li>
                <li><a href="#" title="문자(MMS)로 공유" @click.prevent="shareMMS"><i class="fas fa-mobile-alt"></i></a></li>
                <li><a href="#" title="링크 복사 / 공유하기" @click.prevent="shareLink"><i class="fas fa-share-alt"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  box_style: { type: Boolean, default: false },
});

const currentUrl = computed(() =>
  import.meta.client ? window.location.href : ""
);
const pageTitle = computed(() =>
  import.meta.client ? document.title : "Outstock"
);

function shareTwitter() {
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(pageTitle.value)}`,
    "_blank", "width=600,height=400"
  );
}

function shareKakao() {
  const text = `${pageTitle.value}\n${currentUrl.value}`;
  // 카카오톡 앱 URL 스킴 (모바일) → 미설치 시 카카오 스토리로 fallback
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(text)}`;
  } else {
    window.open(
      `https://story.kakao.com/share?url=${encodeURIComponent(currentUrl.value)}`,
      "_blank", "width=600,height=500"
    );
  }
}

function shareMail() {
  window.location.href = `mailto:?subject=${encodeURIComponent(pageTitle.value)}&body=${encodeURIComponent(currentUrl.value)}`;
}

function shareMMS() {
  const text = `${pageTitle.value} ${currentUrl.value}`;
  window.location.href = `sms:?body=${encodeURIComponent(text)}`;
}

async function shareLink() {
  if (!import.meta.client) return;
  if (navigator.share) {
    try {
      await navigator.share({ title: pageTitle.value, url: currentUrl.value });
    } catch { /* 취소 */ }
  } else {
    await navigator.clipboard.writeText(currentUrl.value);
    await useAlert().openAlert("링크가 복사되었습니다!");
  }
}
</script>
