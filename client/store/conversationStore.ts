export interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  feedback?: "positive" | "negative" | null;
  feedbackDetails?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  rating?: number;
  subjectiveFeedback?: string;
}

class ConversationStore {
  private storageKey = "xbot-conversations";
  private currentConversationKey = "xbot-current-conversation";

  getCurrentConversation(): Conversation | null {
    const stored = localStorage.getItem(this.currentConversationKey);
    return stored ? JSON.parse(stored) : null;
  }

  setCurrentConversation(conversation: Conversation | null): void {
    if (conversation) {
      localStorage.setItem(
        this.currentConversationKey,
        JSON.stringify(conversation),
      );
    } else {
      localStorage.removeItem(this.currentConversationKey);
    }
  }

  saveConversation(conversation: Conversation): void {
    const conversations = this.getAllConversations();
    const existingIndex = conversations.findIndex(
      (c) => c.id === conversation.id,
    );

    if (existingIndex >= 0) {
      conversations[existingIndex] = conversation;
    } else {
      conversations.push(conversation);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(conversations));
    this.setCurrentConversation(conversation);
  }

  getAllConversations(): Conversation[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  createNewConversation(): Conversation {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date().toISOString(),
    };

    this.setCurrentConversation(newConversation);
    return newConversation;
  }

  addMessage(message: Message): void {
    const current = this.getCurrentConversation();
    if (current) {
      current.messages.push(message);
      this.saveConversation(current);
    }
  }

  updateMessageFeedback(
    messageId: string,
    feedback: "positive" | "negative",
  ): void {
    const current = this.getCurrentConversation();
    if (current) {
      const message = current.messages.find((m) => m.id === messageId);
      if (message) {
        message.feedback = feedback;
        this.saveConversation(current);
      }
    }
  }

  endConversation(rating?: number, subjectiveFeedback?: string): void {
    const current = this.getCurrentConversation();
    if (current) {
      current.rating = rating;
      current.subjectiveFeedback = subjectiveFeedback;
      this.saveConversation(current);
      this.setCurrentConversation(null);
    }
  }
}

export const conversationStore = new ConversationStore();
