import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectAccessToken } from "@/features/auth/authSelectors";
import { socketService } from "@/services/socketService";
import { apiSlice } from "@/services/apiSlice";
import { setUserTyping } from "@/features/chat/chatSlice";

export const SocketProvider = ({ children }) => {
  const token = useSelector(selectAccessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      socketService.disconnect();
      return;
    }

    const socket = socketService.connect(token);

    const onNewMessage = () => {
      dispatch(apiSlice.util.invalidateTags(["Message", "Conversation"]));
    };

    const onTyping = ({ conversationId, userId, state: typingState }) => {
      dispatch(
        setUserTyping({
          conversationId,
          userId,
          isTyping: typingState === "start",
        }),
      );
    };

    const onAuthError = () => {
      socketService.disconnect();
    };

    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);
    socket.on("auth_error", onAuthError);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("typing", onTyping);
      socket.off("auth_error", onAuthError);
    };
  }, [token, dispatch]);

  return children;
};
