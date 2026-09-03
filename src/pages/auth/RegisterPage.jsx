import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { PATHS } from "@/routes/routePaths";

export const RegisterPage = () => (
  <div>
    <div className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-violet-300 uppercase">
          Get started
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Create account
        </h2>
      </div>
      <Link
        to={PATHS.LOGIN}
        className="text-sm font-medium text-violet-300 transition hover:text-violet-200"
      >
        Login instead
      </Link>
    </div>
    <RegisterForm />
  </div>
);
