/**
 * 3D Video Preview Component
 * Uses Three.js to render 3D avatars in the video preview
 * Supports multiple avatars, dialogue, lip sync, and emotions
 */

import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

// Avatar appearance configuration
export interface Avatar3DAppearance {
  id: string;
  name: string;
  skinTone: string;
  hairColor: string;
  hairStyle: 'afro' | 'braids' | 'locs' | 'short' | 'bald' | 'covered';
  eyeColor: string;
  outfit: 'agbada' | 'isiagu' | 'ankara' | 'professional' | 'casual' | 'hijab';
  outfitColor: string;
  accessories: string[];
  gender: 'male' | 'female';
  ageGroup: 'child' | 'young' | 'adult' | 'senior';
  ethnicity: string;
}

// Nigerian skin tone palette
const SKIN_TONES = {
  light: '#C68642',
  medium: '#8D5524',
  dark: '#5C3A21',
  deep: '#3D2314',
  golden: '#B87333',
  caramel: '#A0522D',
  ebony: '#2D1810',
};

// Outfit colors
const OUTFIT_COLORS = {
  'agbada-white': '#F5F5F5',
  'agbada-gold': '#FFD700',
  'isiagu-red': '#8B0000',
  'ankara-multicolor': '#E91E63',
  'professional-navy': '#1E3A5F',
  'casual-green': '#228B22',
  'hijab-purple': '#9C27B0',
};

// Default 3D avatars for video preview
export const DEFAULT_3D_AVATARS: Avatar3DAppearance[] = [
  {
    id: '3d-doctor-male',
    name: 'Dr. Chukwuemeka',
    skinTone: SKIN_TONES.medium,
    hairColor: '#1a1a1a',
    hairStyle: 'short',
    eyeColor: '#3D2314',
    outfit: 'professional',
    outfitColor: OUTFIT_COLORS['professional-navy'],
    accessories: ['glasses'],
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'igbo',
  },
  {
    id: '3d-elder-female',
    name: 'Mama Aduke',
    skinTone: SKIN_TONES.dark,
    hairColor: '#4a4a4a',
    hairStyle: 'covered',
    eyeColor: '#2D1810',
    outfit: 'ankara',
    outfitColor: OUTFIT_COLORS['ankara-multicolor'],
    accessories: [],
    gender: 'female',
    ageGroup: 'senior',
    ethnicity: 'yoruba',
  },
  {
    id: '3d-nurse-female',
    name: 'Nurse Amina',
    skinTone: SKIN_TONES.golden,
    hairColor: '#1a1a1a',
    hairStyle: 'covered',
    eyeColor: '#3D2314',
    outfit: 'hijab',
    outfitColor: OUTFIT_COLORS['hijab-purple'],
    accessories: [],
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'hausa',
  },
  {
    id: '3d-chief-male',
    name: 'Chief Okoro',
    skinTone: SKIN_TONES.deep,
    hairColor: '#ffffff',
    hairStyle: 'bald',
    eyeColor: '#2D1810',
    outfit: 'agbada',
    outfitColor: OUTFIT_COLORS['agbada-white'],
    accessories: ['coral-beads'],
    gender: 'male',
    ageGroup: 'senior',
    ethnicity: 'igbo',
  },
  {
    id: '3d-youth-male',
    name: 'Emeka',
    skinTone: SKIN_TONES.caramel,
    hairColor: '#1a1a1a',
    hairStyle: 'afro',
    eyeColor: '#3D2314',
    outfit: 'casual',
    outfitColor: OUTFIT_COLORS['casual-green'],
    accessories: [],
    gender: 'male',
    ageGroup: 'young',
    ethnicity: 'igbo',
  },
  {
    id: '3d-youth-female',
    name: 'Ngozi',
    skinTone: SKIN_TONES.golden,
    hairColor: '#1a1a1a',
    hairStyle: 'braids',
    eyeColor: '#3D2314',
    outfit: 'ankara',
    outfitColor: '#FF6B35',
    accessories: [],
    gender: 'female',
    ageGroup: 'young',
    ethnicity: 'igbo',
  },
];

// Dialogue line for preview
export interface PreviewDialogue {
  speakerId: string;
  text: string;
  duration?: number;
}

