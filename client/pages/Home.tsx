import React from "react";
import { ChatInput } from "@/components/ui/chat-input";
import { useNavigate } from "react-router-dom";
import { aiService } from "@/services/aiService";

const suggestedPrompts = aiService.getRandomSuggestions(4).map((item) => ({
  title: item.question,
  description: "Get immediate AI generated response",
}));

export default function Home() {
  const navigate = useNavigate();

  const handleSendMessage = (message: string) => {
    // Navigate to chat with the message
    navigate("/chat", { state: { initialMessage: message } });
  };

  const handlePromptClick = (prompt: string) => {
    // Navigate to chat with the selected prompt
    navigate("/chat", { state: { initialMessage: prompt } });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card">
        <h1 className="text-xl font-ubuntu font-medium">Bot AI</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-ubuntu font-medium mb-4">
            How Can I Help You Today?
          </h2>

          {/* AI Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full" />
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mb-8">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt.title)}
              className="p-4 bg-card border border-border rounded-lg text-left hover:bg-accent/10 transition-colors group"
            >
              <h3 className="font-ubuntu font-medium text-sm mb-1 group-hover:text-primary">
                {prompt.title}
              </h3>
              <p className="text-xs text-muted-foreground font-open-sans">
                {prompt.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} placeholder="Message Bot AI..." />
    </div>
  );
}
