import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./api-queries/api-slice";
import authReducer from "./features/authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(apiSlice.middleware),
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 100 }, // Increase threshold
      serializableCheck: false, // Optional: hides another common warning // Recommended for React Native
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// import { setupListeners } from '@reduxjs/toolkit/query'
// setupListeners(store.dispatch)

// export default store
