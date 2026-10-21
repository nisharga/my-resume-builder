import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { TEMPLATES } from "../constants";
import type { TemplateId } from "@/types/cv";

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplatePicker({ selected, onSelect }: Props) {
  const open = useSharedValue(0);

  const selectedName = TEMPLATES.find((t) => t.id === selected)?.name ?? "Classic";

  const listStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(open.value, [0, 1], [0, 200]),
    opacity: interpolate(open.value, [0, 1], [0, 1]),
    overflow: "hidden",
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(open.value, [0, 1], [0, 180])}deg` }],
  }));

  function toggle() {
    open.value = withTiming(open.value === 1 ? 0 : 1, { duration: 220 });
  }

  function handleSelect(id: TemplateId) {
    onSelect(id);
    open.value = withTiming(0, { duration: 180 });
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Trigger row */}
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel="Select template"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 14,
          paddingVertical: 13,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "500", color: colors.foreground }}>
          {selectedName}
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={colors.mutedForeground} strokeWidth={2} />
        </Animated.View>
      </Pressable>

      {/* Options list */}
      <Animated.View style={listStyle}>
        {TEMPLATES.filter((t) => t.id !== selected).map((tpl, i, arr) => (
          <View key={tpl.id}>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <Pressable
              onPress={() => handleSelect(tpl.id)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 13,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 15, color: colors.foreground }}>{tpl.name}</Text>
            </Pressable>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
