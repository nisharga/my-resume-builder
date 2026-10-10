import { createContext, useContext, useMemo, useState } from "react";
import { storage } from "../config/storage";
import { getLanguageTranslations } from "../services/i18n";

const LanguageContext = createContext<any>(null);

const LANGUAGE_KEY = "app_language";

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: any) => {
  const [language, setLanguage] = useState<"en" | "bn">(() => {
    const saved = storage.getString(LANGUAGE_KEY);
    return saved === "en" || saved === "bn" ? saved : "en";
  });

  const translations = useMemo(
    () => getLanguageTranslations(language),
    [language],
  );

  const changeLanguage = (newLanguage: "en" | "bn") => {
    setLanguage(newLanguage);
    storage.set(LANGUAGE_KEY, newLanguage);
  };

  const t = (key: string, defaultValue?: string): string => {
    if (!key) return defaultValue || "";

    const trans = translations as Record<string, any>;

    if (trans[key]) return trans[key];

    if (key.includes(".")) {
      const keys = key.split(".");
      let value: any = trans;
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
      if (typeof value === "string") return value;
    }

    if (defaultValue !== undefined) return defaultValue;

    return key;
  };

  const contextValue = useMemo(
    () => ({ language, changeLanguage, t, translations }),
    [language, translations],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
