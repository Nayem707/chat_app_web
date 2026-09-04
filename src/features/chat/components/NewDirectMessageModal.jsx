import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

import { Avatar } from "@/components/ui/Avatar";
import { PATHS } from "@/routes/routePaths";
import { normalizeUserList } from "@/features/groups/groupUtils";
import { useSearchUsersQuery } from "@/features/users/userApi";
import { useCreateConversationMutation } from "@/features/chat/chatApi";

export const NewDirectMessageModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const { data: usersData } = useSearchUsersQuery(query, { skip: !isOpen });
  const users = normalizeUserList(usersData);

  const [createConversation] = useCreateConversationMutation();

  const handleSelectUser = async (user) => {
    setLoadingId(user.id);
    try {
      const result = await createConversation({ userId: user.id }).unwrap();
      const conversationId = result?.data?.id;
      if (conversationId) {
        onClose();
        setQuery("");
        navigate(PATHS.conversationById(conversationId));
      }
    } catch (err) {
      console.error("Failed to start conversation", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-[24rem] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <p className="text-sm font-semibold text-white">New Message</p>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-500 transition hover:text-slate-300"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
            <FiSearch className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people…"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* User list */}
        <div className="max-h-80 overflow-y-auto pb-2">
          {users.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              {query ? "No users found." : "Start typing to search…"}
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                type="button"
                disabled={loadingId === user.id}
                onClick={() => handleSelectUser(user)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-800 disabled:opacity-50"
              >
                <Avatar user={user} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                </div>
                {loadingId === user.id && (
                  <span className="ml-auto text-xs text-slate-500">…</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
