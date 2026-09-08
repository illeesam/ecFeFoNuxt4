/**
 * 전역 파일경로 배지 레지스트리.
 */
export interface BadgeEntry {
  id: string;
  filePath: string;
  instanceUid: number | undefined;
  parentInstanceUid: number | undefined;
}

// 컴포넌트 인스턴스 props 접근자 (module-level, 클라이언트 전용)
const _propsGetters = new Map<string, () => Record<string, unknown> | null>();
const _propsSetters = new Map<
  string,
  (props: Record<string, unknown>) => void
>();

// 컴포넌트 인스턴스 data 접근자
const _dataGetters = new Map<string, () => Record<string, unknown> | null>();
const _dataSetters = new Map<string, (data: Record<string, unknown>) => void>();

// 컴포넌트 DOM 요소 (체크된 배지 페이지 오버레이용)
const _domElements = new Map<string, HTMLElement>();

export function useFilePathBadgeRegistry() {
  const badges = useState<BadgeEntry[]>("filePathBadgeRegistry", () => []);
  const checkedIds = useState<string[]>("filePathBadgeChecked", () => []);
  const hoveredId = useState<string | null>("filePathBadgeHovered", () => null);
  const componentTitles = useState<Record<string, string>>(
    "filePathBadgeTitles",
    () => ({})
  );
  /** 페이지 파일 경로별 타이틀 (배지 parent가 Layout 등일 때 usePageTitle 표시용) */
  const pageTitlesByPath = useState<Record<string, string>>(
    "filePathBadgePageTitles",
    () => ({})
  );

  function register(
    id: string,
    filePath: string,
    instanceUid: number | undefined,
    parentInstanceUid: number | undefined
  ) {
    if (!badges.value.find((b) => b.id === id)) {
      badges.value.push({ id, filePath, instanceUid, parentInstanceUid });
    }
  }

  function unregister(id: string) {
    badges.value = badges.value.filter((b) => b.id !== id);
    checkedIds.value = checkedIds.value.filter((cid) => cid !== id);
    if (hoveredId.value === id) hoveredId.value = null;
    _propsGetters.delete(id);
    _propsSetters.delete(id);
    _dataGetters.delete(id);
    _dataSetters.delete(id);
  }

  function registerInstanceAccessors(
    id: string,
    getter: () => Record<string, unknown> | null,
    setter: (props: Record<string, unknown>) => void
  ) {
    _propsGetters.set(id, getter);
    _propsSetters.set(id, setter);
  }

  function getInstanceProps(id: string): Record<string, unknown> | null {
    return _propsGetters.get(id)?.() ?? null;
  }

  function registerDataAccessor(
    id: string,
    getter: () => Record<string, unknown> | null,
    setter?: (data: Record<string, unknown>) => void
  ) {
    _dataGetters.set(id, getter);
    if (setter) _dataSetters.set(id, setter);
    else _dataSetters.delete(id);
  }

  function getInstanceData(id: string): Record<string, unknown> | null {
    return _dataGetters.get(id)?.() ?? null;
  }

  function applyPropsEdit(id: string, newProps: Record<string, unknown>) {
    _propsSetters.get(id)?.(newProps);
  }

  function applyDataEdit(id: string, newData: Record<string, unknown>) {
    _dataSetters.get(id)?.(newData);
  }

  function registerDomEl(id: string, el: HTMLElement) {
    _domElements.set(id, el);
  }
  function unregisterDomEl(id: string) {
    _domElements.delete(id);
  }
  function getDomEl(id: string): HTMLElement | undefined {
    return _domElements.get(id);
  }

  function toggleChecked(id: string) {
    const idx = checkedIds.value.indexOf(id);
    if (idx === -1) checkedIds.value.push(id);
    else checkedIds.value.splice(idx, 1);
  }

  function selectAll() {
    checkedIds.value = badges.value.map((b) => b.id);
  }

  function deselectAll() {
    checkedIds.value = [];
  }

  function setHovered(id: string | null) {
    hoveredId.value = id;
  }

  function setComponentTitle(uid: number, title: string | null) {
    const key = String(uid);
    if (title === null) {
      const copy = { ...componentTitles.value };
      delete copy[key];
      componentTitles.value = copy;
    } else {
      componentTitles.value = { ...componentTitles.value, [key]: title };
    }
  }

  function normalizePathForTitle(path: string): string {
    return path.replace(/\\/g, "/").replace(/^.*\/app\//, "app/").toLowerCase();
  }

  function setPageTitleByPath(filePath: string | null, title: string | null) {
    if (!filePath) return;
    const key = normalizePathForTitle(filePath);
    if (title === null) {
      const copy = { ...pageTitlesByPath.value };
      delete copy[key];
      pageTitlesByPath.value = copy;
    } else {
      pageTitlesByPath.value = { ...pageTitlesByPath.value, [key]: title };
    }
  }

  function getTitleForBadge(badge: BadgeEntry): string | undefined {
    if (badge.instanceUid != null) {
      const byUid = componentTitles.value[String(badge.instanceUid)];
      if (byUid) return byUid;
    }
    const pathKey = normalizePathForTitle(badge.filePath);
    return pageTitlesByPath.value[pathKey];
  }

  const badgeLevelIds = computed((): Map<string, string> => {
    const list = badges.value;
    const uidSet = new Set(list.map(b => b.instanceUid).filter((u): u is number => u !== undefined));
    const roots = list.filter(b => b.parentInstanceUid === undefined || !uidSet.has(b.parentInstanceUid));
    function getChildren(badge: BadgeEntry) {
      if (badge.instanceUid === undefined) return [];
      return list.filter(b => b.parentInstanceUid === badge.instanceUid);
    }
    const result = new Map<string, string>();
    const visited = new Set<string>();
    function traverse(items: BadgeEntry[], counters: number[]) {
      let counter = 0;
      for (const badge of items) {
        if (visited.has(badge.id)) continue;
        visited.add(badge.id);
        counter++;
        const cur = [...counters, counter];
        result.set(badge.id, cur.join('.') + ')');
        const children = getChildren(badge);
        if (children.length > 0) traverse(children, cur);
      }
    }
    traverse(roots, []);
    return result;
  });

  return {
    badges,
    checkedIds,
    hoveredId,
    componentTitles,
    register,
    unregister,
    registerInstanceAccessors,
    getInstanceProps,
    applyPropsEdit,
    registerDataAccessor,
    getInstanceData,
    applyDataEdit,
    registerDomEl,
    unregisterDomEl,
    getDomEl,
    toggleChecked,
    selectAll,
    deselectAll,
    setHovered,
    setComponentTitle,
    setPageTitleByPath,
    getTitleForBadge,
    badgeLevelIds,
  };
}
