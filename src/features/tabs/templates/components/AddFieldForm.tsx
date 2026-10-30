import { FormInput } from "@/components/form";
import ButtonGroup from "@/components/ui/ButtonGroup";
import { toast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

// ─── schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z
    .string()
    .min(1, "Field name is required")
    .min(2, "Must be at least 2 characters")
    .max(50, "Must be 50 characters or less"),
});

type FormValues = z.infer<typeof schema>;

// ─── types ────────────────────────────────────────────────────────────────────

export interface AdditionalField {
  id: string;
  title: string;
}

// ─── component ────────────────────────────────────────────────────────────────

interface AddFieldFormProps {
  onAdd: (field: Omit<AdditionalField, "id">) => void;
  onClose: () => void;
}

export default function AddFieldForm({ onAdd, onClose }: AddFieldFormProps) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  });

  function onSubmit(values: FormValues) {
    onAdd({ title: values.title });
    toast.success(`"${values.title}" field added successfully.`);
    reset();
    onClose();
  }

  return (
    <View>
      <FormInput
        name="title"
        control={control}
        label="Field Name"
        placeholder="e.g. Certifications, Awards..."
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onSubmit)}
      />

      <ButtonGroup
        btnGroupClassName="mt-4"
        secondaryBtnLabel="Cancel"
        secondaryBtnAction={onClose}
        primaryBtnLabel="Add Field"
        primaryBtnAction={handleSubmit(onSubmit)}
      />
    </View>
  );
}
