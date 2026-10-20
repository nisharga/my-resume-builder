import { colors } from "@/styles/colors";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

interface Props extends TextInputProps {
  label: string;
  hint?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function LabeledInput({ label, hint, multiline, style, onFocus, onBlur, ...rest }: Props) {
  const focused = useSharedValue(0);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focused.value, [0, 1], [colors.border, colors.primary]),
  }));

  return (
    <View style={{ gap: 6 }}>
      <Text className="label-text">{label}</Text>
      <AnimatedView
        style={[
          {
            borderWidth: 1,
            borderRadius: 12,
            backgroundColor: "#fff",
            paddingHorizontal: 14,
            paddingVertical: multiline ? 4 : 0,
          },
          borderStyle,
        ]}
      >
        <TextInput
          multiline={multiline}
          placeholderTextColor={colors.subtleForeground}
          onFocus={(e) => {
            focused.value = withTiming(1, { duration: 180 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focused.value = withTiming(0, { duration: 180 });
            onBlur?.(e);
          }}
          style={[
            {
              fontSize: 16,
              color: colors.foreground,
              paddingVertical: 14,
              textAlignVertical: multiline ? "top" : "center",
            },
            style,
          ]}
          {...rest}
        />
      </AnimatedView>
      {hint ? <Text style={{ fontSize: 13, color: colors.mutedForeground }}>{hint}</Text> : null}
    </View>
  );
}
