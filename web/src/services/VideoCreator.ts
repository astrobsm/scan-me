// Video Creation Service with Avatar Animation and Speech Synthesis

export interface Avatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  style: 'professional' | 'casual' | 'medical' | 'animated';
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  outfit: string;
  voiceId?: string;
  thumbnail: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: Avatar;
  position: 'left' | 'right' | 'center';
  voiceSettings: {
    pitch: number;
    rate: number;
    volume: number;
    voice?: SpeechSynthesisVoice;
  };
}

export interface DialogueLine {
  id: string;
  participantId: string;
  text: string;
  emotion: 'neutral' | 'happy' | 'serious' | 'excited' | 'concerned';
  duration?: number;
  pauseAfter?: number;
}

export interface VideoScene {
  id: string;
  backgroundId: string;
  dialogues: DialogueLine[];
  transition: 'none' | 'fade' | 'slide' | 'zoom';
}

export interface VideoProject {
  id: string;
  title: string;
  type: 'advert' | 'health-talk' | 'educational' | 'interview' | 'news' | 'podcast' | 'tutorial' | 'testimonial' | 'documentary' | 'story' | 'product-demo' | 'announcement' | 'debate' | 'explainer' | 'comedy-skit' | 'motivational' | 'custom';
  topic: string;
  description: string;
  participants: Participant[];
  scenes: VideoScene[];
  backgroundMusic?: string;
  watermark?: string;
  resolution: '720p' | '1080p' | '4k';
  createdAt: Date;
  updatedAt: Date;
}

export interface Background {
  id: string;
  name: string;
  category: 'office' | 'hospital' | 'studio' | 'outdoor' | 'abstract' | 'custom';
  type: 'solid' | 'gradient' | 'image' | 'video';
  value: string;
  thumbnail: string;
}

export interface ExportProgress {
  stage: 'preparing' | 'rendering' | 'encoding' | 'finalizing';
  progress: number;
  currentFrame: number;
  totalFrames: number;
  estimatedTimeRemaining: number;
}

// Predefined avatars
export const AVATARS: Avatar[] = [
  {
    id: 'avatar-1',
    name: 'Dr. Adaeze',
    gender: 'female',
    style: 'medical',
    skinTone: '#8B5A2B',
    hairColor: '#1a1a1a',
    hairStyle: 'professional-bun',
    outfit: 'white-coat',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-2',
    name: 'Dr. Chukwu',
    gender: 'male',
    style: 'medical',
    skinTone: '#6B4423',
    hairColor: '#1a1a1a',
    hairStyle: 'short-professional',
    outfit: 'white-coat',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-3',
    name: 'Nurse Amina',
    gender: 'female',
    style: 'medical',
    skinTone: '#D2691E',
    hairColor: '#2d2d2d',
    hairStyle: 'hijab',
    outfit: 'nurse-scrubs',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-4',
    name: 'Prof. Okonkwo',
    gender: 'male',
    style: 'professional',
    skinTone: '#5D3A1A',
    hairColor: '#4a4a4a',
    hairStyle: 'gray-distinguished',
    outfit: 'suit',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-5',
    name: 'Sarah',
    gender: 'female',
    style: 'casual',
    skinTone: '#C68642',
    hairColor: '#1a1a1a',
    hairStyle: 'braids',
    outfit: 'casual-blouse',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-6',
    name: 'Emmanuel',
    gender: 'male',
    style: 'casual',
    skinTone: '#8B4513',
    hairColor: '#1a1a1a',
    hairStyle: 'fade',
    outfit: 'casual-shirt',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-7',
    name: 'Presenter Chioma',
    gender: 'female',
    style: 'professional',
    skinTone: '#A0522D',
    hairColor: '#2d1810',
    hairStyle: 'natural-curls',
    outfit: 'blazer',
    thumbnail: 'data:image/svg+xml,...'
  },
  {
    id: 'avatar-8',
    name: 'Host Tunde',
    gender: 'male',
    style: 'professional',
    skinTone: '#6B4423',
    hairColor: '#1a1a1a',
    hairStyle: 'afro',
    outfit: 'polo-shirt',
    thumbnail: 'data:image/svg+xml,...'
  }
];

