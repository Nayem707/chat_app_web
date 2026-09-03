import { Outlet } from "react-router-dom";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";

export const ChatLayout = () => (
  <main className="h-screen overflow-hidden bg-slate-950 px-4 py-4 text-slate-100 sm:px-5 lg:px-6">
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1600px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/70 backdrop-blur-md">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <ChatSidebar />
        <Outlet />
      </div>
    </div>
  </main>
);
