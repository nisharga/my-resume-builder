import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addExperience } from "@/redux/features/cvSlice";
import { formatDates } from "@/utils/cv";
import { ChevronRight, Plus } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

export default function ExperienceSection() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const experience = useAppSelector((s) => s.cv.experience);

  function addNew() {
    dispatch(addExperience({ role: "", company: "", start: "", end: "", desc: "" }));
    // Navigate to the newly added item (last index)
    // We read the updated length from the store after dispatch via the component re-render,
    // but since dispatch is synchronous in RTK, we can safely use experience.length as the new index.
    router.push(`/cv-job/${experience.length}`);
  }

  return (
    <CVSectionScreen title="Experience">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Existing jobs */}
        {experience.length > 0 && (
          <View className="overflow-hidden rounded-2xl border border-border bg-white">
            {experience.map((exp, i) => (
              <View key={exp.id}>
                <Pressable
                  onPress={() => router.push(`/cv-job/${i}`)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }}
                  accessibilityRole="button"
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                      {exp.role || "Untitled role"}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
                      {[exp.company, formatDates(exp.start, exp.end)].filter(Boolean).join(" · ")}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
                </Pressable>
                {i < experience.length - 1 && (
                  <View
                    style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Add job button */}
        <Pressable
          onPress={addNew}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: colors.primary,
            borderRadius: 16,
            paddingVertical: 16,
            backgroundColor: colors.accent,
          }}
          accessibilityRole="button"
          accessibilityLabel="Add job"
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={14} color="#fff" strokeWidth={2.5} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>+ Add job</Text>
        </Pressable>
      </ScrollView>
      <LiveFab sectionId="experience" />
    </CVSectionScreen>
  );
}
