export default defineNuxtPlugin(() => {
  const { openConfirm } = useConfirm();
  const { openAlert } = useAlert();
  return {
    provide: {
      confirm: openConfirm,
      alert: openAlert,
    },
  };
});
