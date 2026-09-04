import { NavLink, Outlet } from "react-router-dom";
import { PATHS } from "@/routes/routePaths";
import {
  FiUser,
  FiSettings,
  FiShield,
  FiBell,
  FiLock,
  FiSliders,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { BiHome } from "react-icons/bi";

const settingsNav = [
  { label: "Home", to: PATHS.HOME, icon: BiHome },
  { label: "Profile", to: PATHS.SETTINGS_PROFILE, icon: FiUser },
  { label: "People", to: PATHS.USERS, icon: FiUserPlus },
  { label: "Friends", to: PATHS.FRIENDS, icon: FiUsers },
  { label: "Account", to: PATHS.SETTINGS_ACCOUNT, icon: FiSettings },
  { label: "Privacy", to: PATHS.SETTINGS_PRIVACY, icon: FiShield },
  { label: "Notifications", to: PATHS.SETTINGS_NOTIFICATIONS, icon: FiBell },
  { label: "Security", to: PATHS.SETTINGS_SECURITY, icon: FiLock },
  { label: "Appearance", to: PATHS.SETTINGS_APPEARANCE, icon: FiSliders },
];

export const SettingsLayout = () => (
  <main className="h-screen overflow-hidden bg-slate-950 px-4 py-4 text-slate-100 sm:px-5 lg:px-6">
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1600px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/70 backdrop-blur-md">
      <div className="flex h-full min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-950/80 p-4">
          <h2 className="mb-4 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Settings
          </h2>
          <nav className="space-y-0.5">
            {settingsNav.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-500/10 text-violet-300"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  </main>
);
