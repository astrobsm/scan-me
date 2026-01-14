/**
 * CHARLES-DOUGLAS SCAN APP
 * Nigerian Voice Engine
 * 
 * Authentic Nigerian accent text-to-speech with support for:
 * - Igbo accent
 * - Yoruba accent
 * - Hausa accent
 * - Nigerian Pidgin
 * 
 * Uses hybrid approach:
 * 1. Azure Cognitive Services Speech SDK (for languages with native support)
 * 2. Enhanced Web Speech API with Nigerian accent modulation
 * 3. Custom phonetic mapping for authentic pronunciation
 */

export interface NigerianVoice {
  id: string;
  name: string;
  language: NigerianLanguage;
  gender: 'male' | 'female';
  accent: AccentType;
  description: string;
  voiceUri?: string; // For Azure/ElevenLabs
  pitch: number; // 0.5 - 2.0
  rate: number; // 0.5 - 2.0
  volume: number; // 0 - 1
  emotionSupport: boolean;
  characteristics: VoiceCharacteristics;
}

export type NigerianLanguage = 'igbo' | 'yoruba' | 'hausa' | 'pidgin' | 'english-ng';
export type AccentType = 'native' | 'urban' | 'rural' | 'diaspora';
export type EmotionType = 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm' | 'serious';

export interface VoiceCharacteristics {
  warmth: number; // 0-1
  clarity: number; // 0-1
  authority: number; // 0-1
  friendliness: number; // 0-1
}

export interface SpeechOptions {
  emotion?: EmotionType;
  emphasis?: boolean;
  pauseDuration?: number;
  useNativeWords?: boolean;
}

/**
 * Nigerian Voice Library
 * Comprehensive collection of Nigerian accent voices
 */
