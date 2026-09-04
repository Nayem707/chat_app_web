import { useMemo, useEffect, useRef } from "react";
import { FiCheck, FiClock } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";

const formatMessageTime = (value) =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const getStatusIcon = (status) => {
  if (status === "READ")
    return <FiCheck className="h-3.5 w-3.5 text-violet-300" />;
  if (status === "DELIVERED")
    return <FiCheck className="h-3.5 w-3.5 text-slate-300" />;
  return <FiClock className="h-3.5 w-3.5 text-slate-400" />;
};

export const MessageList = ({
  messages = [],
  currentUserId,
  typingUsers = [],
  conversationType = "DIRECT",
}) => {
  const bottomRef = useRef(null);
  const visibleTyping = useMemo(
    () => typingUsers.filter((userId) => userId !== currentUserId),
    [currentUserId, typingUsers],
  );

  // Scroll to the latest message whenever the list changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, visibleTyping.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_28%)] px-3 py-4 sm:px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {messages.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/55 p-8 text-center text-sm text-slate-400">
            {conversationType === "GROUP"
              ? "This room is empty. Say hello and start the conversation."
              : "No messages yet. Send the first message to start the chat."}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              const sender = isCurrentUser
                ? null
                : {
                    name: message.senderName || "User",
                    color: "from-violet-500 to-indigo-500",
                    avatar: message.senderAvatar || "",
                  };

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  {!isCurrentUser && (
                    <Avatar user={sender} size="sm" className="mb-1" />
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}
                  >
                    {!isCurrentUser && (
                      <div className="mb-1 pl-1 text-[11px] font-medium text-slate-400">
                        {message.senderName}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 shadow-lg shadow-slate-950/10 ${
                        isCurrentUser
                          ? "bg-violet-600 text-white"
                          : "border border-slate-700 bg-slate-900/90 text-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.text}
                      </p>
                    </div>
                    <div
                      className={`mt-1 flex items-center gap-1 text-[10px] ${isCurrentUser ? "justify-end text-violet-300" : "text-slate-400"}`}
                    >
                      <span>{formatMessageTime(message.createdAt)}</span>
                      {isCurrentUser && (
                        <span className="inline-flex items-center">
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {visibleTyping.length > 0 && (
              <div className="flex items-center gap-2 pl-2 text-xs text-slate-400">
                <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-1.5">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-violet-300 [animation-delay:0ms]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-violet-300 [animation-delay:120ms]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-violet-300 [animation-delay:240ms]" />
                </div>
                <span>
                  {visibleTyping.length === 1
                    ? "Typing..."
                    : "Several people are typing..."}
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};
