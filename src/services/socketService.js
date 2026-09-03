import { io } from "socket.io-client";
import { SOCKET_URL } from "@/constants/app.constants";

let socket = null;

export const socketService = {
  connect(token) {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  get() {
    return socket;
  },

  emit(event, data) {
    socket?.emit(event, data);
  },
};
