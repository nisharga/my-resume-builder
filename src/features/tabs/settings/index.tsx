import { Screen, ScreenHeader } from "@/components";
import { colors } from "@/styles/colors";
import {
  Bell,
  ChevronDown,
  Globe,
  HelpCircle,
  Mail,
  Moon,
  Shield,
  FileText,
  Zap,
} from "lucide-react-native";
import {
  getNotificationsEnabled,
  getWeeklyReminderEnabled,
  requestPermissions,
  scheduleWeeklyReminder,
  cancelWeeklyReminder,
  setNotificationsEnabled,
  setWeeklyReminderEnabled,
} from "@/utils/notifications";
import { type ReactNode, useEffect, useState } from "react";
import { Linking, Switch, Text, View, Pressable } from "react-native";
import { SettingItem } from "./components";

const APP_VERSION = "1.0.0";

const TERMS_URL = "https://myresumebuilder.app/terms";
const PRIVACY_URL = "https://myresumebuilder.app/privacy";

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "How many resumes can I build?",
    a: "Unlimited! Create as many resumes as you need, all stored safely in the app.",
  },
  {
    q: "How many resumes can I import?",
    a: "Unlimited. Import as many existing resumes as you like using the AI-powered import feature.",
  },
  {
    q: "Can I send my resume directly to email?",
    a: "Yes! Tap the Share button in the preview screen to send your resume directly via email or any messaging app.",
  },
  {
    q: "Will my resume be saved if I close the app?",
    a: "Your resume is only saved after you export it as a PDF or Google Doc. Always download before closing the app to avoid losing your work.",
  },
  {
    q: "Does importing a resume require an internet connection?",
    a: "Yes, the AI-powered import feature needs an active internet connection to read and fill in your resume data automatically.",
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      className="mb-2 px-1 text-xs tracking-widest text-muted-foreground"
      style={{ fontFamily: "Poppins-SemiBold" }}
    >
      {label.toUpperCase()}
    </Text>
  );
}

const UpcomingBadge = () => (
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

const FaqContent = () => (
  <View className="gap-3 py-1">
    {FAQ_ITEMS.map((item, i) => (
      <View
        key={i}
        className={`gap-1 ${i < FAQ_ITEMS.length - 1 ? "border-b border-border pb-3" : ""}`}
      >
        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.foreground }}>
          {item.q}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 12,
            color: colors.mutedForeground,
            lineHeight: 18,
          }}
        >
          {item.a}
        </Text>
      </View>
    ))}
  </View>
);

// ─── main screen ─────────────────────────────────────────────────────────────

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
