<template>
  <div class="admin-grid bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div v-if="$slots.toolbar" class="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
      <slot name="toolbar" />
    </div>
    <!-- 카드 뷰: 좁은 화면 + pageType 카드_자동/수동더보기 -->
    <template v-if="showCardView">
      <div class="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="(row, idx) in displayRows"
          :key="getRowId(row) ?? idx"
          class="border border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-md transition flex flex-col gap-2"
        >
          <div v-if="selectable" class="flex items-center justify-end">
            <input type="checkbox" :checked="selectedIds.includes(getRowId(row))" @change="toggleSelect(row)" />
          </div>
          <div class="flex-1 space-y-1.5 text-sm">
            <template v-for="col in columns" :key="col.key">
              <div class="flex flex-wrap gap-1">
                <span class="text-gray-500 shrink-0">{{ col.label }}:</span>
                <span class="min-w-0 break-words">
                  <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                    <button
                      v-if="titleColumnKey === col.key && detailRoute"
                      type="button"
                      class="text-left font-medium text-amber-600 hover:underline bg-transparent border-0 cursor-pointer p-0"
                      @click="onTitleClick(row, $event)"
                    >
                      {{ row[col.key] }}
                    </button>
                    <template v-else>{{ row[col.key] }}</template>
                  </slot>
                </span>
              </div>
            </template>
          </div>
          <div v-if="showDetailCol || showEditCol || $slots['row-actions']" class="flex flex-wrap gap-2 pt-2 border-t border-gray-100" @click.stop>
            <template v-if="showDetailCol && detailRoute">
              <button type="button" class="text-amber-600 hover:underline font-medium text-sm bg-transparent border-0 cursor-pointer p-0" @click="onDetailClick(row, $event)">상세</button>
            </template>
            <template v-if="showEditCol && (editRoute || detailRoute)">
              <button type="button" class="text-blue-600 hover:underline font-medium text-sm bg-transparent border-0 cursor-pointer p-0" @click="onEditClick(row, $event)">수정</button>
            </template>
            <slot name="row-actions" :row="row" />
          </div>
        </div>
      </div>
    </template>
    <!-- 테이블 뷰 -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-100 text-gray-700 border-b border-gray-200">
          <tr>
            <th v-if="selectable" class="w-10 p-3">
              <input type="checkbox" :checked="allSelected" @change="onToggleAll(($event.target as HTMLInputElement).checked)" />
            </th>
            <th v-for="col in columns" :key="col.key" class="p-3 font-semibold" :class="col.thClass">
              {{ col.label }}
            </th>
            <th v-if="showDetailCol || showEditCol || $slots['row-actions']" class="w-40 p-3 font-semibold">상세/수정</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in rows"
            :key="rowKey ? row[rowKey] : idx"
            class="border-b border-gray-100 hover:bg-gray-100 transition"
            :class="{ 'cursor-pointer': rowClickable, 'bg-gray-50': idx % 2 === 1 }"
            @click="rowClickable ? $emit('rowClick', row) : undefined"
          >
            <td v-if="selectable" class="p-3" @click.stop>
              <input type="checkbox" :checked="selectedIds.includes(getRowId(row))" @change="toggleSelect(row)" />
            </td>
            <td v-for="col in columns" :key="col.key" class="p-3" :class="col.tdClass">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                <button
                  v-if="titleColumnKey === col.key && detailRoute"
                  type="button"
                  class="text-left w-full font-medium text-amber-600 hover:underline bg-transparent border-0 cursor-pointer p-0"
                  @click="onTitleClick(row, $event)"
                >
                  {{ row[col.key] }}
                </button>
                <template v-else>{{ row[col.key] }}</template>
              </slot>
            </td>
            <td v-if="showDetailCol || showEditCol || $slots['row-actions']" class="p-3 space-x-2" @click.stop>
              <template v-if="showDetailCol">
                <template v-if="detailRoute">
                  <NuxtLink
                    v-if="!detailOpenNewTab"
                    :to="getDetailPath(row)"
                    class="text-amber-600 hover:underline font-medium"
                  >
                    상세
                  </NuxtLink>
                  <button
                    v-else
                    type="button"
                    class="text-amber-600 hover:underline font-medium bg-transparent border-0 cursor-pointer p-0"
                    @click="onDetailClick(row, $event)"
                  >
                    상세
                  </button>
                </template>
                <button
                  v-else
                  type="button"
                  class="text-amber-600 hover:underline font-medium"
                  @click="$emit('detailClick', row)"
                >
                  상세
                </button>
              </template>
              <template v-if="showEditCol && (editRoute || detailRoute)">
                <button
                  type="button"
                  class="text-blue-600 hover:underline font-medium bg-transparent border-0 cursor-pointer p-0"
                  @click="onEditClick(row, $event)"
                >
                  수정
                </button>
              </template>
              <slot name="row-actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="displayRows.length === 0" class="p-8 text-center text-gray-500">조회 결과가 없습니다.</div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = withDefaults(
  defineProps<{
    columns: { key: string; label: string; thClass?: string; tdClass?: string }[];
    rows: T[];
    /** 좁은 화면 카드 뷰용 누적 목록 (pageType이 L_Paging_C_* 일 때 사용) */
    cardRows?: T[];
    /** 목록 페이징 타입 (반응형 시 테이블/카드 구분) */
    pageType?: import("~/types/page").PageType;
    rowKey?: string;
    selectable?: boolean;
    showDetailCol?: boolean;
    detailRoute?: string | ((row: T) => string);
    /** true이면 상세를 프레임 탭 또는 새 브라우저 탭으로 열기 */
    detailOpenNewTab?: boolean;
    /** detailOpenNewTab일 때 탭 제목 (row별) */
    detailTabTitle?: (row: T) => string;
    /** 그리드 행에 수정 버튼 표시 (탭으로 열기) */
    showEditCol?: boolean;
    /** 수정 버튼 경로 (row별). 없으면 detailRoute 사용 */
    editRoute?: string | ((row: T) => string);
    /** 수정 탭 제목 (row별). 예: 회원상세(1) */
    editTabTitle?: (row: T) => string;
    /** 이 키의 셀을 클릭하면 상세 탭 오픈 (예: name, title). detailRoute 필요 */
    titleColumnKey?: string;
    rowClickable?: boolean;
  }>(),
  { rowKey: "id", selectable: false, showDetailCol: false, detailOpenNewTab: false, showEditCol: false, rowClickable: false }
);

