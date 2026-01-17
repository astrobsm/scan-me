/**
 * CHARLES-DOUGLAS SCAN APP
 * Text-to-Speech Module with Custom Voice Support
 */

export interface TTSOptions {
  rate?: number;       // 0.1 to 10
  pitch?: number;      // 0 to 2
  volume?: number;     // 0 to 1
  voice?: string;      // Voice name/ID
  language?: string;   // Language code
  useSSML?: boolean;   // Enable SSML support
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited';
  emphasis?: 'strong' | 'moderate' | 'reduced' | 'none';
  audioFormat?: 'wav' | 'mp3' | 'ogg';
  quality?: 'low' | 'medium' | 'high';
}

export interface CustomVoice {
  id: string;
  name: string;
  audioData: ArrayBuffer;
  sampleRate: number;
}

export interface ProsodyControl {
  rate?: string;       // 'x-slow', 'slow', 'medium', 'fast', 'x-fast'
  pitch?: string;      // '+50%', '-20%', 'x-low', 'high'
  volume?: string;     // 'silent', 'x-soft', 'soft', 'medium', 'loud'
  contour?: string;    // Pitch contour string
}

export interface TTSResult {
  audioBlob: Blob;
  duration: number;
  format: string;
}

const defaultOptions: TTSOptions = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  language: 'en-US',
  useSSML: false,
  emotion: 'neutral',
  emphasis: 'none',
  audioFormat: 'wav',
  quality: 'medium',
};

