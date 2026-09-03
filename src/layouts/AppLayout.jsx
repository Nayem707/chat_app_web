import { Outlet } from "react-router-dom";

export const AppLayout = () => (
  <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
    <Outlet />
  </div>
);
