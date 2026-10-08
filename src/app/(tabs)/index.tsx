import { useLanguage } from "@/src/context/LanguageContext";
import { useTheme } from "@/src/context/ThemeContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1 p-5 gap-4">

        {/* Demo translations */}
        <View className="rounded-xl border border-border bg-card p-4 gap-2">
          <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            greeting
          </Text>
          <Text className="text-2xl font-bold text-foreground">{t("greeting")}</Text>

          <View className="h-px bg-border my-1" />

          <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            howAreYou
          </Text>
          <Text className="text-2xl font-bold text-foreground">{t("howAreYou")}</Text>

          <View className="h-px bg-border my-1" />

          <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            goodMorning
          </Text>
          <Text className="text-2xl font-bold text-foreground">{t("goodMorning")}</Text>
        </View>

        {/* Language Switcher */}
        <View className="rounded-xl border border-border bg-card p-4 gap-3">
          <Text className="text-[15px] font-semibold text-foreground">{t("language")}</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`px-5 py-2 rounded-full border ${
                language === "en"
                  ? "bg-primary border-primary"
                  : "border-border"
              }`}
              onPress={() => changeLanguage("en")}
            >
              <Text
                className={`text-sm font-medium ${
                  language === "en" ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-5 py-2 rounded-full border ${
                language === "bn"
                  ? "bg-primary border-primary"
                  : "border-border"
              }`}
              onPress={() => changeLanguage("bn")}
            >
              <Text
                className={`text-sm font-medium ${
                  language === "bn" ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                বাংলা
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Switcher */}
        <View className="rounded-xl border border-border bg-card p-4 gap-3">
          <Text className="text-[15px] font-semibold text-foreground">{t("theme")}</Text>
          <TouchableOpacity
            className="flex-row items-center gap-3"
            onPress={toggleTheme}
          >
            {/* Track */}
            <View
              className={`w-[50px] h-7 rounded-full justify-center px-[3px] ${
                isDarkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              {/* Thumb */}
              <View
                className={`w-[22px] h-[22px] rounded-full bg-background ${
                  isDarkMode ? "self-end" : "self-start"
                }`}
              />
            </View>
            <Text className="text-[15px] font-medium text-foreground">
              {isDarkMode ? t("darkMode") : t("lightMode")}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
