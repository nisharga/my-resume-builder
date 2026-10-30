import type { ReactNode } from "react";
import { Text, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export default function ScreenHeader({ title, left, right, className = "" }: ScreenHeaderProps) {
  return (
    <View className={`flex-row items-center px-4 pt-1 pb-2 ${className}`}>
      {/* Left slot — fixed width to keep title centred */}
      <View className="w-10">{left ?? null}</View>

      {/* Title */}
      <View className="flex-1 items-center">
        <Text className="lg-medium">{title}</Text>
      </View>

      {/* Right slot */}
      <View className="w-10 items-end">{right ?? null}</View>
    </View>
  );
}
