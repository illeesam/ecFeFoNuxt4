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
  datasets: { label: string; data: number[]; borderColor?: string; backgroundColor?: string }[];
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
      type: "line",
      data: {
        labels: props.labels,
        datasets: props.datasets.map((d, i) => {
          const colors = ["rgb(245, 158, 11)", "rgb(59, 130, 246)", "rgb(34, 197, 94)"];
          const c = colors[i % colors.length];
          return {
            label: d.label,
            data: d.data,
            borderColor: d.borderColor ?? c,
            backgroundColor: d.backgroundColor ?? c.replace("rgb", "rgba").replace(")", ", 0.1)"),
            fill: true,
            tension: 0.3,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
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
