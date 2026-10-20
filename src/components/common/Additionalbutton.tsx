import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Plus } from "lucide-react-native";

type AdditionalButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const containerClass =
  "flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 bg-accent py-4";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function AdditionalButton({
  label,
  onPress,
  disabled = false,
  className = "",
  style,
}: AdditionalButtonProps) {
  const scale = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }

  const inner = (
    <>
      <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
        <Plus size={14} color="#fff" strokeWidth={2.5} />
      </View>
      <Text className="text-sm text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
        {label}
      </Text>
    </>
  );

  return (
    <AnimatedView
      className={`${containerClass} ${className}`}
      style={[containerStyle, style as object]}
    >
      {onPress ? (
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {inner}
        </Pressable>
      ) : (
        inner
      )}
    </AnimatedView>
  );
}
