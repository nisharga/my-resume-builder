import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import type { SectionCompletion } from "@/utils/cv";
import { completedCount } from "@/utils/cv";
import { colors } from "@/styles/colors";

interface Props {
  completion: SectionCompletion;
}

export default function CVProgressBar({ completion }: Props) {
  const count = completedCount(completion);
  const total = 5;
  const pct = Math.round((count / total) * 100);

  // useState avoids the react-hooks/refs "access .current during render" lint rule
  const [animWidth] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: pct,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [pct, animWidth]);

  const widthInterp = animWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="mx-4 mt-3 gap-1.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-[14px] text-muted-foreground">
          {count} of {total} sections complete
        </Text>
        <Text className="text-[14px] font-semibold text-foreground">{pct}%</Text>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-border">
        <Animated.View
          style={{
            height: 8,
            backgroundColor: colors.success,
            borderRadius: 4,
            width: widthInterp,
          }}
        />
      </View>
    </View>
  );
}
