import React, { useState, useEffect } from "react";
import { ChatInput } from "@/components/ui/chat-input";
import { useNavigate } from "react-router-dom";
import { conversationStore, Conversation } from "@/store/conversationStore";

export default function History() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    setConversations(conversationStore.getAllConversations());
  }, []);

  const handleSendMessage = (message: string) => {
    navigate("/chat", { state: { initialMessage: message } });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card">
        <h1 className="text-xl font-ubuntu font-medium text-center">
          Conversation History
        </h1>
      </header>

      {/* History Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-ubuntu font-medium mb-6">
            Today's Chats
          </h2>

          <div className="space-y-4">
            {conversations.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No conversations yet. Start a new chat to see your history here.
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-secondary/30 rounded-lg p-4 border border-border"
                >
                  <h3 className="font-ubuntu font-medium mb-4">
                    {conversation.title}
                  </h3>
                  {conversation.messages.slice(0, 4).map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${index < 3 ? "mb-4" : ""}`}
                    >
                      {message.isUser ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <div className="w-6 h-6 bg-foreground rounded-full text-background flex items-center justify-center text-xs font-medium">
                              Y
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium font-ubuntu">
                                You
                              </span>
                              <span className="text-xs text-muted-foreground font-open-sans">
                                {message.timestamp}
                              </span>
                            </div>
                            <div className="text-sm font-open-sans">
                              {message.message}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium font-ubuntu">
                                <span>Soul AI</span>
                              </span>
                              <span className="text-xs text-muted-foreground font-open-sans">
                                {message.timestamp}
                              </span>
                            </div>
                            <div className="text-sm font-open-sans mb-2">
                              <p>{message.message}</p>
                            </div>
                            {message.feedback && (
                              <div className="text-xs text-muted-foreground font-open-sans">
                                <span className="font-medium">Feedback:</span>{" "}
                                {message.feedback === "positive"
                                  ? "Positive"
                                  : "Negative"}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {conversation.messages.length > 4 && (
                    <div className="text-xs text-muted-foreground text-center mt-2">
                      ... and {conversation.messages.length - 4} more messages
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
