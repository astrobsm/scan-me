/**
 * CHARLES-DOUGLAS SCAN APP
 * 3D Avatar Animation Engine
 * 
 * High-quality 3D animated avatars inspired by Pixar/Disney style
 * Features: Smooth animations, lip sync, expressive emotions, realistic movements
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Simple OrbitControls wrapper without using drei
function OrbitControlsComponent({ enableZoom = true, enablePan = true }: { enableZoom?: boolean; enablePan?: boolean }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ThreeOrbitControls | null>(null);
  
  useEffect(() => {
    const controls = new ThreeOrbitControls(camera, gl.domElement);
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;
    
    return () => {
      controls.dispose();
    };
  }, [camera, gl, enableZoom, enablePan]);
  
  useFrame(() => {
    controlsRef.current?.update();
  });
  
  return null;
}

// ============= TYPES =============

export interface Avatar3DConfig {
  id: string;
  name: string;
  gender: 'male' | 'female';
  skinTone: string;
  hairColor: string;
  hairStyle: 'short' | 'medium' | 'long' | 'bald' | 'braids' | 'afro' | 'hijab';
  eyeColor: string;
  outfitColor: string;
  accessory?: 'glasses' | 'earrings' | 'necklace' | 'headwrap' | 'cap';
  ethnicity: 'igbo' | 'yoruba' | 'hausa' | 'fulani' | 'mixed';
}

export interface EmotionState {
  happiness: number;    // 0-1
  sadness: number;      // 0-1
  anger: number;        // 0-1
  surprise: number;     // 0-1
  fear: number;         // 0-1
  disgust: number;      // 0-1
  neutral: number;      // 0-1
}

export interface LipSyncState {
  viseme: string;       // Current mouth shape
  intensity: number;    // 0-1
}

// Viseme shapes for lip sync (mouth positions for different sounds)
export const VISEMES = {
  'sil': { jawOpen: 0, lipWidth: 0.5, lipPucker: 0 },           // Silence
  'aa': { jawOpen: 0.8, lipWidth: 0.6, lipPucker: 0 },          // "father"
  'ae': { jawOpen: 0.6, lipWidth: 0.7, lipPucker: 0 },          // "cat"
  'ah': { jawOpen: 0.7, lipWidth: 0.5, lipPucker: 0 },          // "but"
  'ao': { jawOpen: 0.6, lipWidth: 0.4, lipPucker: 0.2 },        // "dog"
  'aw': { jawOpen: 0.5, lipWidth: 0.3, lipPucker: 0.5 },        // "foul"
  'ay': { jawOpen: 0.4, lipWidth: 0.6, lipPucker: 0 },          // "say"
  'b': { jawOpen: 0.1, lipWidth: 0.5, lipPucker: 0.8 },         // "boy" (lips together)
  'ch': { jawOpen: 0.3, lipWidth: 0.4, lipPucker: 0.3 },        // "chin"
  'd': { jawOpen: 0.3, lipWidth: 0.5, lipPucker: 0 },           // "dog"
  'ee': { jawOpen: 0.2, lipWidth: 0.8, lipPucker: 0 },          // "bee"
  'eh': { jawOpen: 0.4, lipWidth: 0.6, lipPucker: 0 },          // "pet"
  'er': { jawOpen: 0.3, lipWidth: 0.5, lipPucker: 0.2 },        // "bird"
  'f': { jawOpen: 0.2, lipWidth: 0.5, lipPucker: 0, lipBite: 0.5 }, // "five"
  'g': { jawOpen: 0.4, lipWidth: 0.5, lipPucker: 0 },           // "go"
  'ih': { jawOpen: 0.3, lipWidth: 0.6, lipPucker: 0 },          // "tip"
  'jh': { jawOpen: 0.3, lipWidth: 0.4, lipPucker: 0.2 },        // "joy"
  'k': { jawOpen: 0.3, lipWidth: 0.5, lipPucker: 0 },           // "key"
  'l': { jawOpen: 0.3, lipWidth: 0.5, lipPucker: 0 },           // "love"
  'm': { jawOpen: 0, lipWidth: 0.5, lipPucker: 0.9 },           // "mom" (lips together)
  'n': { jawOpen: 0.2, lipWidth: 0.5, lipPucker: 0 },           // "no"
  'oh': { jawOpen: 0.5, lipWidth: 0.3, lipPucker: 0.4 },        // "go"
  'ow': { jawOpen: 0.4, lipWidth: 0.2, lipPucker: 0.6 },        // "owl"
  'oy': { jawOpen: 0.4, lipWidth: 0.3, lipPucker: 0.3 },        // "boy"
  'p': { jawOpen: 0, lipWidth: 0.5, lipPucker: 0.9 },           // "pop" (lips together)
  'r': { jawOpen: 0.3, lipWidth: 0.4, lipPucker: 0.3 },         // "red"
  's': { jawOpen: 0.2, lipWidth: 0.6, lipPucker: 0 },           // "say"
  'sh': { jawOpen: 0.3, lipWidth: 0.4, lipPucker: 0.4 },        // "she"
  't': { jawOpen: 0.2, lipWidth: 0.5, lipPucker: 0 },           // "to"
  'th': { jawOpen: 0.2, lipWidth: 0.6, lipPucker: 0 },          // "think"
  'uh': { jawOpen: 0.4, lipWidth: 0.5, lipPucker: 0.1 },        // "book"
  'uw': { jawOpen: 0.3, lipWidth: 0.2, lipPucker: 0.7 },        // "you"
  'v': { jawOpen: 0.2, lipWidth: 0.5, lipPucker: 0, lipBite: 0.3 }, // "voice"
  'w': { jawOpen: 0.2, lipWidth: 0.2, lipPucker: 0.8 },         // "way"
  'y': { jawOpen: 0.3, lipWidth: 0.6, lipPucker: 0 },           // "yes"
  'z': { jawOpen: 0.2, lipWidth: 0.6, lipPucker: 0 },           // "zoo"
  'zh': { jawOpen: 0.3, lipWidth: 0.4, lipPucker: 0.3 },        // "measure"
};

// ============= 3D HEAD COMPONENT =============

interface HeadProps {
  skinColor: string;
  emotion: EmotionState;
  lipSync: LipSyncState;
  eyeColor: string;
  gender: 'male' | 'female';
}

function Head({ skinColor, emotion, lipSync, eyeColor, gender }: HeadProps) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyebrowRef = useRef<THREE.Mesh>(null);
  const rightEyebrowRef = useRef<THREE.Mesh>(null);
  
  const [blinkState, setBlinkState] = useState(0);
  const blinkTimer = useRef(0);
  
  // Smooth animation interpolation
  const currentJaw = useRef(0);
  const currentLipWidth = useRef(0.5);
  const currentBrowHeight = useRef(0);
  
  // Get viseme parameters
  const visemeParams = VISEMES[lipSync.viseme as keyof typeof VISEMES] || VISEMES['sil'];
  
  useFrame((state, delta) => {
    if (!headRef.current) return;
    
    // Subtle head movement (idle animation)
    const time = state.clock.elapsedTime;
    headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    headRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
    headRef.current.position.y = Math.sin(time * 0.7) * 0.02;
    
    // Blinking animation
    blinkTimer.current += delta;
    if (blinkTimer.current > 3 + Math.random() * 2) {
      blinkTimer.current = 0;
      setBlinkState(1);
      setTimeout(() => setBlinkState(0), 150);
    }
    
    // Smooth jaw animation for lip sync
    const targetJaw = visemeParams.jawOpen * lipSync.intensity;
    currentJaw.current += (targetJaw - currentJaw.current) * 0.3;
    
    // Smooth lip width animation
    const targetLipWidth = visemeParams.lipWidth;
    currentLipWidth.current += (targetLipWidth - currentLipWidth.current) * 0.3;
    
    // Eyebrow animation based on emotion
    const targetBrowHeight = emotion.surprise * 0.15 - emotion.anger * 0.1 - emotion.sadness * 0.08;
    currentBrowHeight.current += (targetBrowHeight - currentBrowHeight.current) * 0.1;
    
    // Apply eye blink
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkScale = 1 - blinkState * 0.9;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
      
      // Eye look direction (follows slight head movement)
      leftEyeRef.current.rotation.y = Math.sin(time * 0.8) * 0.1;
      rightEyeRef.current.rotation.y = Math.sin(time * 0.8) * 0.1;
    }
    
    // Eyebrow movement
    if (leftEyebrowRef.current && rightEyebrowRef.current) {
      leftEyebrowRef.current.position.y = 0.65 + currentBrowHeight.current;
      rightEyebrowRef.current.position.y = 0.65 + currentBrowHeight.current;
      
      // Angry eyebrows tilt inward
      if (emotion.anger > 0.3) {
        leftEyebrowRef.current.rotation.z = emotion.anger * 0.3;
        rightEyebrowRef.current.rotation.z = -emotion.anger * 0.3;
      } else {
        leftEyebrowRef.current.rotation.z = 0;
        rightEyebrowRef.current.rotation.z = 0;
      }
    }
    
    // Mouth animation
    if (mouthRef.current) {
      mouthRef.current.scale.y = 0.3 + currentJaw.current * 0.7;
      mouthRef.current.scale.x = currentLipWidth.current * 1.5;
      mouthRef.current.position.y = -0.35 - currentJaw.current * 0.1;
      
      // Smile based on happiness
      if (emotion.happiness > 0.3) {
        mouthRef.current.scale.x = currentLipWidth.current * 1.5 + emotion.happiness * 0.3;
      }
    }
  });
  
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor),
    roughness: 0.6,
    metalness: 0.1,
  }), [skinColor]);
  
  const eyeWhiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.3,
    metalness: 0,
  }), []);
  
  const eyeIrisMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(eyeColor),
    roughness: 0.3,
    metalness: 0.1,
  }), [eyeColor]);
  
  const pupilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#000000',
    roughness: 0.2,
    metalness: 0,
  }), []);
  
  const lipMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: gender === 'female' ? '#c4736c' : '#8b5a5a',
    roughness: 0.4,
    metalness: 0,
  }), [gender]);
  
  const eyebrowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.8,
    metalness: 0,
  }), []);
  
  return (
    <group ref={headRef}>
      {/* Main head shape - stylized oval */}
      <mesh position={[0, 0, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.8, 32, 32]} />
      </mesh>
      
      {/* Chin/jaw area */}
      <mesh position={[0, -0.5, 0.2]} material={skinMaterial}>
        <sphereGeometry args={[0.45, 16, 16]} />
      </mesh>
      
      {/* Cheeks */}
      <mesh position={[-0.45, -0.1, 0.4]} material={skinMaterial}>
        <sphereGeometry args={[0.25, 16, 16]} />
      </mesh>
      <mesh position={[0.45, -0.1, 0.4]} material={skinMaterial}>
        <sphereGeometry args={[0.25, 16, 16]} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, -0.05, 0.75]} material={skinMaterial}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
      <mesh position={[0, -0.15, 0.7]} material={skinMaterial}>
        <sphereGeometry args={[0.08, 12, 12]} />
      </mesh>
      
      {/* Left Eye */}
      <group position={[-0.28, 0.15, 0.6]}>
        <mesh ref={leftEyeRef} material={eyeWhiteMaterial}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.1]} material={eyeIrisMaterial}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.13]} material={pupilMaterial}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.03, 0.03, 0.14]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>
      
      {/* Right Eye */}
      <group position={[0.28, 0.15, 0.6]}>
        <mesh ref={rightEyeRef} material={eyeWhiteMaterial}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.1]} material={eyeIrisMaterial}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.13]} material={pupilMaterial}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.03, 0.03, 0.14]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>
      
      {/* Eyebrows */}
      <mesh ref={leftEyebrowRef} position={[-0.28, 0.35, 0.65]} rotation={[0, 0, 0.1]} material={eyebrowMaterial}>
        <boxGeometry args={[0.2, 0.04, 0.05]} />
      </mesh>
      <mesh ref={rightEyebrowRef} position={[0.28, 0.35, 0.65]} rotation={[0, 0, -0.1]} material={eyebrowMaterial}>
        <boxGeometry args={[0.2, 0.04, 0.05]} />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.35, 0.6]} material={lipMaterial}>
        <sphereGeometry args={[0.15, 16, 8]} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.78, 0.05, 0]} rotation={[0, -0.3, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.12, 12, 12]} />
      </mesh>
      <mesh position={[0.78, 0.05, 0]} rotation={[0, 0.3, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.12, 12, 12]} />
      </mesh>
    </group>
  );
}

