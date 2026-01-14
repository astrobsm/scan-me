/**
 * Video Preview Engine - Real-time video preview with canvas rendering
 * Handles avatar animation, lip sync, background rendering, and TTS synchronization
 * 
 * ENHANCED with:
 * - Photorealistic Nigerian avatars from Pexels
 * - Real Nigerian background images
 * - Authentic Nigerian accent voices (Igbo, Yoruba, Hausa, Pidgin)
 */

import { Avatar, Background, Participant, DialogueLine, VideoScene, BACKGROUNDS } from './VideoCreator';
import { BACKGROUND_LIBRARY, Background as LibraryBackground } from './BackgroundLibrary';
import { 
  PhotorealisticAvatar, 
  PHOTOREALISTIC_AVATARS, 
  avatarLoader, 
  getAvatarById, 
  getRandomAvatar 
} from './PhotorealisticAvatarLibrary';
import { 
  NigerianBackground, 
  NIGERIAN_BACKGROUNDS, 
  backgroundLoader, 
  getBackgroundById, 
  getRecommendedBackground 
} from './NigerianBackgroundLibrary';
import { 
  NigerianVoice, 
  NIGERIAN_VOICES, 
  nigerianVoiceEngine, 
  getRecommendedVoice, 
  NigerianLanguage 
} from './NigerianVoiceEngine';

// Lip sync phoneme shapes
export const PHONEME_SHAPES = {
  'rest': 0,
  'aa': 0.9,    // "ah" sound
  'ee': 0.6,    // "ee" sound
  'oo': 0.7,    // "oo" sound
  'oh': 0.8,    // "oh" sound
  'eh': 0.5,    // "eh" sound
  'mm': 0.1,    // closed sounds (m, b, p)
  'ff': 0.3,    // "f/v" sounds
  'th': 0.4,    // "th" sounds
  'ss': 0.35,   // "s/z" sounds
  'sh': 0.45,   // "sh/ch" sounds
  'rr': 0.55    // "r" sounds
};

// Animation state for avatars
export interface AvatarAnimationState {
  mouthOpenness: number;
  eyeBlinkProgress: number;
  headTilt: number;
  eyePosition: { x: number; y: number };
  breathingOffset: number;
  expressionIntensity: number;
}

// Preview state
export interface PreviewState {
  isPlaying: boolean;
  currentDialogueIndex: number;
  currentSceneIndex: number;
  progress: number;
  currentSpeaker: string | null;
  currentText: string;
  animationStates: Map<string, AvatarAnimationState>;
}

// Transition effects
export type TransitionType = 'none' | 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'dissolve' | 'wipe';

// Lower third overlay
export interface LowerThird {
  title: string;
  subtitle?: string;
  position: 'left' | 'center' | 'right';
  style: 'modern' | 'news' | 'minimal' | 'gradient';
}

// Title card
export interface TitleCard {
  title: string;
  subtitle?: string;
  duration: number;
  background: string;
  textColor: string;
  animation: 'fade' | 'slide' | 'zoom' | 'typewriter';
}

