/**
 * CHARLES-DOUGLAS SCAN APP
 * Nigerian Languages Service
 * Supports Igbo, Hausa, Yoruba, and Nigerian Pidgin English
 */

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type NigerianLanguage = 'igbo' | 'hausa' | 'yoruba' | 'pidgin' | 'english';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: NigerianLanguage;
  targetLanguage: NigerianLanguage;
  confidence: number;
}

export interface LanguageInfo {
  code: NigerianLanguage;
  name: string;
  nativeName: string;
  voiceCode: string;
  flag: string;
}

export const NIGERIAN_LANGUAGES: LanguageInfo[] = [
  { code: 'english', name: 'English', nativeName: 'English', voiceCode: 'en-NG', flag: '🇬🇧' },
  { code: 'igbo', name: 'Igbo', nativeName: 'Asụsụ Igbo', voiceCode: 'ig-NG', flag: '🇳🇬' },
  { code: 'hausa', name: 'Hausa', nativeName: 'Harshen Hausa', voiceCode: 'ha-NG', flag: '🇳🇬' },
  { code: 'yoruba', name: 'Yoruba', nativeName: 'Èdè Yorùbá', voiceCode: 'yo-NG', flag: '🇳🇬' },
  { code: 'pidgin', name: 'Nigerian Pidgin', nativeName: 'Naijá', voiceCode: 'pcm-NG', flag: '🇳🇬' },
];

