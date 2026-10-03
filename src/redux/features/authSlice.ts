import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  onboarded: boolean;
}

const initialState: AuthState = {
  token: null,
  onboarded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to update the token in global state
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    // Action to clear token (Logout)
    clearAuth: (state) => {
      state.token = null;
    },
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.onboarded = action.payload;
    },
  },
});

export const { setToken, clearAuth, setOnboarded } = authSlice.actions;
export default authSlice.reducer;
