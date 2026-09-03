import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPhone,
  FiSearch,
  FiSettings,
  FiVideo,
} from "react-icons/fi";

import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/authApi";
import { Avatar } from "@/features/chat/components/Avatar";
import { CreateGroupModal } from "@/features/chat/components/CreateGroupModal";
import { ConversationSidebar } from "@/features/chat/components/ConversationSidebar";
import { GroupMembersPanel } from "@/features/chat/components/GroupMembersPanel";
import { MessageList } from "@/features/chat/components/MessageList";
import { UserProfilePanel } from "@/features/chat/components/UserProfilePanel";
import {
  useCreateGroupMutation,
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/features/chat/chatApi";
import { useSearchUsersQuery } from "@/features/users/userApi";

export const ChatPage = () => {
  const navigate = useNavigate();
  const { data: currentUserData, isLoading: isCurrentUserLoading } =
    useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const [logout] = useLogoutMutation();
  const [sendMessage] = useSendMessageMutation();
  const [createGroup] = useCreateGroupMutation();
  const [createConversation] = useCreateConversationMutation();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  const { data: conversationsData } =
    useGetConversationsQuery(undefined, { skip: !currentUser });
  const conversations = useMemo(
    () => conversationsData?.data || [],
    [conversationsData],
  );

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  const { data: usersData } = useSearchUsersQuery("", { skip: !currentUser });
  const users = usersData?.data || [];

  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedId) ||
    conversations[0] ||
    null;

  const { data: messagesData, isLoading: areMessagesLoading } =
    useGetMessagesQuery(
      { conversationId: activeConversation?.id, page: 1, limit: 50 },
      { skip: !activeConversation?.id },
    );

  const activeMessages = messagesData?.data?.items || [];

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesFilter =
        filter === "all" || conversation.type === filter.toUpperCase();
      const haystack =
        `${conversation.title} ${conversation.description || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [conversations, filter, search]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !activeConversation) return;

    try {
      await sendMessage({ conversationId: activeConversation.id, content }).unwrap();
      setDraft("");
      setTypingUsers([]);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleCreateGroup = async ({ name, members }) => {
    if (!name || !members?.length) return;

    try {
      const result = await createGroup({
        name,
        description: `Group chat created by ${currentUser?.name || "user"}`,
        memberIds: members,
      }).unwrap();

      const createdGroup = result?.data?.data;
      if (createdGroup?.id) {
        setSelectedId(createdGroup.id);
      }
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const _handleCreateDirectConversation = async (userId) => {
    if (!userId) return;
    try {
      const result = await createConversation({ type: "DIRECT", userId }).unwrap();
      const newConversation = result?.data?.data;
      if (newConversation?.id) {
        setSelectedId(newConversation.id);
      }
    } catch (error) {
      console.error("Failed to start a conversation", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (isCurrentUserLoading || !currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-sm text-slate-300">Loading your workspace...</div>
      </main>
    );
  }

  if (!activeConversation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300">
          No conversations available yet.
        </div>
      </main>
    );
  }

  const activeMemberIds = activeConversation.members || [];
  const peerUser =
    users.find(
      (user) =>
        user.id ===
        activeMemberIds.find((memberId) => memberId !== currentUser.id),
    ) ||
    users[0] ||
    null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/70 backdrop-blur-md">
        <div className="flex min-h-[calc(100vh-2rem)] flex-col lg:flex-row">
          <ConversationSidebar
            conversations={filteredConversations}
            selectedConversationId={activeConversation.id}
            onSelectConversation={setSelectedId}
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            onOpenCreateGroup={() => setIsModalOpen(true)}
            currentUser={currentUser}
          />

          <div className="flex min-w-0 flex-1 flex-col border-slate-800 lg:border-l lg:border-r">
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  user={{
                    ...activeConversation,
                    name: activeConversation.title,
                  }}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                      {activeConversation.title}
                    </h2>
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${activeConversation.status === "online" ? "bg-emerald-400" : "bg-slate-500"}`}
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
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
                  aria-label="Start call"
                >
                  <FiPhone className="h-4 w-4" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
                  aria-label="Start video call"
                >
                  <FiVideo className="h-4 w-4" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
                  aria-label="Search in conversation"
                >
                  <FiSearch className="h-4 w-4" />
                </button>
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

            <div className="flex min-h-0 flex-1 flex-col bg-slate-950/60">
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

              {areMessagesLoading ? (
                <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                  Loading messages...
                </div>
              ) : (
                <MessageList
                  messages={activeMessages}
                  currentUserId={currentUser.id}
                  typingUsers={typingUsers}
                  conversationType={activeConversation.type}
                />
              )}

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
                    onChange={(event) => setDraft(event.target.value)}
                    rows={1}
                    placeholder="Type your message..."
                    className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
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

          <aside className="hidden w-[320px] shrink-0 flex-col border-slate-800 bg-slate-950/70 xl:flex">
            {activeConversation.type === "GROUP" ? (
              <GroupMembersPanel
                members={
                  activeConversation.membersMeta ||
                  activeConversation.members ||
                  []
                }
                conversationName={activeConversation.title}
              />
            ) : (
              <UserProfilePanel user={peerUser || currentUser} />
            )}
          </aside>
        </div>
      </div>

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        onCreate={handleCreateGroup}
      />
    </main>
  );
};
