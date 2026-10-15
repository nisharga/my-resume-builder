import { GlassView } from "@/components/ui/liquid-glass";
import ReminderToggle from "../../components/core/ReminderToggle";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";

export default function CreateResumeScreen() {
  const handleCopy = async () => {
    const summary = `Test Summary`;
    await Clipboard.setStringAsync(summary);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied!", "Test Summary");
  };
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View className="h-52 w-72 overflow-hidden rounded-2xl">
        {/* Colorful background so the glass effect is visible */}
        <View className="absolute inset-0 bg-indigo-500" />
        <View className="absolute top-0 left-0 h-28 w-28 -translate-x-6 -translate-y-6 rounded-full bg-purple-400" />
        <View className="absolute right-0 bottom-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-pink-400" />
        <View className="absolute top-6 right-6 h-16 w-16 rounded-full bg-yellow-300 opacity-70" />

        {/* Glass card */}
        <View className="flex-1 items-center justify-center p-4">
          <GlassView className="items-center gap-1.5 rounded-2xl p-5" glassEffectStyle="clear">
            <Text className="text-lg font-semibold text-foreground/90">Glass Effect</Text>
            <Text className="text-center text-sm text-foreground/70">
              Built with expo-glass-effect
            </Text>
          </GlassView>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
      >
        <Text>Haptices Virate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCopy}>
        <Text>Copy Summary</Text>
      </TouchableOpacity>

      <ReminderToggle />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
});