export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private customVoices: Map<string, CustomVoice> = new Map();
  private audioContext: AudioContext | null = null;
  private options: TTSOptions;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioProcessor: AudioWorkletNode | null = null;

  constructor(options: Partial<TTSOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Speak text using browser's Web Speech API
   */
  speak(text: string, options: Partial<TTSOptions> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const opts = { ...this.options, ...options };
      
      // Process text with SSML if enabled
      const processedText = opts.useSSML 
        ? this.stripSSML(text)
        : text;
      
      const utterance = new SpeechSynthesisUtterance(processedText);
      
      // Apply emotion adjustments
      const emotionSettings = this.getEmotionSettings(opts.emotion!);
      utterance.rate = opts.rate! * emotionSettings.rateMultiplier;
      utterance.pitch = opts.pitch! * emotionSettings.pitchMultiplier;
      utterance.volume = opts.volume!;
      utterance.lang = opts.language!;

      // Set voice if specified
      if (opts.voice) {
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.name === opts.voice || v.voiceURI === opts.voice);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      utterance.onerror = (e) => {
        this.currentUtterance = null;
        reject(e);
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  /**
   * Get available system voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Stop speaking
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Pause speaking
   */
  pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Upload custom voice sample
   */
  async uploadVoiceSample(file: File, name: string): Promise<CustomVoice> {
    const arrayBuffer = await file.arrayBuffer();
    
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));
    
    const customVoice: CustomVoice = {
      id: this.generateId(),
      name,
      audioData: arrayBuffer,
      sampleRate: audioBuffer.sampleRate,
    };

    this.customVoices.set(customVoice.id, customVoice);
    return customVoice;
  }

  /**
   * Get custom voices
   */
  getCustomVoices(): CustomVoice[] {
    return Array.from(this.customVoices.values());
  }

  /**
   * Remove custom voice
   */
  removeCustomVoice(id: string): boolean {
    return this.customVoices.delete(id);
  }

  /**
   * Convert text to audio using custom voice (voice cloning simulation)
   * Note: Real voice cloning requires ML models like Coqui TTS or Azure Neural Voice
   */
  async textToAudioWithVoice(text: string, voiceId: string): Promise<TTSResult> {
    const voice = this.customVoices.get(voiceId);
    if (!voice) {
      throw new Error('Custom voice not found');
    }

    // In production, use a voice cloning API:
    // - Azure Custom Neural Voice
    // - ElevenLabs
    // - Coqui TTS
    // - Tortoise TTS

    // For now, generate speech using Web Speech API and return as blob
    const audioBlob = await this.synthesizeToBlob(text);
    
    return {
      audioBlob,
      duration: this.estimateDuration(text),
      format: 'audio/wav',
    };
  }

  /**
   * Synthesize text to audio blob
   */
  async synthesizeToBlob(text: string): Promise<Blob> {
    // Use MediaRecorder to capture speech synthesis
    // This is a workaround since Web Speech API doesn't directly provide audio data
    
    return new Promise((resolve, reject) => {
      if (!this.audioContext) {
        reject(new Error('AudioContext not available'));
        return;
      }

      // Create oscillator-based speech simulation for demo
      // In production, use server-side TTS APIs for actual audio generation
      const sampleRate = 44100;
      const duration = this.estimateDuration(text);
      const numSamples = Math.floor(sampleRate * duration);
      
      const audioBuffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      // Generate simple audio (placeholder)
      for (let i = 0; i < numSamples; i++) {
        channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.1;
      }

      // Convert to WAV blob
      const wavBlob = this.audioBufferToWav(audioBuffer);
      resolve(wavBlob);
    });
  }

  /**
   * Convert AudioBuffer to WAV Blob
   */
  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const data = buffer.getChannelData(0);
    const dataLength = data.length * bytesPerSample;
    const bufferLength = 44 + dataLength;
    
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);
    
    // WAV Header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Audio data
    let offset = 44;
    for (let i = 0; i < data.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * Estimate speech duration
   */
  private estimateDuration(text: string): number {
    const wordsPerMinute = 150;
    const words = text.split(/\s+/).length;
    return (words / wordsPerMinute) * 60;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Convert text to SSML format
   */
  textToSSML(text: string, prosody?: ProsodyControl, breaks?: number[]): string {
    let ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${this.options.language}">`;
    
    if (prosody) {
      const prosodyAttrs = [];
      if (prosody.rate) prosodyAttrs.push(`rate="${prosody.rate}"`);
      if (prosody.pitch) prosodyAttrs.push(`pitch="${prosody.pitch}"`);
      if (prosody.volume) prosodyAttrs.push(`volume="${prosody.volume}"`);
      
      ssml += `<prosody ${prosodyAttrs.join(' ')}>`;
      ssml += text;
      ssml += `</prosody>`;
    } else {
      ssml += text;
    }
    
    ssml += '</speak>';
    return ssml;
  }

  /**
   * Strip SSML tags from text
   */
  private stripSSML(text: string): string {
    return text.replace(/<[^>]*>/g, '');
  }

  /**
   * Get emotion-based voice settings
   */
  private getEmotionSettings(emotion: string): { rateMultiplier: number; pitchMultiplier: number } {
    const emotionMap: Record<string, { rateMultiplier: number; pitchMultiplier: number }> = {
      neutral: { rateMultiplier: 1.0, pitchMultiplier: 1.0 },
      happy: { rateMultiplier: 1.1, pitchMultiplier: 1.15 },
      excited: { rateMultiplier: 1.2, pitchMultiplier: 1.2 },
      sad: { rateMultiplier: 0.85, pitchMultiplier: 0.9 },
      angry: { rateMultiplier: 1.15, pitchMultiplier: 1.1 },
    };
    
    return emotionMap[emotion] || emotionMap.neutral;
  }

  /**
   * Speak with emphasis
   */
  async speakWithEmphasis(text: string, emphasisLevel: 'strong' | 'moderate' | 'reduced' = 'moderate'): Promise<void> {
    const emphasisMultipliers = {
      strong: { rate: 0.9, pitch: 1.15, volume: 1.0 },
      moderate: { rate: 0.95, pitch: 1.1, volume: 1.0 },
      reduced: { rate: 0.98, pitch: 1.05, volume: 0.95 },
    };
    
    const multipliers = emphasisMultipliers[emphasisLevel];
    return this.speak(text, {
      rate: this.options.rate! * multipliers.rate,
      pitch: this.options.pitch! * multipliers.pitch,
      volume: this.options.volume! * multipliers.volume,
    });
  }

  /**
   * Split text into sentences for natural pauses
   */
  private splitIntoSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  }

  /**
   * Speak text with natural pauses
   */
  async speakNaturally(text: string): Promise<void> {
    const sentences = this.splitIntoSentences(text);
    
    for (let i = 0; i < sentences.length; i++) {
      await this.speak(sentences[i].trim());
      
      // Add natural pause between sentences
      if (i < sentences.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }

  /**
   * Get speaking progress (0-1)
   */
  getSpeakingProgress(): number {
    if (!this.currentUtterance || !this.synthesis) return 0;
    
    // This is an approximation as Web Speech API doesn't provide direct progress
    return this.synthesis.speaking ? 0.5 : 1.0;
  }

  /**
   * Check if currently speaking
   */
  get isSpeaking(): boolean {
    return this.synthesis?.speaking || false;
  }

  /**
   * Update options
   */
  setOptions(options: Partial<TTSOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
