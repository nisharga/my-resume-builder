import { Screen, ScreenHeader } from "@/components";
import { colors } from "@/styles";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        left={
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <ChevronLeft size={24} color={colors.foreground} />
          </Pressable>
        }
      />
    </Screen>
  );
}
