import { colors } from "@/styles/colors";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  label: string;
  hint?: string;
}

export function LabeledInput({ label, hint, multiline, style, ...rest }: Props) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground }}>
        {label}
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingHorizontal: 14,
          paddingVertical: multiline ? 4 : 0,
        }}
      >
        <TextInput
          multiline={multiline}
          placeholderTextColor={colors.subtleForeground}
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
      </View>
      {hint ? <Text style={{ fontSize: 13, color: colors.mutedForeground }}>{hint}</Text> : null}
    </View>
  );
}
