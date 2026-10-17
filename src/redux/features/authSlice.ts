import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  userId?: string;
  email?: string;
  name?: { firstName: string; lastName: string };
  role?: string;
  status?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: UserProfile | null;
      }>,
    ) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user ?? null;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    // Legacy — kept so existing dispatches don't break
    setToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { setCredentials, clearAuth, setToken } = authSlice.actions;
export default authSlice.reducer;
