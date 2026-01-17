/**
 * CHARLES-DOUGLAS SCAN APP
 * Speech-to-Text Module with Excellent Recognition
 */

export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  noiseReduction?: boolean;
  confidenceThreshold?: number;
  punctuation?: boolean;
  profanityFilter?: boolean;
  autoLanguageDetection?: boolean;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: Array<{ text: string; confidence: number }>;
  timestamp: number;
}

export interface TranscriptionSession {
  id: string;
  startTime: number;
  results: TranscriptionResult[];
  isActive: boolean;
}

type TranscriptionCallback = (result: TranscriptionResult) => void;
type ErrorCallback = (error: Error) => void;

const defaultOptions: STTOptions = {
  language: 'en-US',
  continuous: true,
  interimResults: true,
  maxAlternatives: 3,
  noiseReduction: true,
  confidenceThreshold: 0.5,
  punctuation: true,
  profanityFilter: false,
  autoLanguageDetection: false,
};

export class SpeechToTextService {
  private recognition: SpeechRecognition | null = null;
  private options: STTOptions;
  private currentSession: TranscriptionSession | null = null;
  private onResultCallback: TranscriptionCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private isSupported: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private noiseLevel: number = 0;
  private detectedLanguages: Map<string, number> = new Map();

  constructor(options: Partial<STTOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    if (typeof window !== 'undefined' && this.options.noiseReduction) {
      this.initAudioContext();
    }
    this.initRecognition();
  }

