import { Outlet } from "react-router-dom";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";

export const ChatLayout = () => (
  <main className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100 sm:px-5 lg:px-6">
    <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/70 backdrop-blur-md">
      <div className="flex min-h-[calc(100vh-2rem)] flex-col lg:flex-row">
        <ChatSidebar />
        <Outlet />
      </div>
    </div>
  </main>
);
