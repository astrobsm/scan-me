/**
 * Professional 3D Character Loader
 * 
 * Loads high-quality 3D characters from various sources:
 * - Reallusion Character Creator exports (GLB/GLTF)
 * - Ready Player Me avatars
 * - Mixamo characters (Adobe)
 * - Custom GLB/GLTF models
 * 
 * Supports full skeletal animation, blend shapes, and lip sync
 */

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Html,
  useGLTF,
  useAnimations,
  Center
} from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Character source types
export type CharacterSource = 
  | 'reallusion'      // Reallusion Character Creator exports
  | 'readyplayerme'   // Ready Player Me avatars
  | 'mixamo'          // Adobe Mixamo characters
  | 'custom'          // Custom GLB/GLTF models
  | 'procedural';     // Our procedural avatars

// Character configuration
export interface Pro3DCharacter {
  id: string;
  name: string;
  source: CharacterSource;
  modelUrl: string;           // URL to GLB/GLTF file
  thumbnailUrl?: string;      // Preview image
  animationUrls?: string[];   // Additional animation files
  scale?: number;             // Model scale
  position?: [number, number, number];
  rotation?: [number, number, number];
  
  // Animation settings
  defaultAnimation?: string;  // Default animation to play
  lipSyncEnabled?: boolean;   // Whether model has blend shapes for lip sync
  blendShapeNames?: {         // Mapping of blend shape names
    mouthOpen?: string;
    mouthSmile?: string;
    eyeBlinkLeft?: string;
    eyeBlinkRight?: string;
    browUp?: string;
    browDown?: string;
  };
  
  // Metadata
  ethnicity?: string;
  gender?: 'male' | 'female' | 'neutral';
  ageGroup?: 'child' | 'young' | 'adult' | 'senior';
  description?: string;
  tags?: string[];
}

// Free sample characters from various sources
export const SAMPLE_3D_CHARACTERS: Pro3DCharacter[] = [
  // Mixamo-compatible rigged characters (free to use)
  {
    id: 'mixamo-xbot',
    name: 'X-Bot',
    source: 'mixamo',
    modelUrl: 'https://threejs.org/examples/models/gltf/Xbot.glb',
    scale: 1,
    gender: 'neutral',
    ageGroup: 'adult',
    description: 'Mixamo X-Bot rigged character',
    tags: ['robot', 'animated', 'rigged'],
  },
  {
    id: 'mixamo-ybot',
    name: 'Y-Bot',
    source: 'mixamo',
    modelUrl: 'https://threejs.org/examples/models/gltf/Soldier.glb',
    scale: 0.01,
    gender: 'male',
    ageGroup: 'adult',
    description: 'Rigged soldier character',
    tags: ['soldier', 'animated', 'rigged'],
  },
];

// Ready Player Me avatar configuration
export interface ReadyPlayerMeConfig {
  subdomain?: string;        // Your RPM subdomain
  avatarId?: string;         // Specific avatar ID
  bodyType?: 'fullbody' | 'halfbody';
  quality?: 'low' | 'medium' | 'high';
  morphTargets?: string[];   // Which blend shapes to include
}

// Generate Ready Player Me avatar URL
export function getReadyPlayerMeUrl(config: ReadyPlayerMeConfig): string {
  const { subdomain = 'demo', avatarId, bodyType = 'fullbody', quality = 'high' } = config;
  
  if (avatarId) {
    // Direct avatar URL
    return `https://models.readyplayer.me/${avatarId}.glb?quality=${quality}&morphTargets=ARKit,Oculus Visemes`;
  }
  
  // Demo avatar for testing
  return 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?quality=high&morphTargets=ARKit,Oculus Visemes';
}

