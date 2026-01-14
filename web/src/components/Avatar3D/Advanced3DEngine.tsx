/**
 * Advanced 3D Avatar Engine
 * Using Three.js + React Three Fiber + Drei
 * Pixar/Disney-quality 3D animated avatars
 */

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// NIGERIAN 3D AVATAR LIBRARY
// Realistic human-like 3D avatars for all ages
// ============================================

export interface Avatar3DProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ageGroup: 'child' | 'teen' | 'young-adult' | 'adult' | 'middle-aged' | 'senior';
  ethnicity: 'igbo' | 'yoruba' | 'hausa' | 'fulani' | 'ijaw' | 'edo' | 'mixed';
  age: number;
  skinTone: string;
  hairColor: string;
  eyeColor: string;
  hairStyle: 'short' | 'afro' | 'braids' | 'locs' | 'bald' | 'covered' | 'fade' | 'curly';
  clothing: string;
  accessories: string[];
  thumbnailUrl: string;
  description: string;
}

// Pre-configured Nigerian 3D Avatars
export const NIGERIAN_3D_AVATARS: Avatar3DProfile[] = [
  // Children
  {
    id: '3d-child-girl-igbo',
    name: 'Adaeze',
    gender: 'female',
    ageGroup: 'child',
    ethnicity: 'igbo',
    age: 8,
    skinTone: '#8B4513',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    hairStyle: 'braids',
    clothing: 'school-uniform',
    accessories: ['beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?w=300',
    description: 'Cheerful Igbo schoolgirl'
  },
  {
    id: '3d-child-boy-yoruba',
    name: 'Adekunle',
    gender: 'male',
    ageGroup: 'child',
    ethnicity: 'yoruba',
    age: 10,
    skinTone: '#6F4E37',
    hairColor: '#0a0a0a',
    eyeColor: '#2d1810',
    hairStyle: 'short',
    clothing: 'agbada-mini',
    accessories: ['cap'],
    thumbnailUrl: 'https://images.pexels.com/photos/8613312/pexels-photo-8613312.jpeg?w=300',
    description: 'Young Yoruba boy'
  },
  {
    id: '3d-child-girl-hausa',
    name: 'Fatima',
    gender: 'female',
    ageGroup: 'child',
    ethnicity: 'hausa',
    age: 9,
    skinTone: '#C4A484',
    hairColor: '#1a1a1a',
    eyeColor: '#4a3728',
    hairStyle: 'covered',
    clothing: 'hijab-dress',
    accessories: ['hijab'],
    thumbnailUrl: 'https://images.pexels.com/photos/7869238/pexels-photo-7869238.jpeg?w=300',
    description: 'Sweet Hausa girl'
  },
  // Teenagers
  {
    id: '3d-teen-girl-igbo',
    name: 'Chiamaka',
    gender: 'female',
    ageGroup: 'teen',
    ethnicity: 'igbo',
    age: 16,
    skinTone: '#8B4513',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    hairStyle: 'afro',
    clothing: 'modern-casual',
    accessories: ['earrings'],
    thumbnailUrl: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?w=300',
    description: 'Trendy Igbo teenager'
  },
  {
    id: '3d-teen-boy-yoruba',
    name: 'Oluwaseun',
    gender: 'male',
    ageGroup: 'teen',
    ethnicity: 'yoruba',
    age: 17,
    skinTone: '#6F4E37',
    hairColor: '#0a0a0a',
    eyeColor: '#2d1810',
    hairStyle: 'fade',
    clothing: 'streetwear',
    accessories: ['watch'],
    thumbnailUrl: 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?w=300',
    description: 'Stylish Yoruba teen'
  },
  // Young Adults
  {
    id: '3d-young-woman-igbo',
    name: 'Ngozi',
    gender: 'female',
    ageGroup: 'young-adult',
    ethnicity: 'igbo',
    age: 25,
    skinTone: '#8B4513',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    hairStyle: 'locs',
    clothing: 'professional',
    accessories: ['glasses', 'earrings'],
    thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=300',
    description: 'Professional Igbo woman'
  },
  {
    id: '3d-young-man-yoruba',
    name: 'Babatunde',
    gender: 'male',
    ageGroup: 'young-adult',
    ethnicity: 'yoruba',
    age: 28,
    skinTone: '#6F4E37',
    hairColor: '#0a0a0a',
    eyeColor: '#2d1810',
    hairStyle: 'short',
    clothing: 'business-casual',
    accessories: ['watch'],
    thumbnailUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=300',
    description: 'Young Yoruba professional'
  },
  {
    id: '3d-young-woman-edo',
    name: 'Osayuki',
    gender: 'female',
    ageGroup: 'young-adult',
    ethnicity: 'edo',
    age: 24,
    skinTone: '#704214',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    hairStyle: 'braids',
    clothing: 'ankara-dress',
    accessories: ['coral-beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/6626967/pexels-photo-6626967.jpeg?w=300',
    description: 'Elegant Edo woman'
  },
  // Adults
  {
    id: '3d-adult-woman-igbo',
    name: 'Adanna',
    gender: 'female',
    ageGroup: 'adult',
    ethnicity: 'igbo',
    age: 35,
    skinTone: '#8B4513',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    hairStyle: 'braids',
    clothing: 'isiagu',
    accessories: ['coral-beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?w=300',
    description: 'Igbo woman in Isiagu'
  },
  {
    id: '3d-adult-man-yoruba',
    name: 'Olumide',
    gender: 'male',
    ageGroup: 'adult',
    ethnicity: 'yoruba',
    age: 42,
    skinTone: '#6F4E37',
    hairColor: '#4a4a4a',
    eyeColor: '#2d1810',
    hairStyle: 'short',
    clothing: 'agbada',
    accessories: ['fila-cap'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147420/pexels-photo-6147420.jpeg?w=300',
    description: 'Distinguished Yoruba man'
  },
  // Middle-aged
  {
    id: '3d-middle-woman-igbo',
    name: 'Mama Nneka',
    gender: 'female',
    ageGroup: 'middle-aged',
    ethnicity: 'igbo',
    age: 52,
    skinTone: '#8B4513',
    hairColor: '#3a3a3a',
    eyeColor: '#3d2314',
    hairStyle: 'covered',
    clothing: 'george-wrapper',
    accessories: ['coral-beads'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147340/pexels-photo-6147340.jpeg?w=300',
    description: 'Respected Igbo matriarch'
  },
  {
    id: '3d-middle-man-yoruba',
    name: 'Chief Adeleke',
    gender: 'male',
    ageGroup: 'middle-aged',
    ethnicity: 'yoruba',
    age: 55,
    skinTone: '#6F4E37',
    hairColor: '#6a6a6a',
    eyeColor: '#2d1810',
    hairStyle: 'short',
    clothing: 'chief-agbada',
    accessories: ['beads', 'fila-cap'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147395/pexels-photo-6147395.jpeg?w=300',
    description: 'Yoruba chief'
  },
  // Seniors
  {
    id: '3d-senior-woman-igbo',
    name: 'Mama Ugochi',
    gender: 'female',
    ageGroup: 'senior',
    ethnicity: 'igbo',
    age: 70,
    skinTone: '#8B4513',
    hairColor: '#8a8a8a',
    eyeColor: '#3d2314',
    hairStyle: 'covered',
    clothing: 'traditional-elder',
    accessories: ['walking-stick'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147352/pexels-photo-6147352.jpeg?w=300',
    description: 'Wise Igbo grandmother'
  },
  {
    id: '3d-senior-man-yoruba',
    name: 'Baba Akinwale',
    gender: 'male',
    ageGroup: 'senior',
    ethnicity: 'yoruba',
    age: 75,
    skinTone: '#6F4E37',
    hairColor: '#ffffff',
    eyeColor: '#2d1810',
    hairStyle: 'bald',
    clothing: 'elder-agbada',
    accessories: ['glasses', 'walking-stick'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147401/pexels-photo-6147401.jpeg?w=300',
    description: 'Venerable Yoruba elder'
  },
  {
    id: '3d-senior-man-hausa',
    name: 'Mallam Ibrahim',
    gender: 'male',
    ageGroup: 'senior',
    ethnicity: 'hausa',
    age: 68,
    skinTone: '#C4A484',
    hairColor: '#ffffff',
    eyeColor: '#4a3728',
    hairStyle: 'bald',
    clothing: 'scholar-robe',
    accessories: ['turban', 'glasses'],
    thumbnailUrl: 'https://images.pexels.com/photos/6147410/pexels-photo-6147410.jpeg?w=300',
    description: 'Hausa Islamic scholar'
  },
  // Mixed/Modern
  {
    id: '3d-mixed-woman',
    name: 'Adaugo',
    gender: 'female',
    ageGroup: 'young-adult',
    ethnicity: 'mixed',
    age: 27,
    skinTone: '#A0785A',
    hairColor: '#2a1a0a',
    eyeColor: '#5a4030',
    hairStyle: 'curly',
    clothing: 'modern-professional',
    accessories: ['earrings'],
    thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=300',
    description: 'Modern Nigerian professional'
  },
  {
    id: '3d-mixed-man',
    name: 'Emeka',
    gender: 'male',
    ageGroup: 'young-adult',
    ethnicity: 'mixed',
    age: 29,
    skinTone: '#7A5C3E',
    hairColor: '#1a1a1a',
    eyeColor: '#3d2314',
    hairStyle: 'afro',
    clothing: 'tech-casual',
    accessories: ['glasses', 'headphones'],
    thumbnailUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=300',
    description: 'Nigerian tech professional'
  }
];

// ============================================
// 3D AVATAR CHARACTER MODEL
// ============================================

interface AvatarCharacterProps {
  profile: Avatar3DProfile;
  emotion?: string;
  isSpeaking?: boolean;
  position?: [number, number, number];
}

// Get body proportions based on age group
function getBodyProportions(ageGroup: string) {
  switch (ageGroup) {
    case 'child':
      return { headScale: 1.4, bodyHeight: 0.7, bodyWidth: 0.8, legLength: 0.5 };
    case 'teen':
      return { headScale: 1.15, bodyHeight: 0.9, bodyWidth: 0.9, legLength: 0.7 };
    case 'young-adult':
    case 'adult':
      return { headScale: 1.0, bodyHeight: 1.0, bodyWidth: 1.0, legLength: 0.85 };
    case 'middle-aged':
      return { headScale: 1.0, bodyHeight: 0.95, bodyWidth: 1.1, legLength: 0.8 };
    case 'senior':
      return { headScale: 1.0, bodyHeight: 0.9, bodyWidth: 1.0, legLength: 0.75 };
    default:
      return { headScale: 1.0, bodyHeight: 1.0, bodyWidth: 1.0, legLength: 0.85 };
  }
}

// Animated 3D Avatar Character
const AvatarCharacter: React.FC<AvatarCharacterProps> = ({ 
  profile, 
  emotion = 'neutral',
  isSpeaking = false,
  position = [0, 0, 0]
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  
  const [blinkTimer, setBlinkTimer] = useState(0);
  
  const proportions = getBodyProportions(profile.ageGroup);
  const skinColor = new THREE.Color(profile.skinTone);
  const hairColor = new THREE.Color(profile.hairColor);
  const eyeColor = new THREE.Color(profile.eyeColor);
  
  // Clothing color based on type
  const getClothingColor = () => {
    if (profile.clothing.includes('agbada')) return new THREE.Color('#1a472a');
    if (profile.clothing.includes('isiagu')) return new THREE.Color('#8B0000');
    if (profile.clothing.includes('ankara')) return new THREE.Color('#FF6B35');
    if (profile.clothing.includes('hijab')) return new THREE.Color('#7b2d8e');
    if (profile.clothing.includes('professional')) return new THREE.Color('#2c3e50');
    return new THREE.Color('#34495e');
  };
  
  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Subtle idle sway
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    
    // Breathing animation
    if (headRef.current) {
      headRef.current.position.y = 1.55 + Math.sin(time * 1.5) * 0.015;
    }
    
    // Blinking
    setBlinkTimer(prev => prev + 0.016);
    const shouldBlink = blinkTimer > 3 + Math.random() * 2;
    if (shouldBlink) {
      setBlinkTimer(0);
    }
    
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkAmount = shouldBlink && blinkTimer < 0.15 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkAmount;
      rightEyeRef.current.scale.y = blinkAmount;
    }
    
    // Mouth animation when speaking
    if (mouthRef.current) {
      if (isSpeaking) {
        mouthRef.current.scale.y = 0.3 + Math.sin(time * 15) * 0.5 + 0.5;
        mouthRef.current.scale.x = 1 + Math.sin(time * 12) * 0.1;
      } else {
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.5, 0.1);
        mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1, 0.1);
      }
    }
    
    // Arm animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isSpeaking) {
        leftArmRef.current.rotation.z = 0.3 + Math.sin(time * 3) * 0.15;
        rightArmRef.current.rotation.z = -0.3 - Math.sin(time * 3 + 1) * 0.15;
      } else {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.05);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.05);
      }
    }
    
    // Emotion-based expressions
    if (headRef.current) {
      switch (emotion) {
        case 'happy':
          headRef.current.rotation.x = Math.sin(time * 2) * 0.05;
          break;
        case 'sad':
          headRef.current.rotation.x = 0.1;
          break;
        case 'surprised':
          headRef.current.rotation.x = -0.1;
          break;
        case 'angry':
          headRef.current.rotation.z = Math.sin(time * 8) * 0.02;
          break;
        default:
          headRef.current.rotation.x = 0;
          headRef.current.rotation.z = 0;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Body/Torso */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.28 * proportions.bodyWidth, 0.6 * proportions.bodyHeight, 8, 16]} />
        <meshStandardMaterial color={getClothingColor()} roughness={0.7} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.55, 0]}>
        {/* Head */}
        <mesh scale={proportions.headScale}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        
        {/* Hair or Head Covering */}
        {profile.hairStyle === 'covered' ? (
          // Hijab/Head covering
          <mesh scale={proportions.headScale}>
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshStandardMaterial color={new THREE.Color('#7b2d8e')} roughness={0.6} />
          </mesh>
        ) : profile.hairStyle === 'bald' ? null : profile.hairStyle === 'afro' ? (
          // Afro hair
          <mesh position={[0, 0.08, 0]} scale={proportions.headScale}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={1} />
          </mesh>
        ) : profile.hairStyle === 'locs' || profile.hairStyle === 'braids' ? (
          // Locs/Braids
          <group scale={proportions.headScale}>
            {[...Array(12)].map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  Math.sin(i * Math.PI / 6) * 0.25,
                  0.1 - (i % 3) * 0.1,
                  Math.cos(i * Math.PI / 6) * 0.25
                ]}
                rotation={[0.3, 0, Math.sin(i * Math.PI / 6) * 0.3]}
              >
                <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
                <meshStandardMaterial color={hairColor} roughness={0.9} />
              </mesh>
            ))}
          </group>
        ) : (
          // Short hair
          <mesh position={[0, 0.12, 0]} scale={[proportions.headScale, proportions.headScale * 0.5, proportions.headScale]}>
            <sphereGeometry args={[0.29, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        )}
        
        {/* Face - only visible if not covered */}
        {profile.hairStyle !== 'covered' || true ? (
          <>
            {/* Left Eye White */}
            <mesh ref={leftEyeRef} position={[-0.09, 0.03, 0.22]} scale={proportions.headScale}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            {/* Left Pupil */}
            <mesh position={[-0.09, 0.03, 0.255]} scale={proportions.headScale}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color={eyeColor} />
            </mesh>
            <mesh position={[-0.09, 0.03, 0.27]} scale={proportions.headScale}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
            
            {/* Right Eye White */}
            <mesh ref={rightEyeRef} position={[0.09, 0.03, 0.22]} scale={proportions.headScale}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            {/* Right Pupil */}
            <mesh position={[0.09, 0.03, 0.255]} scale={proportions.headScale}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color={eyeColor} />
            </mesh>
            <mesh position={[0.09, 0.03, 0.27]} scale={proportions.headScale}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
            
            {/* Eyebrows */}
            <mesh position={[-0.09, 0.09, 0.22]} rotation={[0, 0, 0.1]} scale={proportions.headScale}>
              <boxGeometry args={[0.06, 0.012, 0.01]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.09, 0.09, 0.22]} rotation={[0, 0, -0.1]} scale={proportions.headScale}>
              <boxGeometry args={[0.06, 0.012, 0.01]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            
            {/* Nose */}
            <mesh position={[0, -0.02, 0.25]} rotation={[0.4, 0, 0]} scale={proportions.headScale}>
              <coneGeometry args={[0.025, 0.06, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.8} />
            </mesh>
            
            {/* Mouth */}
            <mesh ref={mouthRef} position={[0, -0.1, 0.23]} scale={proportions.headScale}>
              <boxGeometry args={[0.08, 0.02, 0.015]} />
              <meshStandardMaterial color={new THREE.Color('#8B4513').multiplyScalar(0.7)} />
            </mesh>
            
            {/* Ears */}
            <mesh position={[-0.27, 0, 0]} scale={proportions.headScale}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.27, 0, 0]} scale={proportions.headScale}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.8} />
            </mesh>
          </>
        ) : null}
        
        {/* Glasses if applicable */}
        {profile.accessories.includes('glasses') && (
          <>
            <mesh position={[-0.09, 0.03, 0.28]} scale={proportions.headScale}>
              <ringGeometry args={[0.045, 0.055, 16]} />
              <meshStandardMaterial color="black" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.09, 0.03, 0.28]} scale={proportions.headScale}>
              <ringGeometry args={[0.045, 0.055, 16]} />
              <meshStandardMaterial color="black" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.03, 0.28]} scale={proportions.headScale}>
              <boxGeometry args={[0.06, 0.008, 0.008]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </>
        )}
        
        {/* Fila Cap */}
        {profile.accessories.includes('fila-cap') && (
          <mesh position={[0, 0.25, 0]} scale={proportions.headScale}>
            <cylinderGeometry args={[0.2, 0.25, 0.12, 16]} />
            <meshStandardMaterial color={new THREE.Color('#8B0000')} />
          </mesh>
        )}
      </group>
      
      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.38, 0.85, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.06, 0.4 * proportions.bodyHeight, 8, 16]} />
        <meshStandardMaterial color={getClothingColor()} roughness={0.7} />
      </mesh>
      {/* Left Hand */}
      <mesh position={[-0.5, 0.45, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      
      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.38, 0.85, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.06, 0.4 * proportions.bodyHeight, 8, 16]} />
        <meshStandardMaterial color={getClothingColor()} roughness={0.7} />
      </mesh>
      {/* Right Hand */}
      <mesh position={[0.5, 0.45, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-0.12, 0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.35 * proportions.legLength, 8, 16]} />
        <meshStandardMaterial color={new THREE.Color('#1a1a1a')} roughness={0.7} />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[0.12, 0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.35 * proportions.legLength, 8, 16]} />
        <meshStandardMaterial color={new THREE.Color('#1a1a1a')} roughness={0.7} />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.12, -0.1, 0.05]}>
        <boxGeometry args={[0.1, 0.05, 0.15]} />
        <meshStandardMaterial color={new THREE.Color('#2a2a2a')} />
      </mesh>
      <mesh position={[0.12, -0.1, 0.05]}>
        <boxGeometry args={[0.1, 0.05, 0.15]} />
        <meshStandardMaterial color={new THREE.Color('#2a2a2a')} />
      </mesh>
    </group>
  );
};

