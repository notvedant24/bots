import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { conversationStore, Conversation } from "@/store/conversationStore";
import { Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FeedbackSummary() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    setConversations(conversationStore.getAllConversations());
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    if (ratingFilter === null) return true;
    return conv.rating === ratingFilter;
  });

  const conversationsWithFeedback = filteredConversations.filter(
    (conv) =>
      conv.rating !== undefined ||
      conv.subjectiveFeedback ||
      conv.messages.some((msg) => msg.feedback),
  );

  const averageRating =
    conversations.length > 0
      ? conversations
          .filter((c) => c.rating)
          .reduce((sum, c) => sum + (c.rating || 0), 0) /
        conversations.filter((c) => c.rating).length
      : 0;

  const totalFeedbackMessages = conversations.reduce(
    (total, conv) => total + conv.messages.filter((msg) => msg.feedback).length,
    0,
  );

  const positiveFeedback = conversations.reduce(
    (total, conv) =>
      total + conv.messages.filter((msg) => msg.feedback === "positive").length,
    0,
  );

  const negativeFeedback = conversations.reduce(
    (total, conv) =>
      total + conv.messages.filter((msg) => msg.feedback === "negative").length,
    0,
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card">
        <h1 className="text-xl font-ubuntu font-medium">Feedback Summary</h1>
      </header>

      {/* Stats */}
      <div className="p-6 border-b border-border bg-background">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {positiveFeedback}
            </div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {negativeFeedback}
            </div>
            <div className="text-sm text-muted-foreground">Negative</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {conversations.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Chats</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by rating:</span>
          <div className="flex gap-1">
            <Button
              variant={ratingFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setRatingFilter(null)}
            >
              All
            </Button>
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={ratingFilter === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter(rating)}
                className="flex items-center gap-1"
              >
                {rating}
                <Star className="w-3 h-3" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {conversationsWithFeedback.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No feedback data available yet.
            </div>
          ) : (
            conversationsWithFeedback.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-ubuntu font-medium">
                    {conversation.title}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conversation.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {conversation.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            conversation.rating && conversation.rating >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({conversation.rating}/5)
                    </span>
                  </div>
                )}

                {conversation.subjectiveFeedback && (
                  <div className="mb-3">
                    <span className="text-sm font-medium">Feedback:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {conversation.subjectiveFeedback}
                    </p>
                  </div>
                )}

                {/* Message Feedback */}
                {conversation.messages.filter((msg) => msg.feedback).length >
                  0 && (
                  <div>
                    <span className="text-sm font-medium">
                      Message Feedback:
                    </span>
                    <div className="mt-2 space-y-2">
                      {conversation.messages
                        .filter((msg) => msg.feedback)
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className="text-xs bg-muted/50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-2 py-1 rounded text-xs font-medium",
                                  msg.feedback === "positive"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800",
                                )}
                              >
                                {msg.feedback}
                              </span>
                              <span className="text-muted-foreground">
                                {msg.timestamp}
                              </span>
                            </div>
                            {msg.feedbackDetails && (
                              <p className="mt-1 text-muted-foreground">
                                "{msg.feedbackDetails}"
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
