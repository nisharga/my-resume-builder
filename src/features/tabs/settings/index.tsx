import { Screen, ScreenHeader } from "@/components";
import LogoutButton from "@/components/ui/LogoutButton";
import { colors } from "@/styles/colors";
import { Bell, ChevronDown, Globe, HelpCircle, Mail, Moon, Shield, Zap } from "lucide-react-native";
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
import { Switch, Text, View, Pressable } from "react-native";

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

interface SettingItemProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  right?: "chevron" | "toggle";
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  expandedContent?: ReactNode;
  isLast?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  right = "chevron",
  toggled,
  onToggle,
  expandedContent,
  isLast = false,
}: SettingItemProps) {
  const [open, setOpen] = useState(false);
  const hasExpand = right === "chevron" && !!expandedContent;

  return (
    <View className={`${!isLast ? "border-b border-border" : ""}`}>
      <Pressable
        onPress={hasExpand ? () => setOpen((v) => !v) : undefined}
        className="flex-row items-center gap-3 px-4 py-3.5 active:bg-secondary/60"
      >
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">{icon}</View>

        <View className="flex-1">
          <Text className="sm-semibold text-foreground">{title}</Text>
          <Text className="caption mt-0.5">{subtitle}</Text>
        </View>

        {right === "toggle" ? (
          <Switch
            value={toggled}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ) : (
          <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
            <ChevronDown size={18} color={colors.mutedForeground} strokeWidth={2} />
          </View>
        )}
      </Pressable>

      {hasExpand && open && (
        <View className="border-t border-border bg-secondary/40 px-4 py-3">{expandedContent}</View>
      )}
    </View>
  );
}

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
              subtitle="Get help and find answers"
              expandedContent={<Text className="caption">FAQ content coming soon.</Text>}
            />
            <SettingItem
              icon={<Mail size={17} color={colors.foreground} strokeWidth={2} />}
              title="Contact Us"
              subtitle="We're here to help you"
              expandedContent={<Text className="caption">kabirnisharga@gmail.com</Text>}
            />
            <SettingItem
              icon={<Shield size={17} color={colors.foreground} strokeWidth={2} />}
              title="Privacy Policy"
              subtitle="Read our Privacy Policy"
              isLast
              expandedContent={<Text className="caption">Privacy policy content coming soon.</Text>}
            />
          </View>
        </View>

        {/* ── Logout ───────────────────────────────────────────────── */}
        <LogoutButton />

        {/* ── Footer ───────────────────────────────────────────────── */}
        <Text
          className="mt-2 text-center text-xs text-muted-foreground"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          AI CV Builder | Version 1.0.0
        </Text>
      </View>
    </Screen>
  );
}
