import { createRef } from "react";
import type { AppToastRef, ToastConfig } from "@/components/ui/AppToast";

// Module-level ref — set once in _layout.tsx via <AppToast ref={toastRef} />
export const toastRef = createRef<AppToastRef>();

const show = (config: ToastConfig) => toastRef.current?.show(config);

export const toast = {
  success(message: string, duration?: number) {
    show({ variant: "success", message, duration });
  },
  error(message: string, duration?: number) {
    show({ variant: "error", message, duration: duration ?? 4000 });
  },
  info(message: string, duration?: number) {
    show({ variant: "info", message, duration });
  },
  custom(config: ToastConfig) {
    show(config);
  },
};
