import { FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";

export const UserProfilePanel = ({ user }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-800 p-5">
        <p className="text-xs font-medium tracking-[0.18em] text-violet-300 uppercase">
          Profile
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Avatar user={user} size="xl" />
          <div>
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
            <FiUser className="h-4 w-4 text-violet-300" />
            About
          </div>
          <p className="text-sm leading-6 text-slate-300">
            {user.bio || "No bio provided yet."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <FiPhone className="h-4 w-4 text-slate-400" />
              <span>{user.phone || "Not available"}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="h-4 w-4 text-slate-400" />
              <span>{user.location || "Unknown location"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-3 text-sm font-medium text-slate-200">
            Quick notes
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Product updates are synced every 15 minutes.</li>
            <li>• Last seen online within the last hour.</li>
            <li>• Best for launch coordination and approvals.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
