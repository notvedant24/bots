import { sampleData, QAItem } from "../data/sampleData";

class AIService {
  private data: QAItem[] = sampleData;

  findResponse(userMessage: string): string {
    const normalizedInput = userMessage.toLowerCase().trim();

    // Try exact match first
    const exactMatch = this.data.find(
      (item) => item.question.toLowerCase() === normalizedInput
    );
    if (exactMatch) return exactMatch.response;

    // Remove common filler words
    const stopWords = ["what", "is", "the", "a", "an", "of", "in", "to", "for", "and"];
    const words = normalizedInput
      .split(" ")
      .filter((word) => word.length > 2 && !stopWords.includes(word));

    let bestMatch: QAItem | null = null;
    let maxScore = 0;

    // Find partial matches with stricter conditions
    for (const item of this.data) {
      const questionWords = item.question.toLowerCase().split(" ");
      let score = 0;

      for (const word of words) {
        if (
          questionWords.some(
            (qWord) => qWord.includes(word) || word.includes(qWord)
          )
        ) {
          score++;
        }
      }

      // Require at least 2 keyword matches to count as a valid response
      if (score > maxScore && score >= 2) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch) return bestMatch.response;

    // Default fallback message
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
