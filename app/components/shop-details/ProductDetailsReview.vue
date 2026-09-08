<template>
  <div class="product__details-review">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <div class="postbox__comments">
      <!-- 제목: 리뷰(N)만 한 줄에 배치 -->
      <div class="postbox__comment-title postbox__comment-title--block mb-20">
        <h3 class="postbox__comment-title-h3">리뷰 ({{ totalReviewCount }})</h3>
      </div>
      <!-- 첨부·모아보기는 그 아래 줄 -->
      <div v-if="totalAttachmentCount > 0" class="postbox__comment-attach-row mb-20">
        <span class="postbox__comment-attach-label">첨부 이미지·동영상 {{ totalAttachmentCount }}개</span>
        <button type="button" class="os-btn os-btn-black postbox__comment-viewall-btn" @click="openAllMedia">모아보기</button>
      </div>
      <div class="latest-comments mb-30">
        <ul>
          <template v-for="(review, index) in item.reviews" :key="review.reviewId">
            <li>
              <div class="comments-box">
                <div class="comments-avatar">
                  <app-image :src="review.img" :alt="review.name" :img-style="{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }" :skeleton-style="{ width: '60px', height: '60px', borderRadius: '50%' }" />
                </div>
                <div class="comments-text">
                  <div class="avatar-name">
                    <h5>{{ review.name }}</h5>
                    <span class="comment-actions">
                      <button type="button" class="reply" @click.prevent="startReply(review.reviewId)">답글 쓰기</button>
                      <button type="button" class="delete-btn" @click.prevent="deleteReview(review.reviewId, false)">삭제</button>
                    </span>
                  </div>
                  <div class="user-rating">
                    <ul>
                      <li v-for="s in 5" :key="s">
                        <span><i :class="s <= review.rating ? 'fas fa-star' : 'fal fa-star'"></i></span>
                      </li>
                    </ul>
                  </div>
                  <p>{{ review.content || '내용 없음' }}</p>
                </div>
                <div v-if="(review.attachments?.length ?? 0) > 0" class="comments-attachments">
                  <div class="review-thumb-list">
                    <template v-for="(url, i) in (review.attachments ?? []).slice(0, 5)" :key="url">
                      <button type="button" class="review-thumb" @click="openMedia(review.attachments ?? [], i)">
                        <img v-if="!isVideoUrl(url)" :src="url" :alt="`첨부 ${i + 1}`" class="w-full h-full object-cover" />
                        <span v-else class="review-thumb-video"><i class="fa fa-play text-white"></i></span>
                      </button>
                    </template>
                  </div>
                  <button
                    v-if="(review.attachments?.length ?? 0) > 5"
                    type="button"
                    class="review-thumb-more text-sm text-gray-500 hover:underline mt-1"
                    @click="openMedia(review.attachments ?? [], 5)"
                  >
                    외 {{ (review.attachments?.length ?? 0) - 5 }}개
                  </button>
                </div>
              </div>
            </li>
            <li v-for="reply in (review.replies ?? [])" :key="reply.reviewId" class="children">
              <div class="comments-box">
                <div class="comments-avatar">
                  <app-image :src="reply.img" :alt="reply.name" :img-style="{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }" :skeleton-style="{ width: '60px', height: '60px', borderRadius: '50%' }" />
                </div>
                <div class="comments-text">
                  <div class="avatar-name">
                    <h5>{{ reply.name }}</h5>
                    <button type="button" class="delete-btn" @click.prevent="deleteReview(reply.reviewId, true)">삭제</button>
                  </div>
                  <p>{{ reply.content || '' }}</p>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="post-comments-form mb-100">
      <div class="post-comments-title mb-30">
        <h3>{{ replyingToReviewId ? '답글 쓰기' : '리뷰 쓰기' }}</h3>
        <div v-if="!replyingToReviewId" class="post-rating">
          <ul>
            <li v-for="n in 5" :key="n">
              <button type="button" class="star-btn" :aria-label="`${n}점`" @click.prevent="setReviewRating(n)">
                <i :class="n <= reviewRating ? 'fas fa-star' : 'fal fa-star'"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <review-form
        :product-id="item.productId"
        :rating="reviewRating"
        :parent-review-id="replyingToReviewId ?? undefined"
        @submitted="onReviewSubmitted"
      />
    </div>
    <media-viewer-modal
      :open="mediaViewerOpen"
      :items="mediaViewerItems"
      :initial-index="mediaViewerInitialIndex"
      @close="mediaViewerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('상품 리뷰');
