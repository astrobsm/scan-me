/**
 * CHARLES-DOUGLAS SCAN APP
 * Voice Cloning Service
 * Creates and manages voice profiles for personalized TTS
 */

import { VoiceSample } from './VoiceRecorder';

export interface VoiceProfile {
  id: string;
  name: string;
  samples: VoiceSample[];
  createdAt: number;
  updatedAt: number;
  isDefault: boolean;
  characteristics: VoiceCharacteristics;
  embeddings?: Float32Array;
}

export interface VoiceCharacteristics {
  pitch: number;        // 0.5 - 2.0
  speed: number;        // 0.5 - 2.0
  energy: number;       // 0.5 - 2.0
  breathiness: number;  // 0 - 1
  roughness: number;    // 0 - 1
}

export interface TTSOptions {
  text: string;
  voiceProfileId?: string;
  pitch?: number;
  speed?: number;
  volume?: number;
}

export interface ClonedVoiceResult {
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
}

const VOICE_PROFILES_KEY = 'charles_douglas_voice_profiles';
const DEFAULT_CHARACTERISTICS: VoiceCharacteristics = {
  pitch: 1.0,
  speed: 1.0,
  energy: 1.0,
  breathiness: 0.3,
  roughness: 0.2,
};

/**
 * Voice Cloning and TTS Service
 */
