import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiUser } from "react-icons/fi";

import { useRegisterMutation } from "@/features/auth/authApi";
import { PATHS } from "@/routes/routePaths";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
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
      const action = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (action.error) throw action.error;
      navigate(PATHS.CHAT, { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to complete the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/85 p-5 shadow-xl shadow-slate-950/40 sm:p-6"
    >
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
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            placeholder="Alex Morgan"
            autoComplete="name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Email
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
          <FiMail className="h-4 w-4 text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Password
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
          <FiLock className="h-4 w-4 text-slate-400" />
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
};
