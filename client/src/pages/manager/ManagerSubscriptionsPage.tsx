import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import type { AuthState } from "../../types/auth";
import { fetchUsers, type UserSummary } from "../../api/usersApi";
import {
  createSubscriptionApi,
  fetchSubscriptions,
  markSubscriptionPaidApi,
  type SubscriptionSummary,
} from "../../api/subscriptionsApi";
import { notificationsAdd } from "../../store/notificationsSlice";

const ManagerSubscriptionsPage = () => {
  const authState = useAppSelector((state) => state.auth) as AuthState;
  const dispatch = useAppDispatch();

  const [customers, setCustomers] = useState<UserSummary[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${m}`;
  });
  const [shiftMorning, setShiftMorning] = useState(true);
  const [shiftEvening, setShiftEvening] = useState(false);
  const [shiftNight, setShiftNight] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [savingPaymentId, setSavingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [usersData, subsData] = await Promise.all([
          fetchUsers(),
          fetchSubscriptions(),
        ]);
        const monthlyCustomers = usersData.filter(
          (user) =>
            user.role === "customer-monthly" &&
            user.customerType === "monthly" &&
            (user.status === "approved" || user.status === "active")
        );
        setCustomers(monthlyCustomers);
        setSubscriptions(subsData);
      } catch {
        setError("Unable to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const customerMap = useMemo(() => {
    const map: Record<string, UserSummary> = {};
    customers.forEach((customer) => {
      map[customer.id] = customer;
    });
    return map;
  }, [customers]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      if (month && sub.month !== month) {
        return false;
      }
      if (selectedCustomerId && sub.userId !== selectedCustomerId) {
        return false;
      }
      return true;
    });
  }, [subscriptions, month, selectedCustomerId]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!selectedCustomerId) {
      setFormError("Select a customer");
      return;
    }

    const shifts: string[] = [];
    if (shiftMorning) shifts.push("morning");
    if (shiftEvening) shifts.push("evening");
    if (shiftNight) shifts.push("night");

    if (shifts.length === 0) {
      setFormError("Select at least one shift");
      return;
    }

    setSaving(true);
    try {
      const created = await createSubscriptionApi({
        userId: selectedCustomerId,
        month,
        shifts,
      });
      setSubscriptions((prev) => [created, ...prev]);
      dispatch(
        notificationsAdd({
          message: "Subscription created",
        })
      );
    } catch {
      setFormError("Unable to create subscription");
      dispatch(
        notificationsAdd({
          message: "Failed to create subscription",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async (subscription: SubscriptionSummary) => {
    if (subscription.paymentStatus === "paid") {
      return;
    }
    setSavingPaymentId(subscription.id);
    try {
      const updated = await markSubscriptionPaidApi(
        subscription.id,
        subscription.totalAmount
      );
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      dispatch(
        notificationsAdd({
          message: "Marked subscription as paid",
        })
      );
    } catch {
      setError("Unable to update payment status");
      dispatch(
        notificationsAdd({
          message: "Failed to update payment status",
        })
      );
    } finally {
      setSavingPaymentId(null);
    }
  };

  const managerLabel =
    authState.user?.role === "staff-manager-daily" ? "Daily" : "Monthly";

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          {managerLabel} Manager – Subscriptions
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-100">
            Create monthly subscription
          </h3>
          <form className="space-y-3" onSubmit={handleCreate}>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.phone})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Shifts
              </label>
              <div className="flex gap-3 text-xs">
                <label className="inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={shiftMorning}
                    onChange={(event) =>
                      setShiftMorning(event.target.checked)
                    }
                  />
                  <span>Morning</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={shiftEvening}
                    onChange={(event) =>
                      setShiftEvening(event.target.checked)
                    }
                  />
                  <span>Evening</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={shiftNight}
                    onChange={(event) => setShiftNight(event.target.checked)}
                  />
                  <span>Night</span>
                </label>
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
              {saving ? "Creating..." : "Create subscription"}
            </button>
          </form>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              Subscriptions
            </h3>
          </div>
          {loading && (
            <div className="text-sm text-slate-400">
              Loading subscriptions...
            </div>
          )}
          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}
          {!loading && filteredSubscriptions.length === 0 && (
            <div className="text-sm text-slate-400">
              No subscriptions found.
            </div>
          )}
          {filteredSubscriptions.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Customer
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Month
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Shifts
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Total
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Paid
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => {
                    const customer = customerMap[sub.userId];
                    return (
                      <tr
                        key={sub.id}
                        className="border-t border-slate-800/80 hover:bg-slate-800/40"
                      >
                        <td className="px-3 py-2 text-slate-100">
                          {customer
                            ? `${customer.name} (${customer.phone})`
                            : sub.userId}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          {sub.month}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          {sub.shifts.join(", ")}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          {formatCurrency(sub.totalAmount)}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          {formatCurrency(sub.amountPaid)}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          {sub.paymentStatus}
                        </td>
                        <td className="px-3 py-2 text-slate-200">
                          <button
                            type="button"
                            onClick={() => handleMarkPaid(sub)}
                            disabled={
                              sub.paymentStatus === "paid" ||
                              savingPaymentId === sub.id
                            }
                            className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                          >
                            {sub.paymentStatus === "paid"
                              ? "Paid"
                              : savingPaymentId === sub.id
                              ? "Updating..."
                              : "Mark paid"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerSubscriptionsPage;
