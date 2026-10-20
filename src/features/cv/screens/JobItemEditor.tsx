import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { removeExperience, updateExperience } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { toast } from "@/utils/toast";
import type { Experience } from "@/types/cv";
import { LabeledInput } from "@/components";
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
        <LabeledInput
          label="Job title"
          value={exp.role}
          onChangeText={(v) => update("role", v)}
          placeholder="e.g. UI Designer"
        />

        <LabeledInput
          label="Company"
          value={exp.company}
          onChangeText={(v) => update("company", v)}
          placeholder="e.g. Acme Inc."
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <LabeledInput
              label="Start"
              value={exp.start}
              onChangeText={(v) => update("start", v)}
              placeholder="2021"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <LabeledInput
              label="End"
              value={exp.end}
              onChangeText={(v) => update("end", v)}
              placeholder="Present"
            />
          </View>
        </View>

        <LabeledInput
          label="What you did"
          value={exp.desc}
          onChangeText={(v) => update("desc", v)}
          placeholder="One achievement per line"
          multiline
          style={{ minHeight: 100 }}
          hint="Each line becomes a bullet point."
        />
      </ScrollView>
      <LiveFab sectionId="experience" />
    </CVSectionScreen>
  );
}
