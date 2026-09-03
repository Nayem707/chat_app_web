import { FiMessageSquare } from "react-icons/fi";

export const ChatPage = () => (
  <div className="flex flex-1 items-center justify-center bg-slate-950/60">
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/15">
        <FiMessageSquare className="h-7 w-7 text-violet-300" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">
          No conversation selected
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Pick a conversation from the sidebar to get started.
        </p>
      </div>
    </div>
  </div>
);
