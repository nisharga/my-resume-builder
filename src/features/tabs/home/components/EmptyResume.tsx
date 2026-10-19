import { colors } from "@/styles/colors";
import { FilePlus } from "lucide-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function EmptyResume() {
  // ── Entrance ──────────────────────────────────────────────────────────────
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  // ── Idle float on the icon ────────────────────────────────────────────────
  const iconFloat = useSharedValue(0);

  useEffect(() => {
    // Fade + slide in
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });

    // Float: wait for entrance, then loop gently up/down
    iconFloat.value = withDelay(
      600,
      withRepeat(
        withSequence(withTiming(-10, { duration: 1200 }), withTiming(0, { duration: 1200 })),
        -1,
        true,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconFloat.value }],
  }));

  return (
    <Animated.View style={containerStyle} className="flex-1 items-center justify-center px-8 py-16">
      {/* Floating icon */}
      <Animated.View style={iconStyle}>
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-3xl bg-accent">
          <FilePlus size={48} color={colors.primary} strokeWidth={1.5} />
        </View>
      </Animated.View>

      {/* Text */}
      <Text
        className="mb-2 text-center text-lg text-foreground"
        style={{ fontFamily: "Poppins-SemiBold" }}
      >
        No Resumes Yet
      </Text>
      <Text
        className="text-center text-sm text-muted-foreground"
        style={{ fontFamily: "Poppins-Regular" }}
      >
        Create your first resume and start building your professional career.
      </Text>
    </Animated.View>
  );
}
