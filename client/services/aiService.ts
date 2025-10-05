import { sampleData, QAItem } from "../data/sampleData";

class AIService {
  private data: QAItem[] = sampleData;

  findResponse(userMessage: string): string {
    // Simple matching algorithm - find best match based on keywords
    const normalizedInput = userMessage.toLowerCase().trim();

    // First try exact match
    const exactMatch = this.data.find(
      (item) => item.question.toLowerCase() === normalizedInput,
    );
    if (exactMatch) return exactMatch.response;

    // Then try partial matches based on keywords
    const words = normalizedInput.split(" ").filter((word) => word.length > 2);
    let bestMatch: QAItem | null = null;
    let maxScore = 0;

    for (const item of this.data) {
      const questionWords = item.question.toLowerCase().split(" ");
      let score = 0;

      for (const word of words) {
        if (
          questionWords.some(
            (qWord) => qWord.includes(word) || word.includes(qWord),
          )
        ) {
          score++;
        }
      }

      if (score > maxScore && score > 0) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch) return bestMatch.response;

    // Default response if no match found
    return "Sorry, Did not understand your query!";
  }

  getRandomSuggestions(count: number = 4): QAItem[] {
    // Get some specific suggestions that match the design
    const suggestions = [
      this.data.find((item) => item.question.includes("weather")) ||
        this.data[51],
      this.data.find((item) => item.question.includes("location")) ||
        this.data[52],
      this.data.find((item) => item.question.includes("temperature")) ||
        this.data[53],
      this.data.find((item) => item.question.includes("how are you")) ||
        this.data[50],
    ].filter(Boolean) as QAItem[];

    return suggestions.slice(0, count);
  }

  getAllData(): QAItem[] {
    return this.data;
  }
}

export const aiService = new AIService();
export type { QAItem };
