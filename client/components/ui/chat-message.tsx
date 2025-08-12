import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  showActions?: boolean;
  onFeedback?: (feedback: "positive" | "negative") => void;
}

export function ChatMessage({
  message,
  isUser,
  timestamp,
  showActions = false,
  onFeedback,
}: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col relative",
          isUser ? "items-end" : "items-start",
        )}
        onMouseEnter={() => !isUser && setIsHovered(true)}
        onMouseLeave={() => !isUser && setIsHovered(false)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium font-ubuntu">
            {isUser ? "You" : <span>Soul AI</span>}
          </span>
          <span className="text-xs text-muted-foreground font-open-sans">
            {timestamp}
          </span>
        </div>

        <div
          className={cn(
            "max-w-md p-3 rounded-lg font-open-sans text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border",
          )}
        >
          {isUser ? message : <p>{message}</p>}
        </div>

        {!isUser && isHovered && (
          <div className="flex items-center gap-2 mt-2 absolute -right-16 top-8 bg-background border border-border rounded-lg p-1 shadow-lg">
            <button
              onClick={() => onFeedback?.("positive")}
              className="p-1 hover:bg-primary/10 rounded transition-colors"
            >
              <ThumbsUp className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </button>
            <button
              onClick={() => onFeedback?.("negative")}
              className="p-1 hover:bg-primary/10 rounded transition-colors"
            >
              <ThumbsDown className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <div className="w-6 h-6 bg-foreground rounded-full text-background flex items-center justify-center text-xs font-medium">
            Y
          </div>
        </div>
      )}
    </div>
  );
}
