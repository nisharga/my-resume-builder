// components/AnimatedSplash.tsx
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function AnimatedSplash({
  isReady,
  onFinish,
}: {
  isReady: boolean;
  onFinish: () => void;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isReady) return;
    // 1. Hide the native splash. This view looks identical, so the swap is invisible.
    SplashScreen.hideAsync();
    // 2. Animate out
    scale.value = withTiming(1.2, { duration: 400 });
    opacity.value = withTiming(0, { duration: 400 }, (done) => {
      if (done) runOnJS(onFinish)();
    });
  }, [isReady]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, containerStyle]}
      pointerEvents="none"
    >
      <Animated.Image
        source={require("../assets/images/splash-icon.png")}
        style={[{ width: 200, height: 200 }, logoStyle]} // must match imageWidth in app.json
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
