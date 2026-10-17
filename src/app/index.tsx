import { isAuthenticated } from "@/features/auth/storageAuth";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Root() {
  const [target, setTarget] = useState<"/(tabs)" | "/(auth)/login" | null>(null);

  useEffect(() => {
    isAuthenticated().then((ok) => {
      setTarget(ok ? "/(tabs)" : "/(auth)/login");
    });
  }, []);

  if (!target) return <View style={{ flex: 1 }} />;
  return <Redirect href={target} />;
}
