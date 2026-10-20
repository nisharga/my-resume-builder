import { useLocalSearchParams } from "expo-router";
import {
  PersonalSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
} from "@/features/cv";
import { Text, View } from "react-native";

export default function CVSectionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  switch (id) {
    case "personal":
      return <PersonalSection />;
    case "summary":
      return <SummarySection />;
    case "experience":
      return <ExperienceSection />;
    case "education":
      return <EducationSection />;
    case "skills":
      return <SkillsSection />;
    default:
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Unknown section: {id}</Text>
        </View>
      );
  }
}
