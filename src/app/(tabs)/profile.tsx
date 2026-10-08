import { useLanguage } from "@/src/context/LanguageContext";
import { useTheme } from "@/src/context/ThemeContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  const bg = isDarkMode ? "#121212" : "#FFFFFF";
  const card = isDarkMode ? "#1E1E1E" : "#F3F4F6";
  const text = isDarkMode ? "#F9FAFB" : "#111827";
  const sub = isDarkMode ? "#9CA3AF" : "#6B7280";
  const border = isDarkMode ? "#374151" : "#E5E7EB";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.content}>
        {/* Demo translations */}
        <View
          style={[styles.card, { backgroundColor: card, borderColor: border }]}
        >
          <Text style={[styles.label, { color: sub }]}>greeting</Text>
          <Text style={[styles.value, { color: text }]}>{t("greeting")}</Text>

          <View style={styles.divider} />

          <Text style={[styles.label, { color: sub }]}>howAreYou</Text>
          <Text style={[styles.value, { color: text }]}>{t("howAreYou")}</Text>

          <View style={styles.divider} />

          <Text style={[styles.label, { color: sub }]}>goodMorning</Text>
          <Text style={[styles.value, { color: text }]}>
            {t("goodMorning")}
          </Text>
        </View>

        {/* Language Switcher */}
        <View
          style={[styles.card, { backgroundColor: card, borderColor: border }]}
        >
          <Text style={[styles.sectionTitle, { color: text }]}>
            {t("language")}
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.pill,
                language === "en" && styles.pillActive,
                { borderColor: border },
              ]}
              onPress={() => changeLanguage("en")}
            >
              <Text
                style={[
                  styles.pillText,
                  language === "en" && styles.pillTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                language === "bn" && styles.pillActive,
                { borderColor: border },
              ]}
              onPress={() => changeLanguage("bn")}
            >
              <Text
                style={[
                  styles.pillText,
                  language === "bn" && styles.pillTextActive,
                ]}
              >
                বাংলা
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Switcher */}
        <View
          style={[styles.card, { backgroundColor: card, borderColor: border }]}
        >
          <Text style={[styles.sectionTitle, { color: text }]}>
            {t("theme")}
          </Text>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <View style={[styles.track, isDarkMode && styles.trackActive]}>
              <View style={[styles.thumb, isDarkMode && styles.thumbActive]} />
            </View>
            <Text style={[styles.themeLabel, { color: text }]}>
              {isDarkMode ? t("darkMode") : t("lightMode")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="my-bg p-4">
        <Text className="my-text">Hello from bg-background</Text>
      </View>
    </SafeAreaView>
  );
}

const ACCENT = "#3B82F6";

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, gap: 16 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: { fontSize: 22, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  row: { flexDirection: "row", gap: 10 },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pillActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  pillText: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  pillTextActive: { color: "#FFFFFF" },
  themeToggle: { flexDirection: "row", alignItems: "center", gap: 12 },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  trackActive: { backgroundColor: ACCENT },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  thumbActive: { alignSelf: "flex-end" },
  themeLabel: { fontSize: 15, fontWeight: "500" },
});