export class VoiceCloneService {
  private profiles: Map<string, VoiceProfile> = new Map();
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.loadProfiles();
  }

  /**
   * Set API key for external voice cloning service
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('voice_clone_api_key', key);
  }

  /**
   * Get stored API key
   */
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('voice_clone_api_key');
    }
    return this.apiKey;
  }

  /**
   * Create a new voice profile from samples
   */
  async createProfile(
    name: string,
    samples: VoiceSample[],
    onProgress?: (progress: number, status: string) => void
  ): Promise<VoiceProfile> {
    onProgress?.(0.1, 'Analyzing voice samples...');

    // Analyze voice characteristics from samples
    const characteristics = await this.analyzeVoiceCharacteristics(samples, onProgress);
    
    onProgress?.(0.6, 'Creating voice embeddings...');
    
    // Generate voice embeddings for synthesis
    const embeddings = await this.generateVoiceEmbeddings(samples);
    
    onProgress?.(0.9, 'Saving voice profile...');

    const profile: VoiceProfile = {
      id: `vp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      samples,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: this.profiles.size === 0,
      characteristics,
      embeddings,
    };

    this.profiles.set(profile.id, profile);
    this.saveProfiles();

    onProgress?.(1.0, 'Voice profile created!');

    return profile;
  }

  /**
   * Analyze voice characteristics from samples
   */
  private async analyzeVoiceCharacteristics(
    samples: VoiceSample[],
    onProgress?: (progress: number, status: string) => void
  ): Promise<VoiceCharacteristics> {
    const characteristics: VoiceCharacteristics = { ...DEFAULT_CHARACTERISTICS };

    try {
      this.audioContext = new AudioContext();
      
      let totalPitch = 0;
      let totalEnergy = 0;
      let sampleCount = 0;

      for (let i = 0; i < samples.length; i++) {
        onProgress?.(0.1 + (i / samples.length) * 0.4, `Analyzing sample ${i + 1}/${samples.length}...`);
        
        const sample = samples[i];
        const arrayBuffer = await sample.blob.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);

        // Analyze pitch using autocorrelation
        const pitch = this.estimatePitch(channelData, audioBuffer.sampleRate);
        if (pitch > 0) {
          totalPitch += pitch;
          sampleCount++;
        }

        // Analyze energy/volume
        const energy = this.calculateEnergy(channelData);
        totalEnergy += energy;
      }

      if (sampleCount > 0) {
        const avgPitch = totalPitch / sampleCount;
        // Normalize pitch to 0.5-2.0 range (assuming 80-300Hz typical range)
        characteristics.pitch = Math.max(0.5, Math.min(2.0, avgPitch / 150));
      }

      if (samples.length > 0) {
        const avgEnergy = totalEnergy / samples.length;
        characteristics.energy = Math.max(0.5, Math.min(2.0, avgEnergy * 10));
      }

      // Estimate breathiness and roughness from spectral analysis
      const spectralFeatures = await this.analyzeSpectralFeatures(samples[0]);
      characteristics.breathiness = spectralFeatures.breathiness;
      characteristics.roughness = spectralFeatures.roughness;

    } catch (error) {
      console.warn('Voice analysis error:', error);
    }

    return characteristics;
  }

  /**
   * Estimate pitch using autocorrelation
   */
  private estimatePitch(channelData: Float32Array, sampleRate: number): number {
    const bufferSize = 2048;
    const correlations = new Float32Array(bufferSize);
    
    // Compute autocorrelation
    for (let lag = 0; lag < bufferSize; lag++) {
      let sum = 0;
      for (let i = 0; i < bufferSize - lag; i++) {
        sum += channelData[i] * channelData[i + lag];
      }
      correlations[lag] = sum;
    }

    // Find the first peak after the initial drop
    let peak = 0;
    let peakIndex = 0;
    const minLag = Math.floor(sampleRate / 500); // Max 500Hz
    const maxLag = Math.floor(sampleRate / 50);  // Min 50Hz

    for (let i = minLag; i < Math.min(maxLag, bufferSize); i++) {
      if (correlations[i] > peak) {
        peak = correlations[i];
        peakIndex = i;
      }
    }

    if (peakIndex > 0) {
      return sampleRate / peakIndex;
    }

    return 0;
  }

  /**
   * Calculate energy/RMS of audio
   */
  private calculateEnergy(channelData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] * channelData[i];
    }
    return Math.sqrt(sum / channelData.length);
  }

  /**
   * Analyze spectral features for breathiness and roughness
   */
  private async analyzeSpectralFeatures(sample: VoiceSample): Promise<{ breathiness: number; roughness: number }> {
    try {
      const arrayBuffer = await sample.blob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);

      // Simple spectral analysis
      const fftSize = 2048;
      const spectrum = new Float32Array(fftSize / 2);
      
      // Compute magnitude spectrum (simplified)
      for (let i = 0; i < fftSize / 2; i++) {
        let real = 0, imag = 0;
        for (let j = 0; j < Math.min(fftSize, channelData.length); j++) {
          const angle = -2 * Math.PI * i * j / fftSize;
          real += channelData[j] * Math.cos(angle);
          imag += channelData[j] * Math.sin(angle);
        }
        spectrum[i] = Math.sqrt(real * real + imag * imag);
      }

      // Estimate breathiness from high-frequency content
      const lowFreqEnergy = spectrum.slice(0, 100).reduce((a, b) => a + b, 0);
      const highFreqEnergy = spectrum.slice(100, 500).reduce((a, b) => a + b, 0);
      const breathiness = Math.min(1, highFreqEnergy / (lowFreqEnergy + 1) * 0.5);

      // Estimate roughness from spectral irregularity
      let irregularity = 0;
      for (let i = 1; i < 200; i++) {
        irregularity += Math.abs(spectrum[i] - spectrum[i - 1]);
      }
      const roughness = Math.min(1, irregularity / 1000);

      await audioContext.close();

      return { breathiness, roughness };
    } catch {
      return { breathiness: 0.3, roughness: 0.2 };
    }
  }

  /**
   * Generate voice embeddings for TTS
   */
  private async generateVoiceEmbeddings(samples: VoiceSample[]): Promise<Float32Array> {
    // Create a simplified voice embedding from averaged spectral features
    const embeddingSize = 256;
    const embedding = new Float32Array(embeddingSize);

    try {
      for (const sample of samples) {
        const arrayBuffer = await sample.blob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);

        // Extract features and add to embedding
        const step = Math.floor(channelData.length / embeddingSize);
        for (let i = 0; i < embeddingSize; i++) {
          let sum = 0;
          for (let j = 0; j < step && i * step + j < channelData.length; j++) {
            sum += Math.abs(channelData[i * step + j]);
          }
          embedding[i] += sum / step;
        }

        await audioContext.close();
      }

      // Normalize embedding
      const max = Math.max(...embedding);
      if (max > 0) {
        for (let i = 0; i < embeddingSize; i++) {
          embedding[i] /= max * samples.length;
        }
      }
    } catch (error) {
      console.warn('Embedding generation error:', error);
    }

    return embedding;
  }

  /**
   * Synthesize speech using cloned voice
   */
  async synthesize(options: TTSOptions): Promise<ClonedVoiceResult> {
    const profile = options.voiceProfileId 
      ? this.profiles.get(options.voiceProfileId)
      : this.getDefaultProfile();

    if (!profile) {
      // Fall back to browser TTS if no profile
      return this.synthesizeWithBrowserTTS(options);
    }

    // Check if external API is available
    if (this.apiKey) {
      return this.synthesizeWithExternalAPI(options, profile);
    }

    // Use local synthesis with voice characteristics
    return this.synthesizeLocally(options, profile);
  }

  /**
   * Synthesize using browser's built-in TTS with voice characteristics
   */
  private async synthesizeWithBrowserTTS(options: TTSOptions): Promise<ClonedVoiceResult> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(options.text);
      
      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.localService);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Record the output for consistency
      const audioChunks: Blob[] = [];
      const startTime = Date.now();

      utterance.onend = () => {
        const duration = Date.now() - startTime;
        // For browser TTS, we can't capture the audio blob directly
        // Return a placeholder that indicates synthesis completed
        resolve({
          audioBlob: new Blob([], { type: 'audio/wav' }),
          audioUrl: '',
          duration,
        });
      };

      utterance.onerror = (e) => {
        reject(new Error(`Speech synthesis failed: ${e.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Synthesize with external API (ElevenLabs, etc.)
   */
  private async synthesizeWithExternalAPI(
    options: TTSOptions,
    profile: VoiceProfile
  ): Promise<ClonedVoiceResult> {
    // This would integrate with external TTS APIs
    // For now, fall back to local synthesis
    return this.synthesizeLocally(options, profile);
  }

  /**
   * Local synthesis using voice characteristics
   */
  private async synthesizeLocally(
    options: TTSOptions,
    profile: VoiceProfile
  ): Promise<ClonedVoiceResult> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(options.text);
      
      // Apply voice characteristics
      utterance.rate = (options.speed || profile.characteristics.speed) * 1.0;
      utterance.pitch = (options.pitch || profile.characteristics.pitch) * 1.0;
      utterance.volume = options.volume || 1.0;

      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      const startTime = Date.now();

      utterance.onend = () => {
        const duration = Date.now() - startTime;
        resolve({
          audioBlob: new Blob([], { type: 'audio/wav' }),
          audioUrl: '',
          duration,
        });
      };

      utterance.onerror = (e) => {
        reject(new Error(`Speech synthesis failed: ${e.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Play text with cloned voice
   */
  async speak(text: string, profileId?: string): Promise<void> {
    this.stop();

    const profile = profileId 
      ? this.profiles.get(profileId)
      : this.getDefaultProfile();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (profile) {
      utterance.rate = profile.characteristics.speed;
      utterance.pitch = profile.characteristics.pitch;
    }

    // Get available voices
    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>(resolve => {
        speechSynthesis.onvoiceschanged = () => {
          voices = speechSynthesis.getVoices();
          resolve();
        };
      });
    }

    const preferredVoice = voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  }

  /**
   * Stop current speech
   */
  stop(): void {
    speechSynthesis.cancel();
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  /**
   * Get all voice profiles
   */
  getProfiles(): VoiceProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Get a specific profile
   */
  getProfile(id: string): VoiceProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Get the default profile
   */
  getDefaultProfile(): VoiceProfile | undefined {
    return Array.from(this.profiles.values()).find(p => p.isDefault);
  }

  /**
   * Set a profile as default
   */
  setDefaultProfile(id: string): void {
    for (const profile of this.profiles.values()) {
      profile.isDefault = profile.id === id;
    }
    this.saveProfiles();
  }

  /**
   * Delete a profile
   */
  deleteProfile(id: string): void {
    this.profiles.delete(id);
    this.saveProfiles();
  }

  /**
   * Update a profile
   */
  updateProfile(id: string, updates: Partial<VoiceProfile>): void {
    const profile = this.profiles.get(id);
    if (profile) {
      Object.assign(profile, updates, { updatedAt: Date.now() });
      this.saveProfiles();
    }
  }

  /**
   * Add sample to existing profile
   */
  async addSampleToProfile(profileId: string, sample: VoiceSample): Promise<void> {
    const profile = this.profiles.get(profileId);
    if (profile) {
      profile.samples.push(sample);
      profile.updatedAt = Date.now();
      
      // Recalculate characteristics with new sample
      profile.characteristics = await this.analyzeVoiceCharacteristics(profile.samples);
      profile.embeddings = await this.generateVoiceEmbeddings(profile.samples);
      
      this.saveProfiles();
    }
  }

  /**
   * Save profiles to storage
   */
  private saveProfiles(): void {
    const data = Array.from(this.profiles.values()).map(profile => ({
      ...profile,
      samples: profile.samples.map(s => ({
        ...s,
        blob: null, // Can't serialize blobs directly
        blobSize: s.blob.size,
      })),
      embeddings: profile.embeddings ? Array.from(profile.embeddings) : null,
    }));
    
    localStorage.setItem(VOICE_PROFILES_KEY, JSON.stringify(data));
  }

  /**
   * Load profiles from storage
   */
  private loadProfiles(): void {
    try {
      const data = localStorage.getItem(VOICE_PROFILES_KEY);
      if (data) {
        const profiles = JSON.parse(data);
        for (const profile of profiles) {
          // Restore embeddings
          if (profile.embeddings) {
            profile.embeddings = new Float32Array(profile.embeddings);
          }
          // Note: Blobs need to be re-recorded
          profile.samples = profile.samples.map((s: any) => ({
            ...s,
            blob: new Blob([], { type: 'audio/webm' }),
          }));
          this.profiles.set(profile.id, profile);
        }
      }
    } catch (error) {
      console.warn('Failed to load voice profiles:', error);
    }
  }

  /**
   * Export profile for backup
   */
  async exportProfile(id: string): Promise<Blob> {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const exportData = {
      ...profile,
      samples: await Promise.all(profile.samples.map(async s => ({
        ...s,
        audioData: await this.blobToBase64(s.blob),
      }))),
      embeddings: profile.embeddings ? Array.from(profile.embeddings) : null,
    };

    return new Blob([JSON.stringify(exportData)], { type: 'application/json' });
  }

  /**
   * Import profile from backup
   */
  async importProfile(file: File): Promise<VoiceProfile> {
    const text = await file.text();
    const data = JSON.parse(text);

    // Restore samples
    data.samples = await Promise.all(data.samples.map(async (s: any) => ({
      ...s,
      blob: await this.base64ToBlob(s.audioData, 'audio/webm'),
    })));

    // Restore embeddings
    if (data.embeddings) {
      data.embeddings = new Float32Array(data.embeddings);
    }

    // Generate new ID
    data.id = `vp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.profiles.set(data.id, data);
    this.saveProfiles();

    return data;
  }

  /**
   * Convert Blob to Base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Convert Base64 to Blob
   */
  private async base64ToBlob(base64: string, type: string): Promise<Blob> {
    const response = await fetch(base64);
    return response.blob();
  }
}

export default VoiceCloneService;
