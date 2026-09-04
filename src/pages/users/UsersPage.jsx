import { useState, useMemo } from "react";
import { FiSearch, FiUsers } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { FriendButton } from "@/features/friends/components/FriendButton";
import { useSearchUsersQuery } from "@/features/users/userApi";
import { useGetIncomingRequestsQuery } from "@/features/friends/friendApi";
import { normalizeUserList } from "@/features/groups/groupUtils";

const TABS = ["All Users", "Friend Requests"];

export const UsersPage = () => {
  const [tab, setTab] = useState("All Users");
  const [query, setQuery] = useState("");

  const { data: usersData, isLoading: usersLoading } =
    useSearchUsersQuery(query);
  const { data: requestsData, isLoading: requestsLoading } =
    useGetIncomingRequestsQuery();

  const users = normalizeUserList(usersData);
  const incomingRequests = requestsData?.data ?? [];

  const isLoading = tab === "All Users" ? usersLoading : requestsLoading;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
            <FiUsers className="h-5 w-5 text-violet-300" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">People</h1>
            <p className="text-sm text-slate-400">
              Find and connect with other users
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === t
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
              {t === "Friend Requests" && incomingRequests.length > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] text-white">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search (all-users tab only) */}
        {tab === "All Users" && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2.5">
            <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading…
          </div>
        ) : tab === "All Users" ? (
          <UserList users={users} />
        ) : (
          <IncomingRequestList requests={incomingRequests} />
        )}
      </div>
    </div>
  );
};

const UserList = ({ users }) => {
  if (users.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
        No users found.
      </div>
    );

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
        >
          <Avatar user={user} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <FriendButton userId={user.id} />
        </div>
      ))}
    </div>
  );
};

const IncomingRequestList = ({ requests }) => {
  if (requests.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
        No pending requests.
      </div>
    );

  return (
    <div className="space-y-2">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
        >
          <Avatar user={req.requester} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {req.requester?.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {req.requester?.email}
            </p>
          </div>
          {/* FriendButton reads live status by userId so it shows Accept/Reject */}
          <FriendButton userId={req.requester?.id} />
        </div>
      ))}
    </div>
  );
};
