import { useEffect, useMemo, useState } from "react";
import {
  approveUserApi,
  fetchUsers,
  rejectUserApi,
  type UserSummary,
} from "../../api/usersApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { notificationsAdd } from "../../store/notificationsSlice";

type FilterType = "all" | "pending" | "approved" | "rejected";

const OwnerUsersPage = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch {
        setError("Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredUsers = useMemo(() => {
    if (filter === "all") {
      return users;
    }
    return users.filter((user) => user.status === filter);
  }, [users, filter]);

  const handleApprove = async (user: UserSummary) => {
    setUpdatingId(user.id);
    try {
      const updated = await approveUserApi(user.id);
      setUsers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      dispatch(
        notificationsAdd({
          message: `Approved ${updated.name}`,
        })
      );
    } catch {
      setError("Unable to approve user");
      dispatch(
        notificationsAdd({
          message: "Failed to approve user",
        })
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (user: UserSummary) => {
    setUpdatingId(user.id);
    try {
      const updated = await rejectUserApi(user.id);
      setUsers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      dispatch(
        notificationsAdd({
          message: `Rejected ${updated.name}`,
        })
      );
    } catch {
      setError("Unable to reject user");
      dispatch(
        notificationsAdd({
          message: "Failed to reject user",
        })
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatRole = (role: string, customerType: string | null) => {
    if (role === "shop-owner") {
      return "Owner";
    }
    if (role === "staff-worker") {
      return "Staff";
    }
    if (role === "staff-manager-monthly") {
      return "Manager (Monthly)";
    }
    if (role === "staff-manager-daily") {
      return "Manager (Daily)";
    }
    if (role === "customer-monthly") {
      return "Customer (Monthly)";
    }
    if (role === "customer-daily") {
      return "Customer (Daily)";
    }
    if (customerType) {
      return `Customer (${customerType})`;
    }
    return role;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          Users
        </h2>
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
            onClick={() => setFilter("pending")}
            className={`rounded-full px-3 py-1 ${
              filter === "pending"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`rounded-full px-3 py-1 ${
              filter === "approved"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            Approved
          </button>
          <button
            type="button"
            onClick={() => setFilter("rejected")}
            className={`rounded-full px-3 py-1 ${
              filter === "rejected"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>
      {loading && (
        <div className="text-sm text-slate-400">
          Loading users...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
      {filteredUsers.length === 0 && !loading && (
        <div className="text-sm text-slate-400">
          No users found for this filter.
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
                  Role
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
                    {formatRole(user.role, user.customerType)}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {user.status}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {user.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={updatingId === user.id}
                          onClick={() => handleApprove(user)}
                          className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          {updatingId === user.id ? "Updating..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === user.id}
                          onClick={() => handleReject(user)}
                          className="rounded-md bg-red-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerUsersPage;
