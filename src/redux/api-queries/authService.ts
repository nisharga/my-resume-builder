import StorageService from "@/config/storage";
import STORAGE_KEYS from "@/config/storageKeys";

/**
 * Interface for the User object to avoid using 'any'
 * Adjust these fields based on your Deligo/Griipbuddy user model
 */
interface UserData {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export const AuthService = {
  /**
   * Optimized login to persist user data and tokens.
   * * @param userData - The user profile object from the server
   * @param accessToken - The JWT access token
   * @param refreshToken - The JWT refresh token (optional)
   */
  async login(
    userData: UserData | null | undefined,
    accessToken: string | null | undefined,
    refreshToken?: string | null | undefined,
  ): Promise<boolean> {
    try {
      // 1. Persist User Data
      if (userData) {
        await StorageService.setItem(STORAGE_KEYS.USER, userData);
      }

      // 2. Persist Access Token
      if (accessToken) {
        if (typeof StorageService.setAccessToken === "function") {
          await StorageService.setAccessToken(accessToken);
        } else {
          await StorageService.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        }
      }

      // 3. Persist Refresh Token
      if (refreshToken) {
        if (typeof StorageService.setRefreshToken === "function") {
          await StorageService.setRefreshToken(refreshToken);
        } else {
          await StorageService.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            refreshToken,
          );
        }
      }

      return true;
    } catch (error) {
      console.error("[AuthService] Login persistence failed:", error);
      return false;
    }
  },
};
