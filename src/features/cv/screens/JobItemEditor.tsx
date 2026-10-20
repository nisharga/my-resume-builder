import { useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeExperience, updateExperience } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { toast } from "@/utils/toast";
import type { Experience } from "@/types/cv";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

interface Props {
  index: number;
}

export default function JobItemEditor({ index }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const exp = useAppSelector((s) => s.cv.experience[index] as Experience | undefined);

  useEffect(() => {
    if (!exp) router.back();
  }, [exp, router]);

  if (!exp) return null;

  // Explicit keyof Experience type avoids "keyof never" TS error from array-narrowing
  function update(field: keyof Experience, value: string) {
    dispatch(updateExperience({ ...exp!, [field]: value }));
  }

  function handleDelete() {
    dispatch(removeExperience(exp!.id));
    toast.success("Deleted");
    router.back();
  }

  function handleSave() {
    const e = exp!;
    if (!e.role && !e.company && !e.start && !e.end && !e.desc) {
      dispatch(removeExperience(e.id));
    }
    router.back();
  }

  const inputStyle = {
    fontSize: 16 as const,
    color: colors.foreground,
    paddingVertical: 14 as const,
  };
  const fieldBox = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
  };
  const labelStyle = {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.mutedForeground,
    marginBottom: 6,
  };

  return (
    <CVSectionScreen
      title="Job"
      rightLabel={null}
      footer={
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Pressable
            onPress={handleDelete}
            style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: "center" }}
            accessibilityRole="button"
            accessibilityLabel="Delete job"
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.destructive }}>
              Delete
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: 12,
              alignItems: "center",
              paddingVertical: 14,
            }}
            accessibilityRole="button"
            accessibilityLabel="Save job"
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>Save</Text>
          </Pressable>
        </View>
      }
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={labelStyle}>Job title</Text>
          <View style={fieldBox}>
            <TextInput
              value={exp.role}
              onChangeText={(v) => update("role", v)}
              placeholder="e.g. UI Designer"
              placeholderTextColor={colors.subtleForeground}
              style={inputStyle}
            />
          </View>
        </View>

        <View>
          <Text style={labelStyle}>Company</Text>
          <View style={fieldBox}>
            <TextInput
              value={exp.company}
              onChangeText={(v) => update("company", v)}
              placeholder="e.g. Acme Inc."
              placeholderTextColor={colors.subtleForeground}
              style={inputStyle}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={labelStyle}>Start</Text>
            <View style={fieldBox}>
              <TextInput
                value={exp.start}
                onChangeText={(v) => update("start", v)}
                placeholder="2021"
                placeholderTextColor={colors.subtleForeground}
                style={inputStyle}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={labelStyle}>End</Text>
            <View style={fieldBox}>
              <TextInput
                value={exp.end}
                onChangeText={(v) => update("end", v)}
                placeholder="Present"
                placeholderTextColor={colors.subtleForeground}
                style={inputStyle}
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={labelStyle}>What you did</Text>
          <View style={[fieldBox, { paddingVertical: 4 }]}>
            <TextInput
              value={exp.desc}
              onChangeText={(v) => update("desc", v)}
              placeholder="One achievement per line"
              placeholderTextColor={colors.subtleForeground}
              multiline
              style={{ ...inputStyle, minHeight: 100, textAlignVertical: "top" }}
            />
          </View>
          <Text style={{ marginTop: 6, fontSize: 13, color: colors.mutedForeground }}>
            Each line becomes a bullet point.
          </Text>
        </View>
      </ScrollView>
      <LiveFab sectionId="experience" />
    </CVSectionScreen>
  );
}
