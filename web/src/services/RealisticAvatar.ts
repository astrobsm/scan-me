// Realistic Avatar System with Lip Sync and Phoneme Animation

export interface RealisticAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageGroup: 'young' | 'middle' | 'senior';
  ethnicity: 'african' | 'caucasian' | 'asian' | 'hispanic' | 'mixed';
  style: 'professional' | 'casual' | 'medical' | 'business';
  
  // Facial features
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'oblong';
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  
  // Clothing
  outfit: string;
  outfitColor: string;
  
  // Expression defaults
  defaultExpression: Expression;
  
  // Image URLs (for realistic photos)
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface Expression {
  eyebrows: 'neutral' | 'raised' | 'furrowed' | 'sad';
  eyes: 'open' | 'squint' | 'wide' | 'closed';
  mouth: MouthShape;
  intensity: number; // 0-1
}

export type MouthShape = 
  | 'closed'      // Rest position
  | 'aah'         // A, I sounds - wide open
  | 'ooh'         // O, U sounds - rounded
  | 'ee'          // E sound - wide smile
  | 'fv'          // F, V sounds - teeth on lip
  | 'th'          // TH sound - tongue visible
  | 'mbp'         // M, B, P sounds - closed lips
  | 'wq'          // W, Q sounds - pursed
  | 'rest'        // Neutral rest
  | 'smile'       // Happy expression
  | 'serious';    // Serious expression

export interface Phoneme {
  phoneme: string;
  mouthShape: MouthShape;
  duration: number;
}

// Phoneme to mouth shape mapping
export const PHONEME_MAP: Record<string, MouthShape> = {
  // Vowels
  'a': 'aah', 'aa': 'aah', 'ah': 'aah', 'ay': 'aah',
  'e': 'ee', 'ee': 'ee', 'eh': 'ee', 'ey': 'ee',
  'i': 'ee', 'ih': 'ee', 'iy': 'ee',
  'o': 'ooh', 'oh': 'ooh', 'ow': 'ooh', 'oy': 'ooh',
  'u': 'ooh', 'uh': 'ooh', 'uw': 'ooh',
  
  // Consonants
  'b': 'mbp', 'm': 'mbp', 'p': 'mbp',
  'f': 'fv', 'v': 'fv',
  'th': 'th', 'dh': 'th',
  'w': 'wq', 'q': 'wq',
  'l': 'ee', 'r': 'ee',
  's': 'ee', 'z': 'ee', 'sh': 'ee', 'zh': 'ee',
  'ch': 'ee', 'jh': 'ee',
  'd': 'ee', 't': 'ee', 'n': 'ee',
  'g': 'ee', 'k': 'ee', 'ng': 'ee',
  'h': 'aah',
  'y': 'ee',
  
  // Default
  ' ': 'rest',
  '.': 'closed',
  ',': 'rest',
  '!': 'closed',
  '?': 'closed'
};

// Emotion presets
export const EMOTION_PRESETS: Record<string, Expression> = {
  neutral: {
    eyebrows: 'neutral',
    eyes: 'open',
    mouth: 'rest',
    intensity: 0.5
  },
  happy: {
    eyebrows: 'raised',
    eyes: 'squint',
    mouth: 'smile',
    intensity: 0.8
  },
  excited: {
    eyebrows: 'raised',
    eyes: 'wide',
    mouth: 'aah',
    intensity: 1.0
  },
  serious: {
    eyebrows: 'furrowed',
    eyes: 'open',
    mouth: 'serious',
    intensity: 0.7
  },
  concerned: {
    eyebrows: 'sad',
    eyes: 'open',
    mouth: 'rest',
    intensity: 0.6
  },
  sad: {
    eyebrows: 'sad',
    eyes: 'squint',
    mouth: 'closed',
    intensity: 0.7
  },
  surprised: {
    eyebrows: 'raised',
    eyes: 'wide',
    mouth: 'ooh',
    intensity: 0.9
  },
  angry: {
    eyebrows: 'furrowed',
    eyes: 'squint',
    mouth: 'serious',
    intensity: 0.9
  }
};

