import { useCustomFonts } from "../../assets/fonts";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import AppToast from "@/components/ui/AppToast";
import { toastRef } from "@/utils/toast";
import { CustomSplashScreen, OnboardingScreen } from "@/features/onboarding";
import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import { requestPermissions } from "@/utils/notifications";
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

  // =================== Notifications Logic =================

  const router = useRouter();

  // Request notification permissions once on startup
  useEffect(() => {
    requestPermissions();
  }, []);

  // Navigate based on notification type when user taps a notification
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      if (data?.type === "cv_export") {
        router.push("/notifications");
      } else if (data?.type === "weekly_reminder") {
        router.push("/(tabs)");
      }
    });
    return () => sub.remove();
  }, [router]);

  // =================== Notifications Logic End =================

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
    <Provider store={store}>
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
                <AppToast ref={toastRef} />
              </LanguageProvider>
            </ThemeProvider>
          </ToastProvider>
        </OverlayProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
