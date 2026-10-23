import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EXPORT_CHANNEL_ID = "cv_export";
const NOTIFICATIONS_PREF_KEY = "@notifications_enabled";

export async function getNotificationsEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(NOTIFICATIONS_PREF_KEY);
  return val !== "false"; // default ON when key is absent
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_PREF_KEY, enabled ? "true" : "false");
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: current } = await Notifications.getPermissionsAsync();
  if (current === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function ensureExportChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(EXPORT_CHANNEL_ID, {
    name: "Resume Exports",
    importance: AndroidImportance.HIGH,
    sound: "notification_sound.wav",
    vibrationPattern: [0, 150, 100, 150],
    enableVibrate: true,
    showBadge: false,
  });
}

export async function sendExportNotification(
  cvId: string,
  cvName: string,
  format: "PDF" | "DOCX",
): Promise<void> {
  const enabled = await getNotificationsEnabled();
  if (!enabled) return;

  const granted = await requestPermissions();
  if (!granted) return;

  await ensureExportChannel();

  // Haptic fires at the exact moment the notification is sent
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Resume exported!",
      body: `${cvName || "Your CV"} has been saved as ${format}.`,
      sound: "notification_sound.wav",
      data: { cvId, type: "cv_export", format },
    },
    trigger: Platform.OS === "android" ? { channelId: EXPORT_CHANNEL_ID } : null,
  });
}

export const scheduleMealReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nisharga scheduleNotificationAsync",
      body: "This is body",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 22,
      minute: 20,
    },
  });
};

export const cancelMealReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