// Realistic avatar presets with detailed features
export const REALISTIC_AVATARS: RealisticAvatar[] = [
  {
    id: 'avatar-dr-adaeze',
    name: 'Dr. Adaeze Okonkwo',
    gender: 'female',
    ageGroup: 'middle',
    ethnicity: 'african',
    style: 'medical',
    faceShape: 'oval',
    skinTone: '#8B5A2B',
    eyeColor: '#3D2314',
    hairColor: '#1a1a1a',
    hairStyle: 'professional-updo',
    outfit: 'white-coat',
    outfitColor: '#ffffff',
    defaultExpression: EMOTION_PRESETS.neutral
  },
  {
    id: 'avatar-dr-emeka',
    name: 'Dr. Emeka Nwosu',
    gender: 'male',
    ageGroup: 'middle',
    ethnicity: 'african',
    style: 'medical',
    faceShape: 'square',
    skinTone: '#6B4423',
    eyeColor: '#2D1810',
    hairColor: '#1a1a1a',
    hairStyle: 'short-professional',
    outfit: 'white-coat',
    outfitColor: '#ffffff',
    defaultExpression: EMOTION_PRESETS.neutral
  },
  {
    id: 'avatar-nurse-amina',
    name: 'Nurse Amina Ibrahim',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'african',
    style: 'medical',
    faceShape: 'heart',
    skinTone: '#C68642',
    eyeColor: '#3D2314',
    hairColor: '#2d2d2d',
    hairStyle: 'hijab',
    outfit: 'nurse-scrubs',
    outfitColor: '#5bb3d0',
    defaultExpression: EMOTION_PRESETS.happy
  },
  {
    id: 'avatar-prof-obi',
    name: 'Prof. Chinedu Obi',
    gender: 'male',
    ageGroup: 'senior',
    ethnicity: 'african',
    style: 'professional',
    faceShape: 'oblong',
    skinTone: '#5D3A1A',
    eyeColor: '#2D1810',
    hairColor: '#6b6b6b',
    hairStyle: 'gray-distinguished',
    outfit: 'suit',
    outfitColor: '#2d3436',
    defaultExpression: EMOTION_PRESETS.serious
  },
  {
    id: 'avatar-chioma',
    name: 'Chioma Eze',
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'african',
    style: 'casual',
    faceShape: 'round',
    skinTone: '#A0522D',
    eyeColor: '#3D2314',
    hairColor: '#1a1a1a',
    hairStyle: 'natural-curls',
    outfit: 'casual-blouse',
    outfitColor: '#fd79a8',
    defaultExpression: EMOTION_PRESETS.happy
  },
  {
    id: 'avatar-tunde',
    name: 'Tunde Bakare',
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'african',
    style: 'business',
    faceShape: 'oval',
    skinTone: '#8B4513',
    eyeColor: '#2D1810',
    hairColor: '#1a1a1a',
    hairStyle: 'fade',
    outfit: 'business-casual',
    outfitColor: '#0984e3',
    defaultExpression: EMOTION_PRESETS.neutral
  },
  {
    id: 'avatar-ngozi',
    name: 'Ngozi Adesanya',
    gender: 'female',
    ageGroup: 'middle',
    ethnicity: 'african',
    style: 'business',
    faceShape: 'oval',
    skinTone: '#CD853F',
    eyeColor: '#3D2314',
    hairColor: '#2d1810',
    hairStyle: 'braids',
    outfit: 'blazer',
    outfitColor: '#6c5ce7',
    defaultExpression: EMOTION_PRESETS.neutral
  },
  {
    id: 'avatar-kola',
    name: 'Kola Adeyemi',
    gender: 'male',
    ageGroup: 'middle',
    ethnicity: 'african',
    style: 'casual',
    faceShape: 'round',
    skinTone: '#6B4423',
    eyeColor: '#2D1810',
    hairColor: '#1a1a1a',
    hairStyle: 'afro',
    outfit: 'polo-shirt',
    outfitColor: '#00b894',
    defaultExpression: EMOTION_PRESETS.happy
  }
];

