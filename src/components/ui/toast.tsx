import { createToastHook } from "@gluestack-ui/core/toast/creator";
import { forwardRef, type ReactNode } from "react";
import { Text, View, type TextProps, type ViewProps } from "react-native";

type ToastProps = ViewProps & {
  action?: "muted" | "error" | "warning" | "info" | "success";
  variant?: "solid" | "outline" | "accent";
};

const Toast = forwardRef<View, ToastProps>(
  ({ action: _action, variant: _variant, ...props }, ref) => <View ref={ref} {...props} />,
);
Toast.displayName = "Toast";

function ToastTitle({ children, ...props }: TextProps & { children: ReactNode }) {
  return <Text {...props}>{children}</Text>;
}

function ToastDescription({ children, ...props }: TextProps & { children: ReactNode }) {
  return <Text {...props}>{children}</Text>;
}

const useToast = createToastHook(View);

export { Toast, ToastDescription, ToastTitle, useToast };
