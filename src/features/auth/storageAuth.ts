import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "auth_token";

export const setAuthToken = (token: string) => AsyncStorage.setItem(KEY, token);
export const getAuthToken = () => AsyncStorage.getItem(KEY);
export const removeAuthToken = () => AsyncStorage.removeItem(KEY);
export const isAuthenticated = async () => !!(await AsyncStorage.getItem(KEY));
