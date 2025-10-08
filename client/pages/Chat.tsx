import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { RatingDialog } from "@/components/ui/rating-dialog";
import { aiService } from "@/services/aiService";
import { conversationStore, Message } from "@/store/conversationStore";

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    // Load or create conversation
    let currentConversation = conversationStore.getCurrentConversation();
    if (!currentConversation) {
      currentConversation = conversationStore.createNewConversation();
    }

    setMessages(currentConversation.messages);

    // Handle initial message from navigation
    const initialMessage = location.state?.initialMessage;
    if (initialMessage && currentConversation.messages.length === 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        message: initialMessage,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      conversationStore.addMessage(userMessage);
      setMessages([userMessage]);

      // Generate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          message:
            aiService.findResponse(initialMessage) ||
            "Sorry, Did not understand your query!",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        conversationStore.addMessage(aiResponse);
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  }, [location.state]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    conversationStore.addMessage(newMessage);
    setMessages((prev) => [...prev, newMessage]);

    // Generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        message:
          aiService.findResponse(message) ||
          "Sorry, Did not understand your query!",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      conversationStore.addMessage(aiResponse);
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    if (feedback === "negative") {
      setSelectedMessageId(messageId);
      setFeedbackDialogOpen(true);
    } else {
      conversationStore.updateMessageFeedback(messageId, feedback);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)),
      );
    }
  };

  const handleSaveConversation = () => {
    setRatingDialogOpen(true);
  };

  const handleFeedbackSubmit = (feedback: string) => {
    if (selectedMessageId) {
      const current = conversationStore.getCurrentConversation();
      if (current) {
        const message = current.messages.find((m) => m.id === selectedMessageId);
        if (message) {
          message.feedback = "negative";
          message.feedbackDetails = feedback;
          conversationStore.saveConversation(current);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === selectedMessageId
                ? {
                    ...msg,
                    feedback: "negative" as const,
                    feedbackDetails: feedback,
                  }
                : msg,
            ),
          );
        }
      }
      setSelectedMessageId(null);
    }
  };

  const handleRatingSubmit = (rating: number, subjectiveFeedback?: string) => {
    conversationStore.endConversation(rating, subjectiveFeedback);
    alert(`Thank you for your feedback! Rating: ${rating}/5`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card">
        <h1 className="text-xl font-ubuntu font-medium">Bot AI</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              showActions={!msg.isUser}
              onFeedback={(feedback) => handleFeedback(msg.id, feedback)}
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} onSave={handleSaveConversation} />

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        onSubmit={handleFeedbackSubmit}
      />

      {/* Rating Dialog */}
      <RatingDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        onSubmitRating={handleRatingSubmit}
      />
    </div>
  );
}
