import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ACCESS_TOKEN: "@auth/access_token",
  REFRESH_TOKEN: "@auth/refresh_token",
} as const;

// ─── Access Token ─────────────────────────────────────────────────────────────

export const setAccessToken = (token: string) => AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);

export const getAccessToken = (): Promise<string | null> => AsyncStorage.getItem(KEYS.ACCESS_TOKEN);

export const removeAccessToken = () => AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const setRefreshToken = (token: string) => AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);

export const getRefreshToken = (): Promise<string | null> =>
  AsyncStorage.getItem(KEYS.REFRESH_TOKEN);

export const removeRefreshToken = () => AsyncStorage.removeItem(KEYS.REFRESH_TOKEN);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  return !!token;
};

export const clearAuthStorage = () =>
  AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN]);
