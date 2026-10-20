import { useLocalSearchParams } from "expo-router";
import { EduItemEditor } from "@/features/cv";

export default function CVEduRoute() {
  const { index } = useLocalSearchParams<{ index: string }>();
  return <EduItemEditor index={parseInt(index ?? "0", 10)} />;
}
