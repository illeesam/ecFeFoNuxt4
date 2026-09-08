/**
 * 현재 컴포넌트/페이지의 Vue 파일 경로를 반환 (로컬 모드일 때만).
 * getCurrentInstance()?.type?.__file 기반. 반환 형식: "app/pages/home-4.vue"
 */
export function useCurrentFilePath(): string | null {
  const config = useRuntimeConfig();
  if (config.public.mode !== "local") return null;

  const instance = getCurrentInstance();
  const type = instance?.type;
  if (!type || typeof type !== "object") return null;

  const file = (type as Record<string, unknown>).__file;
  if (typeof file !== "string" || !file) return null;

  const normalized = file.replace(/\\/g, "/");
  const appIndex = normalized.indexOf("app/");
  if (appIndex !== -1) {
    return normalized.slice(appIndex);
  }
  const relMatch = normalized.match(/(?:^|\/)((?:pages|components|layout)\/[a-z0-9/_.-]+\.vue)$/i);
  if (relMatch) return "app/" + relMatch[1];
  return null;
}
