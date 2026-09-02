import { useMemo, useState } from "react";
import {
  FiBell,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPhone,
  FiSearch,
  FiSettings,
  FiVideo,
} from "react-icons/fi";
import { Avatar } from "@/features/chat/components/Avatar";
import { CreateGroupModal } from "@/features/chat/components/CreateGroupModal";
import { ConversationSidebar } from "@/features/chat/components/ConversationSidebar";
import { GroupMembersPanel } from "@/features/chat/components/GroupMembersPanel";
import { MessageList } from "@/features/chat/components/MessageList";
import { UserProfilePanel } from "@/features/chat/components/UserProfilePanel";
import {
  currentUser,
  conversations as initialConversations,
  groupMembers,
  messagesByConversation,
  users,
} from "@/features/chat/mockData";

export const ChatPage = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [messagesById, setMessagesById] = useState(messagesByConversation);
  const [selectedId, setSelectedId] = useState("c1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState(["u2"]);

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

  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedId) ||
    conversations[0];
  const activeMessages = messagesById[activeConversation.id] || [];

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: content,
      createdAt: new Date().toISOString(),
      status: "READ",
      readBy: ["u2"],
    };

    setMessagesById((previous) => ({
      ...previous,
      [activeConversation.id]: [
        ...(previous[activeConversation.id] || []),
        newMessage,
      ],
    }));

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              unreadCount: 0,
              lastMessage: {
                id: newMessage.id,
                senderId: currentUser.id,
                text: content,
                createdAt: newMessage.createdAt,
                status: "READ",
              },
            }
          : conversation,
      ),
    );

    setDraft("");
    setTypingUsers([]);
  };

  const handleCreateGroup = ({ name, members }) => {
    const newId = `c${conversations.length + 1}`;
    const newConversation = {
      id: newId,
      type: "GROUP",
      title: name,
      avatar: name.slice(0, 2).toUpperCase(),
      color: "from-violet-500 to-indigo-500",
      members: ["u1", ...members],
      status: "online",
      unreadCount: 0,
      lastMessage: {
        id: `m-${Date.now()}`,
        senderId: currentUser.id,
        text: "Group created. Say hello!",
        createdAt: new Date().toISOString(),
        status: "READ",
      },
      description: "New conversation",
    };

    setConversations((previous) => [newConversation, ...previous]);
    setMessagesById((previous) => ({
      ...previous,
      [newId]: [
        {
          id: `m-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: "Group created. Say hello!",
          createdAt: new Date().toISOString(),
          status: "READ",
          readBy: ["u1"],
        },
      ],
    }));
    setSelectedId(newId);
  };

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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
                  aria-label="More actions"
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

              <MessageList
                messages={activeMessages}
                currentUserId={currentUser.id}
                typingUsers={typingUsers}
                conversationType={activeConversation.type}
              />

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
                    className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
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
                members={groupMembers[activeConversation.id] || []}
                conversationName={activeConversation.title}
              />
            ) : (
              <UserProfilePanel
                user={
                  users.find(
                    (user) =>
                      user.id ===
                      activeConversation.members.find(
                        (id) => id !== currentUser.id,
                      ),
                  ) || users[1]
                }
              />
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
