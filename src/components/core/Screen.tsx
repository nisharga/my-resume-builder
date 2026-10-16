import { useEffect } from "react";
import type { ReactNode } from "react";
import { ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  /** Indices of scroll children that should stick when scrolled past */
  stickyHeaderIndices?: number[];
  /** Extra classes on the root container */
  className?: string;
  statusBar?: StatusBarStyle;
  edges?: Edge[];
};

export default function Screen({
  children,
  stickyHeaderIndices,
  className = "",
  statusBar = "auto",
  edges = ["top"],
}: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges} className={`bg-background`}>
      <StatusBar style={statusBar} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={stickyHeaderIndices}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces
      >
        <Animated.View className={className} style={[{ flex: 1 }, animStyle]}>
          {children}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