// ============= HAIR COMPONENT =============

interface HairProps {
  style: Avatar3DConfig['hairStyle'];
  color: string;
  gender: 'male' | 'female';
}

function Hair({ style, color, gender }: HairProps) {
  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.8,
    metalness: 0,
  }), [color]);
  
  if (style === 'bald') return null;
  
  if (style === 'hijab') {
    return (
      <group>
        {/* Hijab/headwrap */}
        <mesh position={[0, 0.2, 0]} material={hairMaterial}>
          <sphereGeometry args={[0.85, 32, 32]} />
        </mesh>
        <mesh position={[0, -0.3, 0.3]} material={hairMaterial}>
          <sphereGeometry args={[0.5, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.6, 0]} material={hairMaterial}>
          <cylinderGeometry args={[0.4, 0.5, 0.6, 16]} />
        </mesh>
      </group>
    );
  }
  
  if (style === 'afro') {
    return (
      <group>
        <mesh position={[0, 0.3, 0]} material={hairMaterial}>
          <sphereGeometry args={[1.0, 32, 32]} />
        </mesh>
      </group>
    );
  }
  
  if (style === 'braids') {
    const braids = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x = Math.cos(angle) * 0.6;
      const z = Math.sin(angle) * 0.6;
      braids.push(
        <mesh key={i} position={[x, -0.3, z]} material={hairMaterial}>
          <cylinderGeometry args={[0.06, 0.04, 0.8, 8]} />
        </mesh>
      );
    }
    return (
      <group>
        <mesh position={[0, 0.3, 0]} material={hairMaterial}>
          <sphereGeometry args={[0.82, 32, 32]} />
        </mesh>
        {braids}
      </group>
    );
  }
  
  if (style === 'short') {
    return (
      <mesh position={[0, 0.25, 0]} material={hairMaterial}>
        <sphereGeometry args={[0.82, 32, 32]} />
      </mesh>
    );
  }
  
  if (style === 'medium') {
    return (
      <group>
        <mesh position={[0, 0.25, 0]} material={hairMaterial}>
          <sphereGeometry args={[0.85, 32, 32]} />
        </mesh>
        {/* Hair sides */}
        <mesh position={[-0.5, -0.3, 0]} material={hairMaterial}>
          <sphereGeometry args={[0.35, 16, 16]} />
        </mesh>
        <mesh position={[0.5, -0.3, 0]} material={hairMaterial}>
          <sphereGeometry args={[0.35, 16, 16]} />
        </mesh>
      </group>
    );
  }
  
  // Long hair
  return (
    <group>
      <mesh position={[0, 0.25, 0]} material={hairMaterial}>
        <sphereGeometry args={[0.85, 32, 32]} />
      </mesh>
      {/* Long hair flowing down */}
      <mesh position={[-0.4, -0.5, -0.1]} material={hairMaterial}>
        <cylinderGeometry args={[0.25, 0.2, 1.2, 12]} />
      </mesh>
      <mesh position={[0.4, -0.5, -0.1]} material={hairMaterial}>
        <cylinderGeometry args={[0.25, 0.2, 1.2, 12]} />
      </mesh>
      <mesh position={[0, -0.5, -0.3]} material={hairMaterial}>
        <cylinderGeometry args={[0.35, 0.25, 1.0, 12]} />
      </mesh>
    </group>
  );
}

