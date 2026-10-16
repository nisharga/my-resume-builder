import { useCustomFonts } from "../../assets/fonts";
import { initStorage } from "@/config";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { checkOnboardingStatus, CustomSplashScreen, OnboardingScreen } from "@/features/onboarding";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/global.css";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

type Phase = "loading" | "splash" | "onboarding" | "app";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(useCustomFonts);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    async function prepare() {
      try {
        await initStorage();
      } catch (e) {
        console.warn(e);
      } finally {
        setPhase("splash");
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  async function handleSplashFinish() {
    const onboarded = await checkOnboardingStatus();
    setPhase(onboarded ? "app" : "onboarding");
  }

  function handleOnboardingComplete() {
    setPhase("app");
  }

  if (phase === "loading") return null;

  if (phase === "splash") {
    return (
      <View style={{ flex: 1 }}>
        <CustomSplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  if (phase === "onboarding") {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </GestureHandlerRootView>
    );
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
