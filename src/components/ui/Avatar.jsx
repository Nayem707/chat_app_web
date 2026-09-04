export const Avatar = ({ user, size = "md", className = "" }) => {
  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-14 w-14 text-base",
  };

  const avatarUrl = user?.avatar;
  const isRealImage =
    avatarUrl &&
    (avatarUrl.startsWith("/uploads") || avatarUrl.startsWith("http"));

  if (isRealImage) {
    return (
      <img
        src={avatarUrl}
        alt={user?.name || "User"}
        title={user?.name || "User"}
        className={`rounded-full ring ring-white object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  const initials = user?.name?.slice(0, 2).toUpperCase() || "??";
  const gradient = user?.color || "from-violet-500 to-indigo-500";

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-semibold text-white shadow-sm ${sizeClasses[size]} ${className}`}
      aria-label={user?.name || "User avatar"}
      title={user?.name || "User"}
    >
      {initials}
    </div>
  );
};