// Predefined backgrounds
export const BACKGROUNDS: Background[] = [
  {
    id: 'bg-1',
    name: 'Modern Office',
    category: 'office',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-2',
    name: 'Hospital Room',
    category: 'hospital',
    type: 'gradient',
    value: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-3',
    name: 'News Studio',
    category: 'studio',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-4',
    name: 'Green Nature',
    category: 'outdoor',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-5',
    name: 'Clean White',
    category: 'studio',
    type: 'solid',
    value: '#f5f5f5',
    thumbnail: ''
  },
  {
    id: 'bg-6',
    name: 'Warm Sunset',
    category: 'abstract',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-7',
    name: 'Medical Blue',
    category: 'hospital',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-8',
    name: 'Corporate Gray',
    category: 'office',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-9',
    name: 'Purple Dreams',
    category: 'abstract',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    thumbnail: ''
  },
  {
    id: 'bg-10',
    name: 'Health Green',
    category: 'hospital',
    type: 'gradient',
    value: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    thumbnail: ''
  }
];

// Video templates - Comprehensive video type options
export const VIDEO_TEMPLATES = {
  'health-talk': {
    name: 'Health Talk',
    description: 'Educational health discussion format',
    icon: '🏥',
    category: 'educational',
    suggestedParticipants: 2,
    suggestedDuration: '3-5 minutes',
    structure: [
      'Introduction & Topic Overview',
      'Main Discussion Points',
      'Expert Insights',
      'Q&A or Summary',
      'Call to Action'
    ]
  },
  'advert': {
    name: 'Advertisement',
    description: 'Promotional content format',
    icon: '📢',
    category: 'commercial',
    suggestedParticipants: 1,
    suggestedDuration: '30-60 seconds',
    structure: [
      'Hook/Attention Grabber',
      'Problem Statement',
      'Solution Introduction',
      'Benefits Highlight',
      'Call to Action'
    ]
  },
  'educational': {
    name: 'Educational',
    description: 'Learning and tutorial format',
    icon: '📚',
    category: 'educational',
    suggestedParticipants: 1,
    suggestedDuration: '5-10 minutes',
    structure: [
      'Introduction',
      'Concept Explanation',
      'Examples & Demonstrations',
      'Key Takeaways',
      'Conclusion'
    ]
  },
  'interview': {
    name: 'Interview',
    description: 'One-on-one or panel interview format',
    icon: '🎤',
    category: 'talk-show',
    suggestedParticipants: 2,
    suggestedDuration: '5-15 minutes',
    structure: [
      'Introduction of Guest',
      'Opening Question',
      'Main Discussion Points',
      'Follow-up Questions',
      'Closing Remarks'
    ]
  },
  'news': {
    name: 'News Report',
    description: 'Professional news broadcast format',
    icon: '📰',
    category: 'broadcast',
    suggestedParticipants: 1,
    suggestedDuration: '2-5 minutes',
    structure: [
      'Breaking News Introduction',
      'Story Details',
      'Expert Commentary',
      'Impact Analysis',
      'Wrap-up'
    ]
  },
  'podcast': {
    name: 'Podcast Style',
    description: 'Casual conversation podcast format',
    icon: '🎙️',
    category: 'talk-show',
    suggestedParticipants: 2,
    suggestedDuration: '10-30 minutes',
    structure: [
      'Welcome & Topic Intro',
      'Main Discussion',
      'Listener Questions',
      'Hot Takes',
      'Outro & Next Episode Preview'
    ]
  },
  'tutorial': {
    name: 'Step-by-Step Tutorial',
    description: 'Detailed how-to instructional video',
    icon: '📝',
    category: 'educational',
    suggestedParticipants: 1,
    suggestedDuration: '5-15 minutes',
    structure: [
      'What You Will Learn',
      'Prerequisites & Materials',
      'Step 1, 2, 3...',
      'Tips & Tricks',
      'Summary & Resources'
    ]
  },
  'testimonial': {
    name: 'Testimonial',
    description: 'Customer or user testimonial format',
    icon: '⭐',
    category: 'commercial',
    suggestedParticipants: 1,
    suggestedDuration: '1-3 minutes',
    structure: [
      'Personal Introduction',
      'The Problem They Faced',
      'Discovery of Solution',
      'Results & Benefits',
      'Recommendation'
    ]
  },
  'documentary': {
    name: 'Documentary',
    description: 'In-depth documentary style narration',
    icon: '🎬',
    category: 'narrative',
    suggestedParticipants: 1,
    suggestedDuration: '10-30 minutes',
    structure: [
      'Opening Hook',
      'Background & Context',
      'The Journey',
      'Key Revelations',
      'Conclusion & Reflection'
    ]
  },
  'story': {
    name: 'Storytelling',
    description: 'Engaging narrative storytelling format',
    icon: '📖',
    category: 'narrative',
    suggestedParticipants: 1,
    suggestedDuration: '3-10 minutes',
    structure: [
      'Once Upon a Time...',
      'Character Introduction',
      'The Challenge',
      'The Journey',
      'Resolution & Moral'
    ]
  },
  'product-demo': {
    name: 'Product Demo',
    description: 'Product demonstration and showcase',
    icon: '🛍️',
    category: 'commercial',
    suggestedParticipants: 1,
    suggestedDuration: '3-7 minutes',
    structure: [
      'Product Introduction',
      'Key Features',
      'Live Demonstration',
      'Use Cases',
      'Where to Buy'
    ]
  },
  'announcement': {
    name: 'Announcement',
    description: 'Official announcement or update',
    icon: '📣',
    category: 'broadcast',
    suggestedParticipants: 1,
    suggestedDuration: '1-3 minutes',
    structure: [
      'Greeting',
      'The Big Announcement',
      'Details & Timeline',
      'What This Means',
      'Next Steps'
    ]
  },
  'debate': {
    name: 'Debate',
    description: 'Two-sided debate or discussion',
    icon: '⚖️',
    category: 'talk-show',
    suggestedParticipants: 2,
    suggestedDuration: '10-20 minutes',
    structure: [
      'Topic Introduction',
      'Position A Argument',
      'Position B Counter',
      'Rebuttals',
      'Conclusion'
    ]
  },
  'explainer': {
    name: 'Explainer',
    description: 'Explain complex topics simply',
    icon: '💡',
    category: 'educational',
    suggestedParticipants: 1,
    suggestedDuration: '2-5 minutes',
    structure: [
      'The Question',
      'Simple Explanation',
      'Examples',
      'Why It Matters',
      'Summary'
    ]
  },
  'comedy-skit': {
    name: 'Comedy Skit',
    description: 'Humorous short-form content',
    icon: '😂',
    category: 'entertainment',
    suggestedParticipants: 2,
    suggestedDuration: '1-3 minutes',
    structure: [
      'Setup',
      'Build-up',
      'Punchline',
      'Tag/Callback',
      'Outro'
    ]
  },
  'motivational': {
    name: 'Motivational',
    description: 'Inspirational and motivational speech',
    icon: '🔥',
    category: 'narrative',
    suggestedParticipants: 1,
    suggestedDuration: '3-7 minutes',
    structure: [
      'Powerful Opening',
      'The Challenge',
      'The Breakthrough',
      'Lessons Learned',
      'Call to Action'
    ]
  },
  'custom': {
    name: 'Custom',
    description: 'Build your own format',
    icon: '🎨',
    category: 'custom',
    suggestedParticipants: 1,
    suggestedDuration: 'Variable',
    structure: []
  }
};

