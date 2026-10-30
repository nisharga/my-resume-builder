import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

export default function UpcomingBadge() {
  return (
    <View className="flex-row items-center gap-2 py-1">
      <View className="rounded-full bg-primary/10 px-3 py-1.5">
        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 12, color: colors.primary }}>
          🚀 Coming Soon
        </Text>
      </View>
      <Text className="caption flex-1">
        We are working on this feature and will enable it in an upcoming update.
      </Text>
    </View>
  );
}
