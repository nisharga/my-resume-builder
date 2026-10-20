import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiSlice from "./api-queries/api-slice";
import authReducer from "./features/authSlice";
import cvReducer from "./features/cvSlice";

// Persist CV data to AsyncStorage on every cv/* action
const cvPersistMiddleware = (storeApi: any) => (next: any) => (action: any) => {
  const result = next(action);
  if (typeof action.type === "string" && action.type.startsWith("cv/")) {
    const state: RootState = storeApi.getState();
    AsyncStorage.setItem("@cv_data_v1", JSON.stringify(state.cv)).catch(() => {});
  }
  return result;
};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cv: cvReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 100 },
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)
      .concat(cvPersistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
