import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { AuthState } from "../../types/auth";
import {
  fetchSubscriptionsForUser,
  type SubscriptionSummary,
} from "../../api/subscriptionsApi";
import {
  fetchAttendanceForUserMonth,
  type AttendanceRecord,
} from "../../api/attendanceApi";
import { fetchExtrasByUser, type ExtraRecord } from "../../api/extrasApi";

const CustomerDashboardPage = () => {
  const authState = useAppSelector((state) => state.auth) as AuthState;
  const user = authState.user;

  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${m}`;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [extras, setExtras] = useState<ExtraRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [subs, att, extrasData] = await Promise.all([
          fetchSubscriptionsForUser(user.id),
          fetchAttendanceForUserMonth(user.id, month),
          fetchExtrasByUser(user.id),
        ]);
        setSubscriptions(subs);
        setAttendance(att);
        setExtras(extrasData);
      } catch {
        setError("Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user, month]);

  const daysInMonth = useMemo(() => {
    const [yearString, monthString] = month.split("-");
    const year = Number(yearString);
    const monthIndex = Number(monthString) - 1;
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const days: string[] = [];
    for (let day = 1; day <= lastDay; day += 1) {
      const dayString = String(day).padStart(2, "0");
      days.push(`${yearString}-${monthString}-${dayString}`);
    }
    return days;
  }, [month]);

  const attendanceByDay = useMemo(() => {
    const map: Record<string, AttendanceRecord[]> = {};
    attendance.forEach((record) => {
      const dayKey = record.date.slice(0, 10);
      if (!map[dayKey]) {
        map[dayKey] = [];
      }
      map[dayKey].push(record);
    });
    return map;
  }, [attendance]);

  const extrasByDay = useMemo(() => {
    const map: Record<string, ExtraRecord[]> = {};
    extras.forEach((record) => {
      const dayKey = record.date.slice(0, 10);
      if (!map[dayKey]) {
        map[dayKey] = [];
      }
      map[dayKey].push(record);
    });
    return map;
  }, [extras]);

  const subscriptionForMonth = useMemo(
    () => subscriptions.filter((sub) => sub.month === month),
    [subscriptions, month]
  );

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const customerLabel =
    user?.customerType === "monthly" ? "Monthly customer" : "Daily customer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50">
            Customer Dashboard
          </h2>
          {user && (
            <p className="text-xs text-slate-400">
              {user.name} – {customerLabel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase text-slate-400">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-50 outline-none focus:border-sky-500"
          />
        </div>
      </div>
      {loading && (
        <div className="text-sm text-slate-400">
          Loading subscriptions and attendance...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Subscriptions
          </h3>
          {subscriptionForMonth.length === 0 ? (
            <div className="text-xs text-slate-400">
              No subscription found for this month.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900/80">
                  <tr>
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
                  </tr>
                </thead>
                <tbody>
                  {subscriptionForMonth.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-t border-slate-800/80"
                    >
                      <td className="px-3 py-2 text-slate-100">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Daily details
          </h3>
          <div className="grid gap-2 md:grid-cols-3">
            {daysInMonth.map((day) => {
              const dayAttendance = attendanceByDay[day] || [];
              const dayExtras = extrasByDay[day] || [];
              const thaliShifts = dayAttendance
                .filter((record) => record.isThali)
                .map((record) => record.shift);
              const extrasTotal = dayExtras.reduce(
                (sum, record) => sum + record.totalExtra,
                0
              );
              const totalDailyCost = dayAttendance.reduce(
                (sum, record) => sum + record.totalCost,
                0
              );

              return (
                <div
                  key={day}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-slate-100">
                      {day}
                    </div>
                    {dayAttendance.length > 0 || dayExtras.length > 0 ? (
                      <div className="text-[10px] uppercase text-emerald-400">
                        Active
                      </div>
                    ) : null}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Thali shifts:{" "}
                    {thaliShifts.length > 0
                      ? thaliShifts.join(", ")
                      : "None"}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Extras total:{" "}
                    {extrasTotal > 0 ? formatCurrency(extrasTotal) : "₹0"}
                  </div>
                  {user?.customerType === "daily" && (
                    <div className="text-[11px] text-slate-300">
                      Daily charges:{" "}
                      {totalDailyCost > 0
                        ? formatCurrency(totalDailyCost)
                        : "₹0"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
