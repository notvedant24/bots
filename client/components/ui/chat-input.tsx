import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onSave?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onSave,
  disabled = false,
  placeholder = "Message Bot AI...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-border bg-card"
    >
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full p-3 border border-border rounded-lg",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "font-open-sans text-sm",
              "h-[44px]",
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-3 font-open-sans"
        >
          Ask
        </Button>
        <Button
          type="button"
          variant="outline"
          className="px-6 py-3 font-open-sans"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
