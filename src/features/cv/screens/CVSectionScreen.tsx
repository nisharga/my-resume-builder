import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/colors";

interface Props {
  title: string;
  rightLabel?: string | null;
  onRight?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

interface SpringButtonProps {
  onPress: () => void;
  hitSlop?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

function SpringButton({
  onPress,
  hitSlop,
  accessibilityLabel,
  style,
  children,
}: SpringButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.8, { damping: 14, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 220 });
        }}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
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
        <SpringButton
          onPress={() => router.back()}
          hitSlop={8}
          style={{ width: 44, alignItems: "center" }}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </SpringButton>

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
            <SpringButton
              onPress={handleRight}
              hitSlop={8}
              accessibilityLabel={rightLabel ?? "Done"}
              style={{ marginRight: 8 }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.primary }}>
                {rightLabel}
              </Text>
            </SpringButton>
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
