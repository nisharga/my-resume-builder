import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addEducation } from "@/redux/features/cvSlice";
import { formatDates } from "@/utils/cv";
import { ChevronRight, Plus } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

export default function EducationSection() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const education = useAppSelector((s) => s.cv.education);

  function addNew() {
    dispatch(addEducation({ degree: "", school: "", start: "", end: "" }));
    router.push(`/cv-edu/${education.length}`);
  }

  return (
    <CVSectionScreen title="Education">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {education.length > 0 && (
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#fff",
              overflow: "hidden",
            }}
          >
            {education.map((edu, i) => (
              <View key={edu.id}>
                <Pressable
                  onPress={() => router.push(`/cv-edu/${i}`)}
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
                      {edu.degree || "Untitled degree"}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
                      {[edu.school, formatDates(edu.start, edu.end)].filter(Boolean).join(" · ")}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
                </Pressable>
                {i < education.length - 1 && (
                  <View
                    style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }}
                  />
                )}
              </View>
            ))}
          </View>
        )}

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
          accessibilityLabel="Add school"
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
            + Add school
          </Text>
        </Pressable>
      </ScrollView>
      <LiveFab sectionId="education" />
    </CVSectionScreen>
  );
}
