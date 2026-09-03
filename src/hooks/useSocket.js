import { socketService } from "@/services/socketService";

export const useSocket = () => socketService.get();
