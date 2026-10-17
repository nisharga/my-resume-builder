import { SPLASH_TAGLINE, SPLASH_TITLE } from "@/config/appConfig";
import { colors } from "@/styles/colors";
import * as SplashScreen from "expo-splash-screen";
import { FileText } from "lucide-react-native";
import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type Props = { onFinish: () => void };

export default function CustomSplashScreen({ onFinish }: Props) {
  const iconScale = useSharedValue(0.4);
  const iconOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {});
    });

    iconScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.3)) });
    iconOpacity.value = withTiming(1, { duration: 500 });

    textOpacity.value = withDelay(450, withTiming(1, { duration: 500 }));
    textY.value = withDelay(450, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));

    screenOpacity.value = withDelay(
      2400,
      withTiming(0, { duration: 600 }, (done) => {
        "worklet";
        if (done) runOnJS(onFinish)();
      }),
    );

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View
      style={[screenStyle, { flex: 1, backgroundColor: colors.primary }]}
      className="items-center justify-center"
    >
      {/* Decorative circles */}
      <Animated.View className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10" />
      <Animated.View className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-white/10" />

      {/* Icon card */}
      <Animated.View
        style={iconStyle}
        className="mb-10 h-32 w-32 items-center justify-center rounded-[32px] bg-white/20"
      >
        <FileText size={56} color={colors.white} strokeWidth={1.5} />
      </Animated.View>

      {/* Brand */}
      <Animated.View style={textStyle} className="items-center gap-3">
        <Text className="four-xl-bold">{SPLASH_TITLE}</Text>
        <Text className="sm-normal px-10 text-center">{SPLASH_TAGLINE}</Text>
      </Animated.View>
    </Animated.View>
  );
}