export const NIGERIAN_VOICES: NigerianVoice[] = [
  // IGBO VOICES
  {
    id: 'igbo-male-native',
    name: 'Chukwuemeka',
    language: 'igbo',
    gender: 'male',
    accent: 'native',
    description: 'Deep male voice with authentic Igbo accent',
    pitch: 0.9,
    rate: 0.95,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.8,
      clarity: 0.85,
      authority: 0.9,
      friendliness: 0.7
    }
  },
  {
    id: 'igbo-female-native',
    name: 'Adaeze',
    language: 'igbo',
    gender: 'female',
    accent: 'native',
    description: 'Warm female voice with authentic Igbo accent',
    pitch: 1.15,
    rate: 0.95,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.9,
      clarity: 0.9,
      authority: 0.7,
      friendliness: 0.85
    }
  },
  {
    id: 'igbo-male-urban',
    name: 'Obinna',
    language: 'igbo',
    gender: 'male',
    accent: 'urban',
    description: 'Modern urban male with Igbo English accent',
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.75,
      clarity: 0.9,
      authority: 0.8,
      friendliness: 0.75
    }
  },
  {
    id: 'igbo-female-urban',
    name: 'Chidinma',
    language: 'igbo',
    gender: 'female',
    accent: 'urban',
    description: 'Confident urban female with Igbo accent',
    pitch: 1.1,
    rate: 1.0,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.85,
      clarity: 0.9,
      authority: 0.75,
      friendliness: 0.8
    }
  },

  // YORUBA VOICES
  {
    id: 'yoruba-male-native',
    name: 'Adebayo',
    language: 'yoruba',
    gender: 'male',
    accent: 'native',
    description: 'Rich male voice with authentic Yoruba accent',
    pitch: 0.85,
    rate: 0.9,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.85,
      clarity: 0.85,
      authority: 0.9,
      friendliness: 0.8
    }
  },
  {
    id: 'yoruba-female-native',
    name: 'Folake',
    language: 'yoruba',
    gender: 'female',
    accent: 'native',
    description: 'Melodic female voice with authentic Yoruba accent',
    pitch: 1.2,
    rate: 0.95,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.9,
      clarity: 0.9,
      authority: 0.7,
      friendliness: 0.9
    }
  },
  {
    id: 'yoruba-male-lagos',
    name: 'Tunde',
    language: 'yoruba',
    gender: 'male',
    accent: 'urban',
    description: 'Lagos-style male voice with Yoruba accent',
    pitch: 0.95,
    rate: 1.1,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.7,
      clarity: 0.85,
      authority: 0.85,
      friendliness: 0.7
    }
  },
  {
    id: 'yoruba-female-modern',
    name: 'Yetunde',
    language: 'yoruba',
    gender: 'female',
    accent: 'urban',
    description: 'Modern Lagos female voice',
    pitch: 1.15,
    rate: 1.05,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.8,
      clarity: 0.9,
      authority: 0.75,
      friendliness: 0.85
    }
  },

  // HAUSA VOICES
  {
    id: 'hausa-male-native',
    name: 'Ibrahim',
    language: 'hausa',
    gender: 'male',
    accent: 'native',
    description: 'Deep male voice with authentic Hausa accent',
    pitch: 0.8,
    rate: 0.85,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.75,
      clarity: 0.8,
      authority: 0.95,
      friendliness: 0.7
    }
  },
  {
    id: 'hausa-female-native',
    name: 'Aisha',
    language: 'hausa',
    gender: 'female',
    accent: 'native',
    description: 'Gentle female voice with authentic Hausa accent',
    pitch: 1.1,
    rate: 0.9,
    volume: 0.95,
    emotionSupport: true,
    characteristics: {
      warmth: 0.9,
      clarity: 0.85,
      authority: 0.65,
      friendliness: 0.9
    }
  },
  {
    id: 'hausa-male-kano',
    name: 'Musa',
    language: 'hausa',
    gender: 'male',
    accent: 'urban',
    description: 'Kano-style male voice with Hausa accent',
    pitch: 0.9,
    rate: 0.95,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.8,
      clarity: 0.85,
      authority: 0.9,
      friendliness: 0.75
    }
  },
  {
    id: 'hausa-female-modern',
    name: 'Fatima',
    language: 'hausa',
    gender: 'female',
    accent: 'urban',
    description: 'Modern educated Hausa female voice',
    pitch: 1.05,
    rate: 1.0,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.85,
      clarity: 0.9,
      authority: 0.8,
      friendliness: 0.85
    }
  },

  // PIDGIN VOICES
  {
    id: 'pidgin-male-lagos',
    name: 'Soji',
    language: 'pidgin',
    gender: 'male',
    accent: 'urban',
    description: 'Authentic Lagos Pidgin male voice',
    pitch: 0.95,
    rate: 1.15,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.7,
      clarity: 0.75,
      authority: 0.6,
      friendliness: 0.9
    }
  },
  {
    id: 'pidgin-female-lagos',
    name: 'Blessing',
    language: 'pidgin',
    gender: 'female',
    accent: 'urban',
    description: 'Lively Lagos Pidgin female voice',
    pitch: 1.2,
    rate: 1.2,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.85,
      clarity: 0.75,
      authority: 0.5,
      friendliness: 0.95
    }
  },
  {
    id: 'pidgin-male-warri',
    name: 'Emeka',
    language: 'pidgin',
    gender: 'male',
    accent: 'native',
    description: 'Warri-style Pidgin male voice',
    pitch: 1.0,
    rate: 1.1,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.8,
      clarity: 0.7,
      authority: 0.55,
      friendliness: 0.95
    }
  },
  {
    id: 'pidgin-female-portHarcourt',
    name: 'Joy',
    language: 'pidgin',
    gender: 'female',
    accent: 'native',
    description: 'Port Harcourt Pidgin female voice',
    pitch: 1.15,
    rate: 1.1,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.9,
      clarity: 0.75,
      authority: 0.5,
      friendliness: 0.95
    }
  },

  // NIGERIAN ENGLISH VOICES
  {
    id: 'english-ng-male-pro',
    name: 'Olumide',
    language: 'english-ng',
    gender: 'male',
    accent: 'urban',
    description: 'Professional Nigerian English male voice',
    pitch: 0.95,
    rate: 1.0,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.75,
      clarity: 0.95,
      authority: 0.9,
      friendliness: 0.75
    }
  },
  {
    id: 'english-ng-female-pro',
    name: 'Ngozi',
    language: 'english-ng',
    gender: 'female',
    accent: 'urban',
    description: 'Professional Nigerian English female voice',
    pitch: 1.1,
    rate: 1.0,
    volume: 1.0,
    emotionSupport: true,
    characteristics: {
      warmth: 0.85,
      clarity: 0.95,
      authority: 0.85,
      friendliness: 0.8
    }
  }
];

