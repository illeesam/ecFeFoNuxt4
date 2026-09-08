<template>
  <section class="blog__area pt-55">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="max-w-7xl mx-auto px-4">
      <div class="row">
        <div class="col-xl-9 col-lg-8">
          <div class="postbox__title mb-55">
            <h1><a v-html="item.title"></a></h1>
            <div class="blog__meta">
              <span>작성자 <a href="#">{{ item.author }}</a></span>
              <span>/ {{ item.date }}</span>
            </div>
          </div>

          <!-- 메인 썸네일: AppImage (스켈레톤 + noImage) -->
          <div class="postbox__thumb w-img mb-40">
            <app-image
              :src="item.img"
              alt="블로그 이미지"
              wrap-class="w-full"
              :skeleton-style="{ width: '100%', aspectRatio: '16/9' }"
            />
          </div>

          <div class="postbox__wrapper mb-70">
            <div class="postbox__text mt-65">
              <p>
                디가, 코마, 토러스는 <span class="highlight theme">옴모</span>를 위해 디자인된 세 가지 주방 용기입니다. 2016년 2월 앙비엔테 쇼에서 소개된 디자인 중심 브랜드로,
                <span class="highlight">미니멀한 디자인, 선명한 색상, 스테인리스 스틸과 무광 플라스틱</span>, 추상적인 형태와 곡선이 특징이며 실용적이고 사용하기 편합니다.
              </p>
            </div>
            <div class="postbox__text">
              <p>디가는 두 가지 색의 멜라민 샐러드 보울로, 채소를 씻고 물기를 빼 담을 수 있습니다. 바닥 디스크를 반시계 방향으로 돌리면 물이 빠지고, 시계 방향으로 돌리면 배수가 잠기고 소스를 담아 두기에 좋습니다.</p>
            </div>
            <article class="postbox format-quote mt-45 mb-50">
              <div class="postbox__quote">
                <blockquote>
                  <p><i class="fas fa-quote-right"></i> 많은 출판·웹 에디터가 기본 예시 문장으로 로렘 입숨을 사용합니다. 간단한 검색만으로도 아직 초기 단계인 웹 사이트들을 많이 찾아볼 수 있습니다.</p>
                </blockquote>
              </div>
            </article>
            <!-- 본문 내 보조 이미지: AppImage (스켈레톤 + noImage) -->
            <div class="postbox__details-img w-img mb-60">
              <app-image
                src="/cdn/img/blog/blog-details-sm.jpg"
                alt="블로그 상세 이미지"
                wrap-class="w-full"
                :skeleton-style="{ width: '100%', aspectRatio: '16/7' }"
              />
            </div>
            <div class="postbox__text">
              <p>코마와 토러스는 각각 독특한 디자인과 숨겨진 기능을 가진 티 인퓨저입니다. 코마는 둥근 받침과 긴 스테인리스 핸들로 잡기 편합니다.</p>
            </div>
            <div class="postbox__text">
              <p>
                브러시드 스틸 뚜껑은 손가락으로 열고 닫아 인퓨저를 쉽게 채우고 비울 수 있어, 티 브루잉을 즐기기 좋습니다. 토러스는 도넛 형태로 어떤 컵에도 걸 수 있으며, 다양한 디퓨저 세 개까지 넣을 수 있는 케이스와 함께 건조한 티 보관에 활용할 수
                있습니다.
              </p>
            </div>
          </div>

          <div class="postbox__share mb-95">
            <div class="row">
              <div class="col-xl-6 col-lg-6 col-md-6">
                <div class="postbox__social">
                  <span>친구에게 공유:</span>
                  <ul>
                    <li><a href="#" title="Facebook에 공유" @click.prevent="shareOnFacebook"><i class="fab fa-facebook-f"></i></a></li>
                    <li><a href="#" title="Twitter에 공유" @click.prevent="shareOnTwitter"><i class="fab fa-twitter"></i></a></li>
                    <li><a href="#" title="Pinterest에 공유" @click.prevent="shareOnPinterest"><i class="fab fa-dribbble"></i></a></li>
                    <li><a href="#" title="링크 복사 / 공유하기" @click.prevent="shareLink"><i class="fas fa-share-alt"></i></a></li>
                  </ul>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6">
                <div class="postbox__tag ml-auto">
                  <span>태그:</span>
                  <a href="#">가구,</a>
                  <a href="#">테마,</a>
                  <a href="#">의자,</a>
                  <a href="#">인테리어</a>
                </div>
              </div>
            </div>
          </div>

          <!-- 추천 글: API에서 로드된 블로그 목록 사용 -->
          <div class="postbox__related-title">
            <h3>추천 글</h3>
          </div>
          <div class="postbox__related-item">
            <div class="row">
              <!-- 로딩 중 스켈레톤 -->
              <template v-if="relatedPending">
                <div v-for="n in 2" :key="n" class="col-xl-6 col-lg-6 col-md-6">
                  <skeleton-card />
                </div>
              </template>
              <!-- 추천 글 목록 -->
              <div v-else v-for="(blog, i) in relatedBlogs" :key="i" class="col-xl-6 col-lg-6 col-md-6">
                <blog-item :item="blog" :style_2="true" />
              </div>
            </div>
          </div>

          <div class="postbox__line mt-65"></div>
          <div class="postbox__comments pt-90">
            <div class="postbox__comment-title mb-30">
              <h3>댓글 (32)</h3>
            </div>
            <div class="latest-comments mb-30">
              <ul>
                <li>
                  <div class="comments-box">
                    <div class="comments-avatar">
                      <!-- 댓글 아바타: AppImage (noImage 포함) -->
                      <app-image
                        src="/cdn/img/blog/comments/avater-1.png"
                        alt="김민수"
                        :img-style="{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }"
                        :skeleton-style="{ width: '60px', height: '60px', borderRadius: '50%' }"
                      />
                    </div>
                    <div class="comments-text">
                      <div class="avatar-name">
                        <h5>김민수</h5>
                        <span> - 3개월 전 </span>
                        <a class="reply" href="#">답글 쓰기</a>
                      </div>
                      <p>많은 출판·웹 에디터가 기본 예시 문장으로 로렘 입숨을 사용합니다. 다양한 버전이 시간이 지나며 우연히 또는 의도적으로 만들어져 왔습니다.</p>
                    </div>
                  </div>
                </li>
                <li class="children">
                  <div class="comments-box">
                    <div class="comments-avatar">
                      <app-image
                        src="/cdn/img/blog/comments/avater-2.png"
                        alt="이영희"
                        :img-style="{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }"
                        :skeleton-style="{ width: '60px', height: '60px', borderRadius: '50%' }"
                      />
                    </div>
                    <div class="comments-text">
                      <div class="avatar-name">
                        <h5>이영희</h5>
                        <span> - 6개월 전 </span>
                        <a class="reply" href="#">답글 쓰기</a>
                      </div>
                      <p>많은 출판·웹 에디터가 기본 예시 문장으로 로렘 입숨을 사용하며, 검색하면 아직 초기 단계인 웹 사이트들을 많이 찾을 수 있습니다.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="comments-box">
                    <div class="comments-avatar">
                      <app-image
                        src="/cdn/img/blog/comments/avater-3.png"
                        alt="박지훈"
                        :img-style="{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }"
                        :skeleton-style="{ width: '60px', height: '60px', borderRadius: '50%' }"
                      />
                    </div>
                    <div class="comments-text">
                      <div class="avatar-name">
                        <h5>박지훈</h5>
                        <span> - 6개월 전 </span>
                        <a class="reply" href="#">답글 쓰기</a>
                      </div>
                      <p>많은 출판·웹 에디터가 기본 예시 문장으로 로렘 입숨을 사용합니다. 다양한 버전이 시간이 지나며 우연히 또는 의도적으로 만들어져 왔습니다.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="postbox__line mb-95"></div>
          <div class="post-comments-form mb-100">
            <div class="post-comments-title mb-30">
              <h3>댓글 남기기</h3>
            </div>
            <blog-details-form />
          </div>
        </div>

        <div class="col-xl-3 col-lg-4">
          <blog-sidebar />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('블로그 상세');
