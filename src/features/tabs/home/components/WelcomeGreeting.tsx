import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
} from "react-native-reanimated";
import { colors } from "@/styles/colors";
import { Icons } from "@/components";

interface WelcomeGreetingProps {
  welcomeLabel: string;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

const WelcomeGreeting = ({
  welcomeLabel,
  onNotificationPress,
  notificationCount = 0,
}: WelcomeGreetingProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Initial 3-second delay, then repeat the wave + wait loop infinitely
    rotation.value = withDelay(
      3000,
      withRepeat(
        withSequence(
          // 1. Waving motions
          withTiming(18, { duration: 180 }),
          withTiming(-18, { duration: 180 }),
          withTiming(14, { duration: 180 }),
          withTiming(-14, { duration: 180 }),
          withTiming(0, { duration: 180 }),
          // 2. Pause at rest (0deg) for 3 seconds before next shake
          withDelay(3000, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-row items-center py-3">
      {/* Avatar */}
      <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
        <Icons.User size={22} color={colors.primary} strokeWidth={1.8} />
      </View>

      {/* Greeting text with waving emoji */}
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text
            className="text-lg leading-tight text-foreground"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Welcome Back!
          </Text>
          <Animated.View style={[{ marginLeft: 6, marginTop: -2 }, animatedStyle]}>
            <Text className="text-lg">👋</Text>
          </Animated.View>
        </View>

        <Text
          className="-mt-1 text-sm text-muted-foreground"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          {welcomeLabel}
        </Text>
      </View>

      {/* Notification bell */}
      <Pressable
        onPress={onNotificationPress}
        className="relative h-10 w-10 items-center justify-center rounded-full bg-accent"
        hitSlop={8}
      >
        <Icons.Bell size={20} color={colors.foreground} strokeWidth={1.8} />
        {notificationCount > 0 && (
          <View className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        )}
      </Pressable>
    </View>
  );
};

export default WelcomeGreeting;
