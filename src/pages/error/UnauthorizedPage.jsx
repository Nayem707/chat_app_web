import { Link } from "react-router-dom";
import { PATHS } from "@/routes/routePaths";

export const UnauthorizedPage = () => (
  <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
    <p className="text-sm font-semibold uppercase tracking-wider text-rose-400">
      403
    </p>
    <h1 className="mt-2 text-3xl font-semibold text-white">Access denied</h1>
    <p className="mt-3 text-sm text-slate-400">
      You don't have permission to view this page.
    </p>
    <Link
      to={PATHS.CHAT}
      className="mt-6 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
    >
      Go to chat
    </Link>
  </main>
);