// ============= BODY COMPONENT =============

interface BodyProps {
  outfitColor: string;
  skinColor: string;
  gender: 'male' | 'female';
}

function Body({ outfitColor, skinColor, gender }: BodyProps) {
  const bodyRef = useRef<THREE.Group>(null);
  
  const outfitMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitColor),
    roughness: 0.7,
    metalness: 0,
  }), [outfitColor]);
  
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor),
    roughness: 0.6,
    metalness: 0.1,
  }), [skinColor]);
  
  useFrame((state) => {
    if (!bodyRef.current) return;
    const time = state.clock.elapsedTime;
    // Subtle breathing animation
    bodyRef.current.scale.x = 1 + Math.sin(time * 1.5) * 0.01;
    bodyRef.current.scale.z = 1 + Math.sin(time * 1.5) * 0.01;
  });
  
  const shoulderWidth = gender === 'male' ? 0.65 : 0.55;
  const torsoHeight = gender === 'male' ? 1.2 : 1.1;
  
  return (
    <group ref={bodyRef} position={[0, -1.6, 0]}>
      {/* Neck */}
      <mesh position={[0, 0.6, 0]} material={skinMaterial}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0, 0]} material={outfitMaterial}>
        <cylinderGeometry args={[shoulderWidth, 0.4, torsoHeight, 16]} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-shoulderWidth, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} material={outfitMaterial}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      <mesh position={[shoulderWidth, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} material={outfitMaterial}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-shoulderWidth - 0.15, 0, 0]} material={outfitMaterial}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 12]} />
      </mesh>
      <mesh position={[shoulderWidth + 0.15, 0, 0]} material={outfitMaterial}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 12]} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-shoulderWidth - 0.15, -0.5, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.1, 12, 12]} />
      </mesh>
      <mesh position={[shoulderWidth + 0.15, -0.5, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.1, 12, 12]} />
      </mesh>
    </group>
  );
}

