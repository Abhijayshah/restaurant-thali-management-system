import axiosClient from "./axiosClient";
import type { AuthUser } from "../types/auth";

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const loginApi = async (phone: string, password: string) => {
  const response = await axiosClient.post<AuthResponse>("/auth/login", {
    phone,
    password,
  });
  return response.data;
};

export const registerApi = async (params: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  customerType: "monthly" | "daily";
}) => {
  const role =
    params.customerType === "monthly" ? "customer-monthly" : "customer-daily";

  const response = await axiosClient.post<AuthResponse>("/auth/register", {
    name: params.name,
    phone: params.phone,
    email: params.email,
    password: params.password,
    role,
    customerType: params.customerType,
  });

  return response.data;
};

