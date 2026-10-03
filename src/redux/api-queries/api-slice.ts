import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/src/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Toast from "react-native-toast-message";
import { API_ENDPOINTS, BASE_API_URL } from "../../constants/config";
import { logoutUser } from "./logout";

/**
 * Step 1: Define the base query with standard configurations
 */
// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_API_URL,
//   prepareHeaders: async (headers) => {
//     const token = await getAccessToken();
//     if (token) {
//       // Clean token and ensure Bearer prefix
//       const cleanToken = typeof token === 'string' ? token.replace(/['"]+/g, '') : token;
//       const authToken = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;
//       headers.set('Authorization', authToken);
//     }
//     headers.set('Accept', 'application/json');
//     return headers;
//   },
// });

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: async (headers) => {
    const token = await getAccessToken();

    // 1. Check if token exists first
    if (token) {
      // 2. Ensure it's a string and handle potential object return from storage
      const rawToken = typeof token === "object" ? token?.accessToken || token?.token : token;

      if (rawToken && typeof rawToken === "string") {
        const cleanToken = rawToken.replace(/['"]+/g, "");

        // 3. Now it is safe to call .startsWith
        const authToken = cleanToken.startsWith("Bearer ") ? cleanToken : `Bearer ${cleanToken}`;

        headers.set("Authorization", authToken);
      }
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

/**
 * Step 2: Create a wrapper to handle 401 errors and Refresh Token logic
 */
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Execute the initial request
  let result = await baseQuery(args, api, extraOptions);

  // Step 3: Check if the response is 401 (Unauthorized)
  if (result.error && result.error.status === 401) {
    console.error("[apiSlice] 401 detected, attempting to refresh token...");

    // Get stored refresh token
    let refreshToken = await getRefreshToken();
    if (refreshToken && typeof refreshToken === "object") {
      refreshToken = refreshToken.refreshToken || refreshToken.token || null;
    }

    if (refreshToken) {
      const refreshUrl = `${BASE_API_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`;

      // Step 4: Call the Refresh API using native fetch (avoids recursion)
      const refreshResult = await fetch(refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResult.ok) {
        const data = await refreshResult.json();
        const newAccess = data?.accessToken || data?.data?.accessToken;
        const newRefresh = data?.refreshToken || data?.data?.refreshToken;

        if (newAccess) {
          // Step 5: Save new tokens and retry original request
          await setAccessToken(newAccess);
          if (newRefresh) await setRefreshToken(newRefresh);

          console.log("[apiSlice] Refresh successful, retrying...");
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        // Step 6: Refresh failed (Refresh token expired or invalid) -> Logout
        console.warn("[apiSlice] Refresh failed, clearing session.");

        Toast.show({
          text1: "Session Expired",
          text2: "Please log in again.",
          type: "error",
        });

        await logoutUser(); // Clear storage and navigate to Login
      }
    } else {
      // No refresh token available, just logout
      await logoutUser();
    }
  }

  return result;
};

/**
 * Step 7: Export the Final API Slice
 */
const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth, // Using the reauth wrapper
  keepUnusedDataFor: 30, // Default cache time (set to 0 if you want no cache)
  tagTypes: [
    "vendors",
    "products",
    "categories",
    "customers",
    "user",
    "notification",
    "order",
    "message",
    "Profile",
    "loyalties",
  ],
  endpoints: () => ({}),
});

export default apiSlice;
