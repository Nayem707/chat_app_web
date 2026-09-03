import { NavLink, Outlet } from "react-router-dom";
import { PATHS } from "@/routes/routePaths";

const settingsNav = [
  { label: "Profile", to: PATHS.SETTINGS_PROFILE },
  { label: "Account", to: PATHS.SETTINGS_ACCOUNT },
  { label: "Privacy", to: PATHS.SETTINGS_PRIVACY },
  { label: "Notifications", to: PATHS.SETTINGS_NOTIFICATIONS },
  { label: "Security", to: PATHS.SETTINGS_SECURITY },
  { label: "Appearance", to: PATHS.SETTINGS_APPEARANCE },
];

export const SettingsLayout = () => (
  <div className="flex min-h-screen">
    <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-950/80 p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Settings
      </h2>
      <nav className="space-y-1">
        {settingsNav.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-violet-500/10 text-violet-300"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />
    </main>
  </div>
);