const { isCardView } = useBreakpoint();

const isCardMode = computed(() => {
  const t = props.pageType;
  return (t === "L_Paging_C_AutoLoad" || t === "L_Paging_C_ManualLoad") && (props.cardRows !== undefined && props.cardRows !== null);
});

const showCardView = computed(() => isCardView.value && isCardMode.value);

const displayRows = computed(() => (showCardView.value && props.cardRows ? props.cardRows : props.rows));

const emit = defineEmits<{
  (e: "toggleAll", checked: boolean): void;
  (e: "selectChange", ids: (string | number)[]): void;
  (e: "rowClick", row: T): void;
  (e: "detailClick", row: T): void;
}>();

const selectedIds = defineModel<(string | number)[]>("selectedIds", { default: () => [] });

const { openDetailTab } = useOpenDetailTab();

const allSelected = computed(() => props.rows.length > 0 && selectedIds.value.length === props.rows.length);

function getDetailPath(row: T) {
  return typeof props.detailRoute === "function" ? props.detailRoute(row) : (props.detailRoute ?? "") + "/" + getRowId(row);
}

function getEditPath(row: T) {
  if (props.editRoute) return typeof props.editRoute === "function" ? props.editRoute(row) : (props.editRoute ?? "") + "/" + getRowId(row);
  return getDetailPath(row);
}

function onDetailClick(row: T, e?: MouseEvent) {
  const path = getDetailPath(row);
  const title = props.detailTabTitle?.(row) ?? "상세";
  openDetailTab(path, title, e?.ctrlKey ?? false);
}

function onEditClick(row: T, e?: MouseEvent) {
  const path = getEditPath(row);
  const title = props.editTabTitle?.(row) ?? "수정";
  openDetailTab(path, title, e?.ctrlKey ?? false);
}

function onTitleClick(row: T, e?: MouseEvent) {
  const path = getDetailPath(row);
  const title = props.detailTabTitle?.(row) ?? "상세";
  openDetailTab(path, title, e?.ctrlKey ?? false);
}

function getRowId(row: T) {
  const key = props.rowKey ?? "id";
  const v = row[key];
  return v as string | number;
}

function setSelectedIds(next: (string | number)[]) {
  const arr = selectedIds.value;
  if (Array.isArray(arr)) {
    arr.splice(0, arr.length, ...next);
  } else {
    selectedIds.value = next;
  }
}

function toggleSelect(row: T) {
  const id = getRowId(row);
  const set = new Set(selectedIds.value);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  const next = [...set];
  setSelectedIds(next);
  emit("selectChange", next);
}

function onToggleAll(checked: boolean) {
  const next = checked ? props.rows.map((r) => getRowId(r)) : [];
  setSelectedIds(next);
  emit("selectChange", next);
}
</script>
