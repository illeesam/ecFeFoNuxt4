const CARD_VIEW_MAX_WIDTH = 767;

export function useBreakpoint() {
  const isCardView = ref(false);

  function update() {
    if (typeof window === "undefined") return;
    isCardView.value = window.innerWidth <= CARD_VIEW_MAX_WIDTH;
  }

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") window.removeEventListener("resize", update);
  });

  return { isCardView };
}
