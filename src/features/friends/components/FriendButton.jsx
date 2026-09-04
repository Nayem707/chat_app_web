import { useState } from "react";
import { FiUserPlus, FiUserCheck, FiUserX, FiClock, FiX } from "react-icons/fi";
import {
  useGetFriendStatusQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useCancelFriendRequestMutation,
} from "@/features/friends/friendApi";

/**
 * Renders the correct action button(s) based on the live friendship status.
 */
export const FriendButton = ({ userId }) => {
  const { data: statusData, isLoading } = useGetFriendStatusQuery(userId);
  const status = statusData?.data;

  const [sendRequest, { isLoading: isSending }] =
    useSendFriendRequestMutation();
  const [accept, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();
  const [reject, { isLoading: isRejecting }] = useRejectFriendRequestMutation();
  const [cancel, { isLoading: isCancelling }] =
    useCancelFriendRequestMutation();

  if (isLoading) return <span className="text-xs text-slate-500">…</span>;

  const requestId = status?.requestId;
  const friendStatus = status?.status ?? "NONE";

  if (friendStatus === "ACCEPTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400">
        <FiUserCheck className="h-3.5 w-3.5" />
        Friends
      </span>
    );
  }

  if (friendStatus === "PENDING" && status?.isRequester) {
    return (
      <button
        type="button"
        disabled={isCancelling}
        onClick={() => cancel({ requestId })}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-rose-500/60 hover:text-rose-400 disabled:opacity-50"
      >
        <FiClock className="h-3.5 w-3.5" />
        {isCancelling ? "Cancelling…" : "Request Sent"}
      </button>
    );
  }

  if (friendStatus === "PENDING" && !status?.isRequester) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isAccepting}
          onClick={() => accept({ requestId })}
          className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          <FiUserCheck className="h-3.5 w-3.5" />
          {isAccepting ? "…" : "Accept"}
        </button>
        <button
          type="button"
          disabled={isRejecting}
          onClick={() => reject({ requestId })}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-rose-500/60 hover:text-rose-400 disabled:opacity-50"
        >
          <FiX className="h-3.5 w-3.5" />
          {isRejecting ? "…" : "Reject"}
        </button>
      </div>
    );
  }

  // NONE, REJECTED, or CANCELLED
  return (
    <button
      type="button"
      disabled={isSending}
      onClick={() => sendRequest({ recipientId: userId })}
      className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
    >
      <FiUserPlus className="h-3.5 w-3.5" />
      {isSending ? "Sending…" : "Add Friend"}
    </button>
  );
};
