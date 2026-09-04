import { useRef, useState, useCallback } from "react";
import {
  FiSmile,
  FiImage,
  FiPaperclip,
  FiX,
  FiSend,
  FiFile,
} from "react-icons/fi";
import { socketService } from "@/services/socketService";
import {
  useSendMessageMutation,
  useSendMessageWithAttachmentMutation,
} from "@/features/chat/chatApi";

// ── Emoji data ───────────────────────────────────────────────────────────────
const EMOJI_CATEGORIES = [
  {
    label: "😀",
    title: "Smileys",
    emojis:
      "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😍 😘 😋 😛 😝 😜 🤩 😏 😒 😞 😔 😟 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤯 😳 🥵 🥶 😱 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😐 😑 😬 🙄 😯 😮 🥱 😴 😵 🤧 😷".split(
        " ",
      ),
  },
  {
    label: "👋",
    title: "Gestures",
    emojis:
      "👋 🤚 ✋ 🖖 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 🙏 🤝 🤲 💪".split(
        " ",
      ),
  },
  {
    label: "❤️",
    title: "Hearts",
    emojis:
      "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 💕 💞 💓 💗 💖 💘 💝 💯 ✨ 🔥 🎉 🎊 🎈 🌟 ⭐ 🌈 🌺 🌸 🍀".split(
        " ",
      ),
  },
  {
    label: "🍕",
    title: "Food",
    emojis:
      "🍕 🍔 🍟 🌮 🌯 🍜 🍝 🍣 🍱 🍦 🍰 🎂 🍩 🍪 🍫 🍬 🍭 🥤 ☕ 🍺 🥂 🍷 🍸 🍹".split(
        " ",
      ),
  },
];

// Max file sizes
const MAX_IMAGE = 5 * 1024 * 1024; // 5 MB
const MAX_FILE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
]);

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};

export const MessageComposer = ({
  conversationId,
  currentUser,
  typingTimeoutRef,
}) => {
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState(null); // { file, preview?, error? }
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiTab, setEmojiTab] = useState(0);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [sendWithAttachment, { isLoading: isUploading }] =
    useSendMessageWithAttachmentMutation();

  const isBusy = isSending || isUploading;

  // ── Attachment selection ─────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAttachment({ file, error: "Only image files are supported." });
      return;
    }
    if (file.size > MAX_IMAGE) {
      setAttachment({ file, error: "Image must be under 5 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAttachment({ file, preview: ev.target.result });
    reader.readAsDataURL(file);
    setShowEmoji(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setAttachment({ file, error: "Use the image button for images." });
      return;
    }
    if (!ALLOWED_MIME.has(file.type)) {
      setAttachment({ file, error: "Unsupported file type." });
      return;
    }
    if (file.size > MAX_FILE) {
      setAttachment({ file, error: "File must be under 10 MB." });
      return;
    }
    setAttachment({ file });
    setShowEmoji(false);
  };

  // ── Emoji insert ─────────────────────────────────────────────────────────
  const insertEmoji = useCallback(
    (emoji) => {
      const el = textareaRef.current;
      if (!el) {
        setDraft((d) => d + emoji);
        return;
      }
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = draft.slice(0, start) + emoji + draft.slice(end);
      setDraft(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + emoji.length, start + emoji.length);
      });
    },
    [draft],
  );

  // ── Typing events ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setDraft(e.target.value);
    socketService.emit("typing_start", { conversationId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => socketService.emit("typing_stop", { conversationId }),
      2000,
    );
  };

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const content = draft.trim();
    if ((!content && !attachment?.file) || isBusy) return;
    if (attachment?.error) return;

    setDraft("");
    setAttachment(null);
    setShowEmoji(false);
    socketService.emit("typing_stop", { conversationId });

    try {
      if (attachment?.file) {
        const fd = new FormData();
        fd.append("file", attachment.file);
        if (content) fd.append("content", content);
        await sendWithAttachment({ conversationId, formData: fd }).unwrap();
      } else {
        await sendMessage({
          conversationId,
          content,
          optimisticMessage: {
            id: `temp_${Date.now()}`,
            conversationId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar || "",
            text: content,
            content,
            status: "SENT",
            createdAt: new Date().toISOString(),
          },
        }).unwrap();
      }
    } catch (err) {
      if (!attachment) setDraft(content);
      console.error("Failed to send message", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="border-t border-slate-800 bg-slate-950/80 p-3 sm:p-4">
      {/* Attachment preview */}
      {attachment && (
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
          {attachment.preview ? (
            <img
              src={attachment.preview}
              alt="preview"
              className="h-14 w-14 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-800">
              <FiFile className="h-6 w-6 text-violet-300" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {attachment.file.name}
            </p>
            {attachment.error ? (
              <p className="text-xs text-rose-400">{attachment.error}</p>
            ) : (
              <p className="text-xs text-slate-400">
                {formatBytes(attachment.file.size)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="shrink-0 text-slate-500 hover:text-slate-200"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Emoji picker popover */}
      {showEmoji && (
        <div className="mb-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
          {/* Category tabs */}
          <div className="flex border-b border-slate-800">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.title}
                type="button"
                onClick={() => setEmojiTab(i)}
                title={cat.title}
                className={`flex-1 py-2 text-base transition ${
                  emojiTab === i
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Emoji grid */}
          <div className="flex max-h-40 flex-wrap gap-0.5 overflow-y-auto p-2">
            {EMOJI_CATEGORIES[emojiTab].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="rounded-lg p-1.5 text-lg leading-none transition hover:bg-slate-700"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 rounded-[22px] border border-slate-700 bg-slate-900 p-2 shadow-lg shadow-slate-950/30 sm:gap-3 sm:p-3">
        {/* Emoji */}
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
            showEmoji
              ? "border-violet-500/60 bg-violet-500/10 text-violet-300"
              : "border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-100"
          }`}
          aria-label="Emoji"
        >
          <FiSmile className="h-4 w-4" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => {
            setShowEmoji(false);
            imageInputRef.current?.click();
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:text-slate-100"
          aria-label="Attach image"
        >
          <FiImage className="h-4 w-4" />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* File */}
        <button
          type="button"
          onClick={() => {
            setShowEmoji(false);
            fileInputRef.current?.click();
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:text-slate-100"
          aria-label="Attach file"
        >
          <FiPaperclip className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your message…"
          className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />

        {/* Send */}
        <button
          type="button"
          onClick={handleSend}
          disabled={
            isBusy ||
            (!draft.trim() && !attachment?.file) ||
            !!attachment?.error
          }
          className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {isUploading ? (
            <span className="text-xs">Uploading…</span>
          ) : (
            <>
              <FiSend className="h-3.5 w-3.5" />
              Send
            </>
          )}
        </button>
      </div>
    </div>
  );
};
