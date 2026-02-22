import { useEffect, useState } from "react";
import {
  fetchSettings,
  updateSettingsApi,
  type SettingsResponse,
} from "../../api/settingsApi";

const OwnerSettingsPage = () => {
  const [form, setForm] = useState<SettingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSettings();
        setForm(data);
      } catch {
        setError("Unable to load settings");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleChange =
    (field: keyof SettingsResponse) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!form) {
        return;
      }
      const value = event.target.value;
      if (
        field === "thaliPricePerShift" ||
        field === "dailyThaliPrice" ||
        field === "maxThalisPerMonth" ||
        field === "maxThalisPerDay"
      ) {
        const num = Number(value);
        setForm({
          ...form,
          [field]: Number.isNaN(num) ? 0 : num,
        });
      } else {
        setForm({
          ...form,
          [field]: value,
        });
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) {
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateSettingsApi(form);
      setForm(updated);
      setSuccess("Settings saved");
    } catch {
      setError("Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-lg font-semibold tracking-tight text-slate-50">
        Settings
      </h2>
      {loading && (
        <div className="text-sm text-slate-400">
          Loading settings...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-emerald-400">
          {success}
        </div>
      )}
      {form && !loading && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Restaurant name
            </label>
            <input
              type="text"
              value={form.restaurantName ?? ""}
              onChange={handleChange("restaurantName")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="Restaurant name"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Thali price per shift (monthly)
            </label>
            <input
              type="number"
              value={form.thaliPricePerShift}
              onChange={handleChange("thaliPricePerShift")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Daily thali price
            </label>
            <input
              type="number"
              value={form.dailyThaliPrice}
              onChange={handleChange("dailyThaliPrice")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Max thalis per month (per shift)
            </label>
            <input
              type="number"
              value={form.maxThalisPerMonth}
              onChange={handleChange("maxThalisPerMonth")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              Max thalis per day (daily customers)
            </label>
            <input
              type="number"
              value={form.maxThalisPerDay}
              onChange={handleChange("maxThalisPerDay")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              UPI ID
            </label>
            <input
              type="text"
              value={form.upiId ?? ""}
              onChange={handleChange("upiId")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="upi@bank"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              QR code URL (optional)
            </label>
            <input
              type="text"
              value={form.qrCode ?? ""}
              onChange={handleChange("qrCode")}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OwnerSettingsPage;