export class AvatarRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  
  // Render a realistic avatar with expression and lip sync
  renderAvatar(
    avatar: RealisticAvatar,
    x: number,
    y: number,
    width: number,
    height: number,
    expression: Expression,
    mouthShape: MouthShape,
    speakingIntensity: number = 0
  ): void {
    const ctx = this.ctx;
    const centerX = x + width / 2;
    
    // Calculate proportions
    const headRadius = width * 0.2;
    const headY = y + height * 0.25;
    const bodyY = y + height * 0.45;
    
    // Draw body/clothing
    this.drawBody(centerX, bodyY, width, height, avatar);
    
    // Draw neck
    this.drawNeck(centerX, headY + headRadius * 0.9, headRadius * 0.35, headRadius * 0.5, avatar.skinTone);
    
    // Draw head
    this.drawHead(centerX, headY, headRadius, avatar, expression, mouthShape, speakingIntensity);
    
    // Draw name badge
    this.drawNameBadge(centerX, y + height * 0.92, width * 0.6, avatar.name);
  }
  
  private drawBody(x: number, y: number, w: number, h: number, avatar: RealisticAvatar): void {
    const ctx = this.ctx;
    const bodyWidth = w * 0.5;
    const bodyHeight = h * 0.45;
    
    // Shoulders
    ctx.fillStyle = avatar.outfitColor;
    ctx.beginPath();
    ctx.ellipse(x, y + bodyHeight * 0.2, bodyWidth * 0.7, bodyHeight * 0.3, 0, Math.PI, 0);
    ctx.fill();
    
    // Torso
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.6, y + bodyHeight * 0.2);
    ctx.lineTo(x - bodyWidth * 0.4, y + bodyHeight);
    ctx.lineTo(x + bodyWidth * 0.4, y + bodyHeight);
    ctx.lineTo(x + bodyWidth * 0.6, y + bodyHeight * 0.2);
    ctx.closePath();
    ctx.fill();
    
    // Add collar/details based on outfit
    if (avatar.outfit === 'white-coat') {
      // Lab coat lapels
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - bodyWidth * 0.15, y);
      ctx.lineTo(x - bodyWidth * 0.25, y + bodyHeight * 0.4);
      ctx.moveTo(x + bodyWidth * 0.15, y);
      ctx.lineTo(x + bodyWidth * 0.25, y + bodyHeight * 0.4);
      ctx.stroke();
      
      // Stethoscope
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y + bodyHeight * 0.15, bodyWidth * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    } else if (avatar.outfit === 'suit' || avatar.outfit === 'blazer') {
      // Suit lapels
      ctx.fillStyle = this.darkenColor(avatar.outfitColor, 20);
      ctx.beginPath();
      ctx.moveTo(x - bodyWidth * 0.1, y - bodyHeight * 0.05);
      ctx.lineTo(x - bodyWidth * 0.3, y + bodyHeight * 0.3);
      ctx.lineTo(x - bodyWidth * 0.15, y + bodyHeight * 0.35);
      ctx.lineTo(x, y + bodyHeight * 0.1);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + bodyWidth * 0.1, y - bodyHeight * 0.05);
      ctx.lineTo(x + bodyWidth * 0.3, y + bodyHeight * 0.3);
      ctx.lineTo(x + bodyWidth * 0.15, y + bodyHeight * 0.35);
      ctx.lineTo(x, y + bodyHeight * 0.1);
      ctx.closePath();
      ctx.fill();
      
      // Tie or shirt
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(x, y - bodyHeight * 0.02);
      ctx.lineTo(x - bodyWidth * 0.08, y + bodyHeight * 0.08);
      ctx.lineTo(x, y + bodyHeight * 0.4);
      ctx.lineTo(x + bodyWidth * 0.08, y + bodyHeight * 0.08);
      ctx.closePath();
      ctx.fill();
    }
  }
  
  private drawNeck(x: number, y: number, width: number, height: number, skinTone: string): void {
    const ctx = this.ctx;
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.moveTo(x - width, y);
    ctx.lineTo(x - width * 0.8, y + height);
    ctx.lineTo(x + width * 0.8, y + height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();
  }
  
  private drawHead(
    x: number,
    y: number,
    radius: number,
    avatar: RealisticAvatar,
    expression: Expression,
    mouthShape: MouthShape,
    speakingIntensity: number
  ): void {
    const ctx = this.ctx;
    
    // Face shape adjustments
    let scaleX = 1;
    let scaleY = 1;
    switch (avatar.faceShape) {
      case 'round':
        scaleX = 1.05;
        scaleY = 0.95;
        break;
      case 'oblong':
        scaleX = 0.9;
        scaleY = 1.15;
        break;
      case 'square':
        scaleX = 1.1;
        scaleY = 1;
        break;
      case 'heart':
        scaleX = 1;
        scaleY = 1.05;
        break;
    }
    
    // Head base
    ctx.fillStyle = avatar.skinTone;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * scaleX, radius * scaleY, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add subtle shading
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3, y - radius * 0.3, 0,
      x, y, radius * scaleX
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * scaleX, radius * scaleY, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw hair first (behind face for some styles)
    if (avatar.hairStyle !== 'hijab') {
      this.drawHair(x, y, radius, avatar);
    }
    
    // Draw facial features
    this.drawEyes(x, y, radius, avatar, expression);
    this.drawEyebrows(x, y, radius, avatar, expression);
    this.drawNose(x, y, radius, avatar);
    this.drawMouth(x, y, radius, avatar, mouthShape, expression, speakingIntensity);
    
    // Draw hair on top (for hijab)
    if (avatar.hairStyle === 'hijab') {
      this.drawHijab(x, y, radius, avatar);
    }
  }
  
  private drawEyes(x: number, y: number, radius: number, avatar: RealisticAvatar, expression: Expression): void {
    const ctx = this.ctx;
    const eyeY = y - radius * 0.1;
    const eyeSpacing = radius * 0.35;
    const eyeWidth = radius * 0.18;
    const eyeHeight = radius * 0.12;
    
    // Eye opening based on expression
    let heightMod = 1;
    switch (expression.eyes) {
      case 'squint':
        heightMod = 0.5;
        break;
      case 'wide':
        heightMod = 1.3;
        break;
      case 'closed':
        heightMod = 0.1;
        break;
    }
    
    // Draw each eye
    [-1, 1].forEach(side => {
      const ex = x + side * eyeSpacing;
      
      // Eye white
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, eyeWidth, eyeHeight * heightMod, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye outline
      ctx.strokeStyle = this.darkenColor(avatar.skinTone, 30);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      if (expression.eyes !== 'closed') {
        // Iris
        ctx.fillStyle = avatar.eyeColor;
        ctx.beginPath();
        ctx.arc(ex, eyeY, eyeHeight * heightMod * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(ex, eyeY, eyeHeight * heightMod * 0.35, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(ex - eyeHeight * 0.2, eyeY - eyeHeight * 0.2, eyeHeight * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Eyelashes
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, eyeY - eyeHeight * 0.1, eyeWidth, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    });
  }
  
  private drawEyebrows(x: number, y: number, radius: number, avatar: RealisticAvatar, expression: Expression): void {
    const ctx = this.ctx;
    const browY = y - radius * 0.3;
    const browSpacing = radius * 0.35;
    const browWidth = radius * 0.2;
    
    ctx.strokeStyle = avatar.hairColor;
    ctx.lineWidth = radius * 0.05;
    ctx.lineCap = 'round';
    
    let leftAngle = 0;
    let rightAngle = 0;
    let yOffset = 0;
    
    switch (expression.eyebrows) {
      case 'raised':
        yOffset = -radius * 0.05;
        leftAngle = 0.1;
        rightAngle = -0.1;
        break;
      case 'furrowed':
        leftAngle = -0.2;
        rightAngle = 0.2;
        break;
      case 'sad':
        leftAngle = 0.15;
        rightAngle = -0.15;
        break;
    }
    
    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(x - browSpacing - browWidth, browY + yOffset + leftAngle * radius);
    ctx.quadraticCurveTo(
      x - browSpacing, browY + yOffset - radius * 0.03,
      x - browSpacing + browWidth * 0.8, browY + yOffset - leftAngle * radius * 0.5
    );
    ctx.stroke();
    
    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(x + browSpacing - browWidth * 0.8, browY + yOffset - rightAngle * radius * 0.5);
    ctx.quadraticCurveTo(
      x + browSpacing, browY + yOffset - radius * 0.03,
      x + browSpacing + browWidth, browY + yOffset + rightAngle * radius
    );
    ctx.stroke();
  }
  
  private drawNose(x: number, y: number, radius: number, avatar: RealisticAvatar): void {
    const ctx = this.ctx;
    const noseY = y + radius * 0.15;
    
    // Nose shadow/shape
    ctx.fillStyle = this.darkenColor(avatar.skinTone, 15);
    ctx.beginPath();
    ctx.moveTo(x, y - radius * 0.1);
    ctx.lineTo(x - radius * 0.08, noseY);
    ctx.quadraticCurveTo(x, noseY + radius * 0.05, x + radius * 0.08, noseY);
    ctx.closePath();
    ctx.fill();
    
    // Nostrils
    ctx.fillStyle = this.darkenColor(avatar.skinTone, 25);
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.05, noseY, radius * 0.03, radius * 0.02, 0, 0, Math.PI * 2);
    ctx.ellipse(x + radius * 0.05, noseY, radius * 0.03, radius * 0.02, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  private drawMouth(
    x: number,
    y: number,
    radius: number,
    avatar: RealisticAvatar,
    mouthShape: MouthShape,
    expression: Expression,
    speakingIntensity: number
  ): void {
    const ctx = this.ctx;
    const mouthY = y + radius * 0.45;
    const mouthWidth = radius * 0.35;
    
    // Lip color
    const lipColor = avatar.gender === 'female' 
      ? this.blendColors(avatar.skinTone, '#cc6677', 0.4)
      : this.darkenColor(avatar.skinTone, 20);
    
    ctx.fillStyle = lipColor;
    ctx.strokeStyle = this.darkenColor(lipColor, 20);
    ctx.lineWidth = 1;
    
    // Adjust mouth based on shape and speaking intensity
    const openAmount = speakingIntensity * radius * 0.15;
    
    switch (mouthShape) {
      case 'closed':
      case 'rest':
        // Closed mouth - slight smile or neutral
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth, mouthY);
        ctx.quadraticCurveTo(x, mouthY + radius * 0.05, x + mouthWidth, mouthY);
        ctx.quadraticCurveTo(x, mouthY - radius * 0.02, x - mouthWidth, mouthY);
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'aah':
        // Wide open mouth
        ctx.beginPath();
        ctx.ellipse(x, mouthY + openAmount * 0.3, mouthWidth * 0.8, radius * 0.12 + openAmount, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Teeth
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.rect(x - mouthWidth * 0.5, mouthY - radius * 0.02, mouthWidth, radius * 0.08);
        ctx.fill();
        
        // Tongue
        ctx.fillStyle = '#d35d6e';
        ctx.beginPath();
        ctx.ellipse(x, mouthY + radius * 0.1 + openAmount * 0.5, mouthWidth * 0.4, radius * 0.06, 0, 0, Math.PI);
        ctx.fill();
        break;
        
      case 'ooh':
        // Rounded O shape
        ctx.beginPath();
        ctx.ellipse(x, mouthY, radius * 0.1, radius * 0.12 + openAmount * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Dark interior
        ctx.fillStyle = '#2d1810';
        ctx.beginPath();
        ctx.ellipse(x, mouthY, radius * 0.06, radius * 0.08 + openAmount * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'ee':
        // Wide smile with teeth
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth, mouthY);
        ctx.quadraticCurveTo(x, mouthY + radius * 0.1 + openAmount * 0.5, x + mouthWidth, mouthY);
        ctx.quadraticCurveTo(x, mouthY - radius * 0.03, x - mouthWidth, mouthY);
        ctx.fill();
        ctx.stroke();
        
        // Teeth visible
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.rect(x - mouthWidth * 0.7, mouthY, mouthWidth * 1.4, radius * 0.06 + openAmount * 0.3);
        ctx.fill();
        break;
        
      case 'fv':
        // F/V - teeth on lower lip
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth * 0.7, mouthY);
        ctx.lineTo(x + mouthWidth * 0.7, mouthY);
        ctx.quadraticCurveTo(x, mouthY + radius * 0.05, x - mouthWidth * 0.7, mouthY);
        ctx.fill();
        
        // Upper teeth
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.rect(x - mouthWidth * 0.5, mouthY - radius * 0.02, mouthWidth, radius * 0.04);
        ctx.fill();
        break;
        
      case 'th':
        // TH - tongue between teeth
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth * 0.6, mouthY);
        ctx.lineTo(x + mouthWidth * 0.6, mouthY);
        ctx.lineTo(x + mouthWidth * 0.6, mouthY + radius * 0.03);
        ctx.lineTo(x - mouthWidth * 0.6, mouthY + radius * 0.03);
        ctx.closePath();
        ctx.fill();
        
        // Tongue
        ctx.fillStyle = '#d35d6e';
        ctx.beginPath();
        ctx.ellipse(x, mouthY + radius * 0.02, radius * 0.06, radius * 0.02, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'mbp':
        // M/B/P - lips pressed together
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth, mouthY);
        ctx.lineTo(x + mouthWidth, mouthY);
        ctx.stroke();
        ctx.lineWidth = radius * 0.04;
        ctx.strokeStyle = lipColor;
        ctx.stroke();
        break;
        
      case 'wq':
        // W/Q - pursed lips
        ctx.beginPath();
        ctx.ellipse(x, mouthY, radius * 0.08, radius * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'smile':
        // Big smile
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth, mouthY - radius * 0.02);
        ctx.quadraticCurveTo(x, mouthY + radius * 0.15, x + mouthWidth, mouthY - radius * 0.02);
        ctx.quadraticCurveTo(x, mouthY + radius * 0.05, x - mouthWidth, mouthY - radius * 0.02);
        ctx.fill();
        
        // Teeth
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.rect(x - mouthWidth * 0.6, mouthY - radius * 0.01, mouthWidth * 1.2, radius * 0.08);
        ctx.fill();
        break;
        
      case 'serious':
        // Flat serious mouth
        ctx.beginPath();
        ctx.moveTo(x - mouthWidth, mouthY);
        ctx.lineTo(x + mouthWidth, mouthY);
        ctx.lineWidth = radius * 0.04;
        ctx.strokeStyle = lipColor;
        ctx.stroke();
        break;
    }
  }
  
  private drawHair(x: number, y: number, radius: number, avatar: RealisticAvatar): void {
    const ctx = this.ctx;
    ctx.fillStyle = avatar.hairColor;
    
    switch (avatar.hairStyle) {
      case 'professional-updo':
        // Base hair
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.2, radius * 0.95, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Bun
        ctx.beginPath();
        ctx.ellipse(x, y - radius * 1.1, radius * 0.35, radius * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'short-professional':
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.15, radius * 0.9, Math.PI * 0.85, Math.PI * 2.15);
        ctx.fill();
        // Side hair
        ctx.beginPath();
        ctx.ellipse(x - radius * 0.85, y - radius * 0.1, radius * 0.15, radius * 0.4, -0.2, 0, Math.PI * 2);
        ctx.ellipse(x + radius * 0.85, y - radius * 0.1, radius * 0.15, radius * 0.4, 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'gray-distinguished':
        ctx.fillStyle = avatar.hairColor;
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.1, radius * 0.85, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
        // Gray temples
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.ellipse(x - radius * 0.75, y, radius * 0.2, radius * 0.35, -0.3, 0, Math.PI * 2);
        ctx.ellipse(x + radius * 0.75, y, radius * 0.2, radius * 0.35, 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'natural-curls':
        // Many small circles for curls
        for (let i = 0; i < 25; i++) {
          const angle = (i / 25) * Math.PI + Math.PI;
          const r = radius * (0.85 + Math.random() * 0.25);
          const cx = x + Math.cos(angle) * radius * 0.6;
          const cy = y - radius * 0.35 + Math.sin(angle) * radius * 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'braids':
        // Top hair
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.2, radius * 0.9, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Braids
        for (let i = -2; i <= 2; i++) {
          const bx = x + i * radius * 0.3;
          ctx.beginPath();
          for (let j = 0; j < 8; j++) {
            const by = y + radius * 0.5 + j * radius * 0.15;
            ctx.ellipse(bx + (j % 2 ? 0.02 : -0.02) * radius, by, radius * 0.08, radius * 0.1, 0, 0, Math.PI * 2);
          }
          ctx.fill();
        }
        break;
        
      case 'fade':
        // Top hair
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.3, radius * 0.7, Math.PI, 2 * Math.PI);
        ctx.fill();
        // Fade gradient on sides
        const fadeGrad = ctx.createLinearGradient(x - radius, y, x + radius, y);
        fadeGrad.addColorStop(0, avatar.hairColor);
        fadeGrad.addColorStop(0.3, avatar.skinTone);
        fadeGrad.addColorStop(0.7, avatar.skinTone);
        fadeGrad.addColorStop(1, avatar.hairColor);
        ctx.fillStyle = fadeGrad;
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.1, radius * 0.85, Math.PI * 0.7, Math.PI * 2.3);
        ctx.fill();
        break;
        
      case 'afro':
        // Large afro
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.15, radius * 1.25, 0, Math.PI * 2);
        ctx.fill();
        // Texture
        ctx.fillStyle = this.lightenColor(avatar.hairColor, 10);
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * radius * 0.8;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle) * dist,
            y - radius * 0.15 + Math.sin(angle) * dist,
            radius * 0.08,
            0, Math.PI * 2
          );
          ctx.fill();
        }
        break;
    }
  }
  
  private drawHijab(x: number, y: number, radius: number, avatar: RealisticAvatar): void {
    const ctx = this.ctx;
    
    // Hijab color
    ctx.fillStyle = '#6c5ce7';
    
    // Main hijab shape
    ctx.beginPath();
    ctx.ellipse(x, y - radius * 0.1, radius * 1.2, radius * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Face opening
    ctx.fillStyle = avatar.skinTone;
    ctx.beginPath();
    ctx.ellipse(x, y + radius * 0.1, radius * 0.75, radius * 0.85, 0, -0.3 * Math.PI, 1.3 * Math.PI);
    ctx.fill();
    
    // Hijab drape
    ctx.fillStyle = '#6c5ce7';
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.9, y + radius * 0.3);
    ctx.quadraticCurveTo(x - radius * 1.1, y + radius * 1.5, x - radius * 0.3, y + radius * 2);
    ctx.lineTo(x + radius * 0.3, y + radius * 2);
    ctx.quadraticCurveTo(x + radius * 1.1, y + radius * 1.5, x + radius * 0.9, y + radius * 0.3);
    ctx.fill();
  }
  
  private drawNameBadge(x: number, y: number, width: number, name: string): void {
    const ctx = this.ctx;
    const height = width * 0.2;
    
    // Badge background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(x - width / 2, y - height / 2, width, height, 8);
    ctx.fill();
    
    // Name text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${height * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y);
  }
  
  // Color utility functions
  private darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }
  
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min((num >> 16) + amt, 255);
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
    const B = Math.min((num & 0x0000FF) + amt, 255);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }
  
  private blendColors(color1: string, color2: string, ratio: number): string {
    const hex1 = parseInt(color1.replace('#', ''), 16);
    const hex2 = parseInt(color2.replace('#', ''), 16);
    
    const r1 = hex1 >> 16, g1 = (hex1 >> 8) & 0xFF, b1 = hex1 & 0xFF;
    const r2 = hex2 >> 16, g2 = (hex2 >> 8) & 0xFF, b2 = hex2 & 0xFF;
    
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }
}

