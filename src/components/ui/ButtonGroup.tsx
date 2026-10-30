import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@/styles/colors";

interface AnimatedButtonProps {
  label: string | ReactNode;
  labelClassName?: string;
  onPress: () => void;
  variant: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

function AnimatedButton({
  label,
  labelClassName = "",
  onPress,
  variant,
  className = "",
  disabled,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressableClass =
    variant === "primary"
      ? `w-full items-center rounded-xl bg-primary py-3.5 ${className}`
      : `w-full items-center rounded-xl border border-border py-3.5 ${className}`;

  const labelColor = variant === "primary" ? colors.white : colors.mutedForeground;

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.95, { duration: 100 });
          opacity.value = withTiming(0.75, { duration: 100 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 180 });
          opacity.value = withTiming(1, { duration: 180 });
        }}
        disabled={disabled}
        className={pressableClass}
      >
        {typeof label === "string" ? (
          <Text className={`sm-semibold ${labelClassName}`} style={{ color: labelColor }}>
            {label}
          </Text>
        ) : (
          label
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── public API ───────────────────────────────────────────────────────────────

interface ButtonGroupProps {
  btnGroupClassName?: string;

  primaryBtnLabel: string | ReactNode;
  primaryBtnAction: () => void;
  primaryBtnClassName?: string;
  primaryBtnLabelClass?: string;
  primaryBtnDisabled?: boolean;

  secondaryBtnLabel: string | ReactNode;
  secondaryBtnAction: () => void;
  secondaryBtnClassName?: string;
  secondaryBtnLabelClass?: string;
  secondaryBtnDisabled?: boolean;
}

export default function ButtonGroup({
  btnGroupClassName = "",
  primaryBtnLabel,
  primaryBtnAction,
  primaryBtnClassName,
  primaryBtnLabelClass,
  primaryBtnDisabled,
  secondaryBtnLabel,
  secondaryBtnAction,
  secondaryBtnClassName,
  secondaryBtnLabelClass,
  secondaryBtnDisabled,
}: ButtonGroupProps) {
  return (
    <View className={`flex-row gap-3 ${btnGroupClassName}`}>
      <AnimatedButton
        label={secondaryBtnLabel}
        labelClassName={secondaryBtnLabelClass}
        onPress={secondaryBtnAction}
        variant="secondary"
        className={secondaryBtnClassName}
        disabled={secondaryBtnDisabled}
      />
      <AnimatedButton
        label={primaryBtnLabel}
        labelClassName={primaryBtnLabelClass}
        onPress={primaryBtnAction}
        variant="primary"
        className={primaryBtnClassName}
        disabled={primaryBtnDisabled}
      />
    </View>
  );
}
