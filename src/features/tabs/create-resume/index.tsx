import { useEffect } from "react";
import { Text, View } from "react-native";
import { Button, Screen } from "@/components";
import { ScreenHeader } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { loadCV } from "@/redux/features/cvSlice";
import { getSectionCompletion } from "@/utils/cv";
import { useRouter } from "expo-router";
import { HeroCard, CVProgressBar, SectionCard } from "./components";

export default function CreateResumeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cv = useAppSelector((s) => s.cv);
  const completion = getSectionCompletion(cv); // 5 false

  // Hydrate saved CV data on first mount
  useEffect(() => {
    dispatch(loadCV());
  }, [dispatch]);

  function subtitleFor(id: string): string {
    switch (id) {
      case "personal":
        return cv.personal.name
          ? `${cv.personal.name}${cv.personal.title ? `, ${cv.personal.title}` : ""}`
          : "Add your name and contact";
      case "summary":
        return cv.summary || "Add a short intro about you";
      case "experience":
        if (cv.experience.length === 0) return "Add your work history";
        return cv.experience.length === 1 ? "1 job" : `${cv.experience.length} jobs`;
      case "education":
        if (cv.education.length === 0) return "Add your studies";
        return cv.education.map((e) => e.school).join(", ");
      case "skills":
        return cv.skills.length >= 1 ? cv.skills.join(", ") : "Add at least 3 skills";
      default:
        return "";
    }
  }

  const sections = [
    { id: "personal", title: "Personal details" },
    { id: "summary", title: "Summary" },
    { id: "experience", title: "Experience" },
    { id: "education", title: "Education" },
    { id: "skills", title: "Skills" },
  ] as const;

  return (
    <Screen>
      <ScreenHeader title="My CV" className="mb-2" />

      {/* Hero card: thumbnail + template/color pickers */}
      <HeroCard cv={cv} onPreview={() => router.push("/cv-preview")} />

      {/* Progress */}
      <CVProgressBar completion={completion} />

      {/* Section cards */}
      <View className="mx-4 mt-4 overflow-hidden rounded-2xl border border-border bg-white">
        {sections.map((sec, i) => (
          <View key={sec.id}>
            <SectionCard
              title={sec.title}
              subtitle={subtitleFor(sec.id)}
              complete={completion[sec.id]}
              onPress={() => router.push(`/cv-section/${sec.id}`)}
            />
            {i < sections.length - 1 && <View className="mx-4 h-px bg-border" />}
          </View>
        ))}
      </View>

      {/* Additional Fields section — only shown when at least one field is enabled */}
      {cv.achievements.some((a) => a.enabled) && (
        <View className="mx-4 mt-4 overflow-hidden rounded-2xl border border-border bg-white">
          <SectionCard
            title="Additional Fields"
            subtitle={
              cv.achievements
                .filter((a) => a.enabled && a.value)
                .map((a) => a.name)
                .join(", ") || "Add notes for your enabled fields"
            }
            complete={cv.achievements.some((a) => a.enabled && a.value.trim().length > 0)}
            onPress={() => router.push("/cv-section/additional")}
          />
        </View>
      )}

      {/* Preview button */}
      <View className="mx-4 mt-5">
        <Button onPress={() => router.push("/cv-preview")} className="rounded-xl">
          <Text className="text-[16px] font-semibold text-white">Preview CV</Text>
        </Button>
      </View>
    </Screen>
  );
}
