import { useMemo, useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiClock,
  FiFile,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import {
  useEditMessageMutation,
  useDeleteMessageMutation,
} from "@/features/chat/chatApi";

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

const MessageAttachment = ({ message, isCurrentUser }) => {
  if (!message.attachmentUrl) return null;
  if (message.type === "IMAGE") {
    return (
      <img
        src={message.attachmentUrl}
        alt={message.attachmentName || "image"}
        className="mt-1.5 max-h-60 max-w-xs rounded-xl object-cover"
      />
    );
  }
  return (
    <a
      href={message.attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-1.5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition ${
        isCurrentUser
          ? "bg-violet-700/60 hover:bg-violet-700"
          : "bg-slate-800 hover:bg-slate-700"
      }`}
    >
      <FiFile className="h-4 w-4 shrink-0" />
      <span className="truncate">{message.attachmentName || "file"}</span>
      <FiDownload className="h-3.5 w-3.5 shrink-0 opacity-70" />
    </a>
  );
};

const MessageItem = ({ message, currentUserId, conversationId }) => {
  const isCurrentUser = message.senderId === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);

  const [editMessage, { isLoading: isSaving }] = useEditMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  // Close popover on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const sender = isCurrentUser
    ? null
    : {
        name: message.senderName || "User",
        color: "from-violet-500 to-indigo-500",
        avatar: message.senderAvatar || "",
      };

  const handleSaveEdit = async () => {
    if (!editText.trim() || isSaving) return;
    try {
      await editMessage({
        conversationId,
        messageId: message.id,
        content: editText.trim(),
      }).unwrap();
      setIsEditing(false);
    } catch {
      /* noop */
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      await deleteMessage({ conversationId, messageId: message.id }).unwrap();
      setShowDeleteModal(false);
    } catch {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div
        className={`group relative flex items-start gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        {!isCurrentUser && (
          <Avatar user={sender} size="sm" className="mt-1 shrink-0" />
        )}

        <div
          className={`max-w-[80%] sm:max-w-[70%] ${isCurrentUser ? "flex flex-col items-end" : "flex flex-col items-start"}`}
        >
          {!isCurrentUser && (
            <div className="mb-1 pl-1 text-[11px] font-medium text-slate-400">
              {message.senderName}
            </div>
          )}

          {/* Bubble row: three-dot + bubble (or edit textarea) */}
          <div
            className={`flex items-end gap-1.5 ${isCurrentUser ? "flex-row" : "flex-row-reverse"}`}
          >
            {/* Three-dot menu — only for sender, only when not editing */}
            {isCurrentUser && !isEditing && (
              <div ref={menuRef} className="relative mb-1">
                <button
                  type="button"
                  onClick={() => setShowMenu((v) => !v)}
                  className="flex h-6 w-6 items-center justify-center bg-amber-50/10 rounded-full text-slate-500 opacity-0 transition hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
                  aria-label="Message actions"
                >
                  <FiMoreHorizontal className="h-3.5 w-3.5" />
                </button>
                {showMenu && (
                  <div className="absolute bottom-8 right-0 z-20 w-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/60">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setEditText(message.text || "");
                        setIsEditing(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      <FiEdit2 className="h-3.5 w-3.5 text-slate-400" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-rose-400 transition hover:bg-rose-500/10"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bubble or edit textarea */}
            {isEditing ? (
              <div className="w-64 space-y-1.5 sm:w-80">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-violet-500 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveEdit();
                    }
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                />
                <div className="flex justify-end gap-3 pr-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 transition hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!editText.trim() || isSaving}
                    onClick={handleSaveEdit}
                    className="font-medium text-violet-400 transition hover:text-violet-300 disabled:opacity-50"
                  >
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-2xl px-3.5 py-2.5 shadow-lg shadow-slate-950/10 ${
                  isCurrentUser
                    ? "bg-violet-600 text-white"
                    : "border border-slate-700 bg-slate-900/90 text-slate-100"
                }`}
              >
                {message.text && (
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {message.text}
                  </p>
                )}
                <MessageAttachment
                  message={message}
                  isCurrentUser={isCurrentUser}
                />
              </div>
            )}
          </div>

          {/* Meta row */}
          {!isEditing && (
            <div
              className={`mt-1 flex items-center gap-1 text-[10px] ${isCurrentUser ? "text-violet-300" : "text-slate-400"}`}
            >
              {message.editedAt && <span className="opacity-60">(edited)</span>}
              <span>{formatMessageTime(message.createdAt)}</span>
              {isCurrentUser && (
                <span className="inline-flex items-center">
                  {getStatusIcon(message.status)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-white">
              Delete message?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                currentUserId={currentUserId}
                conversationId={message.conversationId}
              />
            ))}
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
