import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { PATHS } from "@/routes/routePaths";

export const LoginPage = () => (
  <div>
    <div className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-violet-300 uppercase">
          Welcome
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Sign in</h2>
      </div>
      <Link
        to={PATHS.REGISTER}
        className="text-sm font-medium text-violet-300 transition hover:text-violet-200"
      >
        Register instead
      </Link>
    </div>
    <LoginForm />
  </div>
);
