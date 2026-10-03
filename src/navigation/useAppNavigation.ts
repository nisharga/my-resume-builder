import { useRouter } from "expo-router";

export const ROUTES = {
  LOGIN: "/(auth)/login",
  WELCOME: "/(onboarding)/welcome",
  TABS: "/(tabs)",
  PROFILE: "/(tabs)/profile",
  CART: "/(tabs)/cart",
} as const;

export const useAppNavigation = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.replace(ROUTES.LOGIN);
  };

  const goToTabs = () => router.replace(ROUTES.TABS);
  const goToProfile = () => router.replace(ROUTES.PROFILE);

  return { goToLogin, goToTabs, goToProfile, ...router };
};
