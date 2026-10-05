import { LanguageProvider } from "@/src/context/LanguageContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { initStorage } from "@/src/constants/storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

// Keeps (tabs) underneath deep-linked screens so "back" returns to tabs
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    // "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await initStorage();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const isReady = appReady && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
