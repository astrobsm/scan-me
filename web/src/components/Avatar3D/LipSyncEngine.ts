/**
 * CHARLES-DOUGLAS SCAN APP
 * Lip Sync Animation Engine
 * 
 * Converts speech audio/text to viseme animations for realistic lip sync
 */

import { LipSyncState, VISEMES } from './Avatar3DEngine';

// Phoneme to Viseme mapping (simplified CMU phoneme set)
const PHONEME_TO_VISEME: Record<string, string> = {
  // Vowels
  'AA': 'aa', 'AE': 'ae', 'AH': 'ah', 'AO': 'ao', 'AW': 'aw',
  'AY': 'ay', 'EH': 'eh', 'ER': 'er', 'EY': 'ay', 'IH': 'ih',
  'IY': 'ee', 'OW': 'oh', 'OY': 'oy', 'UH': 'uh', 'UW': 'uw',
  
  // Consonants
  'B': 'b', 'CH': 'ch', 'D': 'd', 'DH': 'th', 'F': 'f',
  'G': 'g', 'HH': 'ah', 'JH': 'jh', 'K': 'k', 'L': 'l',
  'M': 'm', 'N': 'n', 'NG': 'n', 'P': 'p', 'R': 'r',
  'S': 's', 'SH': 'sh', 'T': 't', 'TH': 'th', 'V': 'v',
  'W': 'w', 'Y': 'y', 'Z': 'z', 'ZH': 'zh'
};

// Simple letter to viseme mapping for real-time text animation
const LETTER_TO_VISEME: Record<string, string> = {
  'a': 'aa', 'e': 'ee', 'i': 'ih', 'o': 'oh', 'u': 'uw',
  'b': 'b', 'c': 'k', 'd': 'd', 'f': 'f', 'g': 'g',
  'h': 'ah', 'j': 'jh', 'k': 'k', 'l': 'l', 'm': 'm',
  'n': 'n', 'p': 'p', 'q': 'k', 'r': 'r', 's': 's',
  't': 't', 'v': 'v', 'w': 'w', 'x': 's', 'y': 'ee',
  'z': 'z', ' ': 'sil', '.': 'sil', ',': 'sil', '!': 'sil',
  '?': 'sil', '-': 'sil', "'": 'sil'
};

export interface LipSyncTimeline {
  visemes: { time: number; viseme: string; duration: number }[];
  totalDuration: number;
}

export class LipSyncEngine {
  private currentViseme: string = 'sil';
  private targetViseme: string = 'sil';
  private intensity: number = 0;
  private animationFrame: number | null = null;
  private onUpdate: ((state: LipSyncState) => void) | null = null;
  private timeline: LipSyncTimeline | null = null;
  private startTime: number = 0;
  private isPlaying: boolean = false;
  
  constructor() {}
  
  /**
   * Set callback for lip sync updates
   */
  setUpdateCallback(callback: (state: LipSyncState) => void) {
    this.onUpdate = callback;
  }
  
  /**
   * Generate lip sync timeline from text
   */
  generateTimelineFromText(text: string, wordsPerMinute: number = 150): LipSyncTimeline {
    const words = text.split(/\s+/);
    const msPerWord = 60000 / wordsPerMinute;
    const msPerChar = msPerWord / 5; // Assume average 5 chars per word
    
    const visemes: { time: number; viseme: string; duration: number }[] = [];
    let currentTime = 0;
    
    for (const word of words) {
      for (const char of word.toLowerCase()) {
        const viseme = LETTER_TO_VISEME[char] || 'sil';
        const duration = msPerChar * (viseme === 'sil' ? 0.5 : 1);
        
        visemes.push({
          time: currentTime,
          viseme,
          duration
        });
        
        currentTime += duration;
      }
      
      // Add pause between words
      visemes.push({
        time: currentTime,
        viseme: 'sil',
        duration: msPerChar * 0.5
      });
      currentTime += msPerChar * 0.5;
    }
    
    return {
      visemes,
      totalDuration: currentTime
    };
  }
  
