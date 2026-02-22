export type UserRole =
  | "shop-owner"
  | "staff-manager-monthly"
  | "staff-manager-daily"
  | "staff-worker"
  | "customer-monthly"
  | "customer-daily";

export type CustomerType = "monthly" | "daily" | null;

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  customerType: CustomerType;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

