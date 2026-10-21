import { Pressable, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { ACCENT_COLORS } from "../constants";

interface Props {
  selected: string;
  onSelect: (hex: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ColorSwatch({
  hex,
  selected,
  onPress,
}: {
  hex: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.85, { damping: 14, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      }}
      accessibilityRole="radio"
      accessibilityLabel={`Color ${hex}`}
      accessibilityState={{ selected }}
      style={[
        useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] })),
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: hex,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: selected ? 3 : 0,
          borderColor: "#fff",
          shadowColor: selected ? hex : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: selected ? 0.5 : 0,
          shadowRadius: 4,
          elevation: selected ? 4 : 0,
        },
      ]}
    >
      {selected && <Check size={16} color="#fff" strokeWidth={3} />}
    </AnimatedPressable>
  );
}

export default function AccentColorPicker({ selected, onSelect }: Props) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {ACCENT_COLORS.map((hex) => (
        <ColorSwatch
          key={hex}
          hex={hex}
          selected={selected === hex}
          onPress={() => onSelect(hex)}
        />
      ))}
    </View>
  );
}