// ============= GLASSES ACCESSORY =============

function Glasses() {
  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.3,
    metalness: 0.8,
  }), []);
  
  const lensMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#87ceeb',
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.2,
  }), []);
  
  return (
    <group position={[0, 0.15, 0.75]}>
      {/* Left lens frame */}
      <mesh position={[-0.28, 0, 0]} material={glassMaterial}>
        <torusGeometry args={[0.12, 0.015, 8, 24]} />
      </mesh>
      <mesh position={[-0.28, 0, 0.01]} material={lensMaterial}>
        <circleGeometry args={[0.11, 24]} />
      </mesh>
      
      {/* Right lens frame */}
      <mesh position={[0.28, 0, 0]} material={glassMaterial}>
        <torusGeometry args={[0.12, 0.015, 8, 24]} />
      </mesh>
      <mesh position={[0.28, 0, 0.01]} material={lensMaterial}>
        <circleGeometry args={[0.11, 24]} />
      </mesh>
      
      {/* Bridge */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={glassMaterial}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
      </mesh>
      
      {/* Temple arms */}
      <mesh position={[-0.42, 0, -0.2]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
      </mesh>
      <mesh position={[0.42, 0, -0.2]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
      </mesh>
    </group>
  );
}

// ============= MAIN AVATAR 3D COMPONENT =============

interface Avatar3DCharacterProps {
  config: Avatar3DConfig;
  emotion: EmotionState;
  lipSync: LipSyncState;
  talking: boolean;
}

function Avatar3DCharacter({ config, emotion, lipSync, talking }: Avatar3DCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Custom floating animation instead of using Float from drei
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.05;
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
  });
  
  return (
    <group ref={groupRef}>
      <Head 
        skinColor={config.skinTone} 
        emotion={emotion} 
        lipSync={lipSync}
        eyeColor={config.eyeColor}
        gender={config.gender}
      />
      <Hair 
        style={config.hairStyle} 
        color={config.hairColor}
        gender={config.gender}
      />
      <Body 
        outfitColor={config.outfitColor}
        skinColor={config.skinTone}
        gender={config.gender}
      />
      {config.accessory === 'glasses' && <Glasses />}
    </group>
  );
}

