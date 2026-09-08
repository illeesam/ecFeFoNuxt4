/** 블로그 타입 */
export interface CoBlogType {
  blogId: number; // 블로그ID
  img: string; // 이미지
  title: string; // 제목
  author: string; // 작성자
  date: string; // 작성일
  desc: string; // 설명
  blog?: string; // 블로그 본문
}