// Video type categories for filtering
export const VIDEO_CATEGORIES = [
  { id: 'all', name: 'All Types', icon: '🎬' },
  { id: 'educational', name: 'Educational', icon: '📚' },
  { id: 'commercial', name: 'Commercial', icon: '📢' },
  { id: 'talk-show', name: 'Talk Show', icon: '🎤' },
  { id: 'broadcast', name: 'Broadcast', icon: '📰' },
  { id: 'narrative', name: 'Narrative', icon: '📖' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
  { id: 'custom', name: 'Custom', icon: '🎨' }
];

export class VideoCreatorService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private speechSynth: SpeechSynthesis;
  private audioContext: AudioContext | null = null;
  private isRecording = false;
  private currentProject: VideoProject | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.speechSynth = window.speechSynthesis;
  }

  // Initialize canvas with resolution
  initializeCanvas(resolution: '720p' | '1080p' | '4k'): void {
    const resolutions = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 }
    };
    
    const { width, height } = resolutions[resolution];
    this.canvas.width = width;
    this.canvas.height = height;
  }

  // Draw background
  drawBackground(background: Background): void {
    const { width, height } = this.canvas;
    
    if (background.type === 'solid') {
      this.ctx.fillStyle = background.value;
      this.ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'gradient') {
      const gradient = this.ctx.createLinearGradient(0, 0, width, height);
      // Parse gradient colors from CSS gradient string
      const colors = this.parseGradient(background.value);
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  // Parse CSS gradient
  private parseGradient(gradientStr: string): string[] {
    const colorRegex = /#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
    return gradientStr.match(colorRegex) || ['#667eea', '#764ba2'];
  }

  // Draw avatar on canvas
  drawAvatar(
    avatar: Avatar, 
    position: 'left' | 'right' | 'center',
    emotion: string,
    isSpeaking: boolean,
    mouthOpenness: number = 0
  ): void {
    const { width, height } = this.canvas;
    
    // Calculate position
    let x: number;
    const avatarWidth = width * 0.3;
    const avatarHeight = height * 0.7;
    
    switch (position) {
      case 'left':
        x = width * 0.15;
        break;
      case 'right':
        x = width * 0.55;
        break;
      default:
        x = width * 0.35;
    }
    
    const y = height * 0.15;
    
    // Draw avatar body (simplified representation)
    this.drawAvatarBody(x, y, avatarWidth, avatarHeight, avatar, emotion, isSpeaking, mouthOpenness);
  }

  // Draw avatar body with animation
  private drawAvatarBody(
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    avatar: Avatar,
    emotion: string,
    isSpeaking: boolean,
    mouthOpenness: number
  ): void {
    const ctx = this.ctx;
    const centerX = x + w / 2;
    
    // Body/Outfit
    const bodyY = y + h * 0.45;
    const bodyHeight = h * 0.55;
    
    // Outfit color based on type
    const outfitColors: Record<string, string> = {
      'white-coat': '#ffffff',
      'nurse-scrubs': '#5bb3d0',
      'suit': '#2d3436',
      'blazer': '#6c5ce7',
      'casual-blouse': '#fd79a8',
      'casual-shirt': '#00b894',
      'polo-shirt': '#0984e3'
    };
    
    ctx.fillStyle = outfitColors[avatar.outfit] || '#3498db';
    ctx.beginPath();
    ctx.ellipse(centerX, bodyY + bodyHeight * 0.3, w * 0.35, bodyHeight * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Neck
    ctx.fillStyle = avatar.skinTone;
    ctx.fillRect(centerX - w * 0.08, y + h * 0.38, w * 0.16, h * 0.1);
    
    // Head
    const headY = y + h * 0.22;
    const headRadius = w * 0.2;
    
    ctx.fillStyle = avatar.skinTone;
    ctx.beginPath();
    ctx.ellipse(centerX, headY, headRadius, headRadius * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    this.drawHair(centerX, headY, headRadius, avatar);
    
    // Eyes
    const eyeY = headY - headRadius * 0.1;
    const eyeSpacing = headRadius * 0.4;
    const eyeRadius = headRadius * 0.12;
    
    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(centerX - eyeSpacing, eyeY, eyeRadius * 1.2, eyeRadius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + eyeSpacing, eyeY, eyeRadius * 1.2, eyeRadius, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.arc(centerX - eyeSpacing, eyeY, eyeRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + eyeSpacing, eyeY, eyeRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyebrows based on emotion
    ctx.strokeStyle = avatar.hairColor;
    ctx.lineWidth = headRadius * 0.08;
    ctx.lineCap = 'round';
    
    const browY = eyeY - eyeRadius * 2;
    let browAngle = 0;
    
    switch (emotion) {
      case 'happy':
        browAngle = 0.1;
        break;
      case 'serious':
        browAngle = -0.15;
        break;
      case 'concerned':
        browAngle = 0.2;
        break;
      case 'excited':
        browAngle = 0.15;
        break;
    }
    
    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX - eyeSpacing - eyeRadius, browY + browAngle * headRadius);
    ctx.lineTo(centerX - eyeSpacing + eyeRadius, browY - browAngle * headRadius);
    ctx.stroke();
    
    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX + eyeSpacing - eyeRadius, browY - browAngle * headRadius);
    ctx.lineTo(centerX + eyeSpacing + eyeRadius, browY + browAngle * headRadius);
    ctx.stroke();
    
    // Mouth
    const mouthY = headY + headRadius * 0.4;
    const mouthWidth = headRadius * 0.5;
    
    ctx.fillStyle = '#c0392b';
    
    if (isSpeaking) {
      // Animated mouth for speaking
      const openAmount = mouthOpenness * headRadius * 0.2;
      ctx.beginPath();
      ctx.ellipse(centerX, mouthY, mouthWidth, openAmount + headRadius * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Teeth
      if (openAmount > headRadius * 0.05) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - mouthWidth * 0.6, mouthY - openAmount * 0.3, mouthWidth * 1.2, openAmount * 0.4);
      }
    } else {
      // Static mouth based on emotion
      ctx.beginPath();
      if (emotion === 'happy' || emotion === 'excited') {
        ctx.arc(centerX, mouthY - headRadius * 0.05, mouthWidth, 0.1 * Math.PI, 0.9 * Math.PI);
      } else if (emotion === 'serious' || emotion === 'concerned') {
        ctx.moveTo(centerX - mouthWidth, mouthY);
        ctx.lineTo(centerX + mouthWidth, mouthY);
      } else {
        ctx.arc(centerX, mouthY, mouthWidth * 0.8, 0, Math.PI);
      }
      ctx.stroke();
    }
    
    // Name tag
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(centerX - w * 0.25, y + h * 0.88, w * 0.5, h * 0.08);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${h * 0.04}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(avatar.name, centerX, y + h * 0.94);
  }

  // Draw hair based on style
  private drawHair(x: number, y: number, headRadius: number, avatar: Avatar): void {
    const ctx = this.ctx;
    ctx.fillStyle = avatar.hairColor;
    
    switch (avatar.hairStyle) {
      case 'professional-bun':
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.3, headRadius * 0.6, Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 1.1, headRadius * 0.3, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'short-professional':
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.3, headRadius * 0.8, Math.PI, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'hijab':
        ctx.fillStyle = '#6c5ce7';
        ctx.beginPath();
        ctx.ellipse(x, y, headRadius * 1.3, headRadius * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = avatar.skinTone;
        ctx.beginPath();
        ctx.ellipse(x, y, headRadius * 0.85, headRadius * 0.9, 0, 0, Math.PI);
        ctx.fill();
        break;
        
      case 'gray-distinguished':
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.2, headRadius * 0.9, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Temples
        ctx.beginPath();
        ctx.arc(x - headRadius * 0.7, y, headRadius * 0.3, 0, Math.PI * 2);
        ctx.arc(x + headRadius * 0.7, y, headRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'braids':
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.2, headRadius * 0.9, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Draw braids
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(x + i * headRadius * 0.25, y + headRadius * 0.5);
          ctx.lineTo(x + i * headRadius * 0.3, y + headRadius * 1.8);
          ctx.lineWidth = headRadius * 0.12;
          ctx.strokeStyle = avatar.hairColor;
          ctx.stroke();
        }
        break;
        
      case 'fade':
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.3, headRadius * 0.85, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Fade effect
        const fadeGradient = ctx.createLinearGradient(x - headRadius, y, x + headRadius, y);
        fadeGradient.addColorStop(0, avatar.hairColor);
        fadeGradient.addColorStop(0.3, avatar.skinTone);
        fadeGradient.addColorStop(0.7, avatar.skinTone);
        fadeGradient.addColorStop(1, avatar.hairColor);
        ctx.fillStyle = fadeGradient;
        ctx.beginPath();
        ctx.arc(x, y, headRadius * 0.3, 0, Math.PI);
        ctx.fill();
        break;
        
      case 'natural-curls':
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI + Math.PI;
          const r = headRadius * (0.8 + Math.random() * 0.3);
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle) * headRadius * 0.6,
            y - headRadius * 0.3 + Math.sin(angle) * headRadius * 0.4,
            headRadius * 0.25,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
        
      case 'afro':
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.2, headRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      default:
        ctx.beginPath();
        ctx.arc(x, y - headRadius * 0.2, headRadius * 0.9, Math.PI, 2 * Math.PI);
        ctx.fill();
    }
  }

  // Draw speech bubble
  drawSpeechBubble(text: string, position: 'left' | 'right' | 'center', highlight: boolean = false): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    
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
        bubbleX = width * 0.3;
    }
    
    const bubbleY = height * 0.02;
    
    // Bubble background
    ctx.fillStyle = highlight ? 'rgba(102, 126, 234, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = highlight ? '#667eea' : '#ddd';
    ctx.lineWidth = 3;
    
    // Rounded rectangle
    const radius = 15;
    ctx.beginPath();
    ctx.moveTo(bubbleX + radius, bubbleY);
    ctx.lineTo(bubbleX + bubbleWidth - radius, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + radius);
    ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - radius);
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - radius, bubbleY + bubbleHeight);
    ctx.lineTo(bubbleX + radius, bubbleY + bubbleHeight);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - radius);
    ctx.lineTo(bubbleX, bubbleY + radius);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Pointer
    const pointerX = position === 'right' ? bubbleX + bubbleWidth * 0.7 : bubbleX + bubbleWidth * 0.3;
    ctx.beginPath();
    ctx.moveTo(pointerX - 15, bubbleY + bubbleHeight);
    ctx.lineTo(pointerX, bubbleY + bubbleHeight + 20);
    ctx.lineTo(pointerX + 15, bubbleY + bubbleHeight);
    ctx.closePath();
    ctx.fill();
    
    // Text
    ctx.fillStyle = highlight ? '#ffffff' : '#2d3436';
    ctx.font = `${height * 0.025}px Arial`;
    ctx.textAlign = 'center';
    
    // Word wrap
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = bubbleWidth - 40;
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    const lineHeight = height * 0.035;
    const startY = bubbleY + bubbleHeight / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, i) => {
      ctx.fillText(line, bubbleX + bubbleWidth / 2, startY + i * lineHeight);
    });
  }

  // Text-to-speech with timing
  async speakText(text: string, voiceSettings: Participant['voiceSettings']): Promise<number> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voiceSettings.pitch;
      utterance.rate = voiceSettings.rate;
      utterance.volume = voiceSettings.volume;
      
      if (voiceSettings.voice) {
        utterance.voice = voiceSettings.voice;
      }
      
      const startTime = Date.now();
      
      utterance.onend = () => {
        resolve(Date.now() - startTime);
      };
      
      utterance.onerror = () => {
        resolve(2000); // Default duration on error
      };
      
      this.speechSynth.speak(utterance);
    });
  }

  // Get speech duration estimate
  estimateSpeechDuration(text: string, rate: number): number {
    const wordsPerMinute = 150 * rate;
    const words = text.split(' ').length;
    return (words / wordsPerMinute) * 60 * 1000;
  }

  // Start video recording
  async startRecording(project: VideoProject, onProgress: (progress: ExportProgress) => void): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        this.currentProject = project;
        this.initializeCanvas(project.resolution);
        this.recordedChunks = [];
        
        // Create audio context for mixing
        this.audioContext = new AudioContext();
        
        // Get canvas stream
        const canvasStream = this.canvas.captureStream(30);
        
        // Create destination for audio
        const audioDestination = this.audioContext.createMediaStreamDestination();
        
        // Combine video and audio streams
        const combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...audioDestination.stream.getAudioTracks()
        ]);
        
        // Setup media recorder
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm';
        
        this.mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: project.resolution === '4k' ? 20000000 : 
                             project.resolution === '1080p' ? 10000000 : 5000000
        });
        
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };
        
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          resolve(blob);
        };
        
        this.mediaRecorder.start(100);
        this.isRecording = true;
        
        // Render scenes
        await this.renderScenes(project, onProgress);
        
        // Stop recording
        this.mediaRecorder.stop();
        this.isRecording = false;
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Render all scenes
  private async renderScenes(project: VideoProject, onProgress: (progress: ExportProgress) => void): Promise<void> {
    const totalDialogues = project.scenes.reduce((sum, scene) => sum + scene.dialogues.length, 0);
    let processedDialogues = 0;
    
    for (const scene of project.scenes) {
      const background = BACKGROUNDS.find(b => b.id === scene.backgroundId) || BACKGROUNDS[0];
      
      for (const dialogue of scene.dialogues) {
        const participant = project.participants.find(p => p.id === dialogue.participantId);
        if (!participant) continue;
        
        // Estimate duration
        const duration = dialogue.duration || this.estimateSpeechDuration(dialogue.text, participant.voiceSettings.rate);
        const frames = Math.ceil((duration / 1000) * 30);
        
        // Render frames for this dialogue
        for (let frame = 0; frame < frames; frame++) {
          // Clear canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Draw background
          this.drawBackground(background);
          
          // Draw all participants
          for (const p of project.participants) {
            const isSpeaking = p.id === participant.id;
            const mouthOpenness = isSpeaking ? Math.sin(frame * 0.5) * 0.5 + 0.5 : 0;
            this.drawAvatar(p.avatar, p.position, isSpeaking ? dialogue.emotion : 'neutral', isSpeaking, mouthOpenness);
          }
          
          // Draw speech bubble for current speaker
          this.drawSpeechBubble(dialogue.text, participant.position, true);
          
          // Small delay for frame timing
          await new Promise(r => setTimeout(r, 33));
        }
        
        // Speak the dialogue
        await this.speakText(dialogue.text, participant.voiceSettings);
        
        // Pause after dialogue
        if (dialogue.pauseAfter) {
          await new Promise(r => setTimeout(r, dialogue.pauseAfter));
        }
        
        processedDialogues++;
        onProgress({
          stage: 'rendering',
          progress: (processedDialogues / totalDialogues) * 100,
          currentFrame: processedDialogues,
          totalFrames: totalDialogues,
          estimatedTimeRemaining: (totalDialogues - processedDialogues) * 3
        });
      }
      
      // Scene transition
      if (scene.transition !== 'none') {
        await this.renderTransition(scene.transition);
      }
    }
  }

  // Render transition effect
  private async renderTransition(type: 'fade' | 'slide' | 'zoom'): Promise<void> {
    const frames = 30;
    
    for (let i = 0; i < frames; i++) {
      const progress = i / frames;
      
      switch (type) {
        case 'fade':
          this.ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          break;
        case 'slide':
          this.ctx.save();
          this.ctx.translate(-this.canvas.width * progress, 0);
          this.ctx.restore();
          break;
        case 'zoom':
          this.ctx.save();
          const scale = 1 + progress * 0.5;
          this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
          this.ctx.scale(scale, scale);
          this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
          this.ctx.restore();
          break;
      }
      
      await new Promise(r => setTimeout(r, 33));
    }
  }

  // Convert WebM to MP4 (using browser encoding)
  async convertToMP4(webmBlob: Blob): Promise<Blob> {
    // For now, return webm as browsers don't natively support MP4 encoding
    // In production, you'd use a library like ffmpeg.wasm
    return webmBlob;
  }

  // Save project to localStorage
  saveProject(project: VideoProject): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem('video-projects', JSON.stringify(projects));
  }

  // Get all projects
  getProjects(): VideoProject[] {
    const data = localStorage.getItem('video-projects');
    return data ? JSON.parse(data) : [];
  }

  // Delete project
  deleteProject(projectId: string): void {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    localStorage.setItem('video-projects', JSON.stringify(projects));
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.speechSynth.getVoices();
  }

  // Generate unique ID
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const videoCreator = new VideoCreatorService();
