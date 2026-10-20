import { useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeEducation, updateEducation } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { toast } from "@/utils/toast";
import type { Education } from "@/types/cv";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

interface Props {
  index: number;
}

export default function EduItemEditor({ index }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const edu = useAppSelector((s) => s.cv.education[index] as Education | undefined);

  useEffect(() => {
    if (!edu) router.back();
  }, [edu, router]);

  if (!edu) return null;

  function update(field: keyof Education, value: string) {
    dispatch(updateEducation({ ...edu!, [field]: value }));
  }

  function handleDelete() {
    dispatch(removeEducation(edu!.id));
    toast.success("Deleted");
    router.back();
  }

  function handleSave() {
    const e = edu!;
    if (!e.degree && !e.school && !e.start && !e.end) {
      dispatch(removeEducation(e.id));
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
      title="Education"
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
            accessibilityLabel="Delete education"
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
            accessibilityLabel="Save education"
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
          <Text style={labelStyle}>Degree</Text>
          <View style={fieldBox}>
            <TextInput
              value={edu.degree}
              onChangeText={(v) => update("degree", v)}
              placeholder="e.g. B.Sc. in Computer Science"
              placeholderTextColor={colors.subtleForeground}
              style={inputStyle}
            />
          </View>
        </View>

        <View>
          <Text style={labelStyle}>School</Text>
          <View style={fieldBox}>
            <TextInput
              value={edu.school}
              onChangeText={(v) => update("school", v)}
              placeholder="e.g. University of Dhaka"
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
                value={edu.start}
                onChangeText={(v) => update("start", v)}
                placeholder="2016"
                placeholderTextColor={colors.subtleForeground}
                style={inputStyle}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={labelStyle}>End</Text>
            <View style={fieldBox}>
              <TextInput
                value={edu.end}
                onChangeText={(v) => update("end", v)}
                placeholder="2020"
                placeholderTextColor={colors.subtleForeground}
                style={inputStyle}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <LiveFab sectionId="education" />
    </CVSectionScreen>
  );
}
