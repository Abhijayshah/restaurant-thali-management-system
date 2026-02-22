import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import customersReducer from "./customersSlice";
import attendanceReducer from "./attendanceSlice";
import menuReducer from "./menuSlice";
import settingsReducer from "./settingsSlice";
import notificationsReducer from "./notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    attendance: attendanceReducer,
    menu: menuReducer,
    settings: settingsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
