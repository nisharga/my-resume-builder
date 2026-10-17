import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/features/auth/authStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { showToast } from "@/utils/toast";

const BASE_URL = "https://api-food.deligo.pt/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      const refreshResult = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResult.ok) {
        const data = await refreshResult.json();
        const newAccess = data?.data?.accessToken ?? data?.accessToken;
        const newRefresh = data?.data?.refreshToken ?? data?.refreshToken;

        if (newAccess) {
          await setAccessToken(newAccess);
          if (newRefresh) await setRefreshToken(newRefresh);
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        showToast.error("Session Expired", "Please log in again.");
        await clearAuthStorage();
      }
    } else {
      await clearAuthStorage();
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 30,
  tagTypes: ["user", "Profile", "notification"],
  endpoints: () => ({}),
});

export default apiSlice;
