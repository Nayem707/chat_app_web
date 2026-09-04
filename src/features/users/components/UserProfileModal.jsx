import { useNavigate } from "react-router-dom";
import { FiX, FiMail, FiAtSign, FiMessageSquare } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { FriendButton } from "@/features/friends/components/FriendButton";
import { PATHS } from "@/routes/routePaths";
import { useGetFriendStatusQuery } from "@/features/friends/friendApi";
import { useCreateConversationMutation } from "@/features/chat/chatApi";

export const UserProfileModal = ({ user, onClose }) => {
  const navigate = useNavigate();
  const { data: statusData } = useGetFriendStatusQuery(user?.id, {
    skip: !user?.id,
  });
  const isFriend = statusData?.data?.status === "ACCEPTED";

  const [createConversation, { isLoading: isStarting }] =
    useCreateConversationMutation();

  const handleMessage = async () => {
    try {
      const result = await createConversation({ userId: user.id }).unwrap();
      const id = result?.data?.id;
      if (id) {
        onClose();
        navigate(PATHS.conversationById(id));
      }
    } catch {
      /* handled globally */
    }
  };

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-t-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/80 sm:rounded-3xl"
        style={{ maxHeight: "90dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/60 text-slate-300 backdrop-blur-sm transition hover:bg-slate-800 hover:text-white"
          aria-label="Close"
        >
          <FiX className="h-4 w-4" />
        </button>

        {/* Scrollable area — cover is inside so -mt avatar isn't clipped */}
        <div className="overflow-y-auto rounded-t-3xl sm:rounded-3xl">
          {/* Cover */}
          <div
            className={`h-28 w-full shrink-0 ${
              user.coverUrl
                ? ""
                : `bg-gradient-to-br ${user.color ?? "from-violet-600 to-indigo-700"}`
            }`}
            style={
              user.coverUrl
                ? {
                    backgroundImage: `url(${user.coverUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          />

          {/* Avatar row overlapping cover */}
          <div className="-mt-8 flex items-end justify-between px-5">
            <div className="relative">
              <Avatar user={user} size="xl" className="ring-2 ring-slate-900" />
              {user.status === "online" && (
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
              )}
            </div>
            <div className="mb-1 flex items-center gap-2">
              <FriendButton userId={user.id} />
              {isFriend && (
                <button
                  type="button"
                  disabled={isStarting}
                  onClick={handleMessage}
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
                >
                  <FiMessageSquare className="h-3.5 w-3.5" />
                  Message
                </button>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="px-5 pt-3">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            {user.username && (
              <p className="mt-0.5 text-sm text-slate-400">@{user.username}</p>
            )}
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                user.status === "online"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-slate-700/60 text-slate-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${user.status === "online" ? "bg-emerald-400" : "bg-slate-500"}`}
              />
              {user.status === "online" ? "Online" : "Offline"}
            </span>
          </div>

          <div className="mt-4 space-y-3 px-5 pb-6">
            {/* Bio */}
            {user.bio && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm leading-relaxed text-slate-300">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Info rows */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="truncate text-slate-300">{user.email}</span>
              </div>
              {user.username && (
                <div className="flex items-center gap-3 text-sm">
                  <FiAtSign className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate text-slate-300">
                    {user.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
