<template>
  <div ref="rootRef" class="select-multi-check">
    <div class="select-multi-check__trigger" :class="{ 'select-multi-check__trigger--open': isOpen, 'select-multi-check__trigger--summary': summaryMode }" @click.stop="isOpen = !isOpen">
      <span v-if="summaryMode" class="select-multi-check__summary">{{ modelValue.length }}/{{ options.length }} 선택</span>
      <template v-else>
        <span v-if="allSelected" class="select-multi-check__all">All</span>
        <template v-else-if="selectedValues.length > 0">
          <span v-for="val in selectedValues" :key="val" class="select-multi-check__tag" @click.stop="remove(val)">
            {{ getLabel(val) }}
            <span class="select-multi-check__tag-x">×</span>
          </span>
        </template>
        <span v-else class="select-multi-check__placeholder">선택...</span>
      </template>
      <span class="select-multi-check__caret">{{ isOpen ? "▲" : "▼" }}</span>
    </div>

    <Transition name="select-multi-check-drop">
      <div v-show="isOpen" class="select-multi-check__dropdown" @click.stop>
        <label class="select-multi-check__row select-multi-check__row--select-all">
          <input type="checkbox" :checked="allSelected" :indeterminate="someSelected && !allSelected" @change="toggleSelectAll" />
          <span>전체</span>
        </label>
        <div v-if="searchable" class="select-multi-check__search-wrap">
          <input v-model="searchQuery" type="text" class="select-multi-check__search" placeholder="Search" @click.stop />
        </div>
        <div class="select-multi-check__list">
          <label v-for="opt in filteredOptions" :key="opt.value" class="select-multi-check__row" :class="{ 'select-multi-check__row--disabled': opt.disabled }">
            <input type="checkbox" :checked="modelValue.includes(opt.value)" :disabled="opt.disabled" @change="toggle(opt.value)" @click.stop />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
export interface SelectMultiCheckOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    options: SelectMultiCheckOption[];
    searchable?: boolean;
    /** 한 줄 요약 표시 (예: 3/6 선택) */
    summaryMode?: boolean;
  }>(),
  { searchable: false, summaryMode: false },
);

const emit = defineEmits<{ (e: "update:modelValue", value: string[]): void }>();

const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref("");

const selectedValues = computed(() => props.modelValue);

const allSelected = computed(() => props.options.length > 0 && props.modelValue.length >= props.options.filter((o) => !o.disabled).length);

const someSelected = computed(() => props.modelValue.length > 0);

const filteredOptions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

function getLabel(value: string) {
  return props.options.find((o) => o.value === value)?.label ?? value;
}

function toggle(value: string) {
  const next = props.modelValue.includes(value) ? props.modelValue.filter((v) => v !== value) : [...props.modelValue, value];
  emit("update:modelValue", next);
}

function remove(value: string) {
  emit(
    "update:modelValue",
    props.modelValue.filter((v) => v !== value),
  );
}

function toggleSelectAll() {
  const enabled = props.options.filter((o) => !o.disabled);
  if (allSelected.value) {
    emit("update:modelValue", []);
  } else {
    emit(
      "update:modelValue",
      enabled.map((o) => o.value),
    );
  }
}

function handleClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false;
}

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  if (typeof document !== "undefined") document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.select-multi-check {
  position: relative;
  min-width: 100px;
  font-size: 0.8rem;
}

.select-multi-check__trigger {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 6px;
  min-height: 28px;
  padding: 4px 24px 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  line-height: 1.4;
}

.select-multi-check__trigger:hover {
  border-color: #9ca3af;
}

.select-multi-check__trigger--open {
  border-color: #6366f1;
  outline: 1px solid #6366f1;
}

.select-multi-check__trigger--summary {
  flex-wrap: nowrap;
}

.select-multi-check__summary {
  white-space: nowrap;
  color: #374151;
  font-size: 0.75rem;
}

.select-multi-check__all {
  color: #4b5563;
  font-weight: 500;
}

.select-multi-check__placeholder {
  color: #9ca3af;
  font-size: 0.75rem;
}

.select-multi-check__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  background: #6366f1;
  color: #fff;
  border-radius: 9999px;
  font-size: 0.72rem;
  line-height: 1.3;
}

.select-multi-check__tag-x {
  margin-left: 2px;
  cursor: pointer;
  opacity: 0.9;
}

.select-multi-check__tag-x:hover {
  opacity: 1;
}

.select-multi-check__caret {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.65rem;
  pointer-events: none;
}

.select-multi-check__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 2px;
  padding: 6px 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 220px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.select-multi-check__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #374151;
}

.select-multi-check__row:hover {
  background: #f3f4f6;
}

.select-multi-check__row--select-all {
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}

.select-multi-check__row--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-multi-check__row input {
  cursor: pointer;
  accent-color: #6366f1;
}

.select-multi-check__search-wrap {
  padding: 4px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.select-multi-check__search {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.8rem;
  outline: none;
}

.select-multi-check__search:focus {
  border-color: #6366f1;
}

.select-multi-check__list {
  overflow-y: auto;
  max-height: 160px;
}

.select-multi-check-drop-enter-active,
.select-multi-check-drop-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.select-multi-check-drop-enter-from,
.select-multi-check-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