export class VideoPreviewEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private speechSynth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  // Photorealistic avatar support
  private usePhotorealisticAvatars: boolean = true;
  private loadedAvatarImages: Map<string, HTMLImageElement> = new Map();
  private loadedBackgroundImages: Map<string, HTMLImageElement> = new Map();
  private currentNigerianBackground: NigerianBackground | null = null;
  private currentNigerianVoice: NigerianVoice | null = null;
  private participantPhotoAvatars: Map<string, PhotorealisticAvatar> = new Map();
  
  // Animation state
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private animationStates: Map<string, AvatarAnimationState> = new Map();
  
  // Preview state
  private previewState: PreviewState = {
    isPlaying: false,
    currentDialogueIndex: 0,
    currentSceneIndex: 0,
    progress: 0,
    currentSpeaker: null,
    currentText: '',
    animationStates: new Map()
  };
  
  // Scene data
  private participants: Participant[] = [];
  private scenes: VideoScene[] = [];
  private currentBackground: Background | LibraryBackground | null = null;
  
  // Callbacks
  private onStateChange?: (state: PreviewState) => void;
  private onComplete?: () => void;

  constructor() {
    this.speechSynth = window.speechSynthesis;
    // Set default Nigerian voice
    this.currentNigerianVoice = getRecommendedVoice('health-talk', 'english-ng');
    nigerianVoiceEngine.setVoice(this.currentNigerianVoice.id);
  }

  // Initialize with canvas element
  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Initialize animation states for all participants
    this.participants.forEach(p => {
      this.animationStates.set(p.id, this.createInitialAnimationState());
    });
    
    // Preload photorealistic avatars and backgrounds
    this.preloadPhotorealisticAssets();
  }
  
  // Preload photorealistic assets for faster rendering
  private async preloadPhotorealisticAssets(): Promise<void> {
    try {
      // Preload first 10 avatars
      const avatarsToLoad = PHOTOREALISTIC_AVATARS.slice(0, 10);
      for (const avatar of avatarsToLoad) {
        try {
          const img = await avatarLoader.loadImage(avatar, 'full');
          this.loadedAvatarImages.set(avatar.id, img);
        } catch (e) {
          console.warn(`Failed to preload avatar ${avatar.id}:`, e);
        }
      }
      
      // Preload first 5 backgrounds
      const backgroundsToLoad = NIGERIAN_BACKGROUNDS.slice(0, 5);
      for (const bg of backgroundsToLoad) {
        try {
          const img = await backgroundLoader.loadImage(bg, 'full');
          this.loadedBackgroundImages.set(bg.id, img);
        } catch (e) {
          console.warn(`Failed to preload background ${bg.id}:`, e);
        }
      }
    } catch (error) {
      console.warn('Error preloading assets:', error);
    }
  }
  
  // Enable/disable photorealistic avatars
  setPhotorealisticMode(enabled: boolean): void {
    this.usePhotorealisticAvatars = enabled;
  }
  
  // Set Nigerian voice
  setNigerianVoice(voiceId: string): void {
    const voice = NIGERIAN_VOICES.find(v => v.id === voiceId);
    if (voice) {
      this.currentNigerianVoice = voice;
      nigerianVoiceEngine.setVoice(voiceId);
    }
  }
  
  // Set Nigerian voice by language
  setVoiceByLanguage(language: NigerianLanguage, gender?: 'male' | 'female'): void {
    let voices = NIGERIAN_VOICES.filter(v => v.language === language);
    if (gender) {
      voices = voices.filter(v => v.gender === gender);
    }
    if (voices.length > 0) {
      this.currentNigerianVoice = voices[0];
      nigerianVoiceEngine.setVoice(voices[0].id);
    }
  }
  
  // Assign photorealistic avatar to participant
  async assignPhotorealisticAvatar(participantId: string, avatarId?: string): Promise<void> {
    let photoAvatar: PhotorealisticAvatar;
    
    if (avatarId) {
      photoAvatar = getAvatarById(avatarId) || getRandomAvatar();
    } else {
      // Get participant to match avatar characteristics
      const participant = this.participants.find(p => p.id === participantId);
      if (participant) {
        // Match by style/name
        const style = participant.avatar.style || '';
        const name = participant.avatar.name || '';
        const matchingAvatars = PHOTOREALISTIC_AVATARS.filter(a => 
          a.tags.some(t => style.toLowerCase().includes(t)) ||
          a.tags.some(t => name.toLowerCase().includes(t)) ||
          a.profession.toLowerCase().includes(style.toLowerCase())
        );
        photoAvatar = matchingAvatars.length > 0 
          ? matchingAvatars[Math.floor(Math.random() * matchingAvatars.length)]
          : getRandomAvatar({ gender: participant.avatar.gender === 'male' ? 'male' : 'female' });
      } else {
        photoAvatar = getRandomAvatar();
      }
    }
    
    this.participantPhotoAvatars.set(participantId, photoAvatar);
    
    // Preload the image
    try {
      const img = await avatarLoader.loadImage(photoAvatar, 'full');
      this.loadedAvatarImages.set(photoAvatar.id, img);
    } catch (e) {
      console.warn(`Failed to load avatar image for ${participantId}:`, e);
    }
  }
  
  // Set Nigerian background
  async setNigerianBackground(backgroundId: string): Promise<void> {
    const bg = getBackgroundById(backgroundId);
    if (bg) {
      this.currentNigerianBackground = bg;
      try {
        const img = await backgroundLoader.loadImage(bg, 'full');
        this.loadedBackgroundImages.set(bg.id, img);
      } catch (e) {
        console.warn('Failed to load background image:', e);
      }
    }
  }
  
  // Get recommended background for video type
  setBackgroundForVideoType(videoType: string): void {
    const bg = getRecommendedBackground(videoType);
    this.setNigerianBackground(bg.id);
  }
  
  // Get available photorealistic avatars
  getPhotorealisticAvatars(): PhotorealisticAvatar[] {
    return PHOTOREALISTIC_AVATARS;
  }
  
  // Get available Nigerian backgrounds
  getNigerianBackgrounds(): NigerianBackground[] {
    return NIGERIAN_BACKGROUNDS;
  }
  
  // Get available Nigerian voices
  getNigerianVoices(): NigerianVoice[] {
    return NIGERIAN_VOICES;
  }

  // Create initial animation state
  private createInitialAnimationState(): AvatarAnimationState {
    return {
      mouthOpenness: 0,
      eyeBlinkProgress: 0,
      headTilt: 0,
      eyePosition: { x: 0, y: 0 },
      breathingOffset: 0,
      expressionIntensity: 0.5
    };
  }

  // Set scene data
  setSceneData(participants: Participant[], scenes: VideoScene[]): void {
    this.participants = participants;
    this.scenes = scenes;
    
    // Initialize animation states
    participants.forEach(p => {
      if (!this.animationStates.has(p.id)) {
        this.animationStates.set(p.id, this.createInitialAnimationState());
      }
    });
  }

  // Set background
  setBackground(backgroundId: string): void {
    // Try library backgrounds first
    const libraryBg = BACKGROUND_LIBRARY.find(b => b.id === backgroundId);
    if (libraryBg) {
      this.currentBackground = libraryBg;
      return;
    }
    
    // Fall back to basic backgrounds
    const basicBg = BACKGROUNDS.find(b => b.id === backgroundId);
    if (basicBg) {
      this.currentBackground = basicBg;
    }
  }

  // Start preview playback
  async startPreview(onStateChange?: (state: PreviewState) => void, onComplete?: () => void): Promise<void> {
    if (!this.canvas || !this.ctx) return;
    
    this.onStateChange = onStateChange;
    this.onComplete = onComplete;
    
    this.previewState.isPlaying = true;
    this.previewState.currentDialogueIndex = 0;
    this.previewState.currentSceneIndex = 0;
    
    // Start animation loop
    this.startAnimationLoop();
    
    // Start dialogue playback
    await this.playDialogueSequence();
  }

  // Stop preview
  stopPreview(): void {
    this.previewState.isPlaying = false;
    
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Stop speech
    this.speechSynth.cancel();
    this.currentUtterance = null;
    
    // Reset speaking states
    this.animationStates.forEach(state => {
      state.mouthOpenness = 0;
    });
    
    this.notifyStateChange();
  }

  // Pause/Resume preview
  togglePause(): void {
    if (this.previewState.isPlaying) {
      this.speechSynth.pause();
      this.previewState.isPlaying = false;
    } else {
      this.speechSynth.resume();
      this.previewState.isPlaying = true;
      this.startAnimationLoop();
    }
    this.notifyStateChange();
  }

  // Start animation loop
  private startAnimationLoop(): void {
    if (!this.previewState.isPlaying) return;
    
    const animate = (timestamp: number) => {
      if (!this.previewState.isPlaying) return;
      
      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      this.frameCount++;
      
      // Update animations
      this.updateAnimations(deltaTime);
      
      // Render frame
      this.renderFrame();
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  // Update all animations
  private updateAnimations(deltaTime: number): void {
    this.animationStates.forEach((state, participantId) => {
      const isSpeaking = this.previewState.currentSpeaker === participantId;
      
      // Update mouth (lip sync simulation)
      if (isSpeaking) {
        // Simulate speech with varying mouth openness
        const speechPhase = (this.frameCount * 0.15) % (2 * Math.PI);
        const baseOpenness = 0.3 + Math.sin(speechPhase) * 0.3;
        const randomVariation = Math.random() * 0.2;
        state.mouthOpenness = Math.min(1, baseOpenness + randomVariation);
      } else {
        // Close mouth gradually
        state.mouthOpenness = Math.max(0, state.mouthOpenness - 0.1);
      }
      
      // Eye blink (random occasional blinks)
      if (state.eyeBlinkProgress > 0) {
        state.eyeBlinkProgress -= 0.15;
        if (state.eyeBlinkProgress < 0) state.eyeBlinkProgress = 0;
      } else if (Math.random() < 0.003) {
        state.eyeBlinkProgress = 1;
      }
      
      // Subtle head movement
      state.headTilt = Math.sin(this.frameCount * 0.02) * 0.03;
      
      // Eye movement (look around slightly)
      state.eyePosition.x = Math.sin(this.frameCount * 0.01) * 0.1;
      state.eyePosition.y = Math.cos(this.frameCount * 0.015) * 0.05;
      
      // Breathing animation
      state.breathingOffset = Math.sin(this.frameCount * 0.03) * 2;
    });
  }

  // Render a single frame
  private renderFrame(): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw background
    this.drawBackground();
    
    // Draw all participants
    this.participants.forEach(participant => {
      const animState = this.animationStates.get(participant.id) || this.createInitialAnimationState();
      const isSpeaking = this.previewState.currentSpeaker === participant.id;
      const currentDialogue = this.getCurrentDialogue();
      const emotion = isSpeaking && currentDialogue ? currentDialogue.emotion : 'neutral';
      
      this.drawAvatar(participant, animState, isSpeaking, emotion);
    });
    
    // Draw speech bubble for current speaker
    const currentDialogue = this.getCurrentDialogue();
    if (currentDialogue && this.previewState.currentSpeaker) {
      const speaker = this.participants.find(p => p.id === this.previewState.currentSpeaker);
      if (speaker) {
        this.drawSpeechBubble(currentDialogue.text, speaker.position, true);
      }
    }
    
    // Draw progress bar
    this.drawProgressBar();
  }

  // Draw background with enhanced rendering
  private drawBackground(): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    
    // Priority 1: Photorealistic Nigerian background image
    if (this.currentNigerianBackground) {
      const bgImage = this.loadedBackgroundImages.get(this.currentNigerianBackground.id);
      if (bgImage) {
        // Draw image to fill canvas while maintaining aspect ratio
        const imgAspect = bgImage.width / bgImage.height;
        const canvasAspect = width / height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspect > canvasAspect) {
          // Image is wider - fit by height
          drawHeight = height;
          drawWidth = height * imgAspect;
          drawX = (width - drawWidth) / 2;
          drawY = 0;
        } else {
          // Image is taller - fit by width
          drawWidth = width;
          drawHeight = width / imgAspect;
          drawX = 0;
          drawY = (height - drawHeight) / 2;
        }
        
        this.ctx.drawImage(bgImage, drawX, drawY, drawWidth, drawHeight);
        
        // Add slight darkening overlay for better avatar visibility
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, width, height);
        return;
      }
    }
    
    // Priority 2: Library background or basic background
    if (!this.currentBackground) {
      // Default gradient if no background
      const gradient = this.ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
      return;
    }
    
    // Check if it's a library background with gradient property
    if ('gradient' in this.currentBackground && this.currentBackground.gradient) {
      // Parse and draw gradient from library background
      const gradientStr = this.currentBackground.gradient;
      const colors = this.parseGradientColors(gradientStr);
      
      const gradient = this.ctx.createLinearGradient(0, 0, width, height);
      colors.forEach((color, i) => {
        gradient.addColorStop(i / Math.max(1, colors.length - 1), color);
      });
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
      
      // Draw background elements if available
      if ('elements' in this.currentBackground && this.currentBackground.elements) {
        this.drawBackgroundElements(this.currentBackground.elements);
      }
    } else if ('type' in this.currentBackground) {
      // Basic background
      const bg = this.currentBackground as Background;
      if (bg.type === 'solid') {
        this.ctx.fillStyle = bg.value;
        this.ctx.fillRect(0, 0, width, height);
      } else if (bg.type === 'gradient') {
        const colors = this.parseGradientColors(bg.value);
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        colors.forEach((color, i) => {
          gradient.addColorStop(i / Math.max(1, colors.length - 1), color);
        });
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
      }
    }
  }

  // Parse gradient colors from CSS gradient string
  private parseGradientColors(gradientStr: string): string[] {
    const colorRegex = /#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
    return gradientStr.match(colorRegex) || ['#667eea', '#764ba2'];
  }

  // Draw background elements (decorative)
  private drawBackgroundElements(elements: any[]): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    
    elements.forEach(element => {
      this.ctx!.globalAlpha = 0.15;
      
      switch (element.type) {
        case 'medical-cross':
          this.drawMedicalCross(width * 0.1, height * 0.15, 40);
          this.drawMedicalCross(width * 0.9, height * 0.85, 30);
          break;
        case 'waves':
          this.drawWaves(height);
          break;
        case 'circles':
          this.drawDecorativeCircles();
          break;
        case 'palm-trees':
          this.drawPalmTrees();
          break;
        case 'building':
        case 'buildings':
          this.drawCityscape();
          break;
        case 'stars':
          this.drawStars();
          break;
      }
      
      this.ctx!.globalAlpha = 1;
    });
  }

  // Draw decorative medical cross
  private drawMedicalCross(x: number, y: number, size: number): void {
    if (!this.ctx) return;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x - size/6, y - size/2, size/3, size);
    this.ctx.fillRect(x - size/2, y - size/6, size, size/3);
  }

  // Draw wave decoration
  private drawWaves(height: number): void {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      for (let x = 0; x < this.canvas.width; x += 5) {
        const y = height * 0.7 + Math.sin((x + this.frameCount * 2 + i * 50) * 0.02) * 20 + i * 30;
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
  }

  // Draw decorative circles
  private drawDecorativeCircles(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
      this.ctx.beginPath();
      this.ctx.arc(
        this.canvas.width * 0.8,
        this.canvas.height * 0.3,
        50 + i * 40,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }
  }

  // Draw palm trees silhouette
  private drawPalmTrees(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    
    // Simple palm tree shape
    [0.05, 0.95].forEach(xRatio => {
      const x = this.canvas!.width * xRatio;
      const y = this.canvas!.height * 0.9;
      
      // Trunk
      this.ctx!.fillRect(x - 5, y - 80, 10, 80);
      
      // Leaves (simplified)
      this.ctx!.beginPath();
      this.ctx!.arc(x, y - 80, 40, 0, Math.PI * 2);
      this.ctx!.fill();
    });
  }

  // Draw city skyline
  private drawCityscape(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    
    const buildings = [
      { x: 0.02, w: 0.08, h: 0.25 },
      { x: 0.12, w: 0.06, h: 0.35 },
      { x: 0.20, w: 0.07, h: 0.28 },
      { x: 0.78, w: 0.06, h: 0.30 },
      { x: 0.86, w: 0.08, h: 0.38 },
      { x: 0.96, w: 0.05, h: 0.22 }
    ];
    
    buildings.forEach(b => {
      const x = this.canvas!.width * b.x;
      const w = this.canvas!.width * b.w;
      const h = this.canvas!.height * b.h;
      const y = this.canvas!.height - h;
      
      this.ctx!.fillRect(x, y, w, h);
    });
  }

  // Draw stars
  private drawStars(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    for (let i = 0; i < 30; i++) {
      const x = (Math.sin(i * 234.5) * 0.5 + 0.5) * this.canvas.width;
      const y = (Math.cos(i * 123.4) * 0.5 + 0.5) * this.canvas.height * 0.5;
      const size = 1 + Math.random() * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Draw avatar with full animation
  private drawAvatar(
    participant: Participant,
    animState: AvatarAnimationState,
    isSpeaking: boolean,
    emotion: string
  ): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    
    // Check if we should use photorealistic avatar
    if (this.usePhotorealisticAvatars) {
      const photoAvatar = this.participantPhotoAvatars.get(participant.id);
      if (photoAvatar) {
        this.drawPhotorealisticAvatar(participant, photoAvatar, animState, isSpeaking, emotion);
        return;
      }
    }
    
    const avatar = participant.avatar;
    
    // Calculate position
    let x: number;
    const avatarWidth = width * 0.28;
    const avatarHeight = height * 0.65;
    
    switch (participant.position) {
      case 'left':
        x = width * 0.12;
        break;
      case 'right':
        x = width * 0.60;
        break;
      default:
        x = width * 0.36;
    }
    
    const y = height * 0.20 + animState.breathingOffset;
    const centerX = x + avatarWidth / 2;
    
    // Apply head tilt
    this.ctx.save();
    this.ctx.translate(centerX, y + avatarHeight * 0.3);
    this.ctx.rotate(animState.headTilt);
    this.ctx.translate(-centerX, -(y + avatarHeight * 0.3));
    
    // Draw body/outfit
    this.drawAvatarBody(x, y, avatarWidth, avatarHeight, avatar, isSpeaking);
    
    // Draw head
    this.drawAvatarHead(x, y, avatarWidth, avatarHeight, avatar, animState, isSpeaking, emotion);
    
    // Draw name tag
    this.drawNameTag(centerX, y + avatarHeight * 0.92, avatar.name, isSpeaking);
    
    this.ctx.restore();
  }
  
  // Draw photorealistic avatar with animations
  private drawPhotorealisticAvatar(
    participant: Participant,
    photoAvatar: PhotorealisticAvatar,
    animState: AvatarAnimationState,
    isSpeaking: boolean,
    emotion: string
  ): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    const avatarImage = this.loadedAvatarImages.get(photoAvatar.id);
    
    if (!avatarImage) {
      // Fallback to SVG avatar if image not loaded
      return;
    }
    
    // Calculate position
    let x: number;
    const avatarWidth = width * 0.28;
    const avatarHeight = height * 0.65;
    
    switch (participant.position) {
      case 'left':
        x = width * 0.12;
        break;
      case 'right':
        x = width * 0.60;
        break;
      default:
        x = width * 0.36;
    }
    
    const y = height * 0.15 + animState.breathingOffset;
    const centerX = x + avatarWidth / 2;
    
    // Apply head tilt and save context
    this.ctx.save();
    this.ctx.translate(centerX, y + avatarHeight * 0.3);
    this.ctx.rotate(animState.headTilt * 0.5); // Subtle tilt for photos
    this.ctx.translate(-centerX, -(y + avatarHeight * 0.3));
    
    // Calculate image dimensions to maintain aspect ratio
    const imgAspect = avatarImage.width / avatarImage.height;
    let drawWidth = avatarWidth;
    let drawHeight = avatarWidth / imgAspect;
    
    if (drawHeight > avatarHeight) {
      drawHeight = avatarHeight;
      drawWidth = avatarHeight * imgAspect;
    }
    
    const drawX = x + (avatarWidth - drawWidth) / 2;
    const drawY = y + (avatarHeight - drawHeight) / 2;
    
    // Add glow effect when speaking
    if (isSpeaking) {
      this.ctx.shadowColor = '#667eea';
      this.ctx.shadowBlur = 25;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
    }
    
    // Draw rounded frame
    this.ctx.beginPath();
    this.ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 15);
    this.ctx.clip();
    
    // Draw the avatar image
    this.ctx.drawImage(avatarImage, drawX, drawY, drawWidth, drawHeight);
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    
    // Draw lip sync overlay (semi-transparent mouth animation)
    if (isSpeaking && animState.mouthOpenness > 0.1) {
      const lipSync = photoAvatar.lipSyncPoints;
      const faceRect = photoAvatar.faceRect;
      
      // Calculate mouth position in canvas coordinates
      const mouthCenterX = drawX + drawWidth * lipSync.mouthTop.x;
      const mouthCenterY = drawY + drawHeight * lipSync.mouthTop.y;
      const mouthWidth = drawWidth * 0.08;
      const mouthHeight = animState.mouthOpenness * drawHeight * 0.03;
      
      // Subtle mouth animation overlay
      this.ctx.fillStyle = `rgba(0, 0, 0, ${animState.mouthOpenness * 0.3})`;
      this.ctx.beginPath();
      this.ctx.ellipse(mouthCenterX, mouthCenterY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw eye blink overlay
    if (animState.eyeBlinkProgress > 0.3) {
      const lipSync = photoAvatar.lipSyncPoints;
      const leftEyeX = drawX + drawWidth * lipSync.leftEye.x;
      const rightEyeX = drawX + drawWidth * lipSync.rightEye.x;
      const eyeY = drawY + drawHeight * lipSync.leftEye.y;
      const eyeWidth = drawWidth * 0.04;
      const eyeHeight = drawHeight * 0.015 * animState.eyeBlinkProgress;
      
      // Skin-colored overlay for blink effect
      this.ctx.fillStyle = 'rgba(139, 90, 43, 0.8)'; // Approximate skin color
      this.ctx.fillRect(leftEyeX - eyeWidth, eyeY - eyeHeight, eyeWidth * 2, eyeHeight * 2);
      this.ctx.fillRect(rightEyeX - eyeWidth, eyeY - eyeHeight, eyeWidth * 2, eyeHeight * 2);
    }
    
    this.ctx.restore();
    
    // Draw decorative frame border
    this.ctx.strokeStyle = isSpeaking ? '#667eea' : 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = isSpeaking ? 4 : 2;
    this.ctx.beginPath();
    this.ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 15);
    this.ctx.stroke();
    
    // Draw name tag
    this.drawNameTag(centerX, y + avatarHeight * 0.92, photoAvatar.name, isSpeaking);
  }

  // Draw avatar body
  private drawAvatarBody(x: number, y: number, w: number, h: number, avatar: Avatar, isSpeaking: boolean): void {
    if (!this.ctx) return;
    
    const centerX = x + w / 2;
    const bodyY = y + h * 0.45;
    const bodyHeight = h * 0.55;
    
    // Outfit colors
    const outfitColors: Record<string, string> = {
      'white-coat': '#ffffff',
      'nurse-scrubs': '#5bb3d0',
      'suit': '#2d3436',
      'blazer': '#6c5ce7',
      'casual-blouse': '#fd79a8',
      'casual-shirt': '#00b894',
      'polo-shirt': '#0984e3',
      'traditional': '#d4af37',
      'agbada': '#8b4513',
      'kaftan': '#006400'
    };
    
    // Body glow when speaking
    if (isSpeaking) {
      this.ctx.shadowColor = '#667eea';
      this.ctx.shadowBlur = 20;
    }
    
    // Body shape
    this.ctx.fillStyle = outfitColors[avatar.outfit] || '#3498db';
    this.ctx.beginPath();
    this.ctx.ellipse(centerX, bodyY + bodyHeight * 0.35, w * 0.35, bodyHeight * 0.4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    
    // Neck
    this.ctx.fillStyle = avatar.skinTone;
    this.ctx.fillRect(centerX - w * 0.08, y + h * 0.38, w * 0.16, h * 0.1);
  }

  // Draw avatar head with expressions
  private drawAvatarHead(
    x: number, y: number, w: number, h: number,
    avatar: Avatar, animState: AvatarAnimationState,
    isSpeaking: boolean, emotion: string
  ): void {
    if (!this.ctx) return;
    
    const centerX = x + w / 2;
    const headY = y + h * 0.22;
    const headRadius = w * 0.2;
    
    // Head
    this.ctx.fillStyle = avatar.skinTone;
    this.ctx.beginPath();
    this.ctx.ellipse(centerX, headY, headRadius, headRadius * 1.1, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Hair
    this.drawHair(centerX, headY, headRadius, avatar);
    
    // Eyes with blinking
    this.drawEyes(centerX, headY, headRadius, animState, emotion);
    
    // Eyebrows based on emotion
    this.drawEyebrows(centerX, headY, headRadius, avatar, emotion);
    
    // Mouth with lip sync
    this.drawMouth(centerX, headY, headRadius, animState, isSpeaking, emotion);
  }

  // Draw hair
  private drawHair(x: number, y: number, headRadius: number, avatar: Avatar): void {
    if (!this.ctx) return;
    
    this.ctx.fillStyle = avatar.hairColor;
    
    switch (avatar.hairStyle) {
      case 'professional-bun':
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 0.3, headRadius * 0.6, Math.PI, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 1.1, headRadius * 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        break;
        
      case 'short-professional':
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 0.3, headRadius * 0.8, Math.PI, 2 * Math.PI);
        this.ctx.fill();
        break;
        
      case 'hijab':
        this.ctx.fillStyle = '#6c5ce7';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, headRadius * 1.3, headRadius * 1.4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = avatar.skinTone;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, headRadius * 0.85, headRadius * 0.9, 0, 0, Math.PI);
        this.ctx.fill();
        break;
        
      case 'afro':
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 0.2, headRadius * 1.3, 0, Math.PI * 2);
        this.ctx.fill();
        break;
        
      case 'braids':
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 0.2, headRadius * 0.9, Math.PI, 2 * Math.PI);
        this.ctx.fill();
        for (let i = -2; i <= 2; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(x + i * headRadius * 0.25, y + headRadius * 0.5);
          this.ctx.lineTo(x + i * headRadius * 0.3, y + headRadius * 1.8);
          this.ctx.lineWidth = headRadius * 0.12;
          this.ctx.strokeStyle = avatar.hairColor;
          this.ctx.stroke();
        }
        break;
        
      case 'fade':
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 0.3, headRadius * 0.85, Math.PI, 2 * Math.PI);
        this.ctx.fill();
        break;
        
      case 'natural-curls':
        for (let i = 0; i < 15; i++) {
          const angle = (i / 15) * Math.PI + Math.PI;
          this.ctx.beginPath();
          this.ctx.arc(
            x + Math.cos(angle) * headRadius * 0.6,
            y - headRadius * 0.3 + Math.sin(angle) * headRadius * 0.4,
            headRadius * 0.25,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        }
        break;
        
      case 'gele':
        // Nigerian head wrap
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - headRadius * 0.4, headRadius * 1.4, headRadius * 0.8, 0, Math.PI, 2 * Math.PI);
        this.ctx.fill();
        // Add decorative folds
        this.ctx.strokeStyle = '#DAA520';
        this.ctx.lineWidth = 2;
        for (let i = -3; i <= 3; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(x + i * headRadius * 0.35, y - headRadius * 0.8);
          this.ctx.lineTo(x + i * headRadius * 0.4, y - headRadius * 0.2);
          this.ctx.stroke();
        }
        break;
        
      default:
        this.ctx.beginPath();
        this.ctx.arc(x, y - headRadius * 0.2, headRadius * 0.9, Math.PI, 2 * Math.PI);
        this.ctx.fill();
    }
  }

  // Draw eyes with blinking animation
  private drawEyes(centerX: number, headY: number, headRadius: number, animState: AvatarAnimationState, emotion: string): void {
    if (!this.ctx) return;
    
    const eyeY = headY - headRadius * 0.1;
    const eyeSpacing = headRadius * 0.4;
    const eyeRadius = headRadius * 0.12;
    const blinkFactor = 1 - animState.eyeBlinkProgress;
    
    // Eye whites (scaled by blink)
    this.ctx.fillStyle = '#ffffff';
    [-1, 1].forEach(side => {
      this.ctx!.beginPath();
      this.ctx!.ellipse(
        centerX + side * eyeSpacing + animState.eyePosition.x * headRadius,
        eyeY,
        eyeRadius * 1.2,
        eyeRadius * blinkFactor,
        0, 0, Math.PI * 2
      );
      this.ctx!.fill();
    });
    
    // Pupils (only if not fully blinked)
    if (blinkFactor > 0.3) {
      this.ctx.fillStyle = '#2d3436';
      [-1, 1].forEach(side => {
        this.ctx!.beginPath();
        this.ctx!.arc(
          centerX + side * eyeSpacing + animState.eyePosition.x * headRadius * 1.5,
          eyeY + animState.eyePosition.y * headRadius,
          eyeRadius * 0.6 * blinkFactor,
          0, Math.PI * 2
        );
        this.ctx!.fill();
        
        // Eye highlight
        this.ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx!.beginPath();
        this.ctx!.arc(
          centerX + side * eyeSpacing + animState.eyePosition.x * headRadius * 1.5 + eyeRadius * 0.2,
          eyeY + animState.eyePosition.y * headRadius - eyeRadius * 0.2,
          eyeRadius * 0.2 * blinkFactor,
          0, Math.PI * 2
        );
        this.ctx!.fill();
        this.ctx!.fillStyle = '#2d3436';
      });
    }
  }

  // Draw eyebrows based on emotion
  private drawEyebrows(centerX: number, headY: number, headRadius: number, avatar: Avatar, emotion: string): void {
    if (!this.ctx) return;
    
    const eyeY = headY - headRadius * 0.1;
    const eyeSpacing = headRadius * 0.4;
    const eyeRadius = headRadius * 0.12;
    const browY = eyeY - eyeRadius * 2.5;
    
    this.ctx.strokeStyle = avatar.hairColor;
    this.ctx.lineWidth = headRadius * 0.08;
    this.ctx.lineCap = 'round';
    
    let browAngle = 0;
    switch (emotion) {
      case 'happy': browAngle = 0.1; break;
      case 'excited': browAngle = 0.15; break;
      case 'serious': browAngle = -0.15; break;
      case 'concerned': browAngle = 0.2; break;
      case 'angry': browAngle = -0.25; break;
      case 'surprised': browAngle = 0.3; break;
    }
    
    // Left eyebrow
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - eyeSpacing - eyeRadius, browY + browAngle * headRadius);
    this.ctx.lineTo(centerX - eyeSpacing + eyeRadius, browY - browAngle * headRadius);
    this.ctx.stroke();
    
    // Right eyebrow
    this.ctx.beginPath();
    this.ctx.moveTo(centerX + eyeSpacing - eyeRadius, browY - browAngle * headRadius);
    this.ctx.lineTo(centerX + eyeSpacing + eyeRadius, browY + browAngle * headRadius);
    this.ctx.stroke();
  }

  // Draw mouth with lip sync animation
  private drawMouth(centerX: number, headY: number, headRadius: number, animState: AvatarAnimationState, isSpeaking: boolean, emotion: string): void {
    if (!this.ctx) return;
    
    const mouthY = headY + headRadius * 0.4;
    const mouthWidth = headRadius * 0.5;
    
    this.ctx.fillStyle = '#c0392b';
    
    if (isSpeaking && animState.mouthOpenness > 0.1) {
      // Animated speaking mouth
      const openAmount = animState.mouthOpenness * headRadius * 0.25;
      
      // Outer lip
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, mouthY, mouthWidth, openAmount + headRadius * 0.05, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Inner mouth (dark)
      this.ctx.fillStyle = '#1a0000';
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, mouthY, mouthWidth * 0.8, openAmount * 0.7, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Teeth (top row)
      if (openAmount > headRadius * 0.08) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(
          centerX - mouthWidth * 0.6,
          mouthY - openAmount * 0.5,
          mouthWidth * 1.2,
          openAmount * 0.35
        );
        
        // Tooth lines
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(centerX + i * mouthWidth * 0.2, mouthY - openAmount * 0.5);
          this.ctx.lineTo(centerX + i * mouthWidth * 0.2, mouthY - openAmount * 0.15);
          this.ctx.stroke();
        }
      }
      
      // Tongue hint
      if (openAmount > headRadius * 0.1) {
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, mouthY + openAmount * 0.3, mouthWidth * 0.4, openAmount * 0.3, 0, 0, Math.PI);
        this.ctx.fill();
      }
    } else {
      // Static mouth based on emotion
      this.ctx.strokeStyle = '#c0392b';
      this.ctx.lineWidth = headRadius * 0.06;
      this.ctx.lineCap = 'round';
      
      this.ctx.beginPath();
      switch (emotion) {
        case 'happy':
        case 'excited':
          this.ctx.arc(centerX, mouthY - headRadius * 0.1, mouthWidth, 0.15 * Math.PI, 0.85 * Math.PI);
          break;
        case 'serious':
        case 'concerned':
          this.ctx.moveTo(centerX - mouthWidth, mouthY);
          this.ctx.lineTo(centerX + mouthWidth, mouthY);
          break;
        case 'surprised':
          this.ctx.ellipse(centerX, mouthY, mouthWidth * 0.4, headRadius * 0.15, 0, 0, Math.PI * 2);
          this.ctx.fillStyle = '#1a0000';
          this.ctx.fill();
          break;
        default:
          this.ctx.arc(centerX, mouthY, mouthWidth * 0.7, 0.1 * Math.PI, 0.9 * Math.PI);
      }
      this.ctx.stroke();
    }
  }

  // Draw name tag
  private drawNameTag(x: number, y: number, name: string, isSpeaking: boolean): void {
    if (!this.ctx || !this.canvas) return;
    
    const padding = 15;
    this.ctx.font = 'bold 14px Arial';
    const textWidth = this.ctx.measureText(name).width;
    const tagWidth = textWidth + padding * 2;
    const tagHeight = 28;
    
    // Background with glow for speaker
    if (isSpeaking) {
      this.ctx.shadowColor = '#667eea';
      this.ctx.shadowBlur = 10;
    }
    
    this.ctx.fillStyle = isSpeaking ? 'rgba(102, 126, 234, 0.9)' : 'rgba(0, 0, 0, 0.7)';
    this.ctx.beginPath();
    this.ctx.roundRect(x - tagWidth / 2, y - tagHeight / 2, tagWidth, tagHeight, 5);
    this.ctx.fill();
    
    this.ctx.shadowBlur = 0;
    
    // Text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(name, x, y);
  }

  // Draw speech bubble
  private drawSpeechBubble(text: string, position: 'left' | 'right' | 'center', highlight: boolean): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    
    const bubbleWidth = width * 0.4;
    const bubbleHeight = height * 0.15;
    let bubbleX: number;
    
    switch (position) {
      case 'left':
        bubbleX = width * 0.05;
        break;
      case 'right':
        bubbleX = width * 0.55;
        break;
      default:
        bubbleX = width * 0.30;
    }
    
    const bubbleY = height * 0.02;
    
    // Shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetY = 5;
    
    // Bubble background
    this.ctx.fillStyle = highlight ? 'rgba(102, 126, 234, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    this.ctx.strokeStyle = highlight ? '#667eea' : '#ddd';
    this.ctx.lineWidth = 2;
    
    // Rounded rectangle
    const radius = 15;
    this.ctx.beginPath();
    this.ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, radius);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;
    
    // Pointer
    const pointerX = position === 'right' ? bubbleX + bubbleWidth * 0.7 : bubbleX + bubbleWidth * 0.3;
    this.ctx.fillStyle = highlight ? 'rgba(102, 126, 234, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    this.ctx.beginPath();
    this.ctx.moveTo(pointerX - 12, bubbleY + bubbleHeight);
    this.ctx.lineTo(pointerX, bubbleY + bubbleHeight + 18);
    this.ctx.lineTo(pointerX + 12, bubbleY + bubbleHeight);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Text with word wrap
    this.ctx.fillStyle = highlight ? '#ffffff' : '#2d3436';
    this.ctx.font = `${height * 0.022}px Arial`;
    this.ctx.textAlign = 'center';
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = bubbleWidth - 30;
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = this.ctx!.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    const lineHeight = height * 0.03;
    const startY = bubbleY + bubbleHeight / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.slice(0, 4).forEach((line, i) => {
      this.ctx!.fillText(line, bubbleX + bubbleWidth / 2, startY + i * lineHeight);
    });
  }

  // Draw progress bar
  private drawProgressBar(): void {
    if (!this.canvas || !this.ctx) return;
    
    const { width, height } = this.canvas;
    const barWidth = width * 0.8;
    const barHeight = 6;
    const barX = (width - barWidth) / 2;
    const barY = height - 25;
    
    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, barY, barWidth, barHeight, 3);
    this.ctx.fill();
    
    // Progress
    const progressWidth = barWidth * (this.previewState.progress / 100);
    const gradient = this.ctx.createLinearGradient(barX, barY, barX + progressWidth, barY);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, barY, progressWidth, barHeight, 3);
    this.ctx.fill();
  }

  // Get current dialogue
  private getCurrentDialogue(): DialogueLine | null {
    const scene = this.scenes[this.previewState.currentSceneIndex];
    if (!scene) return null;
    return scene.dialogues[this.previewState.currentDialogueIndex] || null;
  }

  // Play dialogue sequence
  private async playDialogueSequence(): Promise<void> {
    for (let sceneIndex = 0; sceneIndex < this.scenes.length; sceneIndex++) {
      if (!this.previewState.isPlaying) break;
      
      this.previewState.currentSceneIndex = sceneIndex;
      const scene = this.scenes[sceneIndex];
      
      // Set background for scene
      this.setBackground(scene.backgroundId);
      
      for (let dialogueIndex = 0; dialogueIndex < scene.dialogues.length; dialogueIndex++) {
        if (!this.previewState.isPlaying) break;
        
        this.previewState.currentDialogueIndex = dialogueIndex;
        const dialogue = scene.dialogues[dialogueIndex];
        const participant = this.participants.find(p => p.id === dialogue.participantId);
        
        if (!participant) continue;
        
        // Update speaking state
        this.previewState.currentSpeaker = participant.id;
        this.previewState.currentText = dialogue.text;
        
        // Calculate progress
        const totalDialogues = this.scenes.reduce((sum, s) => sum + s.dialogues.length, 0);
        const completedDialogues = this.scenes.slice(0, sceneIndex).reduce((sum, s) => sum + s.dialogues.length, 0) + dialogueIndex;
        this.previewState.progress = (completedDialogues / totalDialogues) * 100;
        
        this.notifyStateChange();
        
        // Speak the dialogue
        await this.speakDialogue(dialogue, participant);
        
        // Pause after dialogue
        if (dialogue.pauseAfter && dialogue.pauseAfter > 0) {
          await this.delay(dialogue.pauseAfter);
        }
      }
    }
    
    // Complete
    this.previewState.currentSpeaker = null;
    this.previewState.progress = 100;
    this.notifyStateChange();
    
    if (this.onComplete) {
      this.onComplete();
    }
  }

  // Speak a dialogue line
  private speakDialogue(dialogue: DialogueLine, participant: Participant): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(dialogue.text);
      utterance.pitch = participant.voiceSettings.pitch;
      utterance.rate = participant.voiceSettings.rate;
      utterance.volume = participant.voiceSettings.volume;
      
      if (participant.voiceSettings.voice) {
        utterance.voice = participant.voiceSettings.voice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      this.currentUtterance = utterance;
      this.speechSynth.speak(utterance);
    });
  }

  // Delay helper
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Notify state change
  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.previewState });
    }
  }

  // Render single frame for static preview
  renderStaticPreview(participants: Participant[], backgroundId: string): void {
    if (!this.canvas || !this.ctx) return;
    
    this.participants = participants;
    this.setBackground(backgroundId);
    
    // Initialize animation states
    participants.forEach(p => {
      if (!this.animationStates.has(p.id)) {
        this.animationStates.set(p.id, this.createInitialAnimationState());
      }
    });
    
    // Render
    this.renderFrame();
  }

  // Clean up
  dispose(): void {
    this.stopPreview();
    this.canvas = null;
    this.ctx = null;
    this.animationStates.clear();
  }
}

// Singleton export
export const videoPreviewEngine = new VideoPreviewEngine();
