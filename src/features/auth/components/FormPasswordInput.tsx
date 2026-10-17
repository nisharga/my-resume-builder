import { colors } from "@/styles/colors";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import { useState } from "react";
import { type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Pressable } from "react-native";
import { FormInput } from "./FormInput";

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
};

export function FormPasswordInput<T extends FieldValues>({
  name,
  control,
  label = "Password",
  placeholder = "Enter your password",
}: Props<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      name={name}
      control={control}
      label={label}
      placeholder={placeholder}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      leftIcon={<Lock size={18} color={colors.subtleForeground} />}
      rightSlot={
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          {visible ? (
            <Eye size={18} color={colors.subtleForeground} />
          ) : (
            <EyeOff size={18} color={colors.subtleForeground} />
          )}
        </Pressable>
      }
    />
  );
}
