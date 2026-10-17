import { createRef } from "react";
import type { AppToastRef, ToastConfig } from "@/components/ui/AppToast";

// Module-level ref — set once in _layout.tsx via <AppToast ref={toastRef} />
export const toastRef = createRef<AppToastRef>();

const show = (config: ToastConfig) => toastRef.current?.show(config);

export const showToast = {
  success(title: string, message?: string, duration?: number) {
    show({ variant: "success", title, message, duration });
  },
  error(title: string, message?: string, duration?: number) {
    show({ variant: "error", title, message, duration: duration ?? 4000 });
  },
  info(title: string, message?: string, duration?: number) {
    show({ variant: "info", title, message, duration });
  },
  custom(config: ToastConfig) {
    show(config);
  },
};
