import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  role: string;
  customerType: string | null;
  status: string;
}

export interface CustomersState {
  items: CustomerSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

interface CustomersSetPayload {
  items: CustomerSummary[];
}

interface CustomersLoadingPayload {
  loading: boolean;
}

interface CustomersErrorPayload {
  error: string;
}

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    customersSet(state, action: PayloadAction<CustomersSetPayload>) {
      state.items = action.payload.items;
    },
    customersLoading(state, action: PayloadAction<CustomersLoadingPayload>) {
      state.loading = action.payload.loading;
      if (action.payload.loading) {
        state.error = null;
      }
    },
    customersError(state, action: PayloadAction<CustomersErrorPayload>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const { customersSet, customersLoading, customersError } =
  customersSlice.actions;

export default customersSlice.reducer;

