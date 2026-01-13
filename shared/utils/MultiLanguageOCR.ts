/**
 * CHARLES-DOUGLAS SCAN APP
 * Multi-Language OCR Support Module
 * 
 * Provides language detection and multi-language OCR capabilities
 */

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  script: string;
  modelPath?: string;
}

export interface LanguageDetectionResult {
  detectedLanguage: Language;
  confidence: number;
  alternatives: Array<{ language: Language; confidence: number }>;
}

export interface MultiLanguageConfig {
  defaultLanguage: string;
  enableAutoDetect: boolean;
  supportedLanguages: string[];
  modelBasePath: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', script: 'Latin' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', script: 'Latin' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', script: 'Latin' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', script: 'Latin' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', script: 'Latin' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', script: 'Latin' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', script: 'Latin' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', script: 'Cyrillic' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', script: 'Chinese' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', script: 'Japanese' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', script: 'Korean' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', script: 'Arabic' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', script: 'Hebrew' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', script: 'Devanagari' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', script: 'Thai' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', script: 'Latin' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', script: 'Latin' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', script: 'Latin' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', script: 'Cyrillic' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', script: 'Greek' },
];

// Character ranges for different scripts
const SCRIPT_RANGES: Record<string, RegExp> = {
  Latin: /[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F]/,
  Cyrillic: /[\u0400-\u04FF]/,
  Chinese: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
  Japanese: /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/,
  Korean: /[\uAC00-\uD7AF\u1100-\u11FF]/,
  Arabic: /[\u0600-\u06FF\u0750-\u077F]/,
  Hebrew: /[\u0590-\u05FF]/,
  Devanagari: /[\u0900-\u097F]/,
  Thai: /[\u0E00-\u0E7F]/,
  Greek: /[\u0370-\u03FF]/,
};

// Common words for language detection
const LANGUAGE_MARKERS: Record<string, string[]> = {
  en: ['the', 'and', 'is', 'are', 'of', 'to', 'in', 'it', 'you', 'that'],
  es: ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'los', 'se'],
  fr: ['le', 'la', 'de', 'et', 'est', 'en', 'que', 'les', 'des', 'un'],
  de: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'ist'],
  it: ['di', 'che', 'il', 'la', 'e', 'un', 'per', 'sono', 'una', 'in'],
  pt: ['de', 'que', 'o', 'a', 'e', 'do', 'da', 'em', 'um', 'para'],
  nl: ['de', 'het', 'een', 'van', 'en', 'in', 'is', 'op', 'te', 'dat'],
  ru: ['и', 'в', 'на', 'не', 'что', 'с', 'он', 'как', 'это', 'по'],
};

export class MultiLanguageOCR {
  private config: MultiLanguageConfig;
  private loadedModels: Map<string, any> = new Map();

  constructor(config: Partial<MultiLanguageConfig> = {}) {
    this.config = {
      defaultLanguage: 'en',
      enableAutoDetect: true,
      supportedLanguages: SUPPORTED_LANGUAGES.map(l => l.code),
      modelBasePath: '/models/languages',
      ...config,
    };
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): Language[] {
    return SUPPORTED_LANGUAGES.filter(l => 
      this.config.supportedLanguages.includes(l.code)
    );
  }

  /**
   * Get language by code
   */
  getLanguage(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find(l => l.code === code);
  }

  /**
   * Detect the primary script in text
   */
  detectScript(text: string): string {
    const scriptCounts: Record<string, number> = {};

    for (const char of text) {
      for (const [script, regex] of Object.entries(SCRIPT_RANGES)) {
        if (regex.test(char)) {
          scriptCounts[script] = (scriptCounts[script] || 0) + 1;
        }
      }
    }

    // Find script with highest count
    let maxScript = 'Latin';
    let maxCount = 0;

    for (const [script, count] of Object.entries(scriptCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxScript = script;
      }
    }

    return maxScript;
  }

  /**
   * Detect language from text content
   */
  detectLanguage(text: string): LanguageDetectionResult {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);

    // First, detect script
    const script = this.detectScript(text);

    // Get candidate languages for this script
    const candidates = SUPPORTED_LANGUAGES.filter(l => l.script === script);

    // Score each candidate based on common words
    const scores: Array<{ language: Language; score: number }> = [];

