import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

const memCache: Record<string, string> = {};

export async function initStorage(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const pairs = await AsyncStorage.multiGet(keys as string[]);
  pairs.forEach(([k, v]) => {
    if (v !== null) memCache[k] = v;
  });
}

export const storage = {
  getString(key: string): string | undefined {
    return memCache[key];
  },
  set(key: string, value: string): void {
    memCache[key] = value;
    AsyncStorage.setItem(key, value);
  },
  delete(key: string): void {
    delete memCache[key];
    AsyncStorage.removeItem(key);
  },
  getAllKeys(): string[] {
    return Object.keys(memCache);
  },
  clearAll(): void {
    Object.keys(memCache).forEach(k => delete memCache[k]);
    AsyncStorage.clear();
  },
};

const StorageService = {
  getItem(key: string): any | null {
    try {
      const value = memCache[key];
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: any): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      memCache[key] = serialized;
      await AsyncStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error setting item with key "${key}":`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      delete memCache[key];
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item with key "${key}":`, error);
      return false;
    }
  },

  async clearAll(): Promise<boolean> {
    try {
      Object.keys(memCache).forEach(k => delete memCache[k]);
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  async removeKeysByPrefix(prefix: string): Promise<boolean> {
    try {
      const matched = Object.keys(memCache).filter(k => k.startsWith(prefix));
      matched.forEach(k => { delete memCache[k]; });
      await AsyncStorage.multiRemove(matched);
      return true;
    } catch (error) {
      console.error(`Error removing keys by prefix "${prefix}":`, error);
      return false;
    }
  },

  getAccessToken() { return this.getItem(STORAGE_KEYS.ACCESS_TOKEN); },
  async setAccessToken(token: any) { return this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token); },
  async removeAccessToken() { return this.removeItem(STORAGE_KEYS.ACCESS_TOKEN); },
  getUser() { return this.getItem(STORAGE_KEYS.USER); },
  async setUser(user: any) { return this.setItem(STORAGE_KEYS.USER, user); },
  async removeUser() { return this.removeItem(STORAGE_KEYS.USER); },
  getRefreshToken() { return this.getItem(STORAGE_KEYS.REFRESH_TOKEN); },
  async setRefreshToken(token: any) { return this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token); },
  async removeRefreshToken() { return this.removeItem(STORAGE_KEYS.REFRESH_TOKEN); },
  async setOnboardingCompleted() { return this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true); },
  checkOnboardingStatus(): boolean { return !!this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED); },
};

export const setOnboardingCompleted = () => StorageService.setOnboardingCompleted();
export const checkOnboardingStatus = () => StorageService.checkOnboardingStatus();
export const getAccessToken = () => StorageService.getItem(STORAGE_KEYS.ACCESS_TOKEN);
export const setAccessToken = (token: any) => StorageService.setAccessToken(token);
export const removeAccessToken = () => StorageService.removeAccessToken();
export const getRefreshToken = () => StorageService.getItem(STORAGE_KEYS.REFRESH_TOKEN);
export const setRefreshToken = (token: any) => StorageService.setRefreshToken(token);
export const removeRefreshToken = () => StorageService.removeRefreshToken();
export const getUser = () => StorageService.getUser();
export const setUser = (user: any) => StorageService.setUser(user);
export const removeUser = () => StorageService.removeUser();

export default StorageService;
