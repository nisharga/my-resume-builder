import React from "react";
import { Pressable, Text, View, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors } from "@/styles/colors";

export interface SectionHeaderActionProps {
  /** Label prefix or title (e.g. "Template") */
  label?: string;
  /** Active value or name to display (e.g. "Modern Minimalist") */
  value?: string;
  /** Right button text (default: "Change") */
  actionLabel?: string;
  /** Callback fired when the action button is tapped */
  onActionPress: () => void;
  /** Custom action button text color (default: colors.primary) */
  actionColor?: string;
  /** Optional hitSlop for the action button touch area (default: 8) */
  hitSlop?: number;
  /** NativeWind class overrides for the container */
  className?: string;
  /** Custom container style overrides */
  style?: StyleProp<ViewStyle>;
  /** Custom action label style overrides */
  actionTextStyle?: StyleProp<TextStyle>;
}

export const SectionHeaderAction: React.FC<SectionHeaderActionProps> = ({
  label = "Template",
  value,
  actionLabel = "Change",
  onActionPress,
  actionColor = colors.primary,
  hitSlop = 8,
  className = "",
  style,
  actionTextStyle,
}) => {
  return (
    <View className={`flex-row items-center justify-between py-1 ${className}`} style={style}>
      <Text className="sm-bold text-foreground">
        {label}
        {value ? `: ${value}` : ""}
      </Text>

      <Pressable
        onPress={onActionPress}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} ${label}`}
        className="active:opacity-60"
      >
        <Text
          style={[
            {
              fontSize: 12,
              fontWeight: "600",
              color: actionColor,
            },
            actionTextStyle,
          ]}
        >
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
};

export default SectionHeaderAction;
