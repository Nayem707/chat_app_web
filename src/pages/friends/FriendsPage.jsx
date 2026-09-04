import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare, FiUsers } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { PATHS } from "@/routes/routePaths";
import { UserProfileModal } from "@/features/users/components/UserProfileModal";
import { useGetFriendsQuery } from "@/features/friends/friendApi";
import { useCreateConversationMutation } from "@/features/chat/chatApi";

export const FriendsPage = () => {
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const { data: friendsData, isLoading } = useGetFriendsQuery();
  const friends = friendsData?.data ?? [];

  const [createConversation, { isLoading: isStarting }] =
    useCreateConversationMutation();

  const handleMessage = async (friendId) => {
    try {
      const result = await createConversation({ userId: friendId }).unwrap();
      const id = result?.data?.id;
      if (id) navigate(PATHS.conversationById(id));
    } catch {
      // error handled by global error boundary / RTK Query
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15">
          <FiUsers className="h-5 w-5 text-violet-300" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Friends</h1>
          <p className="text-sm text-slate-400">
            {friends.length} accepted{" "}
            {friends.length === 1 ? "friend" : "friends"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-slate-400">Loading…</div>
      ) : friends.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-sm text-slate-400">
          You have no friends yet. Go to{" "}
          <button
            type="button"
            onClick={() => navigate(PATHS.USERS)}
            className="text-violet-400 hover:underline"
          >
            People
          </button>{" "}
          to send a request.
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
            >
              <button
                type="button"
                onClick={() => setProfileUser(friend)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="relative shrink-0">
                  <Avatar user={friend} size="md" />
                  {friend.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {friend.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {friend.email}
                  </p>
                </div>
              </button>
              <button
                type="button"
                disabled={isStarting}
                onClick={() => handleMessage(friend.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                <FiMessageSquare className="h-3.5 w-3.5" />
                Message
              </button>
            </div>
          ))}
        </div>
      )}

      <UserProfileModal
        user={profileUser}
        onClose={() => setProfileUser(null)}
      />
    </div>
  );
};
