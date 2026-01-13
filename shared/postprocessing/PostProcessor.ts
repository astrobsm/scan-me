/**
 * Post Processor
 * Combines spell checking and medical dictionary for text correction
 */

import { SpellChecker } from './SpellChecker';
import { MedicalDictionary } from './MedicalDictionary';

export interface PostProcessingOptions {
  enableSpellCheck: boolean;
  enableMedicalMode: boolean;
  autoCorrect: boolean;
  highlightUncertain: boolean;
}

export interface ProcessedWord {
  original: string;
  corrected: string;
  confidence: number;
  isMedicalTerm: boolean;
  wasAutoFixed: boolean;
}

export interface PostProcessingResult {
  text: string;
  words: ProcessedWord[];
  corrections: number;
  uncertainWords: string[];
}

const defaultOptions: PostProcessingOptions = {
  enableSpellCheck: true,
  enableMedicalMode: false,
  autoCorrect: true,
  highlightUncertain: true,
};

export class PostProcessor {
  private spellChecker: SpellChecker;
  private medicalDictionary: MedicalDictionary;
  private options: PostProcessingOptions;

  constructor(options: Partial<PostProcessingOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    this.spellChecker = new SpellChecker();
    this.medicalDictionary = new MedicalDictionary();
  }

  /**
   * Process recognized text
   */
  process(text: string): PostProcessingResult {
    const words = this.tokenize(text);
    const processedWords: ProcessedWord[] = [];
    const uncertainWords: string[] = [];
    let corrections = 0;

    for (const word of words) {
      const processed = this.processWord(word);
      processedWords.push(processed);
      
      if (processed.wasAutoFixed) {
        corrections++;
      }
      
      if (processed.confidence < 0.7) {
        uncertainWords.push(processed.original);
      }
    }

    // Reconstruct text
    const correctedText = this.reconstructText(text, processedWords);

    return {
      text: correctedText,
      words: processedWords,
      corrections,
      uncertainWords,
    };
  }

  /**
   * Process a single word
   */
  private processWord(word: string): ProcessedWord {
    // Skip non-alphabetic words
    if (!/^[a-zA-Z]+$/.test(word)) {
      return {
        original: word,
        corrected: word,
        confidence: 1,
        isMedicalTerm: false,
        wasAutoFixed: false,
      };
    }

    // Check if it's a medical term
    if (this.options.enableMedicalMode) {
      if (this.medicalDictionary.isMedicalTerm(word)) {
        const corrected = this.medicalDictionary.correctTerm(word);
        return {
          original: word,
          corrected: corrected || word,
          confidence: 0.95,
          isMedicalTerm: true,
          wasAutoFixed: corrected !== null && corrected !== word,
        };
      }
    }

    // Regular spell check
    if (this.options.enableSpellCheck) {
      if (!this.spellChecker.isCorrect(word)) {
        const suggestions = this.spellChecker.getSuggestions(word);
        
        if (suggestions.length > 0 && this.options.autoCorrect) {
          return {
            original: word,
            corrected: suggestions[0],
            confidence: 0.8,
            isMedicalTerm: false,
            wasAutoFixed: true,
          };
        }
        
        return {
          original: word,
          corrected: word,
          confidence: 0.5,
          isMedicalTerm: false,
          wasAutoFixed: false,
        };
      }
    }

    return {
      original: word,
      corrected: word,
      confidence: 1,
      isMedicalTerm: false,
      wasAutoFixed: false,
    };
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text.match(/\b\w+\b/g) || [];
  }

  /**
   * Reconstruct text with corrections
   */
  private reconstructText(original: string, words: ProcessedWord[]): string {
    let result = original;
    let offset = 0;

    for (const word of words) {
      if (word.wasAutoFixed) {
        const idx = result.indexOf(word.original, offset);
        if (idx !== -1) {
          result = result.slice(0, idx) + word.corrected + result.slice(idx + word.original.length);
          offset = idx + word.corrected.length;
        }
      }
    }

    return result;
  }

  /**
   * Update options
   */
  setOptions(options: Partial<PostProcessingOptions>): void {
    this.options = { ...this.options, ...options };
  }
}
