import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  thaliPricePerShift: number | null;
  dailyThaliPrice: number | null;
  maxThalisPerMonth: number | null;
  maxThalisPerDay: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  thaliPricePerShift: null,
  dailyThaliPrice: null,
  maxThalisPerMonth: null,
  maxThalisPerDay: null,
  loading: false,
  error: null,
};

interface SettingsLoadPayload {
  loading: boolean;
}

interface SettingsSetPayload {
  thaliPricePerShift: number;
  dailyThaliPrice: number;
  maxThalisPerMonth: number;
  maxThalisPerDay: number;
}

interface SettingsErrorPayload {
  error: string;
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    settingsLoading(state, action: PayloadAction<SettingsLoadPayload>) {
      state.loading = action.payload.loading;
      if (action.payload.loading) {
        state.error = null;
      }
    },
    settingsSet(state, action: PayloadAction<SettingsSetPayload>) {
      state.thaliPricePerShift = action.payload.thaliPricePerShift;
      state.dailyThaliPrice = action.payload.dailyThaliPrice;
      state.maxThalisPerMonth = action.payload.maxThalisPerMonth;
      state.maxThalisPerDay = action.payload.maxThalisPerDay;
      state.loading = false;
    },
    settingsError(state, action: PayloadAction<SettingsErrorPayload>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const { settingsLoading, settingsSet, settingsError } =
  settingsSlice.actions;

export default settingsSlice.reducer;

