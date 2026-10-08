export const translations = {
  en: {
    greeting: "Hello",
    howAreYou: "How are you?",
    goodMorning: "Good Morning",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    english: "English",
    bangla: "বাংলা",
  },
  bn: {
    greeting: "হ্যালো",
    howAreYou: "কেমন আছেন?",
    goodMorning: "শুভ সকাল",
    language: "ভাষা",
    theme: "থিম",
    darkMode: "ডার্ক মোড",
    lightMode: "লাইট মোড",
    english: "English",
    bangla: "বাংলা",
  },
};

export const getLanguageTranslations = (language: string = "en") => {
  return translations[language as keyof typeof translations] ?? translations.en;
};