// Props for the main preview component
export interface VideoPreview3DProps {
  participants: {
    id: string;
    name: string;
    position: 'left' | 'center' | 'right';
    avatar3D?: Avatar3DAppearance;
  }[];
  currentDialogue?: PreviewDialogue;
  isPlaying?: boolean;
  emotion?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  onComplete?: () => void;
}

// Single 3D Avatar component for preview
function Preview3DAvatar({
  avatar,
  position,
  isSpeaking,
  emotion,
  dialogueText,
}: {
  avatar: Avatar3DAppearance;
  position: [number, number, number];
  isSpeaking: boolean;
  emotion: string;
  dialogueText?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(1);
  const [breathe, setBreathe] = useState(0);
  
  // Get body scale based on age
  const getBodyScale = () => {
    switch (avatar.ageGroup) {
      case 'child': return { head: 1.3, body: 0.7, height: 0.6 };
      case 'young': return { head: 1.0, body: 0.95, height: 0.95 };
      case 'adult': return { head: 1.0, body: 1.0, height: 1.0 };
      case 'senior': return { head: 1.0, body: 0.9, height: 0.9 };
      default: return { head: 1.0, body: 1.0, height: 1.0 };
    }
  };
  
  const bodyScale = getBodyScale();
  
  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Breathing animation
    setBreathe(Math.sin(time * 2) * 0.02);
    
    // Blinking (every 3-5 seconds)
    const blinkCycle = time % 4;
    if (blinkCycle < 0.15) {
      setEyeBlink(Math.cos(blinkCycle * Math.PI / 0.15));
    } else {
      setEyeBlink(1);
    }
    
    // Lip sync when speaking
    if (isSpeaking) {
      setMouthOpen(0.3 + Math.sin(time * 15) * 0.3 + Math.sin(time * 23) * 0.2);
    } else {
      setMouthOpen(Math.max(0, mouthOpen - 0.1));
    }
    
    // Subtle head movement
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      groupRef.current.position.y = position[1] + breathe;
    }
  });
  
  // Get emotion-based expression
  const getExpressionParams = () => {
    switch (emotion) {
      case 'happy':
        return { eyebrowY: 0.05, mouthCurve: 0.15, eyeScale: 1.1 };
      case 'sad':
        return { eyebrowY: -0.05, mouthCurve: -0.1, eyeScale: 0.9 };
      case 'surprised':
        return { eyebrowY: 0.1, mouthCurve: 0, eyeScale: 1.3 };
      case 'angry':
        return { eyebrowY: -0.08, mouthCurve: -0.05, eyeScale: 0.85 };
      default:
        return { eyebrowY: 0, mouthCurve: 0.05, eyeScale: 1 };
    }
  };
  
  const expression = getExpressionParams();
  
  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, -0.8 * bodyScale.height, 0]} scale={[bodyScale.body, bodyScale.body, bodyScale.body]}>
        <capsuleGeometry args={[0.5, 0.8, 16, 32]} />
        <meshStandardMaterial color={avatar.outfitColor} roughness={0.6} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[0, -0.3 * bodyScale.height, 0]} scale={[bodyScale.body, bodyScale.body, bodyScale.body]}>
        <boxGeometry args={[1.4, 0.3, 0.5]} />
        <meshStandardMaterial color={avatar.outfitColor} roughness={0.6} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.2, 16]} />
        <meshStandardMaterial color={avatar.skinTone} roughness={0.7} />
      </mesh>
      
      {/* Head */}
      <group position={[0, 0.55 * bodyScale.head, 0]} scale={[bodyScale.head, bodyScale.head, bodyScale.head]}>
        {/* Main head sphere */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={avatar.skinTone} roughness={0.7} />
        </mesh>
        
        {/* Face oval (makes head more realistic) */}
        <mesh position={[0, -0.05, 0.18]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color={avatar.skinTone} roughness={0.7} />
        </mesh>
        
        {/* Left Eye */}
        <group position={[-0.12, 0.05, 0.32]}>
          {/* Eye white */}
          <mesh scale={[1, eyeBlink * expression.eyeScale, 1]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.04]} scale={[1, eyeBlink * expression.eyeScale, 1]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={avatar.eyeColor} roughness={0.3} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.065]} scale={[1, eyeBlink * expression.eyeScale, 1]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.2} />
          </mesh>
        </group>
        
        {/* Right Eye */}
        <group position={[0.12, 0.05, 0.32]}>
          {/* Eye white */}
          <mesh scale={[1, eyeBlink * expression.eyeScale, 1]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          {/* Iris */}
          <mesh position={[0, 0, 0.04]} scale={[1, eyeBlink * expression.eyeScale, 1]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={avatar.eyeColor} roughness={0.3} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.065]} scale={[1, eyeBlink * expression.eyeScale, 1]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.2} />
          </mesh>
        </group>
        
        {/* Eyebrows */}
        <mesh position={[-0.12, 0.15 + expression.eyebrowY, 0.33]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color={avatar.hairColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.15 + expression.eyebrowY, 0.33]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial color={avatar.hairColor} roughness={0.8} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.02, 0.38]}>
          <coneGeometry args={[0.04, 0.08, 8]} />
          <meshStandardMaterial color={avatar.skinTone} roughness={0.7} />
        </mesh>
        
        {/* Mouth */}
        <group position={[0, -0.15 + expression.mouthCurve, 0.35]}>
          {/* Lips outline */}
          <mesh scale={[1, 0.6 + mouthOpen, 1]}>
            <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#8B4513" roughness={0.5} />
          </mesh>
          {/* Mouth interior when open */}
          {mouthOpen > 0.1 && (
            <mesh position={[0, -0.02, -0.01]} scale={[1, mouthOpen * 2, 1]}>
              <sphereGeometry args={[0.05, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#2D1810" roughness={0.8} />
            </mesh>
          )}
        </group>
        
        {/* Ears */}
        <mesh position={[-0.38, 0, 0]} rotation={[0, 0, 0.2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={avatar.skinTone} roughness={0.7} />
        </mesh>
        <mesh position={[0.38, 0, 0]} rotation={[0, 0, -0.2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={avatar.skinTone} roughness={0.7} />
        </mesh>
        
        {/* Hair based on style */}
        {avatar.hairStyle === 'afro' && (
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.48, 32, 32]} />
            <meshStandardMaterial color={avatar.hairColor} roughness={0.9} />
          </mesh>
        )}
        
        {avatar.hairStyle === 'short' && (
          <mesh position={[0, 0.2, -0.05]}>
            <sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color={avatar.hairColor} roughness={0.9} />
          </mesh>
        )}
        
        {avatar.hairStyle === 'braids' && (
          <group>
            <mesh position={[0, 0.2, -0.05]}>
              <sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={avatar.hairColor} roughness={0.9} />
            </mesh>
            {/* Braid strands */}
            {[-0.25, -0.15, 0, 0.15, 0.25].map((xOffset, i) => (
              <mesh key={i} position={[xOffset, -0.1, -0.3]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.015, 0.4, 8]} />
                <meshStandardMaterial color={avatar.hairColor} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}
        
        {avatar.hairStyle === 'locs' && (
          <group>
            <mesh position={[0, 0.2, -0.05]}>
              <sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={avatar.hairColor} roughness={0.9} />
            </mesh>
            {/* Loc strands */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh 
                  key={i} 
                  position={[Math.sin(angle) * 0.35, 0, Math.cos(angle) * 0.35 - 0.1]} 
                  rotation={[0.5, angle, 0]}
                >
                  <cylinderGeometry args={[0.025, 0.02, 0.5, 8]} />
                  <meshStandardMaterial color={avatar.hairColor} roughness={0.8} />
                </mesh>
              );
            })}
          </group>
        )}
        
        {avatar.hairStyle === 'covered' && (
          <mesh position={[0, 0.05, -0.1]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={avatar.outfitColor} roughness={0.6} />
          </mesh>
        )}
        
        {/* Glasses accessory */}
        {avatar.accessories.includes('glasses') && (
          <group position={[0, 0.05, 0.35]}>
            {/* Left lens */}
            <mesh position={[-0.12, 0, 0]}>
              <torusGeometry args={[0.08, 0.008, 8, 16]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Right lens */}
            <mesh position={[0.12, 0, 0]}>
              <torusGeometry args={[0.08, 0.008, 8, 16]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.08, 0.008, 0.008]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Left temple */}
            <mesh position={[-0.2, 0, -0.08]} rotation={[0, 0.5, 0]}>
              <boxGeometry args={[0.12, 0.008, 0.008]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Right temple */}
            <mesh position={[0.2, 0, -0.08]} rotation={[0, -0.5, 0]}>
              <boxGeometry args={[0.12, 0.008, 0.008]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>
      
      {/* Name tag */}
      <Html position={[0, -1.6, 0]} center>
        <div style={{
          background: isSpeaking ? 'rgba(59, 130, 246, 0.95)' : 'rgba(30, 41, 59, 0.9)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: isSpeaking ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.2)',
          boxShadow: isSpeaking ? '0 0 15px rgba(59, 130, 246, 0.5)' : 'none',
        }}>
          {avatar.name}
        </div>
      </Html>
      
      {/* Speech bubble when speaking */}
      {isSpeaking && dialogueText && (
        <Html position={[0, 1.5, 0]} center>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '16px',
            fontSize: '14px',
            maxWidth: '250px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>dialogue:</span>{' '}
            {dialogueText}
          </div>
        </Html>
      )}
    </group>
  );
}

// Scene setup component
function PreviewScene({
  participants,
  currentDialogue,
  emotion,
}: {
  participants: VideoPreview3DProps['participants'];
  currentDialogue?: PreviewDialogue;
  emotion: string;
}) {
  // Calculate positions based on participant count and position
  const getPosition = (pos: 'left' | 'center' | 'right', index: number): [number, number, number] => {
    const spacing = 2.5;
    switch (pos) {
      case 'left':
        return [-spacing, 0, 0];
      case 'right':
        return [spacing, 0, 0];
      default:
        return [0, 0, 0];
    }
  };
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, 5]} intensity={0.4} />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#60a5fa" />
      
      {/* Environment */}
      <Environment preset="studio" />
      
      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      
      {/* Background gradient plane */}
      <mesh position={[0, 0, -5]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      
      {/* Render each participant */}
      {participants.map((participant, index) => {
        const avatar = participant.avatar3D || DEFAULT_3D_AVATARS.find(a => 
          a.name.toLowerCase().includes(participant.name.toLowerCase().split(' ')[0])
        ) || DEFAULT_3D_AVATARS[index % DEFAULT_3D_AVATARS.length];
        
        const isSpeaking = currentDialogue?.speakerId === participant.id;
        const position = getPosition(participant.position, index);
        
        return (
          <Preview3DAvatar
            key={participant.id}
            avatar={avatar}
            position={position}
            isSpeaking={isSpeaking}
            emotion={isSpeaking ? emotion : 'neutral'}
            dialogueText={isSpeaking ? currentDialogue?.text : undefined}
          />
        );
      })}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}

// Main Video Preview 3D Component
export function VideoPreview3D({
  participants,
  currentDialogue,
  isPlaying = false,
  emotion = 'neutral',
  width = 1280,
  height = 720,
  backgroundColor = '#e2e8f0',
  onComplete,
}: VideoPreview3DProps) {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: 400,
        background: backgroundColor,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <PreviewScene
            participants={participants}
            currentDialogue={currentDialogue}
            emotion={emotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Simple 3D Avatar Display (for cards/thumbnails)
export function Avatar3DPreviewCard({
  avatar,
  selected,
  onSelect,
  size = 120,
}: {
  avatar: Avatar3DAppearance;
  selected?: boolean;
  onSelect?: (avatar: Avatar3DAppearance) => void;
  size?: number;
}) {
  return (
    <div
      onClick={() => onSelect?.(avatar)}
      style={{
        width: size,
        height: size + 30,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: selected ? '3px solid #3b82f6' : '2px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
        transition: 'all 0.3s ease',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={0.6} />
        <Preview3DAvatar
          avatar={avatar}
          position={[0, -0.3, 0]}
          isSpeaking={false}
          emotion="happy"
        />
      </Canvas>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        textAlign: 'center',
        padding: '4px',
        fontSize: '11px',
        fontWeight: 'bold',
      }}>
        {avatar.name}
      </div>
    </div>
  );
}

export default VideoPreview3D;
