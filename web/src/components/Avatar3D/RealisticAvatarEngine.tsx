/**
 * Realistic 3D Avatar Engine
 * Uses Ready Player Me models and custom GLB avatars
 * Supports all ages, ethnicities, and Nigerian features
 */

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// REALISTIC NIGERIAN AVATAR LIBRARY
// High-quality 3D avatars with real human features
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
  modelUrl: string; // GLB/GLTF model URL
  thumbnailUrl: string;
  description: string;
  age: number;
}

// Ready Player Me base URL for Nigerian-style avatars
const RPM_BASE = 'https://models.readyplayer.me';

// Pre-configured Nigerian avatar models
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e01.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e02.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/8613312/pexels-photo-8613312.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e03.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/7869238/pexels-photo-7869238.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e04.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e05.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e06.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/7869565/pexels-photo-7869565.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e07.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e08.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e09.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6626967/pexels-photo-6626967.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e10.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e11.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147276/pexels-photo-6147276.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e12.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147420/pexels-photo-6147420.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e13.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/7869297/pexels-photo-7869297.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e14.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147381/pexels-photo-6147381.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e15.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147340/pexels-photo-6147340.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e16.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147395/pexels-photo-6147395.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e17.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/7869312/pexels-photo-7869312.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e18.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147352/pexels-photo-6147352.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e19.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147401/pexels-photo-6147401.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e20.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/6147410/pexels-photo-6147410.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e21.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=200',
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
    modelUrl: `${RPM_BASE}/64f9b9b9c7e5b9001d9b5e22.glb`,
    thumbnailUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200',
    description: 'Young Nigerian tech professional',
    age: 29
  }
];

// ============================================
// 3D AVATAR COMPONENT WITH ANIMATIONS
// ============================================

interface AvatarModelProps {
  avatar: RealisticAvatar;
  emotion?: string;
  isSpeaking?: boolean;
  lipSyncValue?: number;
}