  /**
   * Initialize audio context for noise analysis
   */
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
    } catch (e) {
      console.warn('AudioContext not available for noise reduction');
    }
  }

  /**
   * Initialize speech recognition
   */
  private initRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    this.configureRecognition();
  }

  /**
   * Configure recognition settings
   */
  private configureRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.options.continuous!;
    this.recognition.interimResults = this.options.interimResults!;
    this.recognition.maxAlternatives = this.options.maxAlternatives!;
    this.recognition.lang = this.options.language!;

    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
    this.recognition.onstart = this.handleStart.bind(this);
  }

  /**
   * Handle recognition results
   */
  private handleResult(event: SpeechRecognitionEvent): void {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      let confidence = result[0].confidence || 0.9;

      // Apply noise reduction penalty if noise level is high
      if (this.options.noiseReduction && this.noiseLevel > 0.7) {
        confidence = confidence * 0.8;
      }

      // Filter by confidence threshold
      if (confidence < this.options.confidenceThreshold!) {
        continue;
      }

      // Auto-detect language if enabled
      if (this.options.autoLanguageDetection && result.isFinal) {
        this.detectLanguage(transcript);
      }

      // Apply punctuation if enabled
      const processedText = this.options.punctuation 
        ? this.addPunctuation(transcript) 
        : transcript;

      const alternatives = [];
      for (let j = 1; j < result.length; j++) {
        alternatives.push({
          text: result[j].transcript,
          confidence: result[j].confidence,
        });
      }

      const transcriptionResult: TranscriptionResult = {
        text: processedText,
        confidence: confidence,
        isFinal: result.isFinal,
        alternatives,
        timestamp: Date.now(),
      };

      if (this.currentSession) {
        this.currentSession.results.push(transcriptionResult);
      }

      if (this.onResultCallback) {
        this.onResultCallback(transcriptionResult);
      }
    }
  }

  /**
   * Handle errors
   */
  private handleError(event: SpeechRecognitionErrorEvent): void {
    const error = new Error(`Speech recognition error: ${event.error}`);
    
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  /**
   * Handle recognition end
   */
  private handleEnd(): void {
    if (this.currentSession && this.options.continuous) {
      // Auto-restart for continuous mode
      try {
        this.recognition?.start();
      } catch (e) {
        // Already started
      }
    }
  }

  /**
   * Handle recognition start
   */
  private handleStart(): void {
    console.log('Speech recognition started');
  }

  /**
   * Start listening
   */
  start(onResult: TranscriptionCallback, onError?: ErrorCallback): TranscriptionSession {
    if (!this.isSupported || !this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;

    this.currentSession = {
      id: this.generateId(),
      startTime: Date.now(),
      results: [],
      isActive: true,
    };

    this.recognition.start();
    return this.currentSession;
  }

  /**
   * Stop listening
   */
  stop(): TranscriptionSession | null {
    if (this.recognition) {
      this.recognition.stop();
    }

    if (this.currentSession) {
      this.currentSession.isActive = false;
    }

    const session = this.currentSession;
    this.currentSession = null;
    this.onResultCallback = null;
    this.onErrorCallback = null;

    return session;
  }

  /**
   * Abort recognition
   */
  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
    this.currentSession = null;
  }

  /**
   * Get full transcript from session
   */
  getTranscript(session: TranscriptionSession): string {
    return session.results
      .filter(r => r.isFinal)
      .map(r => r.text)
      .join(' ');
  }

  /**
   * Get supported languages
   */
  static getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'es-MX', name: 'Spanish (Mexico)' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'ar-SA', name: 'Arabic' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'ru-RU', name: 'Russian' },
    ];
  }

  /**
   * Set language
   */
  setLanguage(language: string): void {
    this.options.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  /**
   * Check if supported
   */
  get supported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if listening
   */
  get isListening(): boolean {
    return this.currentSession?.isActive || false;
  }

  /**
   * Update options
   */
  setOptions(options: Partial<STTOptions>): void {
    this.options = { ...this.options, ...options };
    this.configureRecognition();
  }

  /**
   * Add smart punctuation to transcript
   */
  private addPunctuation(text: string): string {
    let result = text;
    
    // Capitalize first letter
    result = result.charAt(0).toUpperCase() + result.slice(1);
    
    // Add period at end if missing
    if (!result.match(/[.!?]$/)) {
      result += '.';
    }
    
    // Capitalize after periods
    result = result.replace(/([.!?])\s+([a-z])/g, (match, p1, p2) => {
      return p1 + ' ' + p2.toUpperCase();
    });
    
    return result;
  }

  /**
   * Detect language from transcript
   */
  private detectLanguage(text: string): void {
    // Simple heuristic-based language detection
    const patterns = {
      'en': /\b(the|and|is|are|was|were|have|has|been)\b/gi,
      'es': /\b(el|la|los|las|de|que|es|en|por)\b/gi,
      'fr': /\b(le|la|les|de|et|est|dans|pour|avec)\b/gi,
      'de': /\b(der|die|das|und|ist|in|mit|zu)\b/gi,
    };
    
    for (const [lang, pattern] of Object.entries(patterns)) {
      const matches = text.match(pattern);
      if (matches) {
        const count = this.detectedLanguages.get(lang) || 0;
        this.detectedLanguages.set(lang, count + matches.length);
      }
    }
  }

  /**
   * Get most likely detected language
   */
  getDetectedLanguage(): string | null {
    let maxLang = null;
    let maxCount = 0;
    
    for (const [lang, count] of this.detectedLanguages.entries()) {
      if (count > maxCount) {
        maxCount = count;
        maxLang = lang;
      }
    }
    
    return maxLang;
  }

  /**
   * Get current noise level (0-1)
   */
  getNoiseLevel(): number {
    if (!this.analyser) return 0;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    this.noiseLevel = average / 255;
    
    return this.noiseLevel;
  }

  /**
   * Get audio quality metrics
   */
  getAudioQuality(): { noise: number; clarity: number; quality: string } {
    const noise = this.getNoiseLevel();
    const clarity = 1 - noise;
    
    let quality = 'excellent';
    if (noise > 0.7) quality = 'poor';
    else if (noise > 0.5) quality = 'fair';
    else if (noise > 0.3) quality = 'good';
    
    return { noise, clarity, quality };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

// Type declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}