// ============= AVATAR 3D CANVAS WRAPPER =============

export interface Avatar3DProps {
  config: Avatar3DConfig;
  emotion?: EmotionState;
  lipSync?: LipSyncState;
  talking?: boolean;
  width?: number;
  height?: number;
  className?: string;
  background?: string;
}

const DEFAULT_EMOTION: EmotionState = {
  happiness: 0.3,
  sadness: 0,
  anger: 0,
  surprise: 0,
  fear: 0,
  disgust: 0,
  neutral: 0.7
};

const DEFAULT_LIP_SYNC: LipSyncState = {
  viseme: 'sil',
  intensity: 0
};

export function Avatar3D({ 
  config, 
  emotion = DEFAULT_EMOTION, 
  lipSync = DEFAULT_LIP_SYNC,
  talking = false,
  width = 400,
  height = 500,
  className = '',
  background = '#1e293b'
}: Avatar3DProps) {
  return (
    <div style={{ width, height, background, borderRadius: 12, overflow: 'hidden' }} className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, 5]} intensity={0.5} />
        <pointLight position={[0, 2, 3]} intensity={0.5} color="#fff5e0" />
        
        <Avatar3DCharacter 
          config={config} 
          emotion={emotion} 
          lipSync={lipSync}
          talking={talking}
        />
        
        {/* Simple ground plane for shadow effect */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        
        <OrbitControlsComponent enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

// ============= PRESET NIGERIAN AVATARS =============

export const NIGERIAN_3D_AVATARS: Avatar3DConfig[] = [
  {
    id: '3d-doctor-female-igbo',
    name: 'Dr. Adaeze',
    gender: 'female',
    skinTone: '#8B6914',
    hairColor: '#1a1a1a',
    hairStyle: 'medium',
    eyeColor: '#3D2B1F',
    outfitColor: '#ffffff',
    accessory: 'glasses',
    ethnicity: 'igbo'
  },
  {
    id: '3d-doctor-male-yoruba',
    name: 'Dr. Adebayo',
    gender: 'male',
    skinTone: '#6B4423',
    hairColor: '#1a1a1a',
    hairStyle: 'short',
    eyeColor: '#2C1810',
    outfitColor: '#ffffff',
    ethnicity: 'yoruba'
  },
  {
    id: '3d-nurse-female-hausa',
    name: 'Nurse Amina',
    gender: 'female',
    skinTone: '#C19A6B',
    hairColor: '#4a3728',
    hairStyle: 'hijab',
    eyeColor: '#3D2B1F',
    outfitColor: '#3b82f6',
    ethnicity: 'hausa'
  },
  {
    id: '3d-teacher-male-igbo',
    name: 'Mr. Emeka',
    gender: 'male',
    skinTone: '#8B5A2B',
    hairColor: '#1a1a1a',
    hairStyle: 'short',
    eyeColor: '#2C1810',
    outfitColor: '#1e40af',
    accessory: 'glasses',
    ethnicity: 'igbo'
  },
  {
    id: '3d-chief-male-yoruba',
    name: 'Chief Oladipo',
    gender: 'male',
    skinTone: '#6B4423',
    hairColor: '#4a4a4a',
    hairStyle: 'bald',
    eyeColor: '#3D2B1F',
    outfitColor: '#7c2d12',
    ethnicity: 'yoruba'
  },
  {
    id: '3d-student-female-mixed',
    name: 'Blessing',
    gender: 'female',
    skinTone: '#9C6644',
    hairColor: '#1a1a1a',
    hairStyle: 'afro',
    eyeColor: '#3D2B1F',
    outfitColor: '#059669',
    ethnicity: 'mixed'
  },
  {
    id: '3d-pastor-male-igbo',
    name: 'Pastor Chukwuma',
    gender: 'male',
    skinTone: '#7C5C3A',
    hairColor: '#2a2a2a',
    hairStyle: 'short',
    eyeColor: '#2C1810',
    outfitColor: '#1e1e1e',
    ethnicity: 'igbo'
  },
  {
    id: '3d-market-woman-yoruba',
    name: 'Mama Titi',
    gender: 'female',
    skinTone: '#6B4423',
    hairColor: '#1a1a1a',
    hairStyle: 'braids',
    eyeColor: '#3D2B1F',
    outfitColor: '#ea580c',
    ethnicity: 'yoruba'
  },
  {
    id: '3d-engineer-male-hausa',
    name: 'Engr. Musa',
    gender: 'male',
    skinTone: '#B8860B',
    hairColor: '#1a1a1a',
    hairStyle: 'short',
    eyeColor: '#2C1810',
    outfitColor: '#0369a1',
    ethnicity: 'hausa'
  },
  {
    id: '3d-businesswoman-fulani',
    name: 'Mrs. Fatima',
    gender: 'female',
    skinTone: '#D2691E',
    hairColor: '#2a2a2a',
    hairStyle: 'hijab',
    eyeColor: '#3D2B1F',
    outfitColor: '#7c3aed',
    ethnicity: 'fulani'
  }
];

export default Avatar3D;
