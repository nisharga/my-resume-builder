import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
} from "react-native-reanimated";

const WelcomeGreeting = ({ welcomeLabel }: { welcomeLabel: string }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Initial 3-second delay, then repeat the wave + wait loop infinitely
    rotation.value = withDelay(
      3000,
      withRepeat(
        withSequence(
          // 1. Shaking animation
          withTiming(18, { duration: 180 }),
          withTiming(-18, { duration: 180 }),
          withTiming(14, { duration: 180 }),
          withTiming(-14, { duration: 180 }),
          withTiming(0, { duration: 180 }),
          // 2. Pause at rest (0deg) for 3 seconds before next shake
          withDelay(3000, withTiming(0, { duration: 0 })),
        ),
        -1, // -1 creates an infinite repeat loop
        false,
      ),
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    marginTop: -4,
  }));

  return (
    <View className="flex-row items-center">
      <Text className="font-[Poppins-Regular] text-[14px] text-white/95">
        {"Hi"} {welcomeLabel} {""}
      </Text>
      <Animated.View style={animatedStyle}>
        <Text className="text-[14px]">👋</Text>
      </Animated.View>
    </View>
  );
};

export default WelcomeGreeting;
