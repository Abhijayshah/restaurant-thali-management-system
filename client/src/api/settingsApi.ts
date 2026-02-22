import axiosClient from "./axiosClient";

export interface SettingsResponse {
  thaliPricePerShift: number;
  dailyThaliPrice: number;
  maxThalisPerMonth: number;
  maxThalisPerDay: number;
  qrCode?: string;
  upiId?: string;
  restaurantName?: string;
}

export const fetchSettings = async () => {
  const response = await axiosClient.get<SettingsResponse>("/settings");
  return response.data;
};

export const updateSettingsApi = async (payload: SettingsResponse) => {
  const response = await axiosClient.put<SettingsResponse>("/settings", payload);
  return response.data;
};

