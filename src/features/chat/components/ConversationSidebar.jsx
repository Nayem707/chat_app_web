import { FiFilter, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { Avatar } from "./Avatar";

const formatRelativeTime = (value) => {
  if (!value) return "now";
  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d`;
};

export const ConversationSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onOpenCreateGroup,
  currentUser,
}) => {
  return (
    <aside className="w-full shrink-0 border-slate-800 bg-slate-950/80 lg:max-w-[380px] lg:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar user={currentUser} size="md" />
              <div>
                <div className="text-sm font-semibold text-white">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  online
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCreateGroup}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-violet-500 hover:text-violet-200"
              aria-label="Create new group"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2.5">
            <FiSearch className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            {["all", "direct", "group"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onFilterChange(option)}
                className={`flex-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
                  filter === option
                    ? "bg-violet-600 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {option === "all"
                  ? "All"
                  : option === "direct"
                    ? "Direct"
                    : "Groups"}
              </button>
            ))}
          </div>
        </div>

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

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-5 text-center text-sm text-slate-400">
              No conversations match your search.
            </div>
          ) : (
            conversations.map((conversation) => {
              const unread = conversation.unreadCount > 0;
              const isSelected = selectedConversationId === conversation.id;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    isSelected
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
                      {unread && (
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
    </aside>
  );
};
