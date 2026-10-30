import {
  cancelWeeklyReminder,
  requestPermissions,
  scheduleWeeklyReminder,
} from "../../utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import * as Notifications from "expo-notifications";

const REMINDERS_KEY = "remindersEnabled";

export default function ReminderToggle() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const load = async () => {
      const val = await AsyncStorage.getItem(REMINDERS_KEY);
      setEnabled(val === "true");
    };
    load();
  }, []);

  const toggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleWeeklyReminder();
    } else {
      await cancelWeeklyReminder();
    }
    setEnabled(value);
    await AsyncStorage.setItem(REMINDERS_KEY, value.toString());
  };

  const triggerInstantNotification = async () => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      alert("Please enable notifications in settings!");
      return;
    }
    // 2. Schedule notification with channelId explicitly attached
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "MacroZone Alert 🔔",
        body: "Here is your instant notification!",
        sound: Platform.OS === "ios" ? "notification_sound.wav" : undefined,
        data: {
          screen: "/profile",
        },
      },
      trigger: null,
    });
  };

  return (
    <View>
      <Text>Meal Reminders</Text>
      <Switch value={enabled} onValueChange={toggle} />

      <TouchableOpacity onPress={triggerInstantNotification}>
        <Text>Notification Check</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
});
