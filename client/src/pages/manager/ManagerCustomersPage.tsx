import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { AuthState } from "../../types/auth";
import { createUserApi, fetchUsers, type UserSummary } from "../../api/usersApi";

type FilterType = "all" | "monthly" | "daily";

const ManagerCustomersPage = () => {
  const authState = useAppSelector((state) => state.auth) as AuthState;

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerType, setCustomerType] = useState<"monthly" | "daily">("monthly");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUsers();
        setUsers(
          data.filter((user) =>
            user.role === "customer-monthly" || user.role === "customer-daily"
          )
        );
      } catch {
        setError("Unable to load customers");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredUsers = useMemo(() => {
    if (filter === "monthly") {
      return users.filter((user) => user.customerType === "monthly");
    }
    if (filter === "daily") {
      return users.filter((user) => user.customerType === "daily");
    }
    return users;
  }, [users, filter]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!name || !phone || !password) {
      setFormError("Name, phone and password are required");
      return;
    }

    setSaving(true);
    try {
      const created = await createUserApi({
        name,
        phone,
        email: email || undefined,
        password,
        customerType,
      });
      setUsers((prev) => [created, ...prev]);
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch {
      setFormError("Unable to create customer");
    } finally {
      setSaving(false);
    }
  };

  const managerLabel =
    authState.user?.role === "staff-manager-daily" ? "Daily" : "Monthly";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          {managerLabel} Manager – Customers
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-100">
            Add customer
          </h3>
          <form className="space-y-3" onSubmit={handleCreate}>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
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
              <label className="block text-xs font-medium text-slate-300">
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
              <label className="block text-xs font-medium text-slate-300">
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
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
                placeholder="Set password"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Customer type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerType("monthly")}
                  className={`flex-1 rounded-md border px-3 py-2 text-xs ${
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
                  className={`flex-1 rounded-md border px-3 py-2 text-xs ${
                    customerType === "daily"
                      ? "border-sky-500 bg-sky-600 text-white"
                      : "border-slate-700 bg-slate-950 text-slate-200"
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>
            {formError && (
              <div className="text-xs text-red-400">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add customer"}
            </button>
          </form>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              Customers
            </h3>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-full px-3 py-1 ${
                  filter === "all"
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("monthly")}
                className={`rounded-full px-3 py-1 ${
                  filter === "monthly"
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setFilter("daily")}
                className={`rounded-full px-3 py-1 ${
                  filter === "daily"
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                Daily
              </button>
            </div>
          </div>
          {loading && (
            <div className="text-sm text-slate-400">
              Loading customers...
            </div>
          )}
          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}
          {!loading && filteredUsers.length === 0 && (
            <div className="text-sm text-slate-400">
              No customers found.
            </div>
          )}
          {filteredUsers.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Phone
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-800/80 hover:bg-slate-800/40"
                    >
                      <td className="px-3 py-2 text-slate-100">
                        {user.name}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {user.phone}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {user.customerType ?? "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {user.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerCustomersPage;

