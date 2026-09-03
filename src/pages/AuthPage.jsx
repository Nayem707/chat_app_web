import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { useLoginMutation, useRegisterMutation } from "@/features/auth/authApi";

const authHighlights = [
  "Real-time team chat",
  "Private direct messages",
  "Private and group rooms",
  "Cross-device presence",
];

export const AuthPage = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const isLogin = mode === "login";
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = useMemo(
    () => [
      {
        key: "email",
        label: "Email",
        type: "email",
        icon: FiMail,
        placeholder: "your@email.com",
        autoComplete: "email",
      },
      {
        key: "password",
        label: "Password",
        type: "password",
        icon: FiLock,
        placeholder: "••••••••",
        autoComplete: isLogin ? "current-password" : "new-password",
      },
    ],
    [isLogin],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin && !form.name.trim()) {
      setError("Please enter your full name to create an account.");
      return;
    }

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const action = isLogin
        ? await login({ email: form.email.trim(), password: form.password })
        : await register({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          });

      if (action.error) {
        throw action.error;
      }

      navigate("/chat", { replace: true });
    } catch (submitError) {
      // Errors from axiosBaseQuery are { message, statusCode } — not { data: { message } }.
      const message = submitError?.message || "Unable to complete the request.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_36%),linear-gradient(135deg,#020817_0%,#0f172a_38%,#111827_100%)] px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-950/80 shadow-2xl shadow-slate-950/60 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-slate-900/80 p-8 xl:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-violet-200 uppercase">
                Luma Chat
              </div>
              <h1 className="mt-8 max-w-md text-4xl font-semibold leading-tight text-white">
                Stay connected with your team in real time.
              </h1>
              <p className="mt-4 max-w-md text-base text-slate-300">
                Secure conversations, collaborative group rooms, and presence
                that keeps your team aligned.
              </p>
            </div>

            <div className="space-y-4">
              {authHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <FiCheckCircle className="h-4 w-4" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-2xl font-semibold text-white">24k</div>
                <div className="mt-1 text-slate-400">Messages</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-2xl font-semibold text-white">1.2k</div>
                <div className="mt-1 text-slate-400">Users</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-2xl font-semibold text-white">99.9%</div>
                <div className="mt-1 text-slate-400">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-violet-300 uppercase">
                  Welcome
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  {isLogin ? "Sign in" : "Create account"}
                </h2>
              </div>
              <Link
                to={isLogin ? "/register" : "/login"}
                className="text-sm font-medium text-violet-300 transition hover:text-violet-200"
              >
                {isLogin ? "Register instead" : "Login instead"}
              </Link>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/85 p-5 shadow-xl shadow-slate-950/40 sm:p-6"
            >
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Full name
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
                    <FiUser className="h-4 w-4 text-slate-400" />
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      placeholder="Alex Morgan"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {fields.map(
                ({
                  key,
                  label,
                  type,
                  icon: Icon,
                  placeholder,
                  autoComplete,
                }) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      {label}
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
                      <Icon className="h-4 w-4 text-slate-400" />
                      <input
                        id={key}
                        name={key}
                        type={type}
                        value={form[key]}
                        onChange={handleChange}
                        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                      />
                    </div>
                  </div>
                ),
              )}

              {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Sign in"
                    : "Create account"}
                <FiArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};
