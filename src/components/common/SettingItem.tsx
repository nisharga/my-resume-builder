import { colors } from "@/styles";
import { ChevronDown } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface SettingItemProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  right?: "chevron" | "toggle";
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  expandedContent?: ReactNode;
  isLast?: boolean;
  index?: number;
}

function SettingItem({
  icon,
  title,
  subtitle,
  right = "chevron",
  toggled,
  onToggle,
  onPress,
  expandedContent,
  isLast = false,
  index = 0,
}: SettingItemProps) {
  const [open, setOpen] = useState(false);
  const hasExpand = right === "chevron" && !!expandedContent;

  const chevronRotation = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  function handlePress() {
    if (onPress) {
      onPress();
    } else if (hasExpand) {
      const next = !open;
      setOpen(next);
      chevronRotation.value = withTiming(next ? 180 : 0, { duration: 220 });
    }
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 55)
        .duration(320)
        .springify()}
      className={`${!isLast ? "border-b border-border" : ""}`}
    >
      <Pressable
        onPress={handlePress}
        className="flex-row items-center gap-3 px-4 py-3.5 active:bg-secondary/60"
      >
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">{icon}</View>

        <View className="flex-1">
          <Text className="sm-semibold text-foreground">{title}</Text>
          <Text className="caption mt-0.5">{subtitle}</Text>
        </View>

        {right === "toggle" ? (
          <Switch
            value={toggled}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ) : (
          <Animated.View style={chevronStyle}>
            <ChevronDown size={18} color={colors.mutedForeground} strokeWidth={2} />
          </Animated.View>
        )}
      </Pressable>

      {hasExpand && open && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          className="border-t border-border bg-secondary/40 px-4 py-3"
        >
          {expandedContent}
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default SettingItem;
