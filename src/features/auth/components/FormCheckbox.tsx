import { colors } from "@/styles/colors";
import { Check } from "lucide-react-native";
import { type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: ReactNode;
};

export function FormCheckbox<T extends FieldValues>({ name, control, label }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Pressable
            onPress={() => onChange(!value)}
            className="flex-row items-center gap-3"
            hitSlop={6}
          >
            {/* Box */}
            <View
              style={{
                borderColor: error ? colors.destructive : value ? colors.primary : colors.border,
                backgroundColor: value ? colors.primary : "transparent",
              }}
              className="h-5 w-5 items-center justify-center rounded-md border-2"
            >
              {value ? <Check size={12} color={colors.white} strokeWidth={3} /> : null}
            </View>

            {/* Label */}
            <View className="flex-1 flex-row flex-wrap">{label}</View>
          </Pressable>

          {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
        </View>
      )}
    />
  );
}
