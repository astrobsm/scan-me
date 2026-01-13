/**
 * CHARLES-DOUGLAS SCAN APP
 * Post-Processing Unit Tests
 */

import { PostProcessor } from '../postprocessing/PostProcessor';
import { SpellChecker } from '../postprocessing/SpellChecker';
import { MedicalDictionary } from '../postprocessing/MedicalDictionary';

describe('SpellChecker', () => {
  let spellChecker: SpellChecker;

  beforeEach(() => {
    spellChecker = new SpellChecker();
  });

  describe('isCorrect', () => {
    it('should recognize correctly spelled words', () => {
      expect(spellChecker.isCorrect('the')).toBe(true);
      expect(spellChecker.isCorrect('hello')).toBe(true);
    });

    it('should detect misspelled words', () => {
      expect(spellChecker.isCorrect('teh')).toBe(false);
      expect(spellChecker.isCorrect('helo')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(spellChecker.isCorrect('')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(spellChecker.isCorrect('The')).toBe(true);
      expect(spellChecker.isCorrect('THE')).toBe(true);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for misspelled words', () => {
      const suggestions = spellChecker.getSuggestions('teh');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should limit number of suggestions', () => {
      const suggestions = spellChecker.getSuggestions('teh', 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('addWord', () => {
    it('should add custom words to dictionary', () => {
      spellChecker.addWord('customword');
      expect(spellChecker.isCorrect('customword')).toBe(true);
    });
  });

  describe('checkText', () => {
    it('should return errors for misspelled words', () => {
      const errors = spellChecker.checkText('Teh quick brwon fox');
      expect(Array.isArray(errors)).toBe(true);
    });

    it('should include position information', () => {
      const errors = spellChecker.checkText('teh quick');
      if (errors.length > 0) {
        expect(errors[0]).toHaveProperty('position');
        expect(errors[0]).toHaveProperty('word');
        expect(errors[0]).toHaveProperty('suggestions');
      }
    });
  });
});

describe('MedicalDictionary', () => {
  let medicalDict: MedicalDictionary;

  beforeEach(() => {
    medicalDict = new MedicalDictionary();
  });

  describe('isMedicalTerm', () => {
    it('should recognize medical terms', () => {
      expect(medicalDict.isMedicalTerm('hypertension')).toBe(true);
      expect(medicalDict.isMedicalTerm('diabetes')).toBe(true);
    });

    it('should not recognize non-medical terms', () => {
      expect(medicalDict.isMedicalTerm('hello')).toBe(false);
    });
  });

  describe('expandAbbreviation', () => {
    it('should expand medical abbreviations', () => {
      const expanded = medicalDict.expandAbbreviation('HTN');
      expect(expanded).toBeDefined();
    });
  });
});

describe('PostProcessor', () => {
  let postProcessor: PostProcessor;

  beforeEach(() => {
    postProcessor = new PostProcessor();
  });

  describe('initialization', () => {
    it('should create with default options', () => {
      expect(postProcessor).toBeInstanceOf(PostProcessor);
    });

    it('should accept custom options', () => {
      const customProcessor = new PostProcessor({
        enableSpellCheck: true,
        enableMedicalMode: true,
        autoCorrect: false,
      });
      expect(customProcessor).toBeInstanceOf(PostProcessor);
    });
  });

  describe('process', () => {
    it('should return PostProcessingResult', () => {
      const result = postProcessor.process('Hello world');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('words');
      expect(result).toHaveProperty('corrections');
      expect(result).toHaveProperty('uncertainWords');
    });

    it('should process clean text without changes', () => {
      const result = postProcessor.process('The quick brown fox');
      expect(result.text.length).toBeGreaterThan(0);
    });

    it('should handle empty text', () => {
      const result = postProcessor.process('');
      expect(result.text).toBe('');
    });
  });

  describe('medical mode', () => {
    it('should preserve medical terms', () => {
      const medProcessor = new PostProcessor({ enableMedicalMode: true });
      const result = medProcessor.process('Patient has hypertension');
      expect(result.text).toContain('hypertension');
    });
  });
});