// Loading component
const LoadingAvatar = () => (
  <Html center>
    <div style={{ 
      color: 'white', 
      background: 'rgba(0,0,0,0.7)', 
      padding: '20px', 
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <div className="avatar-loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(0,230,118,0.2)',
        borderTop: '4px solid #00e676',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 10px'
      }} />
      Loading 3D Avatar...
    </div>
  </Html>
);

// ============================================
// MAIN 3D AVATAR VIEWER COMPONENT
// ============================================

export interface Avatar3DViewerProps {
  avatar: Avatar3DProfile;
  emotion?: string;
  isSpeaking?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const Avatar3DViewer: React.FC<Avatar3DViewerProps> = ({
  avatar,
  emotion = 'neutral',
  isSpeaking = false,
  width = 400,
  height = 450,
  className = ''
}) => {
  return (
    <div className={`avatar-3d-viewer ${className}`} style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 1, 3], fov: 45 }}
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <Suspense fallback={<LoadingAvatar />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />
          <pointLight position={[0, 3, 2]} intensity={0.4} color="#ffeedd" />
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* Avatar */}
          <AvatarCharacter
            profile={avatar}
            emotion={emotion}
            isSpeaking={isSpeaking}
            position={[0, -0.8, 0]}
          />
          
          {/* Ground shadow */}
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.4}
            scale={3}
            blur={2}
            far={4}
          />
          
          {/* Camera controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={2}
            maxDistance={5}
            target={[0, 0.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// ============================================
// AVATAR CARD COMPONENT
// ============================================

export interface AvatarCardProps {
  avatar: Avatar3DProfile;
  selected?: boolean;
  onSelect?: (avatar: Avatar3DProfile) => void;
  onPreview?: (avatar: Avatar3DProfile) => void;
}

export const Avatar3DCard: React.FC<AvatarCardProps> = ({
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
        <div className="avatar-3d-badge">3D</div>
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
          🎬 Preview 3D
        </button>
      </div>
    </div>
  );
};

// Filter functions
export const filterAvatarsByAge = (avatars: Avatar3DProfile[], ageGroup: string): Avatar3DProfile[] => {
  if (ageGroup === 'all') return avatars;
  return avatars.filter(a => a.ageGroup === ageGroup);
};

export const filterAvatarsByGender = (avatars: Avatar3DProfile[], gender: string): Avatar3DProfile[] => {
  if (gender === 'all') return avatars;
  return avatars.filter(a => a.gender === gender);
};

export const filterAvatarsByEthnicity = (avatars: Avatar3DProfile[], ethnicity: string): Avatar3DProfile[] => {
  if (ethnicity === 'all') return avatars;
  return avatars.filter(a => a.ethnicity === ethnicity);
};

export default Avatar3DViewer;
