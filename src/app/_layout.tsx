import { useCustomFonts } from "../../assets/fonts";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CustomSplashScreen, OnboardingScreen } from "@/features/onboarding";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/global.css";
import { useAppFlow } from "@/hooks";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Keep native splash visible until the custom one is ready
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(useCustomFonts);
  const fontsReady = fontsLoaded || !!fontError;

  // All phase logic lives in useAppFlow — see src/app/useAppFlow.ts
  const { phase, handleSplashFinish, handleOnboardingComplete } = useAppFlow(fontsReady);

  // ── loading ──────────────────────────────────────────────────────────────
  // Return null so the native splash stays on screen while fonts + storage load.
  if (phase === "loading") return null;

  // ── splash ───────────────────────────────────────────────────────────────
  // Custom animated splash. It hides the native splash on its first frame
  // and calls onFinish when its exit animation completes.
  if (phase === "splash") {
    return (
      <View style={{ flex: 1 }}>
        <CustomSplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  // ── onboarding ───────────────────────────────────────────────────────────
  // Shown on first launch only (ENABLE_ONBOARDING flag in useAppFlow.ts).
  if (phase === "onboarding") {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </GestureHandlerRootView>
    );
  }

  // ── app ───────────────────────────────────────────────────────────────────
  // Full provider tree + Stack navigator.
  // app/index.tsx decides whether to redirect to (auth) or (tabs).
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
