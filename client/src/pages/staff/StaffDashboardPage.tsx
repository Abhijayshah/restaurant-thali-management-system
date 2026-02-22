import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import type { AuthState } from "../../types/auth";
import { fetchUsers, type UserSummary } from "../../api/usersApi";
import { fetchMenu, type MenuItem } from "../../api/menuApi";
import { createAttendanceApi } from "../../api/attendanceApi";
import { createExtrasApi, type ExtraItemInput } from "../../api/extrasApi";
import { notificationsAdd } from "../../store/notificationsSlice";

const StaffDashboardPage = () => {
  const authState = useAppSelector((state) => state.auth) as AuthState;
  const dispatch = useAppDispatch();

  const [customers, setCustomers] = useState<UserSummary[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerType, setCustomerType] = useState<"monthly" | "daily">(
    "monthly"
  );
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [shift, setShift] = useState<"morning" | "evening" | "night">(
    "morning"
  );
  const [isThali, setIsThali] = useState(true);
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  const [extrasItems, setExtrasItems] = useState<ExtraItemInput[]>([]);
  const [extrasSaving, setExtrasSaving] = useState(false);
  const [extrasError, setExtrasError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [usersData, menuData] = await Promise.all([
          fetchUsers(),
          fetchMenu(),
        ]);
        const activeCustomers = usersData.filter(
          (user) =>
            (user.customerType === "monthly" || user.customerType === "daily") &&
            (user.status === "approved" || user.status === "active")
        );
        setCustomers(activeCustomers);
        setMenuItems(menuData);
      } catch {
        setError("Unable to load customers or menu");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const customerOptions = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.customerType === customerType &&
          (customer.status === "approved" || customer.status === "active")
      ),
    [customers, customerType]
  );

  const handleCreateAttendance = async (event: React.FormEvent) => {
    event.preventDefault();
    setAttendanceError("");

    if (!selectedCustomerId) {
      setAttendanceError("Select a customer");
      return;
    }

    setAttendanceSaving(true);
    try {
      await createAttendanceApi({
        userId: selectedCustomerId,
        customerType,
        date,
        shift,
        isThali,
      });
      dispatch(
        notificationsAdd({
          message: "Attendance saved",
        })
      );
    } catch {
      setAttendanceError("Unable to mark attendance");
      dispatch(
        notificationsAdd({
          message: "Failed to save attendance",
        })
      );
    } finally {
      setAttendanceSaving(false);
    }
  };

  const handleAddExtraRow = () => {
    setExtrasItems((prev) => [
      ...prev,
      {
        name: "",
        qty: 1,
        price: 0,
      },
    ]);
  };

  const handleExtrasChange =
    (index: number, field: keyof ExtraItemInput) =>
    (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setExtrasItems((prev) => {
        const next = [...prev];
        const item = { ...next[index] };
        const value = event.target.value;
        if (field === "qty" || field === "price") {
          const num = Number(value);
          item[field] = Number.isNaN(num) ? 0 : num;
        } else if (field === "name") {
          item.name = value;
          item.menuItemId = undefined;
        } else if (field === "menuItemId") {
          item.menuItemId = value || undefined;
          if (value) {
            const menuItem = menuItems.find((menu) => menu.id === value);
            if (menuItem) {
              item.name = menuItem.name;
              item.price = menuItem.price;
            }
          }
        }
        next[index] = item;
        return next;
      });
    };

  const handleRemoveExtraRow = (index: number) => {
    setExtrasItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveExtras = async (event: React.FormEvent) => {
    event.preventDefault();
    setExtrasError("");

    if (!selectedCustomerId) {
      setExtrasError("Select a customer");
      return;
    }

    const validItems = extrasItems.filter(
      (item) => item.name && item.qty > 0 && item.price >= 0
    );

    if (validItems.length === 0) {
      setExtrasError("Add at least one extra item");
      return;
    }

    setExtrasSaving(true);
    try {
      await createExtrasApi({
        userId: selectedCustomerId,
        date,
        shift,
        items: validItems,
      });
      setExtrasItems([]);
      dispatch(
        notificationsAdd({
          message: "Extras saved",
        })
      );
    } catch {
      setExtrasError("Unable to save extras");
      dispatch(
        notificationsAdd({
          message: "Failed to save extras",
        })
      );
    } finally {
      setExtrasSaving(false);
    }
  };

  const staffLabel =
    authState.user?.role === "staff-worker" ? "Staff" : "Manager/Staff";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          {staffLabel} – Attendance and Extras
        </h2>
      </div>
      {loading && (
        <div className="text-sm text-slate-400">
          Loading customers and menu...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-100">
            Mark attendance
          </h3>
          <form className="space-y-3" onSubmit={handleCreateAttendance}>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Customer type
              </label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCustomerType("monthly")}
                  className={`flex-1 rounded-md border px-3 py-2 ${
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
                  className={`flex-1 rounded-md border px-3 py-2 ${
                    customerType === "daily"
                      ? "border-sky-500 bg-sky-600 text-white"
                      : "border-slate-700 bg-slate-950 text-slate-200"
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>
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
                {customerOptions.map((customer) => (
                  <option value={customer.id} key={customer.id}>
                    {customer.name} ({customer.phone})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Shift
              </label>
              <select
                value={shift}
                onChange={(event) =>
                  setShift(event.target.value as "morning" | "evening" | "night")
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={isThali}
                  onChange={(event) => setIsThali(event.target.checked)}
                />
                <span>Thali taken</span>
              </label>
            </div>
            {attendanceError && (
              <div className="text-xs text-red-400">
                {attendanceError}
              </div>
            )}
            <button
              type="submit"
              disabled={attendanceSaving}
              className="rounded-md bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-60"
            >
              {attendanceSaving ? "Saving..." : "Save attendance"}
            </button>
          </form>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-semibold text-slate-100">
            Extras for selected customer
          </h3>
          <form className="space-y-3" onSubmit={handleSaveExtras}>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Items
              </label>
              {extrasItems.length === 0 && (
                <div className="text-xs text-slate-400">
                  No extras added yet.
                </div>
              )}
              {extrasItems.length > 0 && (
                <div className="space-y-2">
                  {extrasItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-2 items-center"
                    >
                      <select
                        value={item.menuItemId ?? ""}
                        onChange={handleExtrasChange(
                          index,
                          "menuItemId"
                        ) as (event: React.ChangeEvent<HTMLSelectElement>) => void}
                        className="min-w-[140px] flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-50 outline-none focus:border-sky-500"
                      >
                        <option value="">Custom item</option>
                        {menuItems.map((menu) => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={item.name}
                        onChange={handleExtrasChange(
                          index,
                          "name"
                        ) as (event: React.ChangeEvent<HTMLInputElement>) => void}
                        className="min-w-[120px] flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-50 outline-none focus:border-sky-500"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={handleExtrasChange(
                          index,
                          "qty"
                        ) as (event: React.ChangeEvent<HTMLInputElement>) => void}
                        className="w-16 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-50 outline-none focus:border-sky-500"
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={handleExtrasChange(
                          index,
                          "price"
                        ) as (event: React.ChangeEvent<HTMLInputElement>) => void}
                        className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-50 outline-none focus:border-sky-500"
                        placeholder="Price"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraRow(index)}
                        className="rounded-md border border-red-500 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={handleAddExtraRow}
                className="mt-2 rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
              >
                Add extra item
              </button>
            </div>
            {extrasError && (
              <div className="text-xs text-red-400">
                {extrasError}
              </div>
            )}
            <button
              type="submit"
              disabled={extrasSaving}
              className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {extrasSaving ? "Saving..." : "Save extras"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
