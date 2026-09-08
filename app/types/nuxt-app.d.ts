import type { ConfirmOptions } from "~/composables/useConfirm";
import type { AlertOptions } from "~/composables/useAlert";

declare module "#app" {
  interface NuxtApp {
    $confirm: (options: ConfirmOptions) => Promise<boolean>;
    $alert: (messageOrOptions: string | AlertOptions) => Promise<void>;
  }
}
