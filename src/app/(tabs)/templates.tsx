import { Icons } from "@/src/components/Icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";
import { Button, ButtonText } from "@/components/ui/button";
import { useState } from "react";

export default function TemplatesScreen() {
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast();
    }
  };
  const showNewToast = () => {
    const newId = Math.random();
    console.log(newId);
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="solid">
            <ToastTitle>Hello!</ToastTitle>
            <ToastDescription>
              This is a customized toast message.
            </ToastDescription>
          </Toast>
        );
      },
    });
  };
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Button onPress={handleToast}>
        <ButtonText>Press Me</ButtonText>
      </Button>

      <View style={styles.content}>
        <Text style={styles.title}>Templates</Text>
      </View>

      <View style={styles.icons}>
        <Icons.CheckCircle width={32} height={32} fill="#1FD191" />
        <Icons.Newspaper width={32} height={32} fill="#F66B3B" />
        <Icons.Report width={32} height={32} />
        <Icons.Database width={32} height={32} />
        <Icons.RightArrow width={24} height={24} color="#3B82F6" />
        <Icons.Moon size={32} color="#6366F1" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  icons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    padding: 16,
    alignItems: "center",
  },
});
