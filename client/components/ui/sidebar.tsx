import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Edit, MessageSquare, History } from "lucide-react";
import { conversationStore } from "@/store/conversationStore";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewChat = () => {
    conversationStore.createNewConversation();
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-ubuntu font-medium text-lg">XBot AI</span>
        </div>
      </div>

      {/* New Chat Button */}
      <Link
        to="/"
        onClick={handleNewChat}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg text-sm font-open-sans transition-colors",
          "hover:bg-primary/10 border border-border",
          location.pathname === "/" ? "bg-primary/20 border-primary/30" : "",
        )}
      >
        <Edit className="w-4 h-4" />
        New Chat
      </Link>

      {/* Past Conversations Section */}
      <div className="mt-6">
        <Link
          to="/history"
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-sm font-open-sans transition-colors",
            "hover:bg-primary/10",
            location.pathname === "/history" ? "bg-primary/20" : "",
          )}
        >
          <History className="w-4 h-4" />
          Past Conversations
        </Link>
      </div>
    </div>
  );
}
