/**
 * Canvas-based Realistic Avatar Engine
 * High-quality 2D animated avatars that work reliably
 * Supports all ages, ethnicities, and Nigerian features
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

// ============================================
// REALISTIC NIGERIAN AVATAR LIBRARY
// High-quality avatars with real human features
// ============================================

export interface RealisticAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageGroup: 'child' | 'teen' | 'young-adult' | 'adult' | 'middle-aged' | 'senior';
  ethnicity: 'igbo' | 'yoruba' | 'hausa' | 'fulani' | 'ijaw' | 'edo' | 'mixed';
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  clothing: string;
  accessories: string[];
  thumbnailUrl: string;
  description: string;
  age: number;
}

// Pre-configured Nigerian avatar models with Pexels images
export const NIGERIAN_REALISTIC_AVATARS: RealisticAvatar[] = [
  // === CHILDREN (Ages 5-12) ===
  {
    id: 'ng-child-girl-igbo-01',
    name: 'Adaeze',
    gender: 'female',
    ageGroup: 'child',
    ethnicity: 'igbo',
    skinTone: '#8B4513',
    hairStyle: 'braids',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    clothing: 'school-uniform',
    accessories: ['beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?w=300',
    description: 'Cheerful Igbo schoolgirl with traditional braids',
    age: 8
  },
  {
    id: 'ng-child-boy-yoruba-01',
    name: 'Adekunle',
    gender: 'male',
    ageGroup: 'child',
    ethnicity: 'yoruba',
    skinTone: '#6F4E37',
    hairStyle: 'low-cut',
    hairColor: '#0a0a0a',
    eyeColor: '#2d1810',
    clothing: 'agbada-mini',
    accessories: ['cap'],
    thumbnailUrl: 'https://images.pexels.com/photos/8613312/pexels-photo-8613312.jpeg?w=300',
    description: 'Young Yoruba boy in traditional attire',
    age: 10
  },
  {
    id: 'ng-child-girl-hausa-01',
    name: 'Fatima',
    gender: 'female',
    ageGroup: 'child',
    ethnicity: 'hausa',
    skinTone: '#C4A484',
    hairStyle: 'covered',
    hairColor: '#1a1a1a',
    eyeColor: '#4a3728',
    clothing: 'hijab-dress',
    accessories: ['hijab'],
    thumbnailUrl: 'https://images.pexels.com/photos/7869238/pexels-photo-7869238.jpeg?w=300',
    description: 'Sweet Hausa girl with colorful hijab',
    age: 9
  },

  // === TEENAGERS (Ages 13-19) ===
  {
    id: 'ng-teen-girl-igbo-01',
    name: 'Chiamaka',
    gender: 'female',
    ageGroup: 'teen',
    ethnicity: 'igbo',
    skinTone: '#8B4513',
    hairStyle: 'afro-puff',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    clothing: 'modern-casual',
    accessories: ['earrings', 'necklace'],
    thumbnailUrl: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?w=300',
    description: 'Trendy Igbo teenager with natural hair',
    age: 16
  },
  {
    id: 'ng-teen-boy-yoruba-01',
    name: 'Oluwaseun',
    gender: 'male',
    ageGroup: 'teen',
    ethnicity: 'yoruba',
    skinTone: '#6F4E37',
    hairStyle: 'fade',
    hairColor: '#0a0a0a',
    eyeColor: '#2d1810',
    clothing: 'streetwear',
    accessories: ['watch', 'chain'],
    thumbnailUrl: 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?w=300',
    description: 'Stylish Yoruba teen with modern fashion',
    age: 17
  },
  {
    id: 'ng-teen-girl-hausa-01',
    name: 'Aisha',
    gender: 'female',
    ageGroup: 'teen',
    ethnicity: 'hausa',
    skinTone: '#C4A484',
    hairStyle: 'covered',
    hairColor: '#1a1a1a',
    eyeColor: '#4a3728',
    clothing: 'modern-hijab',
    accessories: ['hijab', 'bracelet'],
    thumbnailUrl: 'https://images.pexels.com/photos/7869565/pexels-photo-7869565.jpeg?w=300',
    description: 'Fashionable Hausa teenager',
    age: 15
  },

  // === YOUNG ADULTS (Ages 20-29) ===
  {
    id: 'ng-young-woman-igbo-01',
    name: 'Ngozi',
    gender: 'female',
    ageGroup: 'young-adult',
    ethnicity: 'igbo',
    skinTone: '#8B4513',
    hairStyle: 'locs',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    clothing: 'professional',
    accessories: ['glasses', 'earrings'],
    thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=300',
    description: 'Professional Igbo woman with locs',
    age: 25
  },
  {
    id: 'ng-young-man-yoruba-01',
    name: 'Babatunde',
    gender: 'male',
    ageGroup: 'young-adult',
    ethnicity: 'yoruba',
    skinTone: '#6F4E37',
    hairStyle: 'waves',
    hairColor: '#0a0a0a',
    eyeColor: '#2d1810',
    clothing: 'business-casual',
    accessories: ['watch'],
    thumbnailUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=300',
    description: 'Young Yoruba professional',
    age: 28
  },
  {
    id: 'ng-young-woman-edo-01',
    name: 'Osayuki',
    gender: 'female',
    ageGroup: 'young-adult',
    ethnicity: 'edo',
    skinTone: '#704214',
    hairStyle: 'goddess-locs',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    clothing: 'ankara-dress',
    accessories: ['coral-beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/6626967/pexels-photo-6626967.jpeg?w=300',
    description: 'Elegant Edo woman in traditional attire',
    age: 24
  },
  {
    id: 'ng-young-man-fulani-01',
    name: 'Abdullahi',
    gender: 'male',
    ageGroup: 'young-adult',
    ethnicity: 'fulani',
    skinTone: '#C4A484',
    hairStyle: 'short',
    hairColor: '#1a1a1a',
    eyeColor: '#4a3728',
    clothing: 'fulani-traditional',
    accessories: ['hat', 'staff'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?w=300',
    description: 'Fulani young man in traditional wear',
    age: 26
  },

  // === ADULTS (Ages 30-44) ===
  {
    id: 'ng-adult-woman-igbo-01',
    name: 'Adanna',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'igbo',
    skinTone: '#8B4513',
    hairStyle: 'gele-headwrap',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    clothing: 'isiagu',
    accessories: ['coral-beads', 'earrings'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?w=300',
    description: 'Igbo woman in traditional Isiagu',
    age: 35
  },
  {
    id: 'ng-adult-man-yoruba-01',
    name: 'Olumide',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'yoruba',
    skinTone: '#6F4E37',
    hairStyle: 'short-grey',
    hairColor: '#4a4a4a',
    eyeColor: '#2d1810',
    clothing: 'agbada',
    accessories: ['fila-cap', 'walking-stick'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147420/pexels-photo-6147420.jpeg?w=300',
    description: 'Distinguished Yoruba man in Agbada',
    age: 42
  },
  {
    id: 'ng-adult-woman-hausa-01',
    name: 'Hauwa',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'hausa',
    skinTone: '#C4A484',
    hairStyle: 'covered',
    hairColor: '#1a1a1a',
    eyeColor: '#4a3728',
    clothing: 'abaya-elegant',
    accessories: ['hijab', 'gold-jewelry'],
    thumbnailUrl: 'https://images.pexels.com/photos/7869297/pexels-photo-7869297.jpeg?w=300',
    description: 'Elegant Hausa woman',
    age: 38
  },
  {
    id: 'ng-adult-man-ijaw-01',
    name: 'Ebimobowei',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'ijaw',
    skinTone: '#5C4033',
    hairStyle: 'short',
    hairColor: '#1a1a1a',
    eyeColor: '#2d1810',
    clothing: 'niger-delta-attire',
    accessories: ['beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147381/pexels-photo-6147381.jpeg?w=300',
    description: 'Ijaw man in Niger Delta traditional wear',
    age: 40
  },

  // === MIDDLE-AGED (Ages 45-59) ===
  {
    id: 'ng-middle-woman-igbo-01',
    name: 'Mama Nneka',
    gender: 'female',
    ageGroup: 'middle-aged',
    ethnicity: 'igbo',
    skinTone: '#8B4513',
    hairStyle: 'headwrap',
    hairColor: '#3a3a3a',
    eyeColor: '#3d2314',
    clothing: 'george-wrapper',
    accessories: ['coral-beads', 'earrings', 'bracelet'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147340/pexels-photo-6147340.jpeg?w=300',
    description: 'Respected Igbo matriarch',
    age: 52
  },
  {
    id: 'ng-middle-man-yoruba-01',
    name: 'Chief Adeleke',
    gender: 'male',
    ageGroup: 'middle-aged',
    ethnicity: 'yoruba',
    skinTone: '#6F4E37',
    hairStyle: 'grey-short',
    hairColor: '#6a6a6a',
    eyeColor: '#2d1810',
    clothing: 'chief-agbada',
    accessories: ['beads', 'fila-cap', 'staff'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147395/pexels-photo-6147395.jpeg?w=300',
    description: 'Yoruba chief in ceremonial attire',
    age: 55
  },
  {
    id: 'ng-middle-woman-hausa-01',
    name: 'Hajiya Amina',
    gender: 'female',
    ageGroup: 'middle-aged',
    ethnicity: 'hausa',
    skinTone: '#C4A484',
    hairStyle: 'covered',
    hairColor: '#4a4a4a',
    eyeColor: '#4a3728',
    clothing: 'kaftan-elegant',
    accessories: ['hijab', 'gold-set'],
    thumbnailUrl: 'https://images.pexels.com/photos/7869312/pexels-photo-7869312.jpeg?w=300',
    description: 'Distinguished Hausa woman',
    age: 50
  },

  // === SENIORS (Ages 60+) ===
  {
    id: 'ng-senior-woman-igbo-01',
    name: 'Mama Ugochi',
    gender: 'female',
    ageGroup: 'senior',
    ethnicity: 'igbo',
    skinTone: '#8B4513',
    hairStyle: 'grey-headwrap',
    hairColor: '#8a8a8a',
    eyeColor: '#3d2314',
    clothing: 'traditional-elder',
    accessories: ['walking-stick', 'beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147352/pexels-photo-6147352.jpeg?w=300',
    description: 'Wise Igbo grandmother',
    age: 70
  },
  {
    id: 'ng-senior-man-yoruba-01',
    name: 'Baba Akinwale',
    gender: 'male',
    ageGroup: 'senior',
    ethnicity: 'yoruba',
    skinTone: '#6F4E37',
    hairStyle: 'white-short',
    hairColor: '#ffffff',
    eyeColor: '#2d1810',
    clothing: 'elder-agbada',
    accessories: ['glasses', 'walking-stick', 'fila-cap'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147401/pexels-photo-6147401.jpeg?w=300',
    description: 'Venerable Yoruba elder',
    age: 75
  },
  {
    id: 'ng-senior-man-hausa-01',
    name: 'Mallam Ibrahim',
    gender: 'male',
    ageGroup: 'senior',
    ethnicity: 'hausa',
    skinTone: '#C4A484',
    hairStyle: 'white-beard',
    hairColor: '#ffffff',
    eyeColor: '#4a3728',
    clothing: 'scholar-robe',
    accessories: ['turban', 'tasbih', 'glasses'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147410/pexels-photo-6147410.jpeg?w=300',
    description: 'Respected Hausa Islamic scholar',
    age: 68
  },

  // === MIXED/MODERN ===
  {
    id: 'ng-mixed-woman-01',
    name: 'Adaugo',
    gender: 'female',
    ageGroup: 'young-adult',
    ethnicity: 'mixed',
    skinTone: '#A0785A',
    hairStyle: 'curly-natural',
    hairColor: '#2a1a0a',
    eyeColor: '#5a4030',
    clothing: 'modern-professional',
    accessories: ['earrings', 'watch'],
    thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=300',
    description: 'Modern Nigerian professional',
    age: 27
  },
  {
    id: 'ng-mixed-man-01',
    name: 'Emeka',
    gender: 'male',
    ageGroup: 'young-adult',
    ethnicity: 'mixed',
    skinTone: '#7A5C3E',
    hairStyle: 'afro',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    clothing: 'tech-casual',
    accessories: ['glasses', 'headphones'],
    thumbnailUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=300',
    description: 'Young Nigerian tech professional',
    age: 29
  }
];

// ============================================
// CANVAS AVATAR VIEWER COMPONENT
// ============================================

export interface CanvasAvatarViewerProps {
  avatar: RealisticAvatar;
  emotion?: string;
  isSpeaking?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const CanvasAvatarViewer: React.FC<CanvasAvatarViewerProps> = ({
  avatar,
  emotion = 'neutral',
  isSpeaking = false,
  width = 400,
  height = 450,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Animation state
  const stateRef = useRef({
    blinkTimer: 0,
    mouthOpen: 0,
    breathOffset: 0,
    emotionIntensity: 0
  });
  
  // Load avatar image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Use placeholder on error
      setImageLoaded(true);
    };
    img.src = avatar.thumbnailUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [avatar.thumbnailUrl]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastTime = 0;
    
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      const state = stateRef.current;
      
      // Update animation state
      state.blinkTimer += delta;
      state.breathOffset = Math.sin(time / 1000 * 1.5) * 3;
      
      if (isSpeaking) {
        state.mouthOpen = Math.sin(time / 80) * 0.5 + 0.5;
      } else {
        state.mouthOpen *= 0.9;
      }
      
      // Clear canvas
      ctx.fillStyle = 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw avatar
      if (imageRef.current) {
        const img = imageRef.current;
        const aspectRatio = img.width / img.height;
        let drawWidth = width * 0.85;
        let drawHeight = drawWidth / aspectRatio;
        
        if (drawHeight > height * 0.75) {
          drawHeight = height * 0.75;
          drawWidth = drawHeight * aspectRatio;
        }
        
        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2 + state.breathOffset;
        
        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        
        // Rounded corners clip
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, drawWidth, drawHeight, 16);
        ctx.clip();
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.restore();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw border
        ctx.strokeStyle = emotion === 'happy' ? '#00e676' : 
                         emotion === 'sad' ? '#2196f3' :
                         emotion === 'angry' ? '#f44336' :
                         emotion === 'surprised' ? '#ff9800' : '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, y, drawWidth, drawHeight, 16);
        ctx.stroke();
        
        // Emotion glow effect
        if (emotion !== 'neutral') {
          ctx.save();
          ctx.globalAlpha = 0.3 + Math.sin(time / 500) * 0.1;
          ctx.strokeStyle = ctx.strokeStyle;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.roundRect(x - 2, y - 2, drawWidth + 4, drawHeight + 4, 18);
          ctx.stroke();
          ctx.restore();
        }
        
        // Speaking indicator
        if (isSpeaking) {
          const indicatorY = y + drawHeight + 20;
          const barWidth = 8;
          const barGap = 4;
          const numBars = 5;
          const totalWidth = numBars * barWidth + (numBars - 1) * barGap;
          const startX = width / 2 - totalWidth / 2;
          
          for (let i = 0; i < numBars; i++) {
            const barHeight = 10 + Math.sin(time / 100 + i * 0.5) * 15;
            ctx.fillStyle = '#00e676';
            ctx.fillRect(
              startX + i * (barWidth + barGap),
              indicatorY - barHeight / 2,
              barWidth,
              barHeight
            );
          }
        }
        
      } else {
        // Draw placeholder avatar
        drawPlaceholderAvatar(ctx, width, height, avatar, state.breathOffset);
      }
      
      // Draw name label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, height - 50, width, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(avatar.name, width / 2, height - 25);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = '#00e676';
      ctx.fillText(`${avatar.ethnicity.charAt(0).toUpperCase() + avatar.ethnicity.slice(1)} • ${avatar.age} years`, width / 2, height - 8);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [avatar, emotion, isSpeaking, width, height, imageLoaded]);
  
  return (
    <div className={`canvas-avatar-viewer ${className}`} style={{ width, height }}>
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      />
    </div>
  );
};

// Helper function to draw placeholder avatar
function drawPlaceholderAvatar(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  avatar: RealisticAvatar,
  breathOffset: number
) {
  const centerX = width / 2;
  const centerY = height / 2 - 20 + breathOffset;
  
  // Body
  ctx.fillStyle = avatar.clothing.includes('agbada') ? '#1a472a' : '#2c3e50';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 80, 60, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Neck
  ctx.fillStyle = avatar.skinTone;
  ctx.fillRect(centerX - 15, centerY + 10, 30, 30);
  
  // Head
  ctx.fillStyle = avatar.skinTone;
  ctx.beginPath();
  ctx.arc(centerX, centerY - 30, 55, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair
  if (!avatar.hairStyle.includes('covered')) {
    ctx.fillStyle = avatar.hairColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 45, 56, Math.PI, 0);
    ctx.fill();
  } else {
    // Hijab
    ctx.fillStyle = '#7b2d8e';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 25, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = avatar.skinTone;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 20, 40, 45, 0, Math.PI * 1.2, Math.PI * 1.8);
    ctx.fill();
  }
  
  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(centerX - 18, centerY - 30, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(centerX + 18, centerY - 30, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupils
  ctx.fillStyle = avatar.eyeColor;
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 30, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX + 18, centerY - 30, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = avatar.skinTone;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 20);
  ctx.lineTo(centerX - 8, centerY);
  ctx.lineTo(centerX + 8, centerY);
  ctx.closePath();
  ctx.fill();
  
  // Mouth
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 15, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Smile
  ctx.strokeStyle = '#5d2906';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 10, 12, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

// ============================================
// AVATAR CARD COMPONENT
// ============================================

export interface AvatarCardProps {
  avatar: RealisticAvatar;
  selected?: boolean;
  onSelect?: (avatar: RealisticAvatar) => void;
  onPreview?: (avatar: RealisticAvatar) => void;
}

export const CanvasAvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  selected = false,
  onSelect,
  onPreview
}) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={`realistic-avatar-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect?.(avatar)}
    >
      <div className="avatar-thumbnail">
        {!imageError ? (
          <img 
            src={avatar.thumbnailUrl} 
            alt={avatar.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="avatar-placeholder" style={{ backgroundColor: avatar.skinTone }}>
            <span>{avatar.name.charAt(0)}</span>
          </div>
        )}
        <div className="avatar-age-badge">{avatar.age} yrs</div>
      </div>
      <div className="avatar-info">
        <h4>{avatar.name}</h4>
        <p className="avatar-ethnicity">{avatar.ethnicity.charAt(0).toUpperCase() + avatar.ethnicity.slice(1)}</p>
        <p className="avatar-description">{avatar.description}</p>
      </div>
      <div className="avatar-actions">
        <button 
          className="btn-preview"
          onClick={(e) => {
            e.stopPropagation();
            onPreview?.(avatar);
          }}
        >
          👁️ Preview
        </button>
      </div>
    </div>
  );
};

// Filter functions
export const filterAvatarsByAge = (avatars: RealisticAvatar[], ageGroup: string): RealisticAvatar[] => {
  if (ageGroup === 'all') return avatars;
  return avatars.filter(a => a.ageGroup === ageGroup);
};

export const filterAvatarsByGender = (avatars: RealisticAvatar[], gender: string): RealisticAvatar[] => {
  if (gender === 'all') return avatars;
  return avatars.filter(a => a.gender === gender);
};

export const filterAvatarsByEthnicity = (avatars: RealisticAvatar[], ethnicity: string): RealisticAvatar[] => {
  if (ethnicity === 'all') return avatars;
  return avatars.filter(a => a.ethnicity === ethnicity);
};

export default CanvasAvatarViewer;
