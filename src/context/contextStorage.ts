import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "app_language";
const THEME_KEY = "@app_theme_mode";

const cache: Record<string, string> = {};

// Called once on app start (useAppFlow) to hydrate the in-memory cache so
// contexts can read synchronously during their initial useState calls.
export async function initContextStorage(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const pairs = await AsyncStorage.multiGet(keys as string[]);
  pairs.forEach(([k, v]) => {
    if (v !== null) cache[k] = v;
  });
}

// ─── Language ─────────────────────────────────────────────────────────────────

export const getLanguage = (): "en" | "bn" => {
  const val = cache[LANGUAGE_KEY];
  return val === "en" || val === "bn" ? val : "en";
};

export const saveLanguage = (lang: "en" | "bn"): void => {
  cache[LANGUAGE_KEY] = lang;
  AsyncStorage.setItem(LANGUAGE_KEY, lang);
};

// ─── Theme ────────────────────────────────────────────────────────────────────

export const getTheme = (): string | undefined => {
  return cache[THEME_KEY];
};

export const saveTheme = (mode: string): void => {
  cache[THEME_KEY] = mode;
  AsyncStorage.setItem(THEME_KEY, mode);
};
