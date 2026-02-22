import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

interface NotificationsSetPayload {
  items: NotificationItem[];
}

interface NotificationsAddPayload {
  message: string;
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationsSet(state, action: PayloadAction<NotificationsSetPayload>) {
      state.items = action.payload.items;
    },
    notificationsAdd(state, action: PayloadAction<NotificationsAddPayload>) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const item: NotificationItem = {
        id,
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.items = [item, ...state.items];
    },
    notificationsRemove(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    notificationsMarkRead(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, read: true } : item
      );
    },
  },
});

export const {
  notificationsSet,
  notificationsAdd,
  notificationsRemove,
  notificationsMarkRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
