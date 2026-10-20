import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeEducation, updateEducation } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { toast } from "@/utils/toast";
import type { Education } from "@/types/cv";
import { LabeledInput } from "@/components";
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
        <LabeledInput
          label="Degree"
          value={edu.degree}
          onChangeText={(v) => update("degree", v)}
          placeholder="e.g. B.Sc. in Computer Science"
        />

        <LabeledInput
          label="School"
          value={edu.school}
          onChangeText={(v) => update("school", v)}
          placeholder="e.g. University of Dhaka"
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <LabeledInput
              label="Start"
              value={edu.start}
              onChangeText={(v) => update("start", v)}
              placeholder="2016"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <LabeledInput
              label="End"
              value={edu.end}
              onChangeText={(v) => update("end", v)}
              placeholder="2020"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>
      <LiveFab sectionId="education" />
    </CVSectionScreen>
  );
}
