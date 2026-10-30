import { fontFamilyTheme } from "@/styles";
import { colors } from "@/styles/colors";
import { useRef } from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  error?: string;
};

export function OtpInput({ value, onChange, length = 4, error }: Props) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digit || " ";
    const next = chars.join("").trimEnd();
    onChange(next);
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      if (value[index]) {
        const chars = value.padEnd(length, " ").split("");
        chars[index] = " ";
        onChange(chars.join("").trimEnd());
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
        {Array.from({ length }).map((_, i) => {
          const filled = !!value[i] && value[i] !== " ";
          return (
            <TextInput
              key={i}
              ref={(r) => {
                inputs.current[i] = r;
              }}
              value={filled ? value[i] : ""}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={2}
              autoFocus={i === 0}
              style={{
                width: 48,
                height: 56,
                borderWidth: 1.5,
                borderRadius: 12,
                textAlign: "center",
                fontSize: 22,
                fontFamily: fontFamilyTheme.semiBold,
                color: colors.foreground,
                borderColor: error ? colors.destructive : filled ? colors.primary : colors.border,
                backgroundColor: filled ? colors.accent : colors.white,
              }}
            />
          );
        })}
      </View>
      {error ? (
        <Text style={{ fontSize: 13, color: colors.destructive, textAlign: "center" }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
