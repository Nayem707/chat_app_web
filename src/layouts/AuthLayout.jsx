import { Outlet } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const authHighlights = [
  "Real-time team chat",
  "Private direct messages",
  "Private and group rooms",
  "Cross-device presence",
];

export const AuthLayout = () => (
  <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_36%),linear-gradient(135deg,#020817_0%,#0f172a_38%,#111827_100%)] px-4 py-10 text-slate-100">
    <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-950/80 shadow-2xl shadow-slate-950/60 backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left: marketing / hero panel */}
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
              Secure conversations, collaborative group rooms, and presence that
              keeps your team aligned.
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

      {/* Right: form (rendered by child pages via Outlet) */}
      <section className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </div>
  </main>
);
