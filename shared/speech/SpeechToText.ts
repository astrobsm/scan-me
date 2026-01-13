/**
 * CHARLES-DOUGLAS SCAN APP
 * Speech-to-Text Module with Excellent Recognition
 */

export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
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
};

export class SpeechToTextService {
  private recognition: SpeechRecognition | null = null;
  private options: STTOptions;
  private currentSession: TranscriptionSession | null = null;
  private onResultCallback: TranscriptionCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private isSupported: boolean = false;

  constructor(options: Partial<STTOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    this.initRecognition();
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
      const confidence = result[0].confidence;

      const alternatives = [];
      for (let j = 1; j < result.length; j++) {
        alternatives.push({
          text: result[j].transcript,
          confidence: result[j].confidence,
        });
      }

      const transcriptionResult: TranscriptionResult = {
        text: transcript,
        confidence: confidence || 0.9,
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
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
