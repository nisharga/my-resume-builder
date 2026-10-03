import { AuthService } from "./authService";
import apiSlice from "./api-slice";

/**
 * TypeScript Interfaces
 */
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: any;
  };
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: any;
}

export type AuthMethod = "mobile" | "email";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Send OTP
    sendOTP: builder.mutation({
      query: ({ payload }) => ({
        url: "/auth/login-customer",
        method: "POST",
        body: payload,
      }),
    }),

    // 2. Verify OTP
    verifyOTP: builder.mutation<any, { payload: any }>({
      query: ({ payload }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload,
      }),
      // We use onQueryStarted to handle the side effect of saving the session
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;

          // Normalize tokens from various backend shapes (matching your Axios logic)
          const accessToken =
            response?.data?.accessToken || response?.accessToken || response?.token;
          const refreshToken = response?.data?.refreshToken || response?.refreshToken;
          const user = response?.data?.user || response?.user || null;

          let tokenPayload: any = undefined;
          if (accessToken && refreshToken) tokenPayload = { accessToken, refreshToken };
          else if (accessToken) tokenPayload = accessToken;
          else if (refreshToken) tokenPayload = { refreshToken };

          if (tokenPayload) {
            // Persist session via your AuthService
            await AuthService.login(user, tokenPayload);
          }
        } catch (error) {
          console.error("[AuthApi] Verification side-effect failed:", error);
        }
      },
    }),

    // 3. Resend OTP
    resendOTP: builder.mutation<any, { payload: any }>({
      query: ({ payload }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: payload,
      }),
    }),

    // === Get My Profile ===
    getProfile: builder.query({
      query: () => ({
        url: `/profile`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useGetProfileQuery,
} = authApi;
