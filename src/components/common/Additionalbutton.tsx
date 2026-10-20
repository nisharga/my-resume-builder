import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Plus } from "lucide-react-native";

type AdditionalButtonProps = {
  /** Text shown next to the plus icon */
  label: string;
  /** Optional press handler. Without it, the component renders as a static design element. */
  onPress?: () => void;
  /** Disable presses while keeping the button visible */
  disabled?: boolean;
  /** Extra Tailwind classes for the outer container */
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const containerClass =
  "flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 bg-accent py-4";

function Content({ label }: { label: string }) {
  return (
    <>
      <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
        <Plus size={14} color="#fff" strokeWidth={2.5} />
      </View>
      <Text className="text-sm text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
        {label}
      </Text>
    </>
  );
}

export default function AdditionalButton({
  label,
  onPress,
  disabled = false,
  className = "",
  style,
}: AdditionalButtonProps) {
  // No onPress: render as a plain, non-interactive view
  if (!onPress) {
    return (
      <View className={`${containerClass} ${className}`} style={style}>
        <Content label={label} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={`${containerClass} ${className}`}
      style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.7 : 1 }, style]}
    >
      <Content label={label} />
    </Pressable>
  );
}