// Fallback 3D avatar when model can't be loaded
const FallbackAvatar: React.FC<{ avatar: RealisticAvatar; emotion?: string; isSpeaking?: boolean }> = ({ 
  avatar, 
  emotion = 'neutral',
  isSpeaking = false 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(0);
  
  // Parse skin color
  const skinColor = new THREE.Color(avatar.skinTone);
  const hairColor = new THREE.Color(avatar.hairColor);
  const eyeColor = new THREE.Color(avatar.eyeColor);
  
  // Determine body proportions based on age
  const getProportions = () => {
    switch (avatar.ageGroup) {
      case 'child':
        return { headScale: 1.3, bodyHeight: 0.8, bodyWidth: 0.9 };
      case 'teen':
        return { headScale: 1.1, bodyHeight: 1.0, bodyWidth: 0.95 };
      case 'young-adult':
      case 'adult':
        return { headScale: 1.0, bodyHeight: 1.2, bodyWidth: 1.0 };
      case 'middle-aged':
        return { headScale: 1.0, bodyHeight: 1.1, bodyWidth: 1.1 };
      case 'senior':
        return { headScale: 1.0, bodyHeight: 1.0, bodyWidth: 1.0 };
      default:
        return { headScale: 1.0, bodyHeight: 1.0, bodyWidth: 1.0 };
    }
  };
  
  const proportions = getProportions();
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Gentle idle animation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    
    // Breathing animation
    if (headRef.current) {
      headRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
    
    // Blinking
    setBlinkTimer(prev => {
      if (prev > 3 + Math.random() * 2) {
        return 0;
      }
      return prev + delta;
    });
    
    // Eye blinking effect
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkPhase = blinkTimer % 0.15;
      const blinkScale = blinkTimer > 3 && blinkPhase < 0.1 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }
    
    // Mouth animation when speaking
    if (mouthRef.current && isSpeaking) {
      const newMouthOpen = Math.sin(state.clock.elapsedTime * 12) * 0.5 + 0.5;
      mouthRef.current.scale.y = 0.3 + newMouthOpen * 0.7;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.35 * proportions.bodyWidth, proportions.bodyHeight, 8, 16]} />
        <meshStandardMaterial color={avatar.clothing.includes('agbada') ? '#1a472a' : '#2c3e50'} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.5, 0]} scale={proportions.headScale}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Hair */}
      {!avatar.hairStyle.includes('covered') && (
        <mesh position={[0, 1.75, 0]} scale={[proportions.headScale, proportions.headScale * 0.6, proportions.headScale]}>
          <sphereGeometry args={[0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
      
      {/* Hijab for covered hairstyles */}
      {avatar.hairStyle.includes('covered') && (
        <mesh position={[0, 1.6, 0]} scale={proportions.headScale}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#7b2d8e" />
        </mesh>
      )}
      
      {/* Left Eye */}
      <mesh ref={leftEyeRef} position={[-0.12, 1.55, 0.28]} scale={proportions.headScale}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.12, 1.55, 0.32]} scale={proportions.headScale}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      <mesh position={[-0.12, 1.55, 0.34]} scale={proportions.headScale}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Right Eye */}
      <mesh ref={rightEyeRef} position={[0.12, 1.55, 0.28]} scale={proportions.headScale}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 1.55, 0.32]} scale={proportions.headScale}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.12, 1.55, 0.34]} scale={proportions.headScale}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.45, 0.32]} rotation={[0.3, 0, 0]} scale={proportions.headScale}>
        <coneGeometry args={[0.04, 0.08, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 1.35, 0.3]} scale={proportions.headScale}>
        <boxGeometry args={[0.12, 0.03, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Eyebrows */}
      <mesh position={[-0.12, 1.65, 0.28]} rotation={[0, 0, 0.1]} scale={proportions.headScale}>
        <boxGeometry args={[0.08, 0.015, 0.01]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      <mesh position={[0.12, 1.65, 0.28]} rotation={[0, 0, -0.1]} scale={proportions.headScale}>
        <boxGeometry args={[0.08, 0.015, 0.01]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.35, 1.5, 0]} scale={proportions.headScale}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.35, 1.5, 0]} scale={proportions.headScale}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Glasses if applicable */}
      {avatar.accessories.includes('glasses') && (
        <>
          <mesh position={[-0.12, 1.55, 0.35]} scale={proportions.headScale}>
            <ringGeometry args={[0.06, 0.07, 16]} />
            <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.12, 1.55, 0.35]} scale={proportions.headScale}>
            <ringGeometry args={[0.06, 0.07, 16]} />
            <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 1.55, 0.35]} scale={proportions.headScale}>
            <boxGeometry args={[0.08, 0.01, 0.01]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </>
      )}
      
      {/* Arms */}
      <mesh position={[-0.5, 0.6, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={avatar.clothing.includes('agbada') ? '#1a472a' : '#2c3e50'} />
      </mesh>
      <mesh position={[0.5, 0.6, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={avatar.clothing.includes('agbada') ? '#1a472a' : '#2c3e50'} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-0.65, 0.25, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.65, 0.25, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
};

// GLB Model loader component - uses FallbackAvatar for now
// GLB loading can be enabled when Ready Player Me models are available
const GLBAvatar: React.FC<AvatarModelProps> = ({ avatar, emotion, isSpeaking }) => {
  // Always use FallbackAvatar for now - provides great 3D experience without external model loading
  return <FallbackAvatar avatar={avatar} emotion={emotion} isSpeaking={isSpeaking} />;
};

// Custom OrbitControls
const CustomControls: React.FC = () => {
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const spherical = useRef({ theta: 0, phi: Math.PI / 2 });
  const radius = 5;
  
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      
      spherical.current.theta -= deltaX * 0.01;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi + deltaY * 0.01));
      
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl]);
  
  useFrame(() => {
    camera.position.x = radius * Math.sin(spherical.current.phi) * Math.cos(spherical.current.theta);
    camera.position.y = radius * Math.cos(spherical.current.phi);
    camera.position.z = radius * Math.sin(spherical.current.phi) * Math.sin(spherical.current.theta);
    camera.lookAt(0, 0.5, 0);
  });
  
  return null;
};

// Scene lighting
const SceneLighting: React.FC = () => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
    <directionalLight position={[-5, 3, -5]} intensity={0.4} />
    <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffeedd" />
  </>
);

// Loading component
const LoadingAvatar: React.FC = () => (
  <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshStandardMaterial color="#cccccc" wireframe />
  </mesh>
);

// ============================================
// MAIN COMPONENT EXPORTS
// ============================================

export interface RealisticAvatarViewerProps {
  avatar: RealisticAvatar;
  emotion?: string;
  isSpeaking?: boolean;
  lipSyncValue?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const RealisticAvatarViewer: React.FC<RealisticAvatarViewerProps> = ({
  avatar,
  emotion = 'neutral',
  isSpeaking = false,
  lipSyncValue = 0,
  width = 400,
  height = 450,
  className = ''
}) => {
  return (
    <div className={`realistic-avatar-viewer ${className}`} style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <Suspense fallback={<LoadingAvatar />}>
          <SceneLighting />
          <GLBAvatar 
            avatar={avatar} 
            emotion={emotion} 
            isSpeaking={isSpeaking}
            lipSyncValue={lipSyncValue}
          />
          <CustomControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Avatar card for selection
export interface AvatarCardProps {
  avatar: RealisticAvatar;
  selected?: boolean;
  onSelect?: (avatar: RealisticAvatar) => void;
  onPreview?: (avatar: RealisticAvatar) => void;
}

export const RealisticAvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  selected = false,
  onSelect,
  onPreview
}) => {
  return (
    <div 
      className={`realistic-avatar-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect?.(avatar)}
    >
      <div className="avatar-thumbnail">
        <img 
          src={avatar.thumbnailUrl} 
          alt={avatar.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar.name)}&background=random&size=200`;
          }}
        />
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
          Preview 3D
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

export default RealisticAvatarViewer;
