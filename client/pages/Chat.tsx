import React from "react";

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
  showActions,
  onFeedback,
}: ChatMessageProps) {
  return (
    <div
      className={`flex items-start gap-2 my-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-lg px-3 py-2 max-w-[70%] ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {/* ✅ Always wrap text in <p> so Cypress finds it */}
        <p className="whitespace-pre-line">{message}</p>

        {/* timestamp */}
        <span className="block text-xs text-gray-500 mt-1">{timestamp}</span>

        {/* feedback buttons (only for bot messages) */}
        {showActions && (
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              className="text-green-600 hover:underline text-sm"
              onClick={() => onFeedback?.("positive")}
            >
              👍
            </button>
            <button
              type="button"
              className="text-red-600 hover:underline text-sm"
              onClick={() => onFeedback?.("negative")}
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
