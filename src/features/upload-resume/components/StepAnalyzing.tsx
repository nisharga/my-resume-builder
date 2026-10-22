import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { colors } from "@/styles/colors";

const MESSAGES = [
  "Reading your resume...",
  "Extracting personal info...",
  "Analyzing work experience...",
  "Parsing education & skills...",
  "Building your profile...",
  "Almost done!",
];

const DOC_H = 160;
const TOTAL_MS = 3600;

interface Props {
  onDone: () => void;
}

export default function StepAnalyzing({ onDone }: Props) {
  const [scanY] = useState(() => new Animated.Value(0));
  const [progress] = useState(() => new Animated.Value(0));
  const [msgIdx, setMsgIdx] = useState(0);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, { toValue: DOC_H - 2, duration: 900, useNativeDriver: true }),
        Animated.timing(scanY, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: TOTAL_MS,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setMsgIdx((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, TOTAL_MS / MESSAGES.length);

    const done = setTimeout(onDone, TOTAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [scanY, progress, onDone]);

  return (
    <View className="flex-1 items-center px-4 pt-4">
      <Text className="xl-bold mb-1 text-foreground">AI is reading your CV</Text>
      <Text className="sm-normal mb-8 text-center text-muted-foreground">
        Sit tight while we extract all the details from your resume.
      </Text>

      {/* Document with scan beam */}
      <View
        style={{
          width: 130,
          height: DOC_H,
          backgroundColor: "#f1f5f9",
          borderRadius: 12,
          overflow: "hidden",
          padding: 14,
          gap: 9,
          marginBottom: 36,
        }}
      >
        {[78, 55, 70, 48, 65, 50, 72, 42].map((w, i) => (
          <View
            key={i}
            style={{ height: 5, width: `${w}%`, backgroundColor: colors.border, borderRadius: 3 }}
          />
        ))}

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: colors.primary,
            opacity: 0.75,
            transform: [{ translateY: scanY }],
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: colors.primary,
            opacity: 0.06,
            transform: [{ translateY: scanY }],
          }}
        />
      </View>

      {/* AI badge */}
      <View
        style={{
          backgroundColor: colors.primary + "18",
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 5,
          marginBottom: 10,
        }}
      >
        <Text
          style={{ color: colors.primary, fontSize: 11, fontWeight: "700", letterSpacing: 1.5 }}
        >
          AI ANALYZING
        </Text>
      </View>

      <Text className="sm-semibold mb-10 text-foreground">{MESSAGES[msgIdx]}</Text>

      {/* Progress bar */}
      <View
        style={{
          width: "100%",
          height: 6,
          backgroundColor: colors.border,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: 6,
            backgroundColor: colors.primary,
            borderRadius: 3,
            width: progressWidth,
          }}
        />
      </View>
    </View>
  );
}
