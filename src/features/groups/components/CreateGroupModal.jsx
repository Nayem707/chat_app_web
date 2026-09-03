import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

import { Avatar } from "@/components/ui/Avatar";

export const CreateGroupModal = ({ isOpen, onClose, users = [], onCreate }) => {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");

  const filteredUsers = useMemo(
    () => users.filter((u) => u.id !== "u1"),
    [users],
  );

  const toggleUser = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Choose a group name to create a new room.");
      return;
    }
    if (selectedIds.length < 2) {
      setError("Add at least two teammates to the group.");
      return;
    }
    onCreate({ name: name.trim(), members: selectedIds });
    setName("");
    setSelectedIds([]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/60 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-violet-300 uppercase">
              New room
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Create group
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:text-slate-100"
            aria-label="Close create group modal"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="group-name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Group name
            </label>
            <input
              id="group-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              placeholder="Design review"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
              <span className="font-medium">Invite teammates</span>
              <span className="text-slate-400">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleUser(user.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                    selectedIds.includes(user.id)
                      ? "border-violet-500/60 bg-violet-500/10"
                      : "border-slate-700 bg-slate-950/60 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                      selectedIds.includes(user.id)
                        ? "border-violet-400 bg-violet-500 text-white"
                        : "border-slate-600 bg-slate-900 text-slate-500"
                    }`}
                  >
                    {selectedIds.includes(user.id) ? "✓" : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="flex-1 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Create group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
