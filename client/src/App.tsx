import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OwnerLayout from "./layouts/OwnerLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import StaffLayout from "./layouts/StaffLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage";
import OwnerSettingsPage from "./pages/owner/OwnerSettingsPage";
import OwnerUsersPage from "./pages/owner/OwnerUsersPage";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerCustomersPage from "./pages/manager/ManagerCustomersPage";
import ManagerSubscriptionsPage from "./pages/manager/ManagerSubscriptionsPage";
import StaffDashboardPage from "./pages/staff/StaffDashboardPage";
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import { useAppSelector } from "./hooks/useAppSelector";
import { useAppDispatch } from "./hooks/useAppDispatch";
import type { NotificationsState } from "./store/notificationsSlice";
import { notificationsRemove } from "./store/notificationsSlice";

const Notifications = () => {
  const notificationsState = useAppSelector(
    (state) => state.notifications
  ) as NotificationsState;
  const dispatch = useAppDispatch();

  if (notificationsState.items.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md space-y-2 px-4">
        {notificationsState.items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-50 shadow-lg flex items-center justify-between gap-3"
          >
            <span>{item.message}</span>
            <button
              type="button"
              onClick={() => dispatch(notificationsRemove({ id: item.id }))}
              className="text-slate-400 hover:text-slate-200"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Notifications />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={["shop-owner"]} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboardPage />} />
            <Route path="settings" element={<OwnerSettingsPage />} />
            <Route path="users" element={<OwnerUsersPage />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "staff-manager-monthly",
                "staff-manager-daily",
              ]}
            />
          }
        >
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboardPage />} />
            <Route path="customers" element={<ManagerCustomersPage />} />
            <Route path="subscriptions" element={<ManagerSubscriptionsPage />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["staff-worker"]}
            />
          }
        >
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboardPage />} />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "customer-monthly",
                "customer-daily",
              ]}
            />
          }
        >
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
