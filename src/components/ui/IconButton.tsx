import { type ReactNode } from "react";
import { Pressable, View } from "react-native";

interface IconButtonProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  badge?: boolean;
  hitSlop?: number;
  disabled?: boolean;
}

export default function IconButton({
  children,
  onPress,
  className = "",
  badge = false,
  hitSlop = 8,
  disabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      className={`relative items-center justify-center ${disabled ? "opacity-40" : "active:opacity-70"} ${className}`}
    >
      {children}

      {badge && <View className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />}
    </Pressable>
  );
}
