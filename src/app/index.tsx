import { useAuthTarget } from "@/hooks/useAppFlow";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Root() {
  const target = useAuthTarget();

  if (!target) return <View style={{ flex: 1 }} />;
  return <Redirect href={target} />;
}

// _layout.tsx          manages phases:  loading → splash → onboarding → app
//   └─ Stack (app)
//        └─ index.tsx  resolves auth:   → /(auth)/login  OR  /(tabs)
//             └─ <Redirect>             takes the user to the right place
