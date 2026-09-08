<template>
  <ClientOnly>
    <div class="h-64" ref="wrapRef" />
    <template #fallback>
      <div class="h-64 flex items-center justify-center text-gray-400 text-sm">차트 로딩 중...</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[];
  title?: string;
}>();

const wrapRef = ref<HTMLDivElement | null>(null);
let chartInstance: import("chart.js").Chart | null = null;

onMounted(() => {
  if (import.meta.server || !wrapRef.value) return;
  import("chart.js/auto").then(({ default: Chart }) => {
    if (!wrapRef.value) return;
    const ctx = document.createElement("canvas");
    wrapRef.value.appendChild(ctx);
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: props.labels,
        datasets: props.datasets.map((d) => ({
          label: d.label,
          data: d.data,
          backgroundColor: d.backgroundColor ?? "rgba(245, 158, 11, 0.6)",
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: props.datasets.length > 1 } },
        scales: { y: { beginAtZero: true } },
      },
    });
  });
});

onBeforeUnmount(() => {
  chartInstance?.destroy();
  chartInstance = null;
});
</script>
