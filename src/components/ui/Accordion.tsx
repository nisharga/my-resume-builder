import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { colors } from "@/styles/colors";

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: Props) {
  const [contentHeight, setContentHeight] = useState(0);
  const open = useSharedValue(defaultOpen ? 1 : 0);

  const bodyStyle = useAnimatedStyle(() => ({
    height: interpolate(open.value, [0, 1], [0, contentHeight]),
    opacity: interpolate(open.value, [0, 0.5, 1], [0, 0, 1]),
    overflow: "hidden",
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(open.value, [0, 1], [0, 180])}deg` }],
  }));

  function toggle() {
    open.value = withTiming(open.value === 1 ? 0 : 1, { duration: 240 });
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>{title}</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={colors.mutedForeground} strokeWidth={2} />
        </Animated.View>
      </Pressable>

      {/* Animated body */}
      <Animated.View style={bodyStyle}>
        {/* Hidden measure layer — renders content off-screen to get its height */}
        <View
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          {children}
        </View>
        {/* Visible content */}
        <View>{children}</View>
      </Animated.View>
    </View>
  );
}
