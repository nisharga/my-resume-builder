import { Screen, ScreenHeader } from "@/components";
import { colors } from "@/styles/colors";
import { Bell, FileText, Globe, HelpCircle, Mail, Moon, Shield, Zap } from "lucide-react-native";
import {
  getNotificationsEnabled,
  getWeeklyReminderEnabled,
  requestPermissions,
  scheduleWeeklyReminder,
  cancelWeeklyReminder,
  setNotificationsEnabled,
  setWeeklyReminderEnabled,
} from "@/utils/notifications";
import { useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import { SettingItem, SectionLabel, UpcomingBadge, FaqContent } from "./components";

const APP_VERSION = "1.0.0";
const TERMS_URL = "https://myresumebuilder.app/terms";
const PRIVACY_URL = "https://myresumebuilder.app/privacy";

export default function SettingScreen() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [weeklyReminderOn, setWeeklyReminderOn] = useState(false);

  useEffect(() => {
    getNotificationsEnabled()
      .then(setNotificationsOn)
      .catch(() => {});
    getWeeklyReminderEnabled()
      .then(setWeeklyReminderOn)
      .catch(() => {});
  }, []);

  async function handleNotificationToggle(value: boolean) {
    setNotificationsOn(value);
    await setNotificationsEnabled(value);
    if (value) requestPermissions();
  }

  async function handleWeeklyReminderToggle(value: boolean) {
    setWeeklyReminderOn(value);
    await setWeeklyReminderEnabled(value);
    if (value) {
      await scheduleWeeklyReminder();
    } else {
      await cancelWeeklyReminder();
    }
  }

  return (
    <Screen>
      <ScreenHeader title="Settings" className="mb-4" />
      <View className="gap-5 px-4 pb-8">
        {/* ── App Settings ─────────────────────────────────────────── */}
        <View>
          <SectionLabel label="App Settings" />
          <View className="overflow-hidden rounded-2xl bg-white">
            <SettingItem
              icon={<Bell size={17} color={colors.foreground} strokeWidth={2} />}
              title="Notifications"
              subtitle="Manage push notifications"
              right="toggle"
              toggled={notificationsOn}
              onToggle={handleNotificationToggle}
            />
            <SettingItem
              icon={<Bell size={17} color={colors.foreground} strokeWidth={2} />}
              title="Weekly Reminder"
              subtitle="Get a nudge to update your resume"
              right="toggle"
              toggled={weeklyReminderOn}
              onToggle={handleWeeklyReminderToggle}
            />
            <SettingItem
              icon={<Globe size={17} color={colors.foreground} strokeWidth={2} />}
              title="Language"
              subtitle="Choose your preferred language"
              expandedContent={<UpcomingBadge />}
            />
            <SettingItem
              icon={<Moon size={17} color={colors.foreground} strokeWidth={2} />}
              title="Dark Mode"
              subtitle="Switch to a darker theme"
              isLast
              expandedContent={<UpcomingBadge />}
            />
          </View>
        </View>

        {/* ── AI Settings ──────────────────────────────────────────── */}
        <View>
          <SectionLabel label="AI Settings" />
          <View className="overflow-hidden rounded-2xl bg-white">
            <SettingItem
              icon={<Zap size={17} color={colors.foreground} strokeWidth={2} />}
              title="AI Usage / Credits"
              subtitle="View your AI credits and usage"
              isLast
              expandedContent={<Text className="caption">Credits dashboard coming soon.</Text>}
            />
          </View>
        </View>

        {/* ── Support ──────────────────────────────────────────────── */}
        <View>
          <SectionLabel label="Support" />
          <View className="overflow-hidden rounded-2xl bg-white">
            <SettingItem
              icon={<HelpCircle size={17} color={colors.foreground} strokeWidth={2} />}
              title="FAQs"
              subtitle="Frequently asked questions"
              expandedContent={<FaqContent />}
            />
            <SettingItem
              icon={<Mail size={17} color={colors.foreground} strokeWidth={2} />}
              title="Contact Us"
              subtitle="We're here to help you"
              expandedContent={<Text className="caption">kabirnisharga@gmail.com</Text>}
            />
            <SettingItem
              icon={<FileText size={17} color={colors.foreground} strokeWidth={2} />}
              title="Terms & Conditions"
              subtitle="Read our Terms of Service"
              onPress={() => Linking.openURL(TERMS_URL)}
            />
            <SettingItem
              icon={<Shield size={17} color={colors.foreground} strokeWidth={2} />}
              title="Privacy Policy"
              subtitle="Read our Privacy Policy"
              isLast
              onPress={() => Linking.openURL(PRIVACY_URL)}
            />
          </View>
        </View>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <Text
          className="mt-2 text-center text-xs text-muted-foreground"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          Resume Builder | Version {APP_VERSION}
        </Text>
      </View>
    </Screen>
  );
}
