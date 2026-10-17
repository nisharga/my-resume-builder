import { clearAuthStorage, setAccessToken, setRefreshToken } from "@/features/auth/authStorage";
import apiSlice from "./api-slice";
import { clearAuth, setCredentials } from "../features/authSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginCustomerRequest {
  email: string;
}

interface LoginCustomerResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface DeviceDetails {
  deviceId: string;
  deviceType: string;
  deviceName: string;
  fcmToken: string;
  isLoggedIn: boolean;
  userAgent: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
  role: string;
  forceLogin: boolean;
  deviceDetails: DeviceDetails;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: TokenData | null;
}

// ─── Static device payload (replace with real values later) ──────────────────

export const STATIC_DEVICE_DETAILS: DeviceDetails = {
  deviceId: "unknown",
  deviceType: "",
  deviceName: "",
  fcmToken: "",
  isLoggedIn: true,
  userAgent: "",
};

// ─── Save tokens helper ───────────────────────────────────────────────────────

async function saveTokens(dispatch: (action: any) => void, data: TokenData) {
  await setAccessToken(data.accessToken);
  await setRefreshToken(data.refreshToken);
  dispatch(setCredentials({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginCustomer: builder.mutation<LoginCustomerResponse, LoginCustomerRequest>({
      query: (body) => ({
        url: "/auth/login-customer",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) await saveTokens(dispatch, data.data);
        } catch {
          // error handled in the calling screen
        }
      },
    }),

    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) await saveTokens(dispatch, data.data);
        } catch {
          // silent — api-slice handles retry
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        // Clear local session regardless of server response
        try {
          await queryFulfilled;
        } catch {
          // best-effort — local cleanup always runs
        } finally {
          await clearAuthStorage();
          dispatch(clearAuth());
        }
      },
    }),
  }),
});

export const {
  useLoginCustomerMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