    for (const lang of candidates) {
      const markers = LANGUAGE_MARKERS[lang.code] || [];
      let score = 0;

      for (const word of words) {
        if (markers.includes(word)) {
          score++;
        }
      }

      // Normalize score by word count
      const normalizedScore = words.length > 0 ? score / words.length : 0;
      scores.push({ language: lang, score: normalizedScore });
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    // Calculate confidences
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const results = scores.map(s => ({
      language: s.language,
      confidence: totalScore > 0 ? s.score / totalScore : 1 / scores.length,
    }));

    // If no clear winner, use default
    if (results.length === 0 || results[0].confidence < 0.1) {
      const defaultLang = this.getLanguage(this.config.defaultLanguage) || SUPPORTED_LANGUAGES[0];
      return {
        detectedLanguage: defaultLang,
        confidence: 0.5,
        alternatives: [],
      };
    }

    return {
      detectedLanguage: results[0].language,
      confidence: Math.min(results[0].confidence * 2, 1), // Scale up confidence
      alternatives: results.slice(1, 4),
    };
  }

  /**
   * Get the appropriate character set for a language
   */
  getCharacterSet(languageCode: string): string {
    const lang = this.getLanguage(languageCode);
    if (!lang) return this.getDefaultCharacterSet();

    switch (lang.script) {
      case 'Latin':
        return this.getLatinCharacterSet(languageCode);
      case 'Cyrillic':
        return this.getCyrillicCharacterSet();
      case 'Chinese':
        return this.getChineseCharacterSet();
      case 'Japanese':
        return this.getJapaneseCharacterSet();
      case 'Korean':
        return this.getKoreanCharacterSet();
      case 'Arabic':
        return this.getArabicCharacterSet();
      case 'Hebrew':
        return this.getHebrewCharacterSet();
      case 'Devanagari':
        return this.getDevanagariCharacterSet();
      case 'Thai':
        return this.getThaiCharacterSet();
      case 'Greek':
        return this.getGreekCharacterSet();
      default:
        return this.getDefaultCharacterSet();
    }
  }

  private getDefaultCharacterSet(): string {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?-\'\"';
  }

  private getLatinCharacterSet(languageCode: string): string {
    const base = this.getDefaultCharacterSet();
    
    // Add language-specific characters
    const additions: Record<string, string> = {
      es: 'áéíóúüñ¿¡ÁÉÍÓÚÜÑ',
      fr: 'àâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ',
      de: 'äöüßÄÖÜ',
      it: 'àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ',
      pt: 'àáâãçéêíóôõúüÀÁÂÃÇÉÊÍÓÔÕÚÜ',
      nl: 'éëïóöüÉËÏÓÖÜ',
      pl: 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ',
      tr: 'çğıöşüÇĞİÖŞÜ',
      vi: 'àảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵđ',
    };

    return base + (additions[languageCode] || '');
  }

  private getCyrillicCharacterSet(): string {
    return 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789 .,!?-\'\"';
  }

  private getChineseCharacterSet(): string {
    // Return most common Chinese characters (simplified)
    // In production, this would be a much larger set
    return '的一是不了在人有我他这个们中来上大为和国地到以说时要就出会可也你对生能而子那得于着下自之年过发后作里如果';
  }

  private getJapaneseCharacterSet(): string {
    // Hiragana + common Katakana + some Kanji
    return 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  }

  private getKoreanCharacterSet(): string {
    // Common Korean syllables
    return '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호';
  }

  private getArabicCharacterSet(): string {
    return 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩ .,؟!-';
  }

  private getHebrewCharacterSet(): string {
    return 'אבגדהוזחטיכלמנסעפצקרשת0123456789 .,!?-';
  }

  private getDevanagariCharacterSet(): string {
    return 'अआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९';
  }

  private getThaiCharacterSet(): string {
    return 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ๐๑๒๓๔๕๖๗๘๙';
  }

  private getGreekCharacterSet(): string {
    return 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789 .,!?-';
  }

  /**
   * Load language-specific model
   */
  async loadLanguageModel(languageCode: string): Promise<boolean> {
    if (this.loadedModels.has(languageCode)) {
      return true;
    }

    const lang = this.getLanguage(languageCode);
    if (!lang) {
      console.warn(`Language ${languageCode} not supported`);
      return false;
    }

    try {
      // In production, this would load an actual TensorFlow.js model
      const modelPath = `${this.config.modelBasePath}/${languageCode}/model.json`;
      console.log(`Loading model from ${modelPath}...`);
      
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.loadedModels.set(languageCode, { loaded: true });
      return true;
    } catch (error) {
      console.error(`Failed to load model for ${languageCode}:`, error);
      return false;
    }
  }

  /**
   * Check if language model is loaded
   */
  isLanguageLoaded(languageCode: string): boolean {
    return this.loadedModels.has(languageCode);
  }

  /**
   * Get text direction for language
   */
  getTextDirection(languageCode: string): 'ltr' | 'rtl' {
    const lang = this.getLanguage(languageCode);
    return lang?.direction || 'ltr';
  }
}

export default MultiLanguageOCR;
