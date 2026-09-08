/** 첨부 타입 */
export interface CoAttachType {
  attachId: number; // 첨부ID
  refType: string; // 참조 구분 (review, blog, inquiry, etc)
  refId: number; // 참조 ID
  physicalNm: string; // 물리명 (저장 파일명)
  fileNm: string | null; // 파일명 (원본 파일명)
  ext: string; // 확장자
  fileSize: number | null; // 파일 크기(바이트)
  mimeType: string | null; // MIME 타입
  url: string; // 접근 URL
  sortOrder: number; // 정렬 순서
  createdAt: string; // 등록일시 (ISO)
}