import { computed } from "vue";
import { axiosSsr } from "~/utils/axiosSsr";
import { type CoBlogType } from "~/types/coBlogType";
import BlogItem from "../blogs/BlogItem.vue";
import BlogSidebar from "../common/sidebar/BlogSidebar.vue";
import BlogDetailsForm from "../forms/BlogDetailsForm.vue";
import AppImage from "~/components/ui/AppImage.vue";
import SkeletonCard from "~/components/ui/SkeletonCard.vue";

const props = defineProps<{
  item: CoBlogType;
}>();

// 추천 글: SSR로 블로그 목록 로드 (axiosSsr 사용)
const { data: allBlogs, pending: relatedPending } = useAsyncData<CoBlogType[]>(
  "blog-related",
  () => axiosSsr.get<CoBlogType[]>("/api/blogs").then((r) => r.data)
);

const relatedBlogs = computed(() =>
  (allBlogs.value ?? []).filter((b) => b.blogId !== props.item.blogId).slice(0, 2)
);

const currentUrl = computed(() =>
  import.meta.client ? window.location.href : ""
);
const pageTitle = computed(() => props.item?.title ?? "");

function shareOnFacebook() {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`,
    "_blank", "width=600,height=400"
  );
}

function shareOnTwitter() {
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(pageTitle.value)}`,
    "_blank", "width=600,height=400"
  );
}

function shareOnPinterest() {
  window.open(
    `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl.value)}&description=${encodeURIComponent(pageTitle.value)}`,
    "_blank", "width=600,height=400"
  );
}

async function shareLink() {
  if (!import.meta.client) return;
  if (navigator.share) {
    try {
      await navigator.share({ title: pageTitle.value, url: currentUrl.value });
    } catch {
      // 사용자가 취소한 경우
    }
  } else {
    await navigator.clipboard.writeText(currentUrl.value);
    await useAlert().openAlert("링크가 복사되었습니다!");
  }
}
</script>
