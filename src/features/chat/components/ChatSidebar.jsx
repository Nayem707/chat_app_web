import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiBell,
  FiBellOff,
  FiFilter,
  FiLogOut,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { Avatar } from "@/components/ui/Avatar";
import { PATHS } from "@/routes/routePaths";
import { CHAT_FILTER } from "@/features/chat/chat.constants";
import { CreateGroupModal } from "@/features/groups/components/CreateGroupModal";
import { NewDirectMessageModal } from "@/features/chat/components/NewDirectMessageModal";
import { normalizeUserList } from "@/features/groups/groupUtils";
import {
  useCreateGroupMutation,
  useGetConversationsQuery,
} from "@/features/chat/chatApi";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/authApi";
import { useSearchUsersQuery } from "@/features/users/userApi";

const formatRelativeTime = (value) => {
  if (!value) return "now";
  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
};

export const ChatSidebar = () => {
  const navigate = useNavigate();
  const { conversationId: activeId } = useParams();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(CHAT_FILTER.ALL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDmModalOpen, setIsDmModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  const { data: conversationsData } = useGetConversationsQuery(undefined, {
    skip: !currentUser,
  });
  const conversations = useMemo(
    () => conversationsData?.data || [],
    [conversationsData],
  );

  const { data: usersData } = useSearchUsersQuery("", { skip: !currentUser });
  const users = normalizeUserList(usersData);

  const [createGroup] = useCreateGroupMutation();

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesFilter =
        filter === CHAT_FILTER.ALL || c.type === filter.toUpperCase();
      const haystack = `${c.title} ${c.description || ""}`.toLowerCase();
      return matchesFilter && haystack.includes(search.toLowerCase());
    });
  }, [conversations, filter, search]);

  const handleCreateGroup = async ({ name, members }) => {
    if (!name || !members?.length) return;
    try {
      const result = await createGroup({
        name,
        description: `Group chat created by ${currentUser?.name || "user"}`,
        memberIds: members,
      }).unwrap();
      const created = result?.data;
      if (created?.id) navigate(PATHS.conversationById(created.id));
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  return (
    <aside className="w-full shrink-0 border-slate-800 bg-slate-950/80 lg:max-w-[380px] lg:border-r">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar user={currentUser} size="md" />
              <div>
                <div className="text-sm font-semibold text-white">
                  {currentUser?.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDmModalOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-violet-500 hover:text-violet-200"
                aria-label="New direct message"
              >
                <FiPlus className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-violet-500 hover:text-violet-200"
                aria-label="More options"
              >
                <FiSettings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2.5">
            <FiSearch className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="mt-3 flex items-center gap-2">
            {[CHAT_FILTER.ALL, CHAT_FILTER.DIRECT, CHAT_FILTER.GROUP].map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`flex-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
                    filter === option
                      ? "bg-violet-600 text-white"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {option === CHAT_FILTER.ALL
                    ? "All"
                    : option === CHAT_FILTER.DIRECT
                      ? "Direct"
                      : "Groups"}
                </button>
              ),
            )}
          </div>
        </div>

        {/* List header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium">
            <FiUsers className="h-4 w-4 text-violet-300" />
            Recent chats
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <FiFilter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {filteredConversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-5 text-center text-sm text-slate-400">
              No conversations match your search.
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = activeId === conversation.id;
              const hasUnread = conversation.unreadCount > 0;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() =>
                    navigate(PATHS.conversationById(conversation.id))
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-violet-500/60 bg-violet-500/10 shadow-lg shadow-violet-950/20"
                      : "border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      user={{ ...conversation, name: conversation.title }}
                      size="md"
                    />
                    {conversation.status === "online" && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-white">
                        {conversation.title}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-400">
                        {formatRelativeTime(
                          conversation.lastMessage?.createdAt,
                        )}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-400">
                        {conversation.lastMessage?.text || "No messages yet"}
                      </p>
                      {hasUnread && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-semibold text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <NewDirectMessageModal
        isOpen={isDmModalOpen}
        onClose={() => setIsDmModalOpen(false)}
      />

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        onCreate={handleCreateGroup}
      />

      {/* Navigation modal */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-72 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Settings
              </p>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-500 transition hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDmModalOpen(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <FiPlus className="h-4 w-4 text-slate-400" />
                New Message
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <FiPlus className="h-4 w-4 text-slate-400" />
                Create Group
              </button>

              {[
                {
                  label: "Notifications",
                  icon: FiBell,
                  to: PATHS.SETTINGS_NOTIFICATIONS,
                },
                {
                  label: "Privacy",
                  icon: FiShield,
                  to: PATHS.SETTINGS_PRIVACY,
                },
                {
                  label: "Appearance",
                  icon: FiBellOff,
                  to: PATHS.SETTINGS_APPEARANCE,
                },
                {
                  label: "Settings",
                  icon: FiSettings,
                  to: PATHS.SETTINGS_PROFILE,
                },
              ].map(({ label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
