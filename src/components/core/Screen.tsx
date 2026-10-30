import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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
  className?: string;
  statusBar?: StatusBarStyle;
  edges?: Edge[];
};

export default function Screen({
  children,
  className = "",
  statusBar = "auto",
  edges = ["top"],
}: Props) {
  // Auto-detect children that have sticky={true} and build stickyHeaderIndices
  const stickyIndices = React.Children.toArray(children).reduce<number[]>((acc, child, index) => {
    if (React.isValidElement(child) && (child.props as any).sticky === true) {
      acc.push(index);
    }
    return acc;
  }, []);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
  }, [opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: "#f7f8fa" }, animStyle]}>
      <SafeAreaView style={{ flex: 1 }} edges={edges} className={`bg-background ${className}`}>
        <StatusBar style={statusBar} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
            stickyHeaderIndices={stickyIndices.length > 0 ? stickyIndices : undefined}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}
