import { ChevronLeft } from "lucide-react-native";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  /** Title shown in the centre */
  title?: string;
  /** Called when the back button is pressed. Defaults to router.back() */
  onBack?: () => void;
  /** Icon or element shown on the right side */
  right?: ReactNode;
  /** Called when the right element is pressed */
  onRightPress?: () => void;
  /** Makes this header stick to the top while scrolling (Screen detects this automatically) */
  sticky?: boolean;
  /** Classes applied to the root View — use for background, dark mode, etc. */
  className?: string;
};

export default function Header({
  title,
  onBack,
  right,
  onRightPress,
  sticky: _sticky, // consumed by Screen — not used inside this component
  className = "",
}: Props) {
  const router = useRouter();

  const handleBack = () => (onBack ? onBack() : router.back());
  const canGoBack = router.canGoBack();

  return (
    <View className={`flex-row items-center bg-background px-4 py-3 ${className}`}>
      {/* Left — back button */}
      <View className="w-10">
        {canGoBack && (
          <Pressable
            onPress={handleBack}
            hitSlop={10}
            className="h-9 w-9 items-center justify-center rounded-full border active:bg-secondary"
          >
            <ChevronLeft size={22} className="text-foreground" />
          </Pressable>
        )}
      </View>

      {/* Centre — title */}
      <View className="flex-1 items-center">
        {title ? (
          <Text
            numberOfLines={1}
            className="text-[17px] font-semibold text-foreground dark:text-black"
          >
            {title}
          </Text>
        ) : null}
      </View>

      {/* Right — action */}
      <View className="w-10 items-end">
        {right ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={10}
            disabled={!onRightPress}
            className="h-9 w-9 items-center justify-center rounded-full active:bg-secondary"
          >
            {right}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
