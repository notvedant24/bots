import { sampleData, QAItem } from "../data/sampleData";

class AIService {
  private data: QAItem[] = sampleData;

  findResponse(userMessage: string): string {
    const normalizedInput = userMessage.toLowerCase().trim();

    // Exact match
    const exactMatch = this.data.find(
      (item) => item.question.toLowerCase() === normalizedInput
    );
    if (exactMatch) return exactMatch.response;

    // Remove filler words
    const stopWords = [
      "what",
      "is",
      "the",
      "a",
      "an",
      "of",
      "in",
      "to",
      "for",
      "and",
      "on",
      "at",
      "by",
      "from",
      "about",
      "with",
      "as",
      "it",
      "this",
      "that",
    ];

    const words = normalizedInput
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.includes(w));

    let bestMatch: QAItem | null = null;
    let maxScore = 0;

    for (const item of this.data) {
      const questionWords = item.question.toLowerCase().split(/\s+/);
      let score = 0;

      for (const word of words) {
        // Count match only for full keyword overlap, not substring
        if (questionWords.includes(word)) {
          score++;
        }
      }

      // Require at least 2 strong matches to count
      if (score > maxScore && score >= 2) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch) return bestMatch.response;

    // ✅ Strict fallback
    return "Sorry, Did not understand your query!";
  }

  getRandomSuggestions(count: number = 4): QAItem[] {
    const suggestions = [
      this.data.find((item) => item.question.includes("weather")) || this.data[0],
      this.data.find((item) => item.question.includes("location")) || this.data[1],
      this.data.find((item) => item.question.includes("temperature")) || this.data[2],
      this.data.find((item) => item.question.includes("how are you")) || this.data[3],
    ].filter(Boolean) as QAItem[];

    return suggestions.slice(0, count);
  }

  getAllData(): QAItem[] {
    return this.data;
  }
}

export const aiService = new AIService();
export type { QAItem };
