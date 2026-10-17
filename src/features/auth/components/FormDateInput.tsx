import { colors } from "@/styles/colors";
import { Calendar } from "lucide-react-native";
import { type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { FormInput } from "./FormInput";

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
};

export function FormDateInput<T extends FieldValues>({
  name,
  control,
  label = "Date",
  placeholder = "YYYY-MM-DD",
}: Props<T>) {
  return (
    <FormInput
      name={name}
      control={control}
      label={label}
      placeholder={placeholder}
      keyboardType="numeric"
      maxLength={10}
      leftIcon={<Calendar size={18} color={colors.subtleForeground} />}
    />
  );
}