// Common phrases dictionary for offline translation
const PHRASE_DICTIONARY: Record<string, Record<NigerianLanguage, string>> = {
  // Greetings
  'hello': {
    english: 'Hello',
    igbo: 'Nnọọ',
    hausa: 'Sannu',
    yoruba: 'Ẹ káàárọ̀',
    pidgin: 'How far',
  },
  'good morning': {
    english: 'Good morning',
    igbo: 'Ụtụtụ ọma',
    hausa: 'Ina kwana',
    yoruba: 'Ẹ káàárọ̀',
    pidgin: 'Good morning o',
  },
  'good afternoon': {
    english: 'Good afternoon',
    igbo: 'Ehihie ọma',
    hausa: 'Ina wuni',
    yoruba: 'Ẹ káàsán',
    pidgin: 'Good afternoon o',
  },
  'good evening': {
    english: 'Good evening',
    igbo: 'Mgbede ọma',
    hausa: 'Ina yini',
    yoruba: 'Ẹ kúùrọ̀lẹ́',
    pidgin: 'Good evening o',
  },
  'good night': {
    english: 'Good night',
    igbo: 'Ka chi fọ',
    hausa: 'Sai da safe',
    yoruba: 'Ó dàárọ̀',
    pidgin: 'Good night o',
  },
  'how are you': {
    english: 'How are you?',
    igbo: 'Kedu ka ị mere?',
    hausa: 'Yaya kake?',
    yoruba: 'Ṣé àlàáfíà ni?',
    pidgin: 'How you dey?',
  },
  'i am fine': {
    english: 'I am fine',
    igbo: 'Adị m mma',
    hausa: 'Lafiya lau',
    yoruba: 'Mo wà dáadáa',
    pidgin: 'I dey okay',
  },
  'thank you': {
    english: 'Thank you',
    igbo: 'Daalụ',
    hausa: 'Na gode',
    yoruba: 'Ẹ ṣé',
    pidgin: 'Thank you well well',
  },
  'please': {
    english: 'Please',
    igbo: 'Biko',
    hausa: 'Don Allah',
    yoruba: 'Ẹ jọ̀wọ́',
    pidgin: 'Abeg',
  },
  'sorry': {
    english: 'Sorry',
    igbo: 'Ndo',
    hausa: 'Yi hakuri',
    yoruba: 'Má bínú',
    pidgin: 'Sorry o',
  },
  'yes': {
    english: 'Yes',
    igbo: 'Ee',
    hausa: 'Eh',
    yoruba: 'Bẹ́ẹ̀ ni',
    pidgin: 'Yes na',
  },
  'no': {
    english: 'No',
    igbo: 'Mba',
    hausa: "A'a",
    yoruba: 'Rárá',
    pidgin: 'No be so',
  },
  'goodbye': {
    english: 'Goodbye',
    igbo: 'Ka ọ dị',
    hausa: 'Sai anjima',
    yoruba: 'Ó dàbọ̀',
    pidgin: 'I dey go',
  },
  'welcome': {
    english: 'Welcome',
    igbo: 'Nnọọ',
    hausa: 'Maraba',
    yoruba: 'Ẹ káàbọ̀',
    pidgin: 'You are welcome',
  },
  // Common phrases
  'what is your name': {
    english: 'What is your name?',
    igbo: 'Kedụ aha gị?',
    hausa: 'Menene sunanka?',
    yoruba: 'Kí ni orúkọ rẹ?',
    pidgin: 'Wetin be your name?',
  },
  'my name is': {
    english: 'My name is',
    igbo: 'Aha m bụ',
    hausa: 'Sunana',
    yoruba: 'Orúkọ mi ni',
    pidgin: 'My name na',
  },
  'i love you': {
    english: 'I love you',
    igbo: 'Ahụrụ m gị n\'anya',
    hausa: 'Ina son ka',
    yoruba: 'Mo nífẹ̀ẹ́ rẹ',
    pidgin: 'I love you die',
  },
  'i am hungry': {
    english: 'I am hungry',
    igbo: 'Agụụ na-agụ m',
    hausa: 'Ina jin yunwa',
    yoruba: 'Ebi n pa mí',
    pidgin: 'Hunger dey catch me',
  },
  'i am thirsty': {
    english: 'I am thirsty',
    igbo: 'Akpịrị kpọrọ m nkụ',
    hausa: 'Ina jin ƙishirwa',
    yoruba: 'Òǹgbẹ n gbẹ mí',
    pidgin: 'Thirst dey catch me',
  },
  'where is': {
    english: 'Where is',
    igbo: 'Ebee ka',
    hausa: 'Ina ne',
    yoruba: 'Níbo ni',
    pidgin: 'Where',
  },
  'how much': {
    english: 'How much?',
    igbo: 'Ego ole?',
    hausa: 'Nawa ne?',
    yoruba: 'Ẹlo ni?',
    pidgin: 'How much?',
  },
  'i want': {
    english: 'I want',
    igbo: 'Achọrọ m',
    hausa: 'Ina so',
    yoruba: 'Mo fẹ́',
    pidgin: 'I wan',
  },
  'i need help': {
    english: 'I need help',
    igbo: 'Achọrọ m enyemaka',
    hausa: 'Ina bukatar taimako',
    yoruba: 'Mo nílò ìrànlọ́wọ́',
    pidgin: 'I need help o',
  },
  'come here': {
    english: 'Come here',
    igbo: 'Bịa ebe a',
    hausa: 'Zo nan',
    yoruba: 'Wá síbí',
    pidgin: 'Come here',
  },
  'go away': {
    english: 'Go away',
    igbo: 'Pụọ',
    hausa: 'Tafi',
    yoruba: 'Lọ kúrò',
    pidgin: 'Comot here',
  },
  'wait': {
    english: 'Wait',
    igbo: 'Chere',
    hausa: 'Jira',
    yoruba: 'Dúró',
    pidgin: 'Wait small',
  },
  'stop': {
    english: 'Stop',
    igbo: 'Kwụsị',
    hausa: 'Tsaya',
    yoruba: 'Dúró',
    pidgin: 'Stop am',
  },
  // Numbers
  'one': { english: 'One', igbo: 'Otu', hausa: 'Ɗaya', yoruba: 'Ọ̀kan', pidgin: 'One' },
  'two': { english: 'Two', igbo: 'Abụọ', hausa: 'Biyu', yoruba: 'Èjì', pidgin: 'Two' },
  'three': { english: 'Three', igbo: 'Atọ', hausa: 'Uku', yoruba: 'Ẹ̀ta', pidgin: 'Three' },
  'four': { english: 'Four', igbo: 'Anọ', hausa: 'Huɗu', yoruba: 'Ẹ̀rin', pidgin: 'Four' },
  'five': { english: 'Five', igbo: 'Ise', hausa: 'Biyar', yoruba: 'Àrún', pidgin: 'Five' },
  'six': { english: 'Six', igbo: 'Isii', hausa: 'Shida', yoruba: 'Ẹ̀fà', pidgin: 'Six' },
  'seven': { english: 'Seven', igbo: 'Asaa', hausa: 'Bakwai', yoruba: 'Èje', pidgin: 'Seven' },
  'eight': { english: 'Eight', igbo: 'Asatọ', hausa: 'Takwas', yoruba: 'Ẹ̀jọ', pidgin: 'Eight' },
  'nine': { english: 'Nine', igbo: 'Itoolu', hausa: 'Tara', yoruba: 'Ẹ̀sán', pidgin: 'Nine' },
  'ten': { english: 'Ten', igbo: 'Iri', hausa: 'Goma', yoruba: 'Ẹ̀wá', pidgin: 'Ten' },
  // Medical terms
  'i am sick': {
    english: 'I am sick',
    igbo: 'Arịa na-arịa m',
    hausa: 'Ina ciwo',
    yoruba: 'Mo ṣàìsàn',
    pidgin: 'Sickness dey worry me',
  },
  'hospital': {
    english: 'Hospital',
    igbo: 'Ụlọ ọgwụ',
    hausa: 'Asibiti',
    yoruba: 'Ilé ìwòsàn',
    pidgin: 'Hospital',
  },
  'doctor': {
    english: 'Doctor',
    igbo: 'Dọkịta',
    hausa: 'Likita',
    yoruba: 'Dókítà',
    pidgin: 'Doctor',
  },
  'medicine': {
    english: 'Medicine',
    igbo: 'Ọgwụ',
    hausa: 'Magani',
    yoruba: 'Oògùn',
    pidgin: 'Medicine',
  },
  'pain': {
    english: 'Pain',
    igbo: 'Ụfụ',
    hausa: 'Ciwo',
    yoruba: 'Ìrora',
    pidgin: 'Pain',
  },
  'headache': {
    english: 'Headache',
    igbo: 'Isi ọwụwa',
    hausa: 'Ciwon kai',
    yoruba: 'Orí fífọ́',
    pidgin: 'Head dey pain me',
  },
  'fever': {
    english: 'Fever',
    igbo: 'Ahụ ọkụ',
    hausa: 'Zazzabi',
    yoruba: 'Ibà',
    pidgin: 'Body dey hot',
  },
  // Food
  'food': {
    english: 'Food',
    igbo: 'Nri',
    hausa: 'Abinci',
    yoruba: 'Oúnjẹ',
    pidgin: 'Chop',
  },
  'water': {
    english: 'Water',
    igbo: 'Mmiri',
    hausa: 'Ruwa',
    yoruba: 'Omi',
    pidgin: 'Water',
  },
  'rice': {
    english: 'Rice',
    igbo: 'Osikapa',
    hausa: 'Shinkafa',
    yoruba: 'Ìrẹsì',
    pidgin: 'Rice',
  },
  // Family
  'mother': {
    english: 'Mother',
    igbo: 'Nne',
    hausa: 'Uwa',
    yoruba: 'Ìyá',
    pidgin: 'Mama',
  },
  'father': {
    english: 'Father',
    igbo: 'Nna',
    hausa: 'Uba',
    yoruba: 'Bàbá',
    pidgin: 'Papa',
  },
  'child': {
    english: 'Child',
    igbo: 'Nwa',
    hausa: 'Yaro',
    yoruba: 'Ọmọ',
    pidgin: 'Pikin',
  },
  'family': {
    english: 'Family',
    igbo: 'Ezinụlọ',
    hausa: 'Iyali',
    yoruba: 'Ẹbí',
    pidgin: 'Family',
  },
  'friend': {
    english: 'Friend',
    igbo: 'Enyi',
    hausa: 'Aboki',
    yoruba: 'Ọ̀rẹ́',
    pidgin: 'Paddy',
  },
  // Time
  'today': {
    english: 'Today',
    igbo: 'Taa',
    hausa: 'Yau',
    yoruba: 'Òní',
    pidgin: 'Today',
  },
  'tomorrow': {
    english: 'Tomorrow',
    igbo: 'Echi',
    hausa: 'Gobe',
    yoruba: 'Ọ̀la',
    pidgin: 'Tomorrow',
  },
  'yesterday': {
    english: 'Yesterday',
    igbo: 'Ụnyaahụ',
    hausa: 'Jiya',
    yoruba: 'Àná',
    pidgin: 'Yesterday',
  },
  // Common Pidgin expressions
  'no wahala': {
    english: 'No problem',
    igbo: 'Enweghị nsogbu',
    hausa: 'Babu matsala',
    yoruba: 'Kò sí wàhálà',
    pidgin: 'No wahala',
  },
  'wetin dey happen': {
    english: 'What is happening?',
    igbo: 'Kedu ihe na-eme?',
    hausa: 'Mene ne ke faruwa?',
    yoruba: 'Kí ló n ṣẹlẹ̀?',
    pidgin: 'Wetin dey happen?',
  },
  'i no sabi': {
    english: "I don't know",
    igbo: 'Amaghị m',
    hausa: 'Ban sani ba',
    yoruba: 'N kò mọ̀',
    pidgin: 'I no sabi',
  },
  'make we go': {
    english: "Let's go",
    igbo: 'Ka anyị gaa',
    hausa: 'Mu tafi',
    yoruba: 'Ẹ jẹ́ ká lọ',
    pidgin: 'Make we go',
  },
  'e don do': {
    english: "It's enough",
    igbo: 'O zuru',
    hausa: 'Ya isa',
    yoruba: 'Ó ti tó',
    pidgin: 'E don do',
  },
  'na so': {
    english: "That's right",
    igbo: 'Ọ bụ eziokwu',
    hausa: 'Haka ne',
    yoruba: 'Bẹ́ẹ̀ ni',
    pidgin: 'Na so',
  },
  'i dey come': {
    english: 'I am coming',
    igbo: 'Ana m abịa',
    hausa: 'Ina zuwa',
    yoruba: 'Mo n bọ̀',
    pidgin: 'I dey come',
  },
  'sharp sharp': {
    english: 'Quickly',
    igbo: 'Ngwa ngwa',
    hausa: 'Da sauri',
    yoruba: 'Kíákíá',
    pidgin: 'Sharp sharp',
  },
};

