import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { authFailure, authStart, authSuccess } from "../../store/authSlice";
import { registerApi } from "../../api/authApi";
import type { AuthState, UserRole } from "../../types/auth";
import { notificationsAdd } from "../../store/notificationsSlice";

const getHomePathForRole = (role: UserRole) => {
  if (role === "shop-owner") {
    return "/owner";
  }
  if (role === "staff-worker") {
    return "/staff";
  }
  if (role === "customer-monthly" || role === "customer-daily") {
    return "/customer";
  }
  return "/manager";
};

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth) as AuthState;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerType, setCustomerType] = useState<"monthly" | "daily">(
    "monthly"
  );
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError("");
    dispatch(authStart({ loading: true }));

    try {
      const data = await registerApi({
        name,
        phone,
        email: email || undefined,
        password,
        customerType,
      });
      dispatch(authSuccess({ user: data.user, token: data.token }));
      dispatch(
        notificationsAdd({
          message: "Account created successfully",
        })
      );
      const path = getHomePathForRole(data.user.role);
      navigate(path, { replace: true });
    } catch {
      dispatch(authFailure({ error: "Registration failed" }));
      setLocalError("Unable to create account");
      dispatch(
        notificationsAdd({
          message: "Registration failed",
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">
            Create account
          </h1>
          <p className="text-sm text-slate-400">
            Choose monthly or daily customer type
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="Email address"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="Password"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Customer type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCustomerType("monthly")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  customerType === "monthly"
                    ? "border-sky-500 bg-sky-600 text-white"
                    : "border-slate-700 bg-slate-950 text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("daily")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  customerType === "daily"
                    ? "border-sky-500 bg-sky-600 text-white"
                    : "border-slate-700 bg-slate-950 text-slate-200"
                }`}
              >
                Daily
              </button>
            </div>
          </div>
          {(localError || authState.error) && (
            <div className="text-sm text-red-400">
              {localError || authState.error}
            </div>
          )}
          <button
            type="submit"
            disabled={authState.loading}
            className="w-full rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {authState.loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-sky-400 hover:text-sky-300 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
