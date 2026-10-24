import AsyncStorage from "@react-native-async-storage/async-storage";

const SEEN_KEY = "@spotlight_tour_v2_seen";

export async function shouldShowOverview(): Promise<boolean> {
  const val = await AsyncStorage.getItem(SEEN_KEY);
  return val !== "true";
}

export async function markOverviewSeen(): Promise<void> {
  await AsyncStorage.setItem(SEEN_KEY, "true");
}
