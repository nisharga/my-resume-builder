import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import type { SectionCompletion } from "@/utils/cv";
import { colors } from "@/styles/colors";

interface Props {
  completion: SectionCompletion;
}

export default function CVProgressBar({ completion }: Props) {
  // Summary is optional — only the 4 core sections count toward progress
  const { summary: _summary, ...required } = completion;
  const count = Object.values(required).filter(Boolean).length;
  const total = 4;
  // Start at 20% by default; each completed section adds 20%
  const pct = 20 + Math.round((count / total) * 80);

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
          {count === total ? "" : "  ·  Summary optional"}
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
