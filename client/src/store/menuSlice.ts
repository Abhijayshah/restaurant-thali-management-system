import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
};

interface MenuSetPayload {
  items: MenuItem[];
}

interface MenuLoadingPayload {
  loading: boolean;
}

interface MenuErrorPayload {
  error: string;
}

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    menuSet(state, action: PayloadAction<MenuSetPayload>) {
      state.items = action.payload.items;
    },
    menuLoading(state, action: PayloadAction<MenuLoadingPayload>) {
      state.loading = action.payload.loading;
      if (action.payload.loading) {
        state.error = null;
      }
    },
    menuError(state, action: PayloadAction<MenuErrorPayload>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const { menuSet, menuLoading, menuError } = menuSlice.actions;

export default menuSlice.reducer;

