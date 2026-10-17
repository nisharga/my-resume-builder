import { type ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

type Props = {
  title: string;
  subtitle?: ReactNode;
};

export function FormTitle({ title, subtitle }: Props) {
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(16);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 350 });
    titleY.value = withTiming(0, { duration: 350 });
    subtitleOpacity.value = withDelay(120, withTiming(1, { duration: 350 }));
    subtitleY.value = withDelay(120, withTiming(0, { duration: 350 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));

  return (
    <View className="mb-8 items-center">
      <Animated.Text style={titleStyle} className="three-xl-medium mb-1 text-center">
        {title}
      </Animated.Text>
      {subtitle ? (
        <Animated.View style={subtitleStyle} className="flex-row flex-wrap justify-center">
          {typeof subtitle === "string" ? (
            <Text className="base-normal text-center">{subtitle}</Text>
          ) : (
            subtitle
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}
