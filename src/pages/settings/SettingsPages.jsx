import { useState, useEffect } from "react";
import { FiUser, FiMail, FiAtSign, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
import { useUpdateProfileMutation } from "@/features/users/userApi";

const Stub = ({ name }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
    {name} — coming soon.
  </div>
);

export const ProfileSettingsPage = () => {
  const { data: currentUserData, isLoading } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setBio(currentUser.bio || "");
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save changes. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Avatar + identity */}
      <div className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <Avatar user={currentUser} size="xl" />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-white">
            {currentUser?.name}
          </p>
          <p className="truncate text-sm text-slate-400">{currentUser?.email}</p>
          <span
            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              currentUser?.status === "online"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-slate-700/60 text-slate-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                currentUser?.status === "online" ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            {currentUser?.status === "online" ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Editable form */}
      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Edit profile
        </h2>

        {/* Display name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <FiUser className="h-3.5 w-3.5" /> Display name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            placeholder="Your name"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <FiEdit2 className="h-3.5 w-3.5" /> Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            placeholder="Tell something about yourself…"
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400">
            <FiX className="h-3.5 w-3.5" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          {saved ? (
            <>
              <FiCheck className="h-4 w-4" /> Saved
            </>
          ) : isSaving ? (
            "Saving…"
          ) : (
            "Save changes"
          )}
        </button>
      </form>

      {/* Read-only info */}
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Account info
        </h2>
        {[
          { icon: FiMail, label: "Email", value: currentUser?.email },
          { icon: FiAtSign, label: "Username", value: currentUser?.username },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">{label}</p>
              <p className="text-sm text-slate-200">{value || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SettingsPage = () => <Stub name="Settings" />;
export const AccountSettingsPage = () => <Stub name="Account settings" />;
export const PrivacySettingsPage = () => <Stub name="Privacy settings" />;
export const NotificationSettingsPage = () => (
  <Stub name="Notification settings" />
);
export const SecuritySettingsPage = () => <Stub name="Security settings" />;
export const AppearanceSettingsPage = () => <Stub name="Appearance settings" />;
