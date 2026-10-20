import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/colors";

interface Props {
  title: string;
  /** Right slot text (default "Done"). Pass null to hide. */
  rightLabel?: string | null;
  onRight?: () => void;
  children: ReactNode;
  /** Rendered BELOW the scrollable content, outside the keyboard avoidance. */
  footer?: ReactNode;
}

export default function CVSectionScreen({
  title,
  rightLabel = "Done",
  onRight,
  children,
  footer,
}: Props) {
  const router = useRouter();

  function handleRight() {
    if (onRight) onRight();
    else router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={{ width: 44, alignItems: "center" }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 17,
            fontWeight: "600",
            color: colors.foreground,
          }}
        >
          {title}
        </Text>

        <View style={{ width: 44, alignItems: "center" }}>
          {rightLabel !== null && (
            <Pressable
              onPress={handleRight}
              hitSlop={8}
              accessibilityLabel={rightLabel ?? "Done"}
              accessibilityRole="button"
              className="mr-2"
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.primary }}>
                {rightLabel}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
      </KeyboardAvoidingView>

      {footer}
    </SafeAreaView>
  );
}
