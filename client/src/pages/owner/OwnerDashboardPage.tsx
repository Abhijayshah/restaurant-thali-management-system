import { useEffect, useState } from "react";
import { fetchSummaryReport } from "../../api/reportsApi";

const OwnerDashboardPage = () => {
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${m}`;
  });

  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSummaryReport(month);
        setMonthlyTotal(data.monthlyCustomersTotal);
        setDailyTotal(data.dailyCustomersTotal);
        setGrandTotal(data.grandTotal);
      } catch {
        setError("Unable to load summary");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [month]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const formatCurrency = (value: number) => {
    if (!Number.isFinite(value)) {
      return "₹0";
    }
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          Owner Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase text-slate-400">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={handleMonthChange}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-50 outline-none focus:border-sky-500"
          />
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs uppercase text-slate-400">
            Monthly Customers Total
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {loading ? "..." : formatCurrency(monthlyTotal)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs uppercase text-slate-400">
            Daily Customers Total
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {loading ? "..." : formatCurrency(dailyTotal)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs uppercase text-slate-400">
            Grand Total
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {loading ? "..." : formatCurrency(grandTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
