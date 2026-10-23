import { Screen } from "@/components";
import { ScreenHeader } from "@/components/common";
import IconButton from "@/components/ui/IconButton";
import LogoutButton from "@/components/ui/LogoutButton";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import {
  Bell,
  ChevronDown,
  Globe,
  HelpCircle,
  KeyRound,
  Mail,
  Pencil,
  Plus,
  Shield,
  Zap,
} from "lucide-react-native";
import {
  getNotificationsEnabled,
  requestPermissions,
  setNotificationsEnabled,
} from "@/utils/notifications";
import { type ReactNode, useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

// ─── tiny helpers ────────────────────────────────────────────────────────────

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
        {/* Icon bg */}
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-secondary">{icon}</View>

        {/* Labels */}
        <View className="flex-1">
          <Text className="sm-semibold text-foreground">{title}</Text>
          <Text className="caption mt-0.5">{subtitle}</Text>
        </View>

        {/* Right */}
        {right === "toggle" ? (
          <Switch
            value={toggled}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ) : (
          <View
            style={{
              transform: [{ rotate: open ? "180deg" : "0deg" }],
            }}
          >
            <ChevronDown size={18} color={colors.mutedForeground} strokeWidth={2} />
          </View>
        )}
      </Pressable>

      {/* Expandable content */}
      {hasExpand && open && (
        <View className="border-t border-border bg-secondary/40 px-4 py-3">{expandedContent}</View>
      )}
    </View>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { language, changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [notificationsOn, setNotificationsOn] = useState(true);

  useEffect(() => {
    getNotificationsEnabled()
      .then(setNotificationsOn)
      .catch(() => {});
  }, []);

  async function handleNotificationToggle(value: boolean) {
    setNotificationsOn(value);
    await setNotificationsEnabled(value);
    if (value) requestPermissions();
  }

  return (
    <Screen>
      <ScreenHeader title="Profile" />

      <View className="gap-5 px-4 pb-8">
        {/* ── User card ────────────────────────────────────────────── */}
        <View className="flex-row items-center gap-3 rounded-2xl bg-accent px-4 py-4">
          {/* Avatar */}
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Text className="text-white" style={{ fontFamily: "Poppins-SemiBold", fontSize: 20 }}>
              NK
            </Text>
          </View>

          {/* Name + email */}
          <View className="flex-1">
            <Text
              style={{ fontFamily: "Poppins-SemiBold", fontSize: 15, color: colors.foreground }}
            >
              Nisharga Kabir
            </Text>
            <Text className="caption mt-0.5">kabirnisharga@gmail.com</Text>
          </View>

          {/* Edit + Add */}
          <View className="flex-row gap-2">
            <IconButton className="h-8 w-8 items-center justify-center rounded-full border border-border bg-white">
              <Pencil size={13} color={colors.foreground} strokeWidth={2} />
            </IconButton>
            <IconButton className="h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Plus size={15} color={colors.white} strokeWidth={2.5} />
            </IconButton>
          </View>
        </View>

        {/* ── Account Settings ─────────────────────────────────────── */}
        <View>
          <SectionLabel label="Account Settings" />
          <View className="overflow-hidden rounded-2xl bg-white">
            <SettingItem
              icon={<KeyRound size={17} color={colors.foreground} strokeWidth={2} />}
              title="Change Password"
              subtitle="Update your password"
              isLast
              expandedContent={<Text className="caption">Password change form coming soon.</Text>}
            />
          </View>
        </View>

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
              icon={<Globe size={17} color={colors.foreground} strokeWidth={2} />}
              title="Language"
              subtitle="Choose your preferred language"
              isLast
              expandedContent={
                <View className="flex-row gap-2">
                  {(["en", "bn"] as const).map((lang) => (
                    <Pressable
                      key={lang}
                      onPress={() => changeLanguage(lang)}
                      className={`rounded-full px-4 py-2 ${
                        language === lang ? "bg-primary" : "border border-border bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${language === lang ? "text-white" : "text-foreground"}`}
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        {lang === "en" ? "English" : "বাংলা"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              }
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

        {/* ── Dark mode toggle (bonus) ──────────────────────────────── */}
        <View>
          <View className="overflow-hidden rounded-2xl bg-white">
            <SettingItem
              icon={<Bell size={17} color={colors.foreground} strokeWidth={2} />}
              title="Dark Mode"
              subtitle={isDarkMode ? "Currently dark" : "Currently light"}
              right="toggle"
              toggled={isDarkMode}
              onToggle={() => toggleTheme()}
              isLast
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
