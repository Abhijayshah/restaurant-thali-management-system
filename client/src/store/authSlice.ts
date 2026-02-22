import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser } from "../types/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

interface AuthStartPayload {
  loading: boolean;
}

interface AuthSuccessPayload {
  user: AuthUser;
  token: string;
}

interface AuthFailurePayload {
  error: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state, action: PayloadAction<AuthStartPayload>) {
      state.loading = action.payload.loading;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<AuthSuccessPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    authFailure(state, action: PayloadAction<AuthFailurePayload>) {
      state.loading = false;
      state.error = action.payload.error;
    },
    authLogout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { authStart, authSuccess, authFailure, authLogout } =
  authSlice.actions;

export default authSlice.reducer;
