import { createToast, createToastHook } from "@gluestack-ui/core/toast/creator";
import { Text, View } from "react-native";

const GluestackToast = createToast({
  Root: View,
  Title: Text,
  Description: Text,
});

const useToast = createToastHook(View);

const Toast = GluestackToast;
const ToastTitle = GluestackToast.Title;
const ToastDescription = GluestackToast.Description;

export { Toast, ToastDescription, ToastTitle, useToast };