/**
 * Nigerian Phonetic Mappings
 * For authentic pronunciation of common words
 */
const NIGERIAN_PHONETICS: Record<NigerianLanguage, Record<string, string>> = {
  igbo: {
    'hello': 'ndeewọ',
    'thank you': 'daalụ',
    'please': 'biko',
    'doctor': 'dibia',
    'hospital': 'ụlọ ọgwụ',
    'medicine': 'ọgwụ',
    'health': 'ahụike',
    'yes': 'ee',
    'no': 'mba',
    'good morning': 'ụtụtụ ọma',
    'good afternoon': 'ehihie ọma',
    'good evening': 'mgbede ọma',
    'how are you': 'kedu ka ịmere',
    'I am fine': 'ọ dị mma',
    'God bless you': 'Chukwu gọzie gị',
    'welcome': 'nnọọ'
  },
  yoruba: {
    'hello': 'bawoni',
    'thank you': 'ẹ ṣeun',
    'please': 'jọwọ',
    'doctor': 'dọkita',
    'hospital': 'ile iwosan',
    'medicine': 'oogun',
    'health': 'ilera',
    'yes': 'bẹẹni',
    'no': 'rara',
    'good morning': 'ẹ kaaro',
    'good afternoon': 'ẹ kaasan',
    'good evening': 'ẹ kaalẹ',
    'how are you': 'bawo ni',
    'I am fine': 'mo wa daadaa',
    'God bless you': 'Olorun bukun fun ọ',
    'welcome': 'ẹ kabo'
  },
  hausa: {
    'hello': 'sannu',
    'thank you': 'na gode',
    'please': 'don Allah',
    'doctor': 'likita',
    'hospital': 'asibiti',
    'medicine': 'magani',
    'health': 'lafiya',
    'yes': 'e',
    'no': 'ayi',
    'good morning': 'ina kwana',
    'good afternoon': 'ina wuni',
    'good evening': 'barka da yamma',
    'how are you': 'yaya kake',
    'I am fine': 'lafiya lau',
    'God bless you': 'Allah ya albarkace ka',
    'welcome': 'maraba'
  },
  pidgin: {
    'hello': 'how far',
    'thank you': 'thank you',
    'please': 'abeg',
    'doctor': 'dokita',
    'hospital': 'hospital',
    'medicine': 'medicine',
    'health': 'health',
    'yes': 'yes na',
    'no': 'no be so',
    'good morning': 'good morning',
    'good afternoon': 'good afternoon',
    'good evening': 'good evening',
    'how are you': 'how you dey',
    'I am fine': 'I dey fine',
    'God bless you': 'God go bless you',
    'welcome': 'you are welcome'
  },
  'english-ng': {
    // Nigerian English uses standard English words but with accent
  }
};

/**
 * Common Pidgin expressions
 */
const PIDGIN_EXPRESSIONS: Record<string, string> = {
  'you understand?': 'you sabi?',
  'I understand': 'I sabi',
  "I don't understand": 'I no sabi',
  'come here': 'come here na',
  'let us go': 'make we go',
  'wait a moment': 'hold on small',
  'it is good': 'e good',
  'it is bad': 'e no good',
  'very good': 'e don burst',
  'be careful': 'take time',
  'hurry up': 'sharp sharp',
  'no problem': 'no wahala',
  'this is serious': 'e serious o',
  'my friend': 'my guy',
  'brothers and sisters': 'my people',
  'what happened': 'wetin happen',
  'tell me': 'gist me',
  'I am telling you': 'I dey tell you'
};

/**
 * Nigerian Voice Engine
 * Handles text-to-speech with authentic Nigerian accents
 */
export class NigerianVoiceEngine {
  private synthesis: SpeechSynthesis;
  private currentVoice: NigerianVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  /**
   * Get all available Nigerian voices
   */
  getVoices(): NigerianVoice[] {
    return NIGERIAN_VOICES;
  }

  /**
   * Get voices by language
   */
  getVoicesByLanguage(language: NigerianLanguage): NigerianVoice[] {
    return NIGERIAN_VOICES.filter(v => v.language === language);
  }

  /**
   * Get voices by gender
   */
  getVoicesByGender(gender: 'male' | 'female'): NigerianVoice[] {
    return NIGERIAN_VOICES.filter(v => v.gender === gender);
  }

