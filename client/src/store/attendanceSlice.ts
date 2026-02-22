import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  shift: "morning" | "evening" | "night";
  foodTaken: boolean;
}

export interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
};

interface AttendanceSetPayload {
  records: AttendanceRecord[];
}

interface AttendanceLoadingPayload {
  loading: boolean;
}

interface AttendanceErrorPayload {
  error: string;
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    attendanceSet(state, action: PayloadAction<AttendanceSetPayload>) {
      state.records = action.payload.records;
    },
    attendanceLoading(state, action: PayloadAction<AttendanceLoadingPayload>) {
      state.loading = action.payload.loading;
      if (action.payload.loading) {
        state.error = null;
      }
    },
    attendanceError(state, action: PayloadAction<AttendanceErrorPayload>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const { attendanceSet, attendanceLoading, attendanceError } =
  attendanceSlice.actions;

export default attendanceSlice.reducer;

