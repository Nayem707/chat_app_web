import { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiMail,
  FiAtSign,
  FiEdit2,
  FiCheck,
  FiX,
  FiCamera,
  FiImage,
} from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadCoverMutation,
} from "@/features/users/userApi";

const Stub = ({ name }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
    {name} — coming soon.
  </div>
);

export const ProfileSettingsPage = () => {
  const { data: currentUserData, isLoading } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.data;
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();
  const [uploadCover, { isLoading: isUploadingCover }] =
    useUploadCoverMutation();

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      await uploadAvatar(fd).unwrap();
    } catch {
      /* noop */
    }
    e.target.value = "";
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("cover", file);
    try {
      await uploadCover(fd).unwrap();
    } catch {
      /* noop */
    }
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-400">
        Loading…
      </div>
    );
  }

  const coverBg = currentUser?.coverUrl
    ? `url(${currentUser.coverUrl})`
    : undefined;
  const coverClass = currentUser?.coverUrl
    ? ""
    : `bg-gradient-to-br ${currentUser?.color ?? "from-violet-500 to-indigo-500"}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Cover + Avatar upload card */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        {/* Cover */}
        <div
          className={`relative h-44 w-full ${coverClass}`}
          style={
            coverBg
              ? {
                  backgroundImage: coverBg,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <button
            type="button"
            disabled={isUploadingCover}
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-slate-900 disabled:opacity-50"
          >
            <FiImage className="h-3.5 w-3.5" />
            {isUploadingCover ? "Uploading…" : "Change"}
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>

        {/* Avatar row */}
        <div className="-mt-0 flex items-end justify-between px-5 pb-4">
          <div className="relative">
            <Avatar user={currentUser} size="xl" className="ring-2 " />
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 left-10 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow transition hover:bg-violet-500 disabled:opacity-50"
              title="Change avatar"
            >
              <FiCamera className="h-3 w-3" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      {/* Read-only info */}
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Account info
        </h2>
        {[
          { icon: FiAtSign, label: "Username", value: currentUser?.username },
          { icon: FiMail, label: "Email", value: currentUser?.email },
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