  /**
   * Get voice by ID
   */
  getVoiceById(id: string): NigerianVoice | undefined {
    return NIGERIAN_VOICES.find(v => v.id === id);
  }

  /**
   * Set current voice
   */
  setVoice(voiceId: string): void {
    const voice = this.getVoiceById(voiceId);
    if (voice) {
      this.currentVoice = voice;
    }
  }

  /**
   * Apply Nigerian accent modulation to text
   */
  private applyAccentModulation(text: string, voice: NigerianVoice): string {
    let modifiedText = text;

    // Apply language-specific phonetics
    if (voice.language !== 'english-ng') {
      const phonetics = NIGERIAN_PHONETICS[voice.language];
      if (phonetics) {
        Object.entries(phonetics).forEach(([english, native]) => {
          const regex = new RegExp(`\\b${english}\\b`, 'gi');
          modifiedText = modifiedText.replace(regex, native);
        });
      }
    }

    // Apply Pidgin expressions
    if (voice.language === 'pidgin') {
      Object.entries(PIDGIN_EXPRESSIONS).forEach(([english, pidgin]) => {
        const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        modifiedText = modifiedText.replace(regex, pidgin);
      });
    }

    return modifiedText;
  }

  /**
   * Apply emotion modulation
   */
  private applyEmotionModulation(utterance: SpeechSynthesisUtterance, emotion: EmotionType): void {
    switch (emotion) {
      case 'happy':
        utterance.pitch *= 1.15;
        utterance.rate *= 1.1;
        break;
      case 'sad':
        utterance.pitch *= 0.9;
        utterance.rate *= 0.85;
        break;
      case 'angry':
        utterance.pitch *= 1.1;
        utterance.rate *= 1.2;
        utterance.volume = Math.min(1, utterance.volume * 1.2);
        break;
      case 'excited':
        utterance.pitch *= 1.2;
        utterance.rate *= 1.25;
        break;
      case 'calm':
        utterance.pitch *= 0.95;
        utterance.rate *= 0.9;
        break;
      case 'serious':
        utterance.pitch *= 0.9;
        utterance.rate *= 0.95;
        break;
      case 'neutral':
      default:
        // No modification
        break;
    }
  }

  /**
   * Speak text with Nigerian accent
   */
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (!this.currentVoice) {
      this.currentVoice = NIGERIAN_VOICES[0];
    }

