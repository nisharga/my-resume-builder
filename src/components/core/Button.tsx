import React, { useState } from "react";
import {
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  activeOpacity?: number;
  gradientColors?: readonly [string, string];
  className?: string;
  innerClassName?: string;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  activeOpacity = 0.85,
  gradientColors,
  className = "",
  innerClassName = "",
  style,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const isInactive = disabled || isLoading;
  const [isPressed, setIsPressed] = useState(false);

  // Lazy initializer prevents "Cannot access ref value during render" lint error
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = (e: any) => {
    if (!isInactive) {
      setIsPressed(true);
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    if (!isInactive) {
      setIsPressed(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
    onPressOut?.(e);
  };

  const combinedClasses = `${className} ${innerClassName}`;
  const customRounded = combinedClasses.split(" ").find((cls) => cls.startsWith("rounded-"));
  const activeRadiusClass = customRounded ?? "rounded-full";

  const baseInnerClass = `h-[52px] min-w-[52px] flex-row items-center justify-center gap-2 px-6 overflow-hidden ${activeRadiusClass} ${innerClassName}`;

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#FFFFFF" />;
    }
    if (typeof children === "string") {
      return <Text className="text-base font-semibold tracking-wide text-white">{children}</Text>;
    }
    return children;
  };

  const resolvedGradientColors =
    gradientColors ??
    (isInactive
      ? (["#C7D2FE", "#C7D2FE"] as const)
      : isPressed
        ? (["#3B5BDB", "#7074E8"] as const)
        : (["#4A6CF7", "#8B8FFF"] as const));

  return (
    <Animated.View
      style={[{ transform: [{ scale: scaleAnim }] }, !isInactive && styles.softGlow]}
      className={`${activeRadiusClass} ${className}`}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled: isInactive, busy: isLoading }}
        disabled={isInactive}
        activeOpacity={activeOpacity}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
        {...rest}
        className={`overflow-hidden ${activeRadiusClass}`}
      >
        {gradientColors || !className.includes("bg-") ? (
          <LinearGradient
            colors={resolvedGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={baseInnerClass}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          <View className={`${baseInnerClass} ${isInactive ? "opacity-50" : ""}`}>
            {renderContent()}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  softGlow: {
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
});
