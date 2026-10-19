import { colors } from "@/styles/colors";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export interface AdditionalField {
  id: string;
  title: string;
  section: string;
}

interface AddFieldFormProps {
  onAdd: (field: Omit<AdditionalField, "id">) => void;
  onClose: () => void;
}

export default function AddFieldForm({ onAdd, onClose }: AddFieldFormProps) {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), section: section.trim() });
    onClose();
  }

  return (
    <View>
      <Text className="mb-1 text-sm text-foreground" style={{ fontFamily: "Poppins-Medium" }}>
        Field Title
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Certifications"
        placeholderTextColor={colors.mutedForeground}
        className="mb-4 rounded-xl border border-border bg-secondary px-4"
        style={{
          fontFamily: "Poppins-Regular",
          fontSize: 14,
          color: colors.foreground,
          paddingVertical: 12,
        }}
      />

      <Text className="mb-1 text-sm text-foreground" style={{ fontFamily: "Poppins-Medium" }}>
        Section Content
      </Text>
      <TextInput
        value={section}
        onChangeText={setSection}
        placeholder="Describe this section..."
        placeholderTextColor={colors.mutedForeground}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="mb-6 rounded-xl border border-border bg-secondary px-4 py-3"
        style={{
          fontFamily: "Poppins-Regular",
          fontSize: 14,
          color: colors.foreground,
          minHeight: 100,
        }}
      />

      <View className="flex-row gap-3">
        <Pressable
          onPress={onClose}
          className="flex-1 items-center rounded-xl border border-border py-3.5 active:opacity-70"
        >
          <Text className="sm-semibold text-muted-foreground">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleAdd}
          className={`flex-1 items-center rounded-xl py-3.5 active:opacity-80 ${title.trim() ? "bg-primary" : "bg-primary/40"}`}
        >
          <Text className="sm-semibold text-white">Add Field</Text>
        </Pressable>
      </View>
    </View>
  );
}
