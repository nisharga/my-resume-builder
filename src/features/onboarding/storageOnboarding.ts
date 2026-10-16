import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "onboarding_completed";

export const setOnboardingCompleted = () => AsyncStorage.setItem(KEY, "true");

export const checkOnboardingStatus = async () => !!(await AsyncStorage.getItem(KEY));
