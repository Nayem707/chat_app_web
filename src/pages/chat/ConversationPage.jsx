import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiBell,
  FiBellOff,
  FiLogOut,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPhone,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
  FiUsers,
  FiVideo,
} from "react-icons/fi";

import { Avatar } from "@/components/ui/Avatar";
import { MessageList } from "@/features/chat/components/MessageList";
import { MessageComposer } from "@/features/chat/components/MessageComposer";
import { GroupMembers } from "@/features/groups/components/GroupMembers";
import { UserProfilePanel } from "@/features/chat/components/UserProfilePanel";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
} from "@/features/chat/chatApi";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/authApi";
import { useSearchUsersQuery } from "@/features/users/userApi";
import { PATHS } from "@/routes/routePaths";
import { selectTypingUsers } from "@/features/chat/chatSlice";
import {
  getConversationPeerUser,
  normalizeUserList,
} from "@/features/groups/groupUtils";
import { socketService } from "@/services/socketService";

const MENU_ITEMS = [
  { label: "Profile", icon: FiUser, to: PATHS.SETTINGS_PROFILE },
  { label: "Groups", icon: FiUsers, to: PATHS.GROUPS },
  { label: "Notifications", icon: FiBell, to: PATHS.SETTINGS_NOTIFICATIONS },
  { label: "Privacy", icon: FiShield, to: PATHS.SETTINGS_PRIVACY },
  { label: "Appearance", icon: FiBellOff, to: PATHS.SETTINGS_APPEARANCE },
  { label: "Settings", icon: FiSettings, to: PATHS.SETTINGS_PROFILE },
];

export const ConversationPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;

  const [logout] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const typingTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  const typingUsers = useSelector(selectTypingUsers(conversationId));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Join / leave the socket room for this conversation
  useEffect(() => {
    if (!conversationId) return;
    socketService.emit("join_conversation", { conversationId });
    return () => {
      socketService.emit("leave_conversation", { conversationId });
      socketService.emit("typing_stop", { conversationId });
      clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId]);

  const { data: conversationsData } = useGetConversationsQuery(undefined, {
    skip: !currentUser,
  });
  const conversations = useMemo(
    () => conversationsData?.data || [],
    [conversationsData],
  );

  const { data: usersData } = useSearchUsersQuery("", { skip: !currentUser });
  const users = useMemo(() => normalizeUserList(usersData), [usersData]);

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

  const handleLogout = async () => {
    setIsMenuOpen(false);
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

  const peerUser = getConversationPeerUser({
    conversation: activeConversation,
    currentUserId: currentUser?.id,
    users,
  });

  return (
    <>
      {/* Center: conversation area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-slate-800 lg:border-l lg:border-r">
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
                  ? `${activeConversation.members.length} members • ${
                      activeConversation.status === "online"
                        ? "active now"
                        : "offline"
                    }`
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

            {/* More options dropdown */}
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border bg-slate-900 transition hover:border-slate-600 hover:text-white ${
                  isMenuOpen
                    ? "border-violet-500/60 text-violet-300"
                    : "border-slate-700 text-slate-300"
                }`}
                aria-label="More options"
                aria-expanded={isMenuOpen}
              >
                <FiMoreHorizontal className="h-4 w-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/60">
                  <div className="border-b border-slate-800 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      Navigate
                    </p>
                  </div>

                  <div className="py-1">
                    {MENU_ITEMS.map(({ label, icon: Icon, to }) => (
                      <Link
                        key={label}
                        to={to}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        <Icon className="h-4 w-4 text-slate-400" />
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950/60">
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
          <MessageComposer
            conversationId={conversationId}
            currentUser={currentUser}
            typingTimeoutRef={typingTimeoutRef}
          />
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
