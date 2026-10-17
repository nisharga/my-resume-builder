import { colors } from "@/styles/colors";
import { type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Platform, Text, TextInput, type TextInputProps, View } from "react-native";

type Props<T extends FieldValues> = Omit<TextInputProps, "value" | "onChangeText"> & {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
};

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  leftIcon,
  rightSlot,
  placeholder,
  ...inputProps
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          {label ? <Text className="sm-semibold">{label}</Text> : null}

          <View
            className={`flex-row items-center gap-3 rounded-xl border bg-white px-4 dark:bg-secondary ${
              error ? "border-destructive" : "border-input"
            }`}
            style={{ minHeight: Platform.OS === "ios" ? 52 : 56 }}
          >
            {leftIcon}
            <TextInput
              className="flex-1 text-base text-foreground"
              style={{ paddingVertical: 0 }}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ""}
              placeholder={placeholder}
              placeholderTextColor={colors.subtleForeground}
              {...inputProps}
            />
            {rightSlot}
          </View>

          {error ? <Text className="text-sm text-destructive">{error.message}</Text> : null}
        </View>
      )}
    />
  );
}
