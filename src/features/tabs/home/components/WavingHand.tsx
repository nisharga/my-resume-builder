import { useEffect } from "react";
import { StyleProp, Text, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface WavingHandProps {
  emoji?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function WavingHand({
  emoji = "👋",
  className = "text-lg",
  style,
}: WavingHandProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withDelay(
      3000,
      withRepeat(
        withSequence(
          withTiming(18, { duration: 180 }),
          withTiming(-18, { duration: 180 }),
          withTiming(14, { duration: 180 }),
          withTiming(-14, { duration: 180 }),
          withTiming(0, { duration: 180 }),
          withDelay(3000, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );

    return () => cancelAnimation(rotation);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Text className={className}>{emoji}</Text>
    </Animated.View>
  );
}
