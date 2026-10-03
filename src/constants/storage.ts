import { MMKV } from 'react-native-mmkv';
import { STORAGE_KEYS } from './storageKeys';

export const storage = new MMKV();

const StorageService = {
  getItem(key: string): any | null {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item with key "${key}" from storage:`, error);
      return null;
    }
  },

  setItem(key: string, value: any): boolean {
    try {
      storage.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item with key "${key}" in storage:`, error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      storage.delete(key);
      return true;
    } catch (error) {
      console.error(`Error removing item with key "${key}" from storage:`, error);
      return false;
    }
  },

  clearAll(): boolean {
    try {
      storage.clearAll();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  removeKeysByPrefix(prefix: string): boolean {
    try {
      const keys = storage.getAllKeys();
      const matched = keys.filter(k => k.startsWith(prefix));
      matched.forEach(k => storage.delete(k));
      return true;
    } catch (error) {
      console.error(`Error removing keys by prefix "${prefix}":`, error);
      return false;
    }
  },

  getAccessToken() {
    return this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token: any) {
    return this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeAccessToken() {
    return this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getUser() {
    return this.getItem(STORAGE_KEYS.USER);
  },

  setUser(user: any) {
    return this.setItem(STORAGE_KEYS.USER, user);
  },

  removeUser() {
    return this.removeItem(STORAGE_KEYS.USER);
  },

  getRefreshToken() {
    return this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token: any) {
    return this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  removeRefreshToken() {
    return this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setOnboardingCompleted() {
    return this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
  },

  checkOnboardingStatus(): boolean {
    return !!this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  },
};

export const setOnboardingCompleted = () => StorageService.setOnboardingCompleted();
export const checkOnboardingStatus = () => StorageService.checkOnboardingStatus();
export const getAccessToken = () => StorageService.getAccessToken();
export const setAccessToken = (token: any) => StorageService.setAccessToken(token);
export const removeAccessToken = () => StorageService.removeAccessToken();
export const getRefreshToken = () => StorageService.getRefreshToken();
export const setRefreshToken = (token: any) => StorageService.setRefreshToken(token);
export const removeRefreshToken = () => StorageService.removeRefreshToken();
export const getUser = () => StorageService.getUser();
export const setUser = (user: any) => StorageService.setUser(user);
export const removeUser = () => StorageService.removeUser();

export default StorageService;
