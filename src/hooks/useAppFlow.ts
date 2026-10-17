import { initStorage } from "@/config";
import { isAuthenticated } from "@/features/auth/storageAuth";
import { checkOnboardingStatus } from "@/features/onboarding/storageOnboarding";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export const ENABLE_CUSTOM_SPLASH = true;
export const ENABLE_ONBOARDING = true;
export const ENABLE_AUTH = true;

// ─── Phase ────────────────────────────────────────────────────────────────────
// loading    → fonts/storage initialising; native splash stays visible
// splash     → custom animated splash (only when ENABLE_CUSTOM_SPLASH = true)
// onboarding → first-launch slides (only when ENABLE_ONBOARDING = true)
// auth       → after login redirect to main screen
// app        → main Stack; useAuthTarget() redirects to (auth) or (tabs)

export type AppPhase = "loading" | "splash" | "onboarding" | "app";

// ─── Shared: advance past splash ─────────────────────────────────────────────

async function goToNextPhase(setPhase: (p: AppPhase) => void) {
  if (ENABLE_ONBOARDING) {
    const done = await checkOnboardingStatus();
    if (!done) {
      setPhase("onboarding");
      return;
    }
  }
  setPhase("app");
}

// ─── useAppFlow ───────────────────────────────────────────────────────────────
// Drives the full pre-navigation flow.
// fontsReady = true once expo-font resolves (loaded or errored).

export function useAppFlow(fontsReady: boolean) {
  const [phase, setPhase] = useState<AppPhase>("loading");

  // Step 1 — fonts ready → init storage → splash (or skip straight ahead)
  useEffect(() => {
    if (!fontsReady) return;
    async function prepare() {
      try {
        await initStorage();
      } catch (e) {
        console.warn(e);
      }

      if (ENABLE_CUSTOM_SPLASH) {
        // Custom splash will call handleSplashFinish when its animation ends
        setPhase("splash");
      } else {
        // No custom splash — dismiss native splash and advance immediately
        SplashScreen.hideAsync().catch(() => {});
        await goToNextPhase(setPhase);
      }
    }
    prepare();
  }, [fontsReady]);

  // Step 2 — custom splash animation done → check onboarding
  async function handleSplashFinish() {
    await goToNextPhase(setPhase);
  }

  // Step 3 — onboarding completed / skipped → hand off to Stack
  function handleOnboardingComplete() {
    setPhase("app");
  }

  return { phase, handleSplashFinish, handleOnboardingComplete };
}

// ─── useAuthTarget ────────────────────────────────────────────────────────────
// Used by app/index.tsx to redirect after the Stack mounts.
// Returns null while resolving, then the target href.

export function useAuthTarget() {
  const [target, setTarget] = useState<"/(tabs)" | "/(auth)/login" | null>(null);

  useEffect(() => {
    async function resolve() {
      if (!ENABLE_AUTH) {
        setTarget("/(tabs)");
        return;
      }
      const ok = await isAuthenticated();
      setTarget(ok ? "/(tabs)" : "/(auth)/login");
    }
    resolve();
  }, []);

  return target;
}
