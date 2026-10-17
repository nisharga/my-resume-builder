import { Button } from "@/components";
import {
  ONBOARDING_BTN_GET_STARTED,
  ONBOARDING_BTN_NEXT,
  ONBOARDING_BTN_SKIP,
  ONBOARDING_SLIDES,
} from "@/config/appConfig";
import { colors } from "@/styles/colors";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { setOnboardingCompleted } from "./storageOnboarding";

type Props = { onComplete?: () => void };

export default function OnboardingScreen({ onComplete }: Props) {
  const [index, setIndex] = useState(0);

  const isLast = index === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[index]!;
  const { Icon } = slide;

  async function finish() {
    try {
      await setOnboardingCompleted();
      onComplete?.();
    } catch (e) {
      console.error("Failed to complete onboarding", e);
    }
  }

  function goNext() {
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Skip */}
      <View className="flex-row justify-end px-6 pt-2">
        {!isLast ? (
          <Pressable onPress={finish} hitSlop={12}>
            <Text className="text-base font-medium text-muted-foreground">
              {ONBOARDING_BTN_SKIP}
            </Text>
          </Pressable>
        ) : (
          <View className="h-6" />
        )}
      </View>

      {/* Slide — key forces remount on index change, triggering enter/exit animations */}
      <Animated.View
        key={index}
        entering={FadeInRight.duration(300)}
        exiting={FadeOutLeft.duration(200)}
        className="flex-1 items-center justify-center px-8"
      >
        <View
          style={{ backgroundColor: slide.iconBg }}
          className="mb-12 h-52 w-52 items-center justify-center rounded-[40px]"
        >
          <Icon size={88} color={slide.iconColor} strokeWidth={1.5} />
        </View>

        <Text className="three-xl-medium mb-4 text-center">{slide.title}</Text>
        <Text className="base-normal text-center">{slide.description}</Text>
      </Animated.View>

      {/* Bottom controls */}
      <View className="gap-5 px-6 pb-6">
        {/* Dot indicators */}
        <View className="flex-row justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={{ backgroundColor: i === index ? colors.primary : colors.border }}
              className={`h-2 rounded-full ${i === index ? "w-6" : "w-2"}`}
            />
          ))}
        </View>

        <Button onPress={goNext} className="rounded-2xl">
          {isLast ? ONBOARDING_BTN_GET_STARTED : ONBOARDING_BTN_NEXT}
        </Button>
      </View>
    </SafeAreaView>
  );
}