// Lip sync engine for text to phoneme conversion
export class LipSyncEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  
  // Convert text to phonemes with timing
  textToPhonemes(text: string, duration: number): Phoneme[] {
    const phonemes: Phoneme[] = [];
    const chars = text.toLowerCase().split('');
    const avgDuration = duration / chars.length;
    
    let i = 0;
    while (i < chars.length) {
      let char = chars[i];
      let nextChar = chars[i + 1] || '';
      let phoneme = char;
      
      // Handle digraphs
      if (char === 't' && nextChar === 'h') {
        phoneme = 'th';
        i++;
      } else if (char === 's' && nextChar === 'h') {
        phoneme = 'sh';
        i++;
      } else if (char === 'c' && nextChar === 'h') {
        phoneme = 'ch';
        i++;
      }
      
      const mouthShape = PHONEME_MAP[phoneme] || PHONEME_MAP[char] || 'rest';
      
      phonemes.push({
        phoneme,
        mouthShape,
        duration: avgDuration
      });
      
      i++;
    }
    
    return phonemes;
  }
  
  // Get current mouth shape based on audio analysis
  analyzeAudio(audioData: Uint8Array): { mouthShape: MouthShape; intensity: number } {
    if (!audioData || audioData.length === 0) {
      return { mouthShape: 'rest', intensity: 0 };
    }
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i];
    }
    const average = sum / audioData.length;
    const intensity = Math.min(average / 128, 1);
    
    // Determine mouth shape based on frequency distribution
    const lowFreq = this.getFrequencyRange(audioData, 0, 0.2);
    const midFreq = this.getFrequencyRange(audioData, 0.2, 0.6);
    const highFreq = this.getFrequencyRange(audioData, 0.6, 1);
    
    let mouthShape: MouthShape = 'rest';
    
    if (intensity < 0.1) {
      mouthShape = 'rest';
    } else if (lowFreq > midFreq && lowFreq > highFreq) {
      mouthShape = 'ooh';
    } else if (highFreq > lowFreq && highFreq > midFreq) {
      mouthShape = 'ee';
    } else if (intensity > 0.7) {
      mouthShape = 'aah';
    } else {
      mouthShape = 'rest';
    }
    
    return { mouthShape, intensity };
  }
  
  private getFrequencyRange(data: Uint8Array, start: number, end: number): number {
    const startIndex = Math.floor(data.length * start);
    const endIndex = Math.floor(data.length * end);
    let sum = 0;
    for (let i = startIndex; i < endIndex; i++) {
      sum += data[i];
    }
    return sum / (endIndex - startIndex);
  }
}

export const lipSyncEngine = new LipSyncEngine();
