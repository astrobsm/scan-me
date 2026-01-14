/**
 * CHARLES-DOUGLAS SCAN APP
 * Emotion Animation Engine
 * 
 * Controls expressive facial animations and emotion transitions
 */

import { EmotionState } from './Avatar3DEngine';

export type EmotionName = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral' | 'excited' | 'concerned' | 'thoughtful';

// Preset emotion configurations
export const EMOTION_PRESETS: Record<EmotionName, EmotionState> = {
  happy: {
    happiness: 0.9,
    sadness: 0,
    anger: 0,
    surprise: 0.2,
    fear: 0,
    disgust: 0,
    neutral: 0.1
  },
  sad: {
    happiness: 0,
    sadness: 0.8,
    anger: 0,
    surprise: 0,
    fear: 0.1,
    disgust: 0,
    neutral: 0.1
  },
  angry: {
    happiness: 0,
    sadness: 0.1,
    anger: 0.9,
    surprise: 0,
    fear: 0,
    disgust: 0.2,
    neutral: 0
  },
  surprised: {
    happiness: 0.2,
    sadness: 0,
    anger: 0,
    surprise: 0.95,
    fear: 0.1,
    disgust: 0,
    neutral: 0
  },
  fearful: {
    happiness: 0,
    sadness: 0.2,
    anger: 0,
    surprise: 0.4,
    fear: 0.9,
    disgust: 0,
    neutral: 0
  },
  disgusted: {
    happiness: 0,
    sadness: 0.1,
    anger: 0.3,
    surprise: 0,
    fear: 0,
    disgust: 0.9,
    neutral: 0
  },
  neutral: {
    happiness: 0.1,
    sadness: 0,
    anger: 0,
    surprise: 0,
    fear: 0,
    disgust: 0,
    neutral: 0.9
  },
  excited: {
    happiness: 0.8,
    sadness: 0,
    anger: 0,
    surprise: 0.6,
    fear: 0,
    disgust: 0,
    neutral: 0
  },
  concerned: {
    happiness: 0,
    sadness: 0.4,
    anger: 0.1,
    surprise: 0.2,
    fear: 0.3,
    disgust: 0,
    neutral: 0.3
  },
  thoughtful: {
    happiness: 0.1,
    sadness: 0.1,
    anger: 0,
    surprise: 0.1,
    fear: 0,
    disgust: 0,
    neutral: 0.7
  }
};

// Text sentiment keywords for automatic emotion detection
const SENTIMENT_KEYWORDS: Record<EmotionName, string[]> = {
  happy: ['happy', 'glad', 'joy', 'wonderful', 'great', 'excellent', 'amazing', 'love', 'excited', 'pleased', 'delighted', 'fantastic', 'good news', 'congratulations', 'well done', 'thank you', 'welcome'],
  sad: ['sad', 'sorry', 'unfortunately', 'regret', 'disappointed', 'loss', 'grief', 'mourn', 'miss', 'lonely', 'depressed', 'unhappy', 'bad news'],
  angry: ['angry', 'furious', 'outraged', 'unacceptable', 'terrible', 'awful', 'horrible', 'wrong', 'stop', 'enough', 'frustrated'],
  surprised: ['wow', 'amazing', 'incredible', 'unbelievable', 'really', 'seriously', 'what', 'how', 'shocked', 'surprised', 'unexpected'],
  fearful: ['afraid', 'scared', 'worried', 'anxious', 'danger', 'risk', 'warning', 'careful', 'emergency', 'urgent', 'critical'],
  disgusted: ['disgusting', 'gross', 'terrible', 'horrible', 'unacceptable', 'shameful', 'embarrassing'],
  neutral: ['the', 'is', 'are', 'will', 'can', 'may', 'should', 'would', 'could'],
  excited: ['exciting', 'thrilling', 'can\'t wait', 'looking forward', 'eager', 'enthusiastic', 'pumped'],
  concerned: ['worried', 'concerned', 'careful', 'important', 'serious', 'need to', 'must', 'should'],
  thoughtful: ['think', 'consider', 'perhaps', 'maybe', 'might', 'wonder', 'believe', 'understand']
};

export class EmotionEngine {
  private currentEmotion: EmotionState;
  private targetEmotion: EmotionState;
  private transitionSpeed: number = 0.05;
  private animationFrame: number | null = null;
  private onUpdate: ((state: EmotionState) => void) | null = null;
  private isAnimating: boolean = false;
  
  constructor() {
    this.currentEmotion = { ...EMOTION_PRESETS.neutral };
    this.targetEmotion = { ...EMOTION_PRESETS.neutral };
  }
  
  /**
   * Set callback for emotion updates
   */
  setUpdateCallback(callback: (state: EmotionState) => void) {
    this.onUpdate = callback;
  }
  
