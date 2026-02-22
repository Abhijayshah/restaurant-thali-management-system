import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import type { AuthState } from "../types/auth";
import { authLogout } from "../store/authSlice";

const OwnerLayout = () => {
  const authState = useAppSelector((state) => state.auth) as AuthState;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="px-6 py-4 text-xl font-semibold tracking-tight">
          Thali Owner
        </div>
        <nav className="flex-1 px-4 space-y-2 text-sm">
          <NavLink
            to="/owner"
            end
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-slate-800/60 text-slate-50" : "text-slate-300"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/owner/settings"
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-slate-800/60 text-slate-50" : "text-slate-300"
              }`
            }
          >
            Settings
          </NavLink>
          <NavLink
            to="/owner/users"
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-slate-800/60 text-slate-50" : "text-slate-300"
              }`
            }
          >
            Users
          </NavLink>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 flex items-center px-4 md:px-6 justify-between">
          <div className="font-semibold tracking-tight">Owner Panel</div>
          <div className="flex items-center gap-3 text-xs">
            {authState.user && (
              <span className="text-slate-300">
                {authState.user.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-6 py-4 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
