/**
 * Spell Checker
 * General purpose spell checking with common word dictionary
 */

export class SpellChecker {
  private dictionary: Set<string>;
  private customWords: Set<string>;

  constructor() {
    this.dictionary = this.loadDictionary();
    this.customWords = new Set();
  }

  /**
   * Check if word is spelled correctly
   */
  isCorrect(word: string): boolean {
    const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
    if (normalized.length === 0) return true;
    
    return this.dictionary.has(normalized) || 
           this.customWords.has(normalized);
  }

  /**
   * Get spelling suggestions for a word
   */
  getSuggestions(word: string, maxSuggestions: number = 5): string[] {
    const normalized = word.toLowerCase();
    const suggestions: Array<{ word: string; distance: number }> = [];

    for (const dictWord of this.dictionary) {
      const distance = this.levenshteinDistance(normalized, dictWord);
      if (distance <= 2) {
        suggestions.push({ word: dictWord, distance });
      }
    }

    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxSuggestions)
      .map(s => s.word);
  }

  /**
   * Add custom word to dictionary
   */
  addWord(word: string): void {
    this.customWords.add(word.toLowerCase());
  }

  /**
   * Check text and return misspelled words
   */
  checkText(text: string): Array<{ word: string; position: number; suggestions: string[] }> {
    const words = text.match(/\b[a-zA-Z]+\b/g) || [];
    const errors: Array<{ word: string; position: number; suggestions: string[] }> = [];
    
    let position = 0;
    for (const word of words) {
      const idx = text.indexOf(word, position);
      if (!this.isCorrect(word)) {
        errors.push({
          word,
          position: idx,
          suggestions: this.getSuggestions(word),
        });
      }
      position = idx + word.length;
    }

    return errors;
  }

  /**
   * Levenshtein distance calculation
   */
  private levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Load basic English dictionary
   */
  private loadDictionary(): Set<string> {
    // Common English words - expandable
    const words = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
      'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
      'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
      'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
      'patient', 'doctor', 'medicine', 'health', 'hospital', 'treatment', 'diagnosis',
      'symptoms', 'prescription', 'medication', 'dose', 'daily', 'twice', 'morning',
      'evening', 'before', 'after', 'meals', 'water', 'tablets', 'capsules', 'mg', 'ml',
    ];
    
    return new Set(words);
  }
}
