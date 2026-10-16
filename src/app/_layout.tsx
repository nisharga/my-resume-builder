import { useCustomFonts } from "../../assets/fonts";
import { initStorage } from "@/config";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/global.css";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(useCustomFonts);

  useEffect(() => {
    async function prepare() {
      try {
        await initStorage();
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded || fontError) {
          SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <OverlayProvider>
        <ToastProvider>
          <ThemeProvider>
            <LanguageProvider>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
            </LanguageProvider>
          </ThemeProvider>
        </ToastProvider>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}