// Component to load and display a GLB/GLTF character
function GLTFCharacter({
  character,
  isSpeaking,
  emotion,
  playAnimation,
}: {
  character: Pro3DCharacter;
  isSpeaking?: boolean;
  emotion?: string;
  playAnimation?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(character.modelUrl);
  const { actions, names } = useAnimations(animations, groupRef);
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  
  // Find morph target meshes for lip sync
  const morphMeshes = React.useMemo(() => {
    const meshes: THREE.SkinnedMesh[] = [];
    clonedScene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh && (child as THREE.SkinnedMesh).morphTargetInfluences) {
        meshes.push(child as THREE.SkinnedMesh);
      }
    });
    return meshes;
  }, [clonedScene]);
  
  // Play animations
  useEffect(() => {
    const animName = playAnimation || character.defaultAnimation || names[0];
    if (animName && actions[animName]) {
      actions[animName]?.reset().fadeIn(0.5).play();
      return () => {
        actions[animName]?.fadeOut(0.5);
      };
    }
  }, [actions, names, playAnimation, character.defaultAnimation]);
  
  // Animation loop for lip sync and expressions
  useFrame((state, delta) => {
    mixer.update(delta);
    
    const time = state.clock.elapsedTime;
    
    // Lip sync animation
    if (isSpeaking && morphMeshes.length > 0) {
      morphMeshes.forEach((mesh) => {
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          // Try common blend shape names
          const mouthOpenNames = ['mouthOpen', 'jawOpen', 'viseme_aa', 'A', 'mouth_open'];
          for (const name of mouthOpenNames) {
            const idx = mesh.morphTargetDictionary[name];
            if (idx !== undefined) {
              mesh.morphTargetInfluences[idx] = 0.3 + Math.sin(time * 15) * 0.3;
              break;
            }
          }
        }
      });
    }
    
    // Breathing and subtle movement
    if (groupRef.current) {
      groupRef.current.position.y = (character.position?.[1] || 0) + Math.sin(time * 2) * 0.02;
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      scale={character.scale || 1}
      position={character.position || [0, 0, 0]}
      rotation={character.rotation?.map(r => r * Math.PI / 180) as [number, number, number] || [0, 0, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Fallback loading indicator
function LoadingIndicator() {
  return (
    <Html center>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '10px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          margin: '0 auto 10px',
          animation: 'spin 1s linear infinite',
        }} />
        Loading 3D Character...
      </div>
    </Html>
  );
}

// Error boundary for model loading
function ModelErrorFallback({ error, name }: { error: string; name: string }) {
  return (
    <Html center>
      <div style={{
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '300px',
      }}>
        <p><strong>⚠️ Failed to load: {name}</strong></p>
        <p style={{ fontSize: '12px', opacity: 0.8 }}>{error}</p>
      </div>
    </Html>
  );
}

// Main Pro 3D Character Viewer
export interface Pro3DCharacterViewerProps {
  character: Pro3DCharacter;
  isSpeaking?: boolean;
  emotion?: string;
  playAnimation?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
  backgroundColor?: string;
}

export function Pro3DCharacterViewer({
  character,
  isSpeaking = false,
  emotion = 'neutral',
  playAnimation,
  width = 400,
  height = 500,
  showControls = true,
  backgroundColor = '#1e293b',
}: Pro3DCharacterViewerProps) {
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div style={{ width, height, background: backgroundColor, borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<LoadingIndicator />}>
          {error ? (
            <ModelErrorFallback error={error} name={character.name} />
          ) : (
            <>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
              <spotLight position={[0, 5, 5]} intensity={0.5} angle={0.3} />
              
              <Environment preset="studio" />
              
              <ContactShadows
                position={[0, -1, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
              />
              
              <Center>
                <GLTFCharacter
                  character={character}
                  isSpeaking={isSpeaking}
                  emotion={emotion}
                  playAnimation={playAnimation}
                />
              </Center>
              
              {showControls && (
                <OrbitControls
                  enablePan={false}
                  minDistance={1.5}
                  maxDistance={5}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                />
              )}
            </>
          )}
        </Suspense>
      </Canvas>
      
      {/* Character name */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
      }}>
        {character.name}
      </div>
    </div>
  );
}

// Upload and import custom GLB/GLTF
export interface CustomModelUploaderProps {
  onModelLoaded: (character: Pro3DCharacter) => void;
}

export function CustomModelUploader({ onModelLoaded }: CustomModelUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['.glb', '.gltf'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validTypes.includes(ext)) {
      alert('Please upload a GLB or GLTF file');
      return;
    }
    
    setUploading(true);
    
    try {
      // Create object URL for the model
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Create character config
      const character: Pro3DCharacter = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.(glb|gltf)$/i, ''),
        source: 'custom',
        modelUrl: url,
        scale: 1,
        description: 'Custom uploaded model',
        tags: ['custom', 'uploaded'],
      };
      
      onModelLoaded(character);
    } catch (error) {
      console.error('Error loading model:', error);
      alert('Failed to load the 3D model');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div style={{
      border: '2px dashed rgba(255,255,255,0.3)',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.05)',
    }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {previewUrl ? (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#10b981', marginBottom: '10px' }}>✅ Model loaded successfully!</p>
          <button
            onClick={() => {
              setPreviewUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: '1px solid #ef4444',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Remove & Upload New
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Import 3D Character</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '14px' }}>
            Upload GLB/GLTF files from Reallusion, Mixamo, or any 3D software
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {uploading ? 'Loading...' : 'Choose GLB/GLTF File'}
          </button>
        </>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
        <p><strong>Supported formats:</strong> .glb, .gltf</p>
        <p><strong>Recommended sources:</strong></p>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '10px auto' }}>
          <li>Reallusion Character Creator → Export as GLB</li>
          <li>Adobe Mixamo → Download as FBX, convert to GLB</li>
          <li>Ready Player Me → Copy GLB URL</li>
          <li>Blender → Export as GLB with animations</li>
        </ul>
      </div>
    </div>
  );
}

// Ready Player Me integration helper
export function ReadyPlayerMeIntegration({
  onAvatarReady,
}: {
  onAvatarReady: (character: Pro3DCharacter) => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const loadAvatar = async () => {
    if (!avatarUrl.trim()) return;
    
    setLoading(true);
    try {
      // Validate URL format
      let modelUrl = avatarUrl.trim();
      if (!modelUrl.includes('.glb')) {
        // Extract avatar ID and construct URL
        const match = modelUrl.match(/([a-f0-9]{24})/i);
        if (match) {
          modelUrl = `https://models.readyplayer.me/${match[1]}.glb?quality=high&morphTargets=ARKit,Oculus Visemes`;
        }
      }
      
      const character: Pro3DCharacter = {
        id: `rpm-${Date.now()}`,
        name: 'Ready Player Me Avatar',
        source: 'readyplayerme',
        modelUrl,
        scale: 1,
        lipSyncEnabled: true,
        blendShapeNames: {
          mouthOpen: 'viseme_aa',
          eyeBlinkLeft: 'eyeBlinkLeft',
          eyeBlinkRight: 'eyeBlinkRight',
        },
        description: 'Custom Ready Player Me avatar',
        tags: ['rpm', 'custom', 'animated'],
      };
      
      onAvatarReady(character);
    } catch (error) {
      console.error('Error loading RPM avatar:', error);
      alert('Failed to load Ready Player Me avatar');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <h4 style={{ color: 'white', marginBottom: '10px' }}>
        🎮 Ready Player Me Integration
      </h4>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
        Create a free avatar at{' '}
        <a 
          href="https://readyplayer.me" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#60a5fa' }}
        >
          readyplayer.me
        </a>
        {' '}and paste the avatar URL below
      </p>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Paste Ready Player Me avatar URL or ID..."
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            padding: '10px 12px',
            color: 'white',
            fontSize: '13px',
          }}
        />
        <button
          onClick={loadAvatar}
          disabled={loading || !avatarUrl.trim()}
          style={{
            background: loading ? '#64748b' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Loading...' : 'Load Avatar'}
        </button>
      </div>
    </div>
  );
}

// Preload GLTF models
SAMPLE_3D_CHARACTERS.forEach((char) => {
  try {
    useGLTF.preload(char.modelUrl);
  } catch (e) {
    // Ignore preload errors
  }
});

export default Pro3DCharacterViewer;
