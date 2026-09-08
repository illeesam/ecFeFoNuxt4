<template>
  <div ref="rootRef" class="relative">
    <div class="flex gap-2">
      <input
        :value="displayLabel"
        type="text"
        readonly
        class="border rounded px-3 py-1.5 w-48 bg-gray-50 cursor-pointer"
        placeholder="회원 선택"
        @click="open = !open"
      />
      <button type="button" class="px-2 border rounded hover:bg-gray-100" @click="open = !open">
        {{ open ? "▲" : "▼" }}
      </button>
    </div>
    <div
      v-show="open"
      class="absolute top-full left-0 mt-1 w-96 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="p-2 border-b bg-gray-50 font-medium text-sm">회원 선택 (클릭)</div>
      <ul>
        <li
          v-for="m in memberList"
          :key="m.memberId"
          class="px-3 py-2 cursor-pointer hover:bg-amber-50 border-b border-gray-100 text-sm"
          :class="{ 'bg-amber-100': selected?.memberId === m.memberId }"
          @click="select(m)"
        >
          {{ m.name }} ({{ m.email }}) - {{ m.memberId }}
        </li>
      </ul>
      <div v-if="memberList.length === 0" class="p-4 text-gray-500 text-sm">회원 목록이 없습니다.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type MemberOption = { memberId: number; name: string; email: string };

const props = defineProps<{
  modelValue: MemberOption | null;
  memberList: MemberOption[];
}>();

const emit = defineEmits<{ (e: "update:modelValue", v: MemberOption | null): void }>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onUnmounted(() => document.removeEventListener("click", onDocClick));

const selected = computed(() => props.modelValue);

const displayLabel = computed(() =>
  props.modelValue ? `${props.modelValue.name} (${props.modelValue.email})` : ""
);

function select(m: MemberOption) {
  emit("update:modelValue", m);
  open.value = false;
}
</script>