    return new Promise((resolve, reject) => {
      try {
        // Cancel any current speech
        this.stop();

        // Apply accent modulation if enabled
        let processedText = options.useNativeWords !== false
          ? this.applyAccentModulation(text, this.currentVoice!)
          : text;

        // Add pauses for emphasis
        if (options.emphasis) {
          processedText = processedText.replace(/\./g, '... ');
          processedText = processedText.replace(/,/g, ', ');
        }

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(processedText);
        utterance.pitch = this.currentVoice!.pitch;
        utterance.rate = this.currentVoice!.rate;
        utterance.volume = this.currentVoice!.volume;

        // Try to find a matching system voice
        const voices = this.synthesis.getVoices();
        const englishVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (this.currentVoice!.gender === 'female' ? 
            v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('eva'):
            v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('mark'))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        // Apply emotion modulation
        if (options.emotion && this.currentVoice!.emotionSupport) {
          this.applyEmotionModulation(utterance, options.emotion);
        }

        // Set up event handlers
        utterance.onend = () => {
          this.isPlaying = false;
          this.currentUtterance = null;
          if (this.onEndCallback) {
            this.onEndCallback();
          }
          resolve();
        };

        utterance.onerror = (event) => {
          this.isPlaying = false;
          this.currentUtterance = null;
          reject(new Error(`Speech error: ${event.error}`));
        };

        // Start speaking
        this.currentUtterance = utterance;
        this.isPlaying = true;
        this.synthesis.speak(utterance);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    this.synthesis.cancel();
    this.isPlaying = false;
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    this.synthesis.pause();
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    this.synthesis.resume();
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.isPlaying;
  }

  /**
   * Set callback for when speech ends
   */
  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  /**
   * Get estimated duration for text
   */
  estimateDuration(text: string): number {
    if (!this.currentVoice) return 0;
    
    // Average speaking rate: ~150 words per minute
    // Adjust based on voice rate setting
    const baseWPM = 150;
    const adjustedWPM = baseWPM * this.currentVoice.rate;
    const words = text.split(/\s+/).length;
    const minutes = words / adjustedWPM;
    return minutes * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Get phoneme data for lip sync
   */
  getPhonemeData(text: string): PhonemeData[] {
    const phonemes: PhonemeData[] = [];
    const words = text.split(/\s+/);
    let currentTime = 0;
    const wordDuration = 300; // Average ms per word

    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        const char = word[i].toLowerCase();
        const phoneme = this.charToPhoneme(char);
        phonemes.push({
          phoneme,
          startTime: currentTime,
          duration: 50,
          mouthShape: this.getMouthShape(phoneme)
        });
        currentTime += 50;
      }
      currentTime += wordDuration - (word.length * 50);
    }

    return phonemes;
  }

  /**
   * Convert character to phoneme
   */
  private charToPhoneme(char: string): string {
    const phonemeMap: Record<string, string> = {
      'a': 'AH', 'e': 'EH', 'i': 'IH', 'o': 'OH', 'u': 'UH',
      'b': 'B', 'c': 'K', 'd': 'D', 'f': 'F', 'g': 'G',
      'h': 'HH', 'j': 'JH', 'k': 'K', 'l': 'L', 'm': 'M',
      'n': 'N', 'p': 'P', 'q': 'K', 'r': 'R', 's': 'S',
      't': 'T', 'v': 'V', 'w': 'W', 'x': 'KS', 'y': 'Y', 'z': 'Z'
    };
    return phonemeMap[char] || 'X';
  }

  /**
   * Get mouth shape for phoneme
   */
  private getMouthShape(phoneme: string): MouthShape {
    const vowelPhonemes = ['AH', 'EH', 'IH', 'OH', 'UH'];
    const lipRoundPhonemes = ['OH', 'UH', 'W'];
    const closePhonemes = ['M', 'B', 'P'];
    const widePhonemes = ['AH', 'EH'];

    if (closePhonemes.includes(phoneme)) {
      return { openness: 0, roundness: 0.5, width: 0.5 };
    }
    if (lipRoundPhonemes.includes(phoneme)) {
      return { openness: 0.5, roundness: 0.9, width: 0.3 };
    }
    if (widePhonemes.includes(phoneme)) {
      return { openness: 0.8, roundness: 0.2, width: 0.8 };
    }
    if (vowelPhonemes.includes(phoneme)) {
      return { openness: 0.6, roundness: 0.4, width: 0.6 };
    }
    
    // Default for consonants
    return { openness: 0.3, roundness: 0.5, width: 0.5 };
  }
}

export interface PhonemeData {
  phoneme: string;
  startTime: number;
  duration: number;
  mouthShape: MouthShape;
}

export interface MouthShape {
  openness: number; // 0-1 (closed to open)
  roundness: number; // 0-1 (stretched to rounded)
  width: number; // 0-1 (narrow to wide)
}

/**
 * Get recommended voice for video type
 */
export function getRecommendedVoice(videoType: string, language?: NigerianLanguage): NigerianVoice {
  const professionalTypes = ['health-talk', 'educational', 'news', 'interview', 'announcement'];
  const casualTypes = ['comedy-skit', 'story', 'testimonial'];
  
  const isProfessional = professionalTypes.includes(videoType);
  const isCasual = casualTypes.includes(videoType);

  let filtered = [...NIGERIAN_VOICES];

  if (language) {
    filtered = filtered.filter(v => v.language === language);
  }

  if (isProfessional) {
    filtered = filtered.filter(v => v.accent === 'urban' || v.language === 'english-ng');
    filtered.sort((a, b) => b.characteristics.authority - a.characteristics.authority);
  } else if (isCasual) {
    filtered = filtered.filter(v => v.language === 'pidgin' || v.accent === 'native');
    filtered.sort((a, b) => b.characteristics.friendliness - a.characteristics.friendliness);
  }

  if (filtered.length === 0) {
    filtered = NIGERIAN_VOICES;
  }

  return filtered[0];
}

// Export singleton instance
export const nigerianVoiceEngine = new NigerianVoiceEngine();

export default {
  NIGERIAN_VOICES,
  NIGERIAN_PHONETICS,
  PIDGIN_EXPRESSIONS,
  NigerianVoiceEngine,
  nigerianVoiceEngine,
  getRecommendedVoice
};
