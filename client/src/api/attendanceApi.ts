import axiosClient from "./axiosClient";

export interface AttendanceRecord {
  id: string;
  userId: string;
  customerType: "monthly" | "daily";
  date: string;
  shift: "morning" | "evening" | "night";
  foodTaken: boolean;
  isThali: boolean;
  totalCost: number;
}

export const createAttendanceApi = async (payload: {
  userId: string;
  customerType: "monthly" | "daily";
  date: string;
  shift: "morning" | "evening" | "night";
  isThali: boolean;
}) => {
  const response = await axiosClient.post<AttendanceRecord>("/attendance", {
    userId: payload.userId,
    customerType: payload.customerType,
    date: payload.date,
    shift: payload.shift,
    isThali: payload.isThali,
    foodTaken: true,
  });

  const item = response.data as AttendanceRecord & { _id?: string };

  return {
    ...item,
    id: item._id ?? item.id,
  };
};

export const fetchAttendanceForUserMonth = async (
  userId: string,
  month: string
) => {
  const response = await axiosClient.get<AttendanceRecord[]>("/attendance", {
    params: { userId, month },
  });

  return response.data.map((item) => {
    const record = item as AttendanceRecord & { _id?: string };
    return {
      ...record,
      id: record._id ?? record.id,
    };
  });
};