import { type PdProductType } from "~/types/pdProductType";
import ReviewForm from "../forms/ReviewForm.vue";
import AppImage from "~/components/ui/AppImage.vue";
import MediaViewerModal from "~/components/ui/MediaViewerModal.vue";

const VIDEO_EXT = new Set(['mp4', 'webm', 'mov']);
function isVideoUrl(url: string): boolean {
  const ext = url.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXT.has(ext);
}

const props = defineProps<{
  item: PdProductType;
}>();

const totalReviewCount = computed(() => {
  const list = props.item.reviews ?? [];
  return list.reduce((sum, r) => sum + 1 + (r.replies?.length ?? 0), 0);
});

const allAttachmentsList = computed(() => {
  const list = props.item.reviews ?? [];
  const urls: string[] = [];
  for (const r of list) {
    const a = r.attachments ?? [];
    urls.push(...a);
  }
  return urls;
});
const totalAttachmentCount = computed(() => allAttachmentsList.value.length);

const mediaViewerOpen = ref(false);
const mediaViewerItems = ref<string[]>([]);
const mediaViewerInitialIndex = ref(0);

function openMedia(items: string[], index: number) {
  mediaViewerItems.value = items;
  mediaViewerInitialIndex.value = index;
  mediaViewerOpen.value = true;
}
function openAllMedia() {
  mediaViewerItems.value = [...allAttachmentsList.value];
  mediaViewerInitialIndex.value = 0;
  mediaViewerOpen.value = true;
}

const reviewRating = ref(0);
const replyingToReviewId = ref<number | null>(null);

function setReviewRating(n: number) {
  reviewRating.value = n;
}
function startReply(reviewId: number) {
  replyingToReviewId.value = reviewId;
}

const router = useRouter();
const { $toast } = useNuxtApp();

function onReviewSubmitted() {
  replyingToReviewId.value = null;
  router.go(0);
}

const deletingId = ref<number | null>(null);

async function deleteReview(reviewId: number, isReply: boolean) {
  const ok = await useConfirm().openConfirm({
    title: '삭제 확인',
    message: isReply ? '이 답글을 삭제할까요?' : '이 리뷰를 삭제할까요? 달린 답글도 함께 삭제됩니다.',
    confirmText: '삭제',
    cancelText: '취소',
    variant: 'danger',
  });
  if (!ok || deletingId.value !== null) return;
  deletingId.value = reviewId;
  try {
    const res = await $fetch<{ success?: boolean; message?: string }>(
      `/api/products/${props.item.productId}/reviews/${reviewId}`,
      { method: 'DELETE' }
    );
    if (res?.success) {
      $toast?.success?.(res.message ?? '삭제되었습니다.');
      router.go(0);
    }
  } catch (e: any) {
    const msg = e?.data?.message ?? e?.message ?? '삭제에 실패했습니다.';
    $toast?.error?.(msg);
  } finally {
    deletingId.value = null;
  }
}
</script>

<style scoped>
.star-btn,
.reply,
.delete-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
}
.reply { color: inherit; }
.delete-btn { color: var(--color-danger, #dc2626); }
.comment-actions { display: inline-flex; gap: 0.5rem; margin-left: 0.25rem; }
.star-btn:hover,
.reply:hover,
.delete-btn:hover {
  opacity: 0.85;
}

.comments-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.comments-text { flex: 1; min-width: 0; }
.comments-attachments {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.review-thumb-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: flex-end;
}
.review-thumb {
  width: 48px;
  height: 48px;
  border-radius: 0.25rem;
  overflow: hidden;
  border: 1px solid var(--tw-gray-200, #e5e7eb);
  padding: 0;
  cursor: pointer;
  background: #f3f4f6;
  flex-shrink: 0;
}
.review-thumb:hover { opacity: 0.9; }
.review-thumb-video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6b7280;
}
.review-thumb-more { background: none; border: none; cursor: pointer; }

/* 제목란: 리뷰(N)만 한 줄, 그 아래 첨부·모아보기 */
.postbox__comment-title--block {
  display: block;
}
.postbox__comment-title-h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}
.postbox__comment-attach-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
}
.postbox__comment-attach-label {
  white-space: nowrap;
  font-size: 0.875rem;
  color: #4b5563;
}
.postbox__comment-viewall-btn {
  white-space: nowrap;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}
</style>
