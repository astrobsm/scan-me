/**
 * CHARLES-DOUGLAS SCAN APP
 * Advanced 3D Avatar Animation System
 * 
 * Pixar/Disney-quality 3D animated avatars
 * Uses Three.js + React Three Fiber + Drei
 */

// Advanced 3D Avatar System (Main)
export {
  Avatar3DViewer,
  Avatar3DCard,
  NIGERIAN_3D_AVATARS,
  filterAvatarsByAge,
  filterAvatarsByGender,
  filterAvatarsByEthnicity,
  type Avatar3DProfile,
  type Avatar3DViewerProps,
  type AvatarCardProps
} from './Advanced3DEngine';

// 3D Video Preview System
export {
  VideoPreview3D,
  Avatar3DPreviewCard,
  DEFAULT_3D_AVATARS,
  type VideoPreview3DProps,
  type Avatar3DAppearance,
  type PreviewDialogue,
} from './VideoPreview3D';

// Professional 3D Character Loader (Reallusion, Mixamo, Ready Player Me, Custom GLB)
export {
  Pro3DCharacterViewer,
  CustomModelUploader,
  ReadyPlayerMeIntegration,
  SAMPLE_3D_CHARACTERS,
  getReadyPlayerMeUrl,
  type Pro3DCharacter,
  type Pro3DCharacterViewerProps,
  type CharacterSource,
  type ReadyPlayerMeConfig,
} from './Pro3DCharacterLoader';

// Import CSS
import './RealisticAvatar.css';
