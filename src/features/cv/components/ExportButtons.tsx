import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Edit2, FileText, FileType, type LucideProps } from "lucide-react-native";
import { colors } from "@/styles/colors";
import type { ComponentType } from "react";

interface Props {
  onEdit: () => void;
  onPDF: () => void;
  onDocs: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ExportBtn({
  Icon,
  label,
  onPress,
  variant = "default",
}: {
  Icon: ComponentType<LucideProps>;
  label: string;
  onPress: () => void;
  variant?: "default" | "primary" | "docs";
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "docs"
        ? colors.secondary
        : colors.background;

  const labelColor =
    variant === "default" ? colors.foreground : variant === "docs" ? colors.foreground : "#fff";
  const iconColor =
    variant === "default"
      ? colors.mutedForeground
      : variant === "docs"
        ? colors.foreground
        : "#fff";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 14, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        animStyle,
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 14,
          gap: 5,
          backgroundColor: bg,
        },
      ]}
    >
      <Icon size={20} color={iconColor} strokeWidth={1.8} />
      <Text style={{ fontSize: 12, fontWeight: "600", color: labelColor }}>{label}</Text>
    </AnimatedPressable>
  );
}

export default function ExportButtons({ onEdit, onPDF, onDocs }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <ExportBtn Icon={Edit2} label="Edit" onPress={onEdit} variant="default" />
      <View style={{ width: 1, backgroundColor: colors.border }} />
      <ExportBtn Icon={FileType} label="Docs" onPress={onDocs} variant="docs" />
      <View style={{ width: 1, backgroundColor: colors.border }} />
      <ExportBtn Icon={FileText} label="PDF" onPress={onPDF} variant="primary" />
    </View>
  );
}
