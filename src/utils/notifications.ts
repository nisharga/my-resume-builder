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

const WEEKLY_CHANNEL_ID = "weekly_reminder";
const WEEKLY_PREF_KEY = "@weekly_reminder_enabled";

export async function getWeeklyReminderEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(WEEKLY_PREF_KEY);
  return val === "true"; // default OFF
}

export async function setWeeklyReminderEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(WEEKLY_PREF_KEY, enabled ? "true" : "false");
}

async function ensureWeeklyChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(WEEKLY_CHANNEL_ID, {
    name: "Weekly Resume Reminder",
    importance: AndroidImportance.DEFAULT,
    sound: "notification_sound.wav",
    vibrationPattern: [0, 200, 100, 200],
    enableVibrate: true,
    showBadge: false,
  });
}

const WEEKLY_MESSAGES = [
  "Time to upgrade your resume — what new skills did you learn this week?",
  "A strong resume is always a work in progress. Take 5 minutes to update yours.",
  "New week, new opportunities. Make sure your CV reflects your best self.",
  "Did you pick up a new skill this week? Add it to your resume now!",
  "Your next opportunity could come any day — is your resume ready?",
];

export async function scheduleWeeklyReminder(): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) return;

  await ensureWeeklyChannel();

  await Notifications.cancelAllScheduledNotificationsAsync();

  const msg = WEEKLY_MESSAGES[Math.floor(Math.random() * WEEKLY_MESSAGES.length)]!;

  // DAILY trigger for testing — change to WEEKLY for production
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Resume Reminder",
      body: msg,
      sound: "notification_sound.wav",
      data: { type: "weekly_reminder" },
    },
    trigger:
      Platform.OS === "android"
        ? {
            channelId: WEEKLY_CHANNEL_ID,
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            hour: 15,
            minute: 24,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 15,
            minute: 25,
          },
  });
}

export async function cancelWeeklyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
