import { useLocalSearchParams } from "expo-router";
import { JobItemEditor } from "@/features/cv";

export default function CVJobRoute() {
  const { index } = useLocalSearchParams<{ index: string }>();
  return <JobItemEditor index={parseInt(index ?? "0", 10)} />;
}
