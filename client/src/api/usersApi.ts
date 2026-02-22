import axiosClient from "./axiosClient";

export interface UserSummary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  customerType: string | null;
  status: string;
}

interface RawUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  customerType?: string | null;
  status: string;
}

const mapUser = (user: RawUser | UserSummary): UserSummary => {
  if ("id" in user) {
    return user;
  }
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    customerType: user.customerType ?? null,
    status: user.status,
  };
};

export const fetchUsers = async (): Promise<UserSummary[]> => {
  const response = await axiosClient.get<RawUser[]>("/users");
  return response.data.map(mapUser);
};

export const approveUserApi = async (id: string): Promise<UserSummary> => {
  const response = await axiosClient.put<RawUser>(`/users/${id}/approve`);
  return mapUser(response.data);
};

export const rejectUserApi = async (id: string): Promise<UserSummary> => {
  const response = await axiosClient.put<RawUser>(`/users/${id}/reject`);
  return mapUser(response.data);
};

export const createUserApi = async (payload: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  customerType: "monthly" | "daily";
}) => {
  const role =
    payload.customerType === "monthly" ? "customer-monthly" : "customer-daily";

  const response = await axiosClient.post<UserSummary>("/users", {
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    password: payload.password,
    role,
    customerType: payload.customerType,
  });

  return response.data;
};
