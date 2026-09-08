/**
 * 블로그 목록 공유 컴포저블
 * 여러 컴포넌트에서 /api/blogs 를 중복 호출하지 않도록 캐시 key를 공유합니다.
 */
import { axiosSsr } from "~/utils/axiosSsr";
import { type CoBlogType } from "~/types/coBlogType";

export function useBlogs() {
  const { data: blogs, pending } = useAsyncData<CoBlogType[]>(
    "blogs",
    () => axiosSsr.get<CoBlogType[]>("/api/blogs").then((r) => r.data),
    { default: () => [] as CoBlogType[] }
  );

  return { blogs, pending };
}
