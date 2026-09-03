const Stub = ({ name }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
    {name} — coming soon.
  </div>
);

export const SettingsPage = () => <Stub name="Settings" />;
export const ProfileSettingsPage = () => <Stub name="Profile settings" />;
export const AccountSettingsPage = () => <Stub name="Account settings" />;
export const PrivacySettingsPage = () => <Stub name="Privacy settings" />;
export const NotificationSettingsPage = () => (
  <Stub name="Notification settings" />
);
export const SecuritySettingsPage = () => <Stub name="Security settings" />;
export const AppearanceSettingsPage = () => <Stub name="Appearance settings" />;
