import { API_ENDPOINTS, BASE_API_URL } from "@/config";
import StorageService from "@/config/storage";
import STORAGE_KEYS from "@/config/storageKeys";

interface LogoutResponse {
  success: boolean;
  message?: string;
}

export const logoutUser = async (
  fcmToken?: string | null,
): Promise<LogoutResponse> => {
  try {
    // 1. Get Tokens
    const accessToken = await StorageService.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = await StorageService.getItem(
      STORAGE_KEYS.REFRESH_TOKEN,
    );

    // 2. Call Backend (Best Effort)
    // We use standard fetch here to avoid circular dependencies with apiSlice
    if (accessToken || refreshToken) {
      const authHeader = accessToken?.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`;

      try {
        await fetch(`${BASE_API_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            refreshToken: refreshToken,
            deviceToken: fcmToken, // Optional: for clearing push notifications
          }),
        });
      } catch (apiError) {
        console.warn(
          "[Auth] Backend logout failed, continuing with local cleanup",
          apiError,
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error("[Auth] Logout Error:", error);
    return { success: false, message: "Local logout failed" };
  } finally {
    // 3. CRITICAL: Clear Local Data & Redux State
    await StorageService.clearAll(); // Or clear specific keys

    // Note: RTK Query state will be reset automatically when the store is re-initialized
    // No need to dispatch resetApiState here to avoid circular dependency

    // Use your navigation service to go to Login screen here
    // NavigationService.replace('Login');
  }
};