  /**
   * Set target emotion with smooth transition
   */
  setEmotion(emotion: EmotionName, speed: number = 0.05) {
    this.targetEmotion = { ...EMOTION_PRESETS[emotion] };
    this.transitionSpeed = speed;
    
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }
  
  /**
   * Set custom emotion blend
   */
  setCustomEmotion(emotion: Partial<EmotionState>, speed: number = 0.05) {
    this.targetEmotion = {
      ...this.currentEmotion,
      ...emotion
    };
    this.transitionSpeed = speed;
    
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }
  
  /**
   * Blend multiple emotions together
   */
  blendEmotions(emotions: { emotion: EmotionName; weight: number }[]): EmotionState {
    const result: EmotionState = {
      happiness: 0,
      sadness: 0,
      anger: 0,
      surprise: 0,
      fear: 0,
      disgust: 0,
      neutral: 0
    };
    
    let totalWeight = 0;
    for (const { emotion, weight } of emotions) {
      const preset = EMOTION_PRESETS[emotion];
      for (const key of Object.keys(result) as (keyof EmotionState)[]) {
        result[key] += preset[key] * weight;
      }
      totalWeight += weight;
    }
    
    // Normalize
    if (totalWeight > 0) {
      for (const key of Object.keys(result) as (keyof EmotionState)[]) {
        result[key] /= totalWeight;
      }
    }
    
    return result;
  }
  
  /**
   * Analyze text and detect appropriate emotion
   */
  detectEmotionFromText(text: string): EmotionName {
    const lowerText = text.toLowerCase();
    const scores: Record<EmotionName, number> = {
      happy: 0, sad: 0, angry: 0, surprised: 0,
      fearful: 0, disgusted: 0, neutral: 0,
      excited: 0, concerned: 0, thoughtful: 0
    };
    
    for (const [emotion, keywords] of Object.entries(SENTIMENT_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          scores[emotion as EmotionName] += 1;
        }
      }
    }
    
    // Check for punctuation emphasis
    if (text.includes('!')) {
      scores.excited += 0.5;
      scores.surprised += 0.3;
    }
    if (text.includes('?')) {
      scores.surprised += 0.3;
      scores.thoughtful += 0.2;
    }
    
    // Find highest scoring emotion
    let maxScore = 0;
    let detectedEmotion: EmotionName = 'neutral';
    
    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as EmotionName;
      }
    }
    
    return detectedEmotion;
  }
  
  /**
   * Auto-animate emotion based on text being spoken
   */
  animateFromText(text: string) {
    const emotion = this.detectEmotionFromText(text);
    this.setEmotion(emotion, 0.08);
  }
  
  /**
   * Create emotion sequence for dialogue
   */
  createDialogueSequence(dialogues: { text: string; duration: number }[]): { emotion: EmotionName; time: number; duration: number }[] {
    const sequence: { emotion: EmotionName; time: number; duration: number }[] = [];
    let currentTime = 0;
    
    for (const dialogue of dialogues) {
      const emotion = this.detectEmotionFromText(dialogue.text);
      sequence.push({
        emotion,
        time: currentTime,
        duration: dialogue.duration
      });
      currentTime += dialogue.duration;
    }
    
    return sequence;
  }
  
  /**
   * Micro-expressions - quick flashes of emotion
   */
  async flashEmotion(emotion: EmotionName, duration: number = 200) {
    const originalEmotion = { ...this.currentEmotion };
    this.setEmotion(emotion, 0.3);
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    this.targetEmotion = originalEmotion;
  }
  
  /**
   * Stop all animations
   */
  stop() {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  /**
   * Reset to neutral
   */
  reset() {
    this.setEmotion('neutral', 0.1);
  }
  
  private animate = () => {
    if (!this.isAnimating) return;
    
    let hasChanged = false;
    
    for (const key of Object.keys(this.currentEmotion) as (keyof EmotionState)[]) {
      const diff = this.targetEmotion[key] - this.currentEmotion[key];
      if (Math.abs(diff) > 0.001) {
        this.currentEmotion[key] += diff * this.transitionSpeed;
        hasChanged = true;
      } else {
        this.currentEmotion[key] = this.targetEmotion[key];
      }
    }
    
    this.notifyUpdate();
    
    if (hasChanged) {
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.isAnimating = false;
    }
  };
  
  private notifyUpdate() {
    if (this.onUpdate) {
      this.onUpdate({ ...this.currentEmotion });
    }
  }
  
  /**
   * Get current emotion state
   */
  getState(): EmotionState {
    return { ...this.currentEmotion };
  }
}

// Singleton instance
export const emotionEngine = new EmotionEngine();

export default EmotionEngine;
