import { sampleData } from "../data/sampleData";
import type { QAItem } from "../data/sampleData";

class AIService {
  private data: QAItem[] = sampleData;

  findResponse(userMessage: string): string {
    const normalizedInput = userMessage.toLowerCase().trim();

    // 1️⃣ Exact match first
    const exactMatch = this.data.find(
      (item) => item.question.toLowerCase() === normalizedInput
    );
    if (exactMatch) return exactMatch.response;

    // 2️⃣ Partial match: only exact word matches count
    const words = normalizedInput.split(" ").filter((w) => w.length > 2);
    let bestMatch: QAItem | null = null;
    let maxScore = 0;

    for (const item of this.data) {
      const questionWords = item.question.toLowerCase().split(" ");
      let score = 0;

      for (const word of words) {
        if (questionWords.includes(word)) {
          score++;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    // Only accept partial match if at least 2 exact words match
    if (bestMatch && maxScore >= 2) return bestMatch.response;

    // 3️⃣ Default response for completely unknown questions
    return "Sorry, Did not understand your query!";
  }

  getRandomSuggestions(count: number = 4): QAItem[] {
    const suggestions = [
      this.data.find((item) => item.question.includes("weather")) || this.data[51],
      this.data.find((item) => item.question.includes("location")) || this.data[52],
      this.data.find((item) => item.question.includes("temperature")) || this.data[53],
      this.data.find((item) => item.question.includes("how are you")) || this.data[50],
    ].filter(Boolean) as QAItem[];

    return suggestions.slice(0, count);
  }

  getAllData(): QAItem[] {
    return this.data;
  }
}

export const aiService = new AIService();
export type { QAItem };