  /**
   * Generate more accurate timeline with Nigerian accent patterns
   */
  generateNigerianAccentTimeline(text: string, language: 'english' | 'igbo' | 'yoruba' | 'hausa' | 'pidgin' = 'english'): LipSyncTimeline {
    // Nigerian English tends to be more syllable-timed
    const baseTempo = language === 'pidgin' ? 130 : 140;
    
    // Adjust emphasis patterns based on language
    const emphasisPattern = {
      'igbo': { vowelStretch: 1.3, consonantSharp: 1.1 },
      'yoruba': { vowelStretch: 1.4, consonantSharp: 1.0 },
      'hausa': { vowelStretch: 1.2, consonantSharp: 1.2 },
      'pidgin': { vowelStretch: 1.5, consonantSharp: 0.9 },
      'english': { vowelStretch: 1.2, consonantSharp: 1.0 }
    };
    
    const pattern = emphasisPattern[language];
    const timeline = this.generateTimelineFromText(text, baseTempo);
    
    // Apply accent patterns
    timeline.visemes = timeline.visemes.map(v => {
      const isVowel = ['aa', 'ae', 'ah', 'ao', 'aw', 'ay', 'ee', 'eh', 'er', 'ih', 'oh', 'ow', 'oy', 'uh', 'uw'].includes(v.viseme);
      return {
        ...v,
        duration: v.duration * (isVowel ? pattern.vowelStretch : pattern.consonantSharp)
      };
    });
    
    // Recalculate times
    let time = 0;
    timeline.visemes = timeline.visemes.map(v => {
      const result = { ...v, time };
      time += v.duration;
      return result;
    });
    timeline.totalDuration = time;
    
    return timeline;
  }
  
  /**
   * Play a lip sync timeline
   */
  playTimeline(timeline: LipSyncTimeline) {
    this.timeline = timeline;
    this.startTime = performance.now();
    this.isPlaying = true;
    this.animate();
  }
  
  /**
   * Stop playback
   */
  stop() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.currentViseme = 'sil';
    this.intensity = 0;
    this.notifyUpdate();
  }
  
  /**
   * Real-time animation from live audio
   */
  animateFromAudioLevel(audioLevel: number) {
    // Simple audio level to mouth opening
    this.intensity = Math.min(1, audioLevel * 2);
    
    // Choose viseme based on audio characteristics
    if (audioLevel > 0.6) {
      this.currentViseme = 'aa';
    } else if (audioLevel > 0.4) {
      this.currentViseme = 'ah';
    } else if (audioLevel > 0.2) {
      this.currentViseme = 'eh';
    } else if (audioLevel > 0.1) {
      this.currentViseme = 'ih';
    } else {
      this.currentViseme = 'sil';
    }
    
    this.notifyUpdate();
  }
  
  /**
   * Animate character speaking a word
   */
  speakWord(word: string): Promise<void> {
    return new Promise((resolve) => {
      const timeline = this.generateTimelineFromText(word, 200);
      this.playTimeline(timeline);
      
      setTimeout(() => {
        this.stop();
        resolve();
      }, timeline.totalDuration);
    });
  }
  
  /**
   * Animate character speaking full text
   */
  async speakText(text: string, language: 'english' | 'igbo' | 'yoruba' | 'hausa' | 'pidgin' = 'english'): Promise<void> {
    const timeline = this.generateNigerianAccentTimeline(text, language);
    
    return new Promise((resolve) => {
      this.playTimeline(timeline);
      
      setTimeout(() => {
        this.stop();
        resolve();
      }, timeline.totalDuration);
    });
  }
  
  private animate = () => {
    if (!this.isPlaying || !this.timeline) return;
    
    const elapsed = performance.now() - this.startTime;
    
    // Find current viseme
    let currentViseme = 'sil';
    let intensity = 0;
    
    for (let i = 0; i < this.timeline.visemes.length; i++) {
      const v = this.timeline.visemes[i];
      if (elapsed >= v.time && elapsed < v.time + v.duration) {
        currentViseme = v.viseme;
        // Smooth intensity curve within each viseme
        const progress = (elapsed - v.time) / v.duration;
        intensity = Math.sin(progress * Math.PI); // Bell curve
        break;
      }
    }
    
    this.currentViseme = currentViseme;
    this.intensity = intensity;
    this.notifyUpdate();
    
    if (elapsed < this.timeline.totalDuration) {
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.stop();
    }
  };
  
  private notifyUpdate() {
    if (this.onUpdate) {
      this.onUpdate({
        viseme: this.currentViseme,
        intensity: this.intensity
      });
    }
  }
  
  /**
   * Get current lip sync state
   */
  getState(): LipSyncState {
    return {
      viseme: this.currentViseme,
      intensity: this.intensity
    };
  }
}

// Singleton instance
export const lipSyncEngine = new LipSyncEngine();

export default LipSyncEngine;
