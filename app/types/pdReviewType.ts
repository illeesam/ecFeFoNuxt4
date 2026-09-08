/** 상품 리뷰 타입 */
export interface PdReviewType {
  reviewId: number; // 리뷰ID
  img: string; // 이미지
  name: string; // 작성자명
  time: string; // 작성일시
  rating: number; // 평점
  content?: string; // 리뷰/답글 내용
  attachments?: string[]; // 첨부 이미지·동영상 URL 목록
  children?: boolean; // 자식 리뷰 여부
  replies?: PdReviewType[]; // 답글 목록
}
