import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPhone,
  FiSearch,
  FiSettings,
  FiVideo,
} from "react-icons/fi";

import { Avatar } from "@/components/ui/Avatar";
import { MessageList } from "@/features/chat/components/MessageList";
import { GroupMembers } from "@/features/groups/components/GroupMembers";
import { UserProfilePanel } from "@/features/chat/components/UserProfilePanel";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/features/chat/chatApi";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/authApi";
import { useSearchUsersQuery } from "@/features/users/userApi";
import { PATHS } from "@/routes/routePaths";

export const ConversationPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;

  const [logout] = useLogoutMutation();
  const [sendMessage] = useSendMessageMutation();
  const [draft, setDraft] = useState("");
  const [typingUsers] = useState([]);

  const { data: conversationsData } = useGetConversationsQuery(undefined, {
    skip: !currentUser,
  });
  const conversations = useMemo(
    () => conversationsData?.data || [],
    [conversationsData],
  );

  const { data: usersData } = useSearchUsersQuery("", { skip: !currentUser });
  const users = usersData?.data || [];

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === conversationId) || null,
    [conversations, conversationId],
  );

  const { data: messagesData, isLoading: areMessagesLoading } =
    useGetMessagesQuery(
      { conversationId, page: 1, limit: 50 },
      { skip: !conversationId },
    );
  const activeMessages = messagesData?.data?.items || [];

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversationId) return;
    try {
      await sendMessage({ conversationId, content }).unwrap();
      setDraft("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  if (!activeConversation) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-950/60">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300">
          Conversation not found.
        </div>
      </div>
    );
  }

  const activeMemberIds = activeConversation.members || [];
  const peerUser =
    users.find(
      (u) => u.id === activeMemberIds.find((id) => id !== currentUser?.id),
    ) ||
    users[0] ||
    null;

  return (
    <>
      {/* Center: conversation area */}
      <div className="flex min-w-0 flex-1 flex-col border-slate-800 lg:border-l lg:border-r">
        {/* Conversation header */}
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              user={{ ...activeConversation, name: activeConversation.title }}
              size="md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                  {activeConversation.title}
                </h2>
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    activeConversation.status === "online"
                      ? "bg-emerald-400"
                      : "bg-slate-500"
                  }`}
                />
              </div>
              <p className="truncate text-xs text-slate-400">
                {activeConversation.type === "GROUP"
                  ? `${activeConversation.members.length} members • ${activeConversation.status === "online" ? "active now" : "offline"}`
                  : activeConversation.status === "online"
                    ? "online now"
                    : "last seen recently"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { icon: FiPhone, label: "Start call" },
              { icon: FiVideo, label: "Start video call" },
              { icon: FiSearch, label: "Search in conversation" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
              aria-label="Log out"
            >
              <FiMoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Sub-header */}
        <div className="border-b border-slate-800 bg-slate-900/40 px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
              <FiMessageSquare className="h-3.5 w-3.5 text-violet-300" />
              {activeConversation.type === "GROUP"
                ? "Group room"
                : "Direct message"}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FiBell className="h-3.5 w-3.5" />
              {activeConversation.unreadCount > 0
                ? `${activeConversation.unreadCount} unread`
                : "All caught up"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex min-h-0 flex-1 flex-col bg-slate-950/60">
          {areMessagesLoading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
              Loading messages…
            </div>
          ) : (
            <MessageList
              messages={activeMessages}
              currentUserId={currentUser?.id}
              typingUsers={typingUsers}
              conversationType={activeConversation.type}
            />
          )}

          {/* Composer */}
          <div className="border-t border-slate-800 bg-slate-950/80 p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-[22px] border border-slate-700 bg-slate-900 p-2 shadow-lg shadow-slate-950/30 sm:gap-3 sm:p-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:text-slate-100"
              >
                <FiSettings className="h-4 w-4" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={1}
                placeholder="Type your message…"
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                className="flex h-11 items-center justify-center rounded-full bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <aside className="hidden w-[320px] shrink-0 flex-col border-slate-800 bg-slate-950/70 xl:flex">
        {activeConversation.type === "GROUP" ? (
          <GroupMembers
            members={
              activeConversation.membersMeta || activeConversation.members || []
            }
            conversationName={activeConversation.title}
          />
        ) : (
          <UserProfilePanel user={peerUser || currentUser} />
        )}
      </aside>
    </>
  );
};
