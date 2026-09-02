import { FiShield, FiUsers } from "react-icons/fi";
import { Avatar } from "./Avatar";

export const GroupMembersPanel = ({ members = [], conversationName }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-violet-300 uppercase">
              Room details
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {conversationName}
            </h3>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
            {members.length} members
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
            <FiUsers className="h-4 w-4 text-violet-300" />
            Members
          </div>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar user={member} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                  </div>
                </div>
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${member.status === "online" ? "bg-emerald-400" : "bg-slate-500"}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
            <FiShield className="h-4 w-4 text-amber-300" />
            Permissions
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Owners can manage the room and invite members.</li>
            <li>• Admins can moderate conversations and alerts.</li>
            <li>• Members can read and send messages.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
