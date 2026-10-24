import { colors } from "@/styles";
import { ChevronDown } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { View, Pressable, Switch, Text } from "react-native";

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
}: SettingItemProps) {
  const [open, setOpen] = useState(false);
  const hasExpand = right === "chevron" && !!expandedContent;

  function handlePress() {
    if (onPress) {
      onPress();
    } else if (hasExpand) {
      setOpen((v) => !v);
    }
  }

  return (
    <View className={`${!isLast ? "border-b border-border" : ""}`}>
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
          <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
            <ChevronDown size={18} color={colors.mutedForeground} strokeWidth={2} />
          </View>
        )}
      </Pressable>

      {hasExpand && open && (
        <View className="border-t border-border bg-secondary/40 px-4 py-3">{expandedContent}</View>
      )}
    </View>
  );
}

export default SettingItem;
