const confirmResolveMap = new Map<number, (value: boolean) => void>();
let confirmNextId = 0;

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
};

export function useConfirm() {
  const state = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: "default" | "danger";
    pendingId: number;
  }>("confirm-dialog-state", () => ({
    open: false,
    title: "확인",
    message: "",
    confirmText: "확인",
    cancelText: "취소",
    variant: "default",
    pendingId: 0,
  }));

  function openConfirm(options: ConfirmOptions): Promise<boolean> {
    const id = ++confirmNextId;
    state.value = {
      open: true,
      title: options.title ?? "확인",
      message: options.message,
      confirmText: options.confirmText ?? "확인",
      cancelText: options.cancelText ?? "취소",
      variant: options.variant ?? "default",
      pendingId: id,
    };
    return new Promise<boolean>((resolve) => {
      confirmResolveMap.set(id, resolve);
    });
  }

  function handleConfirm() {
    const id = state.value.pendingId;
    state.value = { ...state.value, open: false };
    confirmResolveMap.get(id)?.(true);
    confirmResolveMap.delete(id);
  }

  function handleCancel() {
    const id = state.value.pendingId;
    state.value = { ...state.value, open: false };
    confirmResolveMap.get(id)?.(false);
    confirmResolveMap.delete(id);
  }

  return { state, openConfirm, handleConfirm, handleCancel };
}
