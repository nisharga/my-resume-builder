import { Button } from "@/components";
import { setOnboardingCompleted } from "@/config";
import { colors } from "@/styles/colors";
import { Briefcase, FileText, LayoutTemplate, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Slide = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    Icon: FileText,
    iconBg: colors.accent,
    iconColor: colors.primary,
    title: "Build Your CV",
    description: "Create stunning professional resumes in minutes with our easy-to-use builder.",
  },
  {
    Icon: LayoutTemplate,
    iconBg: "#FFF7ED",
    iconColor: colors.warning,
    title: "Choose a Template",
    description: "Pick from professionally designed templates that make you stand out.",
  },
  {
    Icon: Briefcase,
    iconBg: "#F0FDF4",
    iconColor: colors.success,
    title: "Get Hired",
    description: "Download and share your CV to land your dream job.",
  },
];

type Props = { onComplete?: () => void };

export default function OnboardingScreen({ onComplete }: Props) {
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index]!;
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
            <Text className="text-base font-medium text-muted-foreground">Skip</Text>
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

        <Text className="mb-4 text-center text-3xl leading-tight font-bold text-heading">
          {slide.title}
        </Text>
        <Text className="text-center text-base leading-relaxed text-body">{slide.description}</Text>
      </Animated.View>

      {/* Bottom controls */}
      <View className="gap-5 px-6 pb-6">
        {/* Dot indicators */}
        <View className="flex-row justify-center gap-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{ backgroundColor: i === index ? colors.primary : colors.border }}
              className={`h-2 rounded-full ${i === index ? "w-6" : "w-2"}`}
            />
          ))}
        </View>

        <Button onPress={goNext} className="rounded-2xl">
          {isLast ? "Get Started" : "Next"}
        </Button>
      </View>
    </SafeAreaView>
  );
}
