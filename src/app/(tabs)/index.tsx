import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="flex-1 gap-4 p-5">
        {/* Demo translations */}
        <View className="bg-card gap-2 rounded-xl border border-border p-4">
          <Text className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            greeting
          </Text>
          <Text className="text-2xl font-bold text-foreground">{t("greeting")}</Text>

          <View className="my-1 h-px bg-border" />

          <Text className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            howAreYou
          </Text>
          <Text className="text-2xl font-bold text-foreground">{t("howAreYou")}</Text>

          <View className="my-1 h-px bg-border" />

          <Text className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            goodMorning
          </Text>
          <Text className="text-2xl font-bold text-foreground">{t("goodMorning")}</Text>
        </View>

        {/* Language Switcher */}
        <View className="bg-card gap-3 rounded-xl border border-border p-4">
          <Text className="text-[15px] font-semibold text-foreground">{t("language")}</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`rounded-full border px-5 py-2 ${
                language === "en" ? "border-primary bg-primary" : "border-border"
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
              className={`rounded-full border px-5 py-2 ${
                language === "bn" ? "border-primary bg-primary" : "border-border"
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
        <View className="bg-card gap-3 rounded-xl border border-border p-4">
          <Text className="text-[15px] font-semibold text-foreground">{t("theme")}</Text>
          <TouchableOpacity className="flex-row items-center gap-3" onPress={toggleTheme}>
            {/* Track */}
            <View
              className={`h-7 w-[50px] justify-center rounded-full px-[3px] ${
                isDarkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              {/* Thumb */}
              <View
                className={`h-[22px] w-[22px] rounded-full bg-background ${
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
