import { useLanguage } from "@/context/LanguageContext";

export function useAppConfigText() {
  const { t } = useLanguage();
  return {
    GREETING: t("greeting"),
    HOW_ARE_YOU: "Kemon aso vaia",
    GOOD_MORNING: t("goodMorning"),
    LANGUAGE: t("language"),
    THEME: t("theme"),
    DARK_MODE: t("darkMode"),
    LIGHT_MODE: t("lightMode"),
  };
}
