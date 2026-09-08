/**
 * 컴포넌트에 타이틀을 붙입니다 (useHead의 컴포넌트 버전).
 * 컴포넌트 <script setup> 내부에서 호출하면 오버레이 목록에 타이틀이 표시됩니다.
 *
 * @example
 * // app/components/blogs/BlogStandardItem.vue
 * useComponentTitle('블로그 아이템')
 */
export function useComponentTitle(title: string) {
  const config = useRuntimeConfig();
  if (config.public.mode !== "local") return;

  const instance = getCurrentInstance();
  if (!instance) return;

  const { setComponentTitle } = useFilePathBadgeRegistry();

  // setup() 실행 시점에 즉시 등록 (XdevFilePathBadge mount 전이어도 OK)
  setComponentTitle(instance.uid, title);

  onUnmounted(() => {
    setComponentTitle(instance.uid, null);
  });
}