export class NigerianLanguagesService {
  private static instance: NigerianLanguagesService;
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
      }
    }
  }

  static getInstance(): NigerianLanguagesService {
    if (!NigerianLanguagesService.instance) {
      NigerianLanguagesService.instance = new NigerianLanguagesService();
    }
    return NigerianLanguagesService.instance;
  }

  /**
   * Get all supported languages
   */
  getLanguages(): LanguageInfo[] {
    return NIGERIAN_LANGUAGES;
  }

  /**
   * Translate text between Nigerian languages
   */
  async translate(
    text: string,
    sourceLanguage: NigerianLanguage,
    targetLanguage: NigerianLanguage
  ): Promise<TranslationResult> {
    if (sourceLanguage === targetLanguage) {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage,
        targetLanguage,
        confidence: 1.0,
      };
    }

    // Try exact phrase match first
    const normalizedText = text.toLowerCase().trim();
    
    // Check for exact phrase match
    if (PHRASE_DICTIONARY[normalizedText]) {
      const translation = PHRASE_DICTIONARY[normalizedText][targetLanguage];
      if (translation) {
        return {
          originalText: text,
          translatedText: translation,
          sourceLanguage,
          targetLanguage,
          confidence: 0.95,
        };
      }
    }

    // Try to find the source phrase by matching in source language
    for (const [key, translations] of Object.entries(PHRASE_DICTIONARY)) {
      if (translations[sourceLanguage].toLowerCase() === normalizedText) {
        return {
          originalText: text,
          translatedText: translations[targetLanguage],
          sourceLanguage,
          targetLanguage,
          confidence: 0.9,
        };
      }
    }

    // Word-by-word translation for longer texts
    const words = text.split(/\s+/);
    const translatedWords: string[] = [];
    let totalConfidence = 0;
    let matchedWords = 0;

    for (const word of words) {
      const normalizedWord = word.toLowerCase().replace(/[.,!?]/g, '');
      let translated = false;

      // Check dictionary
      if (PHRASE_DICTIONARY[normalizedWord]) {
        translatedWords.push(PHRASE_DICTIONARY[normalizedWord][targetLanguage]);
        totalConfidence += 0.9;
        matchedWords++;
        translated = true;
      }

      // Check if word exists in source language translations
      if (!translated) {
        for (const translations of Object.values(PHRASE_DICTIONARY)) {
          if (translations[sourceLanguage].toLowerCase() === normalizedWord) {
            translatedWords.push(translations[targetLanguage]);
            totalConfidence += 0.85;
            matchedWords++;
            translated = true;
            break;
          }
        }
      }

      if (!translated) {
        // Keep original word if no translation found
        translatedWords.push(word);
        totalConfidence += 0.3;
        matchedWords++;
      }
    }

    return {
      originalText: text,
      translatedText: translatedWords.join(' '),
      sourceLanguage,
      targetLanguage,
      confidence: matchedWords > 0 ? totalConfidence / matchedWords : 0,
    };
  }

  /**
   * Detect the language of input text
   */
  detectLanguage(text: string): NigerianLanguage {
    const normalizedText = text.toLowerCase().trim();
    const languageScores: Record<NigerianLanguage, number> = {
      english: 0,
      igbo: 0,
      hausa: 0,
      yoruba: 0,
      pidgin: 0,
    };

    // Check against dictionary
    const words = normalizedText.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[.,!?]/g, '');
      
      for (const translations of Object.values(PHRASE_DICTIONARY)) {
        for (const [lang, translation] of Object.entries(translations)) {
          if (translation.toLowerCase().includes(cleanWord)) {
            languageScores[lang as NigerianLanguage]++;
          }
        }
      }
    }

    // Check for language-specific characters
    if (/[ọụịṅ]/i.test(text)) languageScores.igbo += 5;
    if (/[ɓɗƙ]/i.test(text)) languageScores.hausa += 5;
    if (/[ẹọṣ]/i.test(text)) languageScores.yoruba += 5;
    if (/\b(dey|wetin|wahala|abeg|pikin|oga)\b/i.test(text)) languageScores.pidgin += 5;

    // Find language with highest score
    let maxScore = 0;
    let detectedLanguage: NigerianLanguage = 'english';
    
    for (const [lang, score] of Object.entries(languageScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedLanguage = lang as NigerianLanguage;
      }
    }

    return detectedLanguage;
  }

  /**
   * Text-to-Speech for Nigerian languages
   */
  speak(
    text: string,
    language: NigerianLanguage,
    options: { rate?: number; pitch?: number; volume?: number } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const langInfo = NIGERIAN_LANGUAGES.find(l => l.code === language);
      
      // Set language - fall back to English if specific language not available
      utterance.lang = langInfo?.voiceCode || 'en-NG';
      
      // Try to find a voice that matches
      const voices = this.synthesis.getVoices();
      const matchingVoice = voices.find(v => 
        v.lang.startsWith(langInfo?.voiceCode.split('-')[0] || 'en')
      );
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false;
  }

  /**
   * Speech-to-Text for Nigerian languages
   */
  listen(
    language: NigerianLanguage,
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (!this.recognition) {
      onError?.(new Error('Speech recognition not supported'));
      return () => {};
    }

    const langInfo = NIGERIAN_LANGUAGES.find(l => l.code === language);
    this.recognition.lang = langInfo?.voiceCode || 'en-NG';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      onError?.(new Error(event.error));
    };

    this.recognition.start();

    return () => {
      this.recognition?.stop();
    };
  }

  /**
   * Get available voices for a language
   */
  getVoicesForLanguage(language: NigerianLanguage): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    
    const langInfo = NIGERIAN_LANGUAGES.find(l => l.code === language);
    const langPrefix = langInfo?.voiceCode.split('-')[0] || 'en';
    
    return this.synthesis.getVoices().filter(v => v.lang.startsWith(langPrefix));
  }

  /**
   * Get common phrases for learning
   */
  getCommonPhrases(): Array<{ key: string; translations: Record<NigerianLanguage, string> }> {
    return Object.entries(PHRASE_DICTIONARY).map(([key, translations]) => ({
      key,
      translations,
    }));
  }

  /**
   * Translate and speak
   */
  async translateAndSpeak(
    text: string,
    sourceLanguage: NigerianLanguage,
    targetLanguage: NigerianLanguage,
    speakOptions?: { rate?: number; pitch?: number; volume?: number }
  ): Promise<TranslationResult> {
    const result = await this.translate(text, sourceLanguage, targetLanguage);
    await this.speak(result.translatedText, targetLanguage, speakOptions);
    return result;
  }
}

export const nigerianLanguages = NigerianLanguagesService.getInstance();
export default NigerianLanguagesService;
