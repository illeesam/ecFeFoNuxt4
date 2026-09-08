let alertResolve: (() => void) | null = null;

export type AlertOptions = {
  title?: string;
  message: string;
  confirmText?: string;
};

export function useAlert() {
  const state = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
  }>("alert-dialog-state", () => ({
    open: false,
    title: "알림",
    message: "",
    confirmText: "확인",
  }));

  function openAlert(messageOrOptions: string | AlertOptions): Promise<void> {
    const options =
      typeof messageOrOptions === "string"
        ? { message: messageOrOptions }
        : messageOrOptions;
    state.value = {
      open: true,
      title: options.title ?? "알림",
      message: options.message,
      confirmText: options.confirmText ?? "확인",
    };
    return new Promise<void>((resolve) => {
      alertResolve = resolve;
    });
  }

  function handleClose() {
    state.value = { ...state.value, open: false };
    alertResolve?.();
    alertResolve = null;
  }

  return { state, openAlert, handleClose };
}
