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
}

export interface CustomVoice {
  id: string;
  name: string;
  audioData: ArrayBuffer;
  sampleRate: number;
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
};

export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private customVoices: Map<string, CustomVoice> = new Map();
  private audioContext: AudioContext | null = null;
  private options: TTSOptions;

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
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = opts.rate!;
      utterance.pitch = opts.pitch!;
      utterance.volume = opts.volume!;
      utterance.lang = opts.language!;

      // Set voice if specified
      if (opts.voice) {
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.name === opts.voice || v.voiceURI === opts.voice);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

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
   * Update options
   */
  setOptions(options: Partial<TTSOptions>): void {
    this.options = { ...this.options, ...options };
  }
}
