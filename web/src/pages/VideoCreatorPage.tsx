import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  Plus,
  Play,
  Pause,
  Download,
  Trash2,
  Edit3,
  Users,
  MessageSquare,
  Image,
  Settings,
  ChevronRight,
  ChevronLeft,
  Save,
  X,
  Volume2,
  Loader,
  Check,
  AlertCircle,
  Film,
  Mic,
  PlusCircle,
  MinusCircle,
  Move,
  Sparkles,
  Upload,
  FileText,
  Copy,
  Eye,
  Box
} from 'lucide-react';
import {
  videoCreator,
  VideoProject,
  Participant,
  DialogueLine,
  VideoScene,
  Avatar,
  Background,
  AVATARS,
  BACKGROUNDS,
  VIDEO_TEMPLATES,
  VIDEO_CATEGORIES,
  ExportProgress
} from '../services/VideoCreator';
import { videoPreviewEngine, PreviewState } from '../services/VideoPreviewEngine';
import { REALISTIC_AVATARS, RealisticAvatar as ServiceRealisticAvatar, EMOTION_PRESETS, AvatarRenderer } from '../services/RealisticAvatar';
import { bulkDialogueService, BulkDialogueEntry, DIALOGUE_TEMPLATES, DialogueTemplate } from '../services/BulkDialogueService';
import { 
  PHOTOREALISTIC_AVATARS, 
  avatarLoader, 
  getAvatarById as getPhotoAvatarById,
  PhotorealisticAvatar 
} from '../services/PhotorealisticAvatarLibrary';

// Import Advanced 3D Avatar data (stable Three.js 0.160 + Fiber 8.15 + Drei 9.92)
import {
  NIGERIAN_3D_AVATARS,
  filterAvatarsByAge,
  filterAvatarsByGender,
  filterAvatarsByEthnicity,
  type Avatar3DProfile,
  type Avatar3DViewerProps,
  type AvatarCardProps
} from '../components/Avatar3D/Advanced3DEngine';

// Lazy load 3D components to prevent initialization crashes
const Avatar3DViewer = React.lazy(() => 
  import('../components/Avatar3D/Advanced3DEngine').then(mod => ({ default: mod.Avatar3DViewer }))
);
const Avatar3DCard = React.lazy(() => 
  import('../components/Avatar3D/Advanced3DEngine').then(mod => ({ default: mod.Avatar3DCard }))
);

import { 
  NIGERIAN_AVATAR_LIBRARY, 
  AVATAR_CATEGORIES, 
  ETHNICITIES,
  getAvatarsByCategory,
  getAvatarsByEthnicity,
  DetailedAvatar 
} from '../services/NigerianAvatarLibrary';
import { 
  BACKGROUND_LIBRARY, 
  BACKGROUND_CATEGORIES,
  getBackgroundsByCategory,
  Background as LibraryBackground
} from '../services/BackgroundLibrary';
import { 
  NIGERIAN_VOICE_LIBRARY, 
  LANGUAGE_CATEGORIES,
  EMOTION_VOICE_SETTINGS,
  getVoicesByLanguage,
  applyEmotionToVoice,
  NigerianVoice,
  EmotionType
} from '../services/NigerianVoiceLibrary';
import './VideoCreatorPage.css';

type WizardStep = 'type' | 'topic' | 'participants' | 'dialogue' | 'background' | 'preview' | 'export';

type VideoType = 'advert' | 'health-talk' | 'educational' | 'interview' | 'news' | 'podcast' | 'tutorial' | 'testimonial' | 'documentary' | 'story' | 'product-demo' | 'announcement' | 'debate' | 'explainer' | 'comedy-skit' | 'motivational' | 'custom';

export function VideoCreatorPage() {
  // Project state
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('type');
  
  // Form state
  const [projectType, setProjectType] = useState<VideoType>('health-talk');
  const [videoTypeCategory, setVideoTypeCategory] = useState<string>('all');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [scenes, setScenes] = useState<VideoScene[]>([{ id: '1', backgroundId: 'bg-1', dialogues: [], transition: 'fade' }]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState<string>('bg-1');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewState, setPreviewState] = useState<PreviewState | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Bulk upload state
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadContent, setBulkUploadContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [uploadFormat, setUploadFormat] = useState<'csv' | 'json' | 'txt'>('csv');
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [previewAvatarId, setPreviewAvatarId] = useState<string>('');
  const [use3DAvatars, setUse3DAvatars] = useState(true); // Enable 3D avatars by default
  const [realistic3DAvatar, setRealistic3DAvatar] = useState<Avatar3DProfile | null>(null);
  const [selected3DAvatar, setSelected3DAvatar] = useState<string>(''); // Currently selected 3D avatar
  const [avatar3DAge, setAvatar3DAge] = useState<string>('all');
  const [avatar3DGender, setAvatar3DGender] = useState<string>('all');
  const [avatar3DEthnicity, setAvatar3DEthnicity] = useState<string>('all');
  const [avatar3DIsSpeaking, setAvatar3DIsSpeaking] = useState(false);
  const [avatar3DEmotion, setAvatar3DEmotion] = useState<string>('neutral');
  
  // Library filter state
  const [avatarCategory, setAvatarCategory] = useState('all');
  const [avatarEthnicity, setAvatarEthnicity] = useState('all');
  const [backgroundCategory, setBackgroundCategory] = useState('all');
  const [voiceLanguage, setVoiceLanguage] = useState('all');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  
  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarPreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Load projects and voices on mount
  useEffect(() => {
    setProjects(videoCreator.getProjects());
    
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);
  
  // Start new project
  const startNewProject = () => {
    setIsCreating(true);
    setWizardStep('type');
    setProjectType('health-talk');
    setTopic('');
    setDescription('');
    setParticipants([]);
    setScenes([{ id: '1', backgroundId: 'bg-1', dialogues: [], transition: 'fade' }]);
    setCurrentSceneIndex(0);
    setSelectedBackground('bg-1');
  };
  
  // Add participant (supports both Avatar and PhotorealisticAvatar)
  const addParticipant = (avatarInput: Avatar | PhotorealisticAvatar) => {
    // Convert PhotorealisticAvatar to Avatar format if needed
    let avatar: Avatar;
    if ('thumbnailUrl' in avatarInput) {
      // It's a PhotorealisticAvatar
      const photoAvatar = avatarInput as PhotorealisticAvatar;
      const styleMap: Record<string, 'professional' | 'casual' | 'medical' | 'animated'> = {
        'doctor': 'medical',
        'nurse': 'medical',
        'pharmacist': 'medical',
        'traditional': 'casual',
        'farmer': 'casual',
        'student': 'casual'
      };
      const profession = photoAvatar.profession.toLowerCase();
      const style = Object.entries(styleMap).find(([key]) => profession.includes(key))?.[1] || 'professional';
      
      avatar = {
        id: photoAvatar.id,
        name: photoAvatar.name,
        gender: photoAvatar.gender,
        style,
        skinTone: '#8B6914', // Default Nigerian skin tone
        hairColor: '#1a1a1a',
        hairStyle: 'natural',
        outfit: photoAvatar.profession,
        thumbnail: photoAvatar.thumbnailUrl
      };
    } else {
      avatar = avatarInput as Avatar;
    }
    
    const position = participants.length === 0 ? 'left' : participants.length === 1 ? 'right' : 'center';
    const newParticipant: Participant = {
      id: videoCreator.generateId(),
      name: avatar.name,
      avatar,
      position: position as 'left' | 'right' | 'center',
      voiceSettings: {
        pitch: avatar.gender === 'female' ? 1.2 : 0.9,
        rate: 1.0,
        volume: 1.0,
        voice: voices.find(v => v.lang.includes('en'))
      }
    };
    setParticipants([...participants, newParticipant]);
  };
  
  // Remove participant
  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
    // Remove dialogues for this participant
    setScenes(scenes.map(scene => ({
      ...scene,
      dialogues: scene.dialogues.filter(d => d.participantId !== id)
    })));
  };
  
  // Update participant voice settings
  const updateParticipantVoice = (id: string, settings: Partial<Participant['voiceSettings']>) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, voiceSettings: { ...p.voiceSettings, ...settings } } : p
    ));
  };
  
  // Add dialogue line
  const addDialogue = (participantId: string) => {
    const newDialogue: DialogueLine = {
      id: videoCreator.generateId(),
      participantId,
      text: '',
      emotion: 'neutral',
      pauseAfter: 500
    };
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].dialogues.push(newDialogue);
    setScenes(updatedScenes);
  };
  
  // Update dialogue
  const updateDialogue = (dialogueId: string, updates: Partial<DialogueLine>) => {
    const updatedScenes = scenes.map(scene => ({
      ...scene,
      dialogues: scene.dialogues.map(d => 
        d.id === dialogueId ? { ...d, ...updates } : d
      )
    }));
    setScenes(updatedScenes);
  };
  
  // Remove dialogue
  const removeDialogue = (dialogueId: string) => {
    const updatedScenes = scenes.map(scene => ({
      ...scene,
      dialogues: scene.dialogues.filter(d => d.id !== dialogueId)
    }));
    setScenes(updatedScenes);
  };
  
  // Move dialogue up/down
  const moveDialogue = (dialogueId: string, direction: 'up' | 'down') => {
    const scene = scenes[currentSceneIndex];
    const index = scene.dialogues.findIndex(d => d.id === dialogueId);
    if (index < 0) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scene.dialogues.length) return;
    
    const updatedDialogues = [...scene.dialogues];
    [updatedDialogues[index], updatedDialogues[newIndex]] = [updatedDialogues[newIndex], updatedDialogues[index]];
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].dialogues = updatedDialogues;
    setScenes(updatedScenes);
  };
  
  // Add scene
  const addScene = () => {
    const newScene: VideoScene = {
      id: videoCreator.generateId(),
      backgroundId: selectedBackground,
      dialogues: [],
      transition: 'fade'
    };
    setScenes([...scenes, newScene]);
    setCurrentSceneIndex(scenes.length);
  };
  
  // Remove scene
  const removeScene = (index: number) => {
    if (scenes.length <= 1) return;
    const updatedScenes = scenes.filter((_, i) => i !== index);
    setScenes(updatedScenes);
    if (currentSceneIndex >= updatedScenes.length) {
      setCurrentSceneIndex(updatedScenes.length - 1);
    }
  };
  
  // Update scene background
  const updateSceneBackground = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].backgroundId = backgroundId;
    setScenes(updatedScenes);
  };
  
  // Generate AI suggestions for dialogue
  const generateDialogueSuggestion = () => {
    const suggestions: Record<string, string[][]> = {
      'health-talk': [
        ["Welcome to today's health discussion. Today we'll be talking about " + (topic || 'an important health topic') + ".", "That's right! This is something everyone should know about."],
        ["Let me explain the key facts you need to know.", "These are really important points for our audience."],
        ["In summary, remember to take care of your health.", "Thank you for watching, and stay healthy!"]
      ],
      'advert': [
        ["Are you tired of dealing with " + (topic || 'everyday problems') + "?"],
        ["Introducing the perfect solution that will change your life!"],
        ["Don't wait! Get yours today and experience the difference!"]
      ],
      'educational': [
        ["Hello and welcome! Today we're learning about " + (topic || 'an exciting topic') + "."],
        ["Let's break this down step by step so it's easy to understand."],
        ["Now you know everything you need! Thanks for learning with us!"]
      ],
      'custom': [
        ["Hello everyone!", "Great to be here!"],
        ["Let's discuss our main topic.", "I'm excited to share my thoughts."],
        ["Thank you for watching!", "See you next time!"]
      ]
    };
    
    const selected = suggestions[projectType];
    if (!selected) return;
    
    // Clear existing dialogues and add suggestions
    const newDialogues: DialogueLine[] = [];
    selected.forEach((lines: string[], groupIndex: number) => {
      lines.forEach((text: string, lineIndex: number) => {
        const participantIndex = lineIndex % participants.length;
        if (participants[participantIndex]) {
          newDialogues.push({
            id: videoCreator.generateId(),
            participantId: participants[participantIndex].id,
            text,
            emotion: groupIndex === 0 ? 'excited' : groupIndex === selected.length - 1 ? 'happy' : 'neutral',
            pauseAfter: 500
          });
        }
      });
    });
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].dialogues = newDialogues;
    setScenes(updatedScenes);
    setSuccess('AI suggestions generated! Feel free to edit them.');
  };
  
  // Handle bulk file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processBulkDialogue(content, file.name);
    };
    reader.readAsText(file);
  };
  
  // Process bulk dialogue content
  const processBulkDialogue = (content: string, filename: string = 'dialogue.txt') => {
    const result = bulkDialogueService.parseFile(content, filename);
    
    if (!result.success) {
      setError(result.errors.join(', '));
      return;
    }
    
    if (result.warnings.length > 0) {
      setSuccess(`Imported ${result.entries.length} lines with ${result.warnings.length} warnings`);
    } else {
      setSuccess(`Successfully imported ${result.entries.length} dialogue lines!`);
    }
    
    // Convert bulk entries to dialogue lines
    const newDialogues: DialogueLine[] = result.entries.map((entry: BulkDialogueEntry) => {
      let participantId = participants[0]?.id || '';
      
      if (entry.participantIndex !== undefined && participants[entry.participantIndex]) {
        participantId = participants[entry.participantIndex].id;
      } else if (entry.participantName) {
        const found = participants.find(p => 
          p.name.toLowerCase().includes(entry.participantName!.toLowerCase())
        );
        if (found) participantId = found.id;
      }
      
      return {
        id: videoCreator.generateId(),
        participantId,
        text: entry.text,
        emotion: (entry.emotion as DialogueLine['emotion']) || 'neutral',
        pauseAfter: entry.pauseAfter || 500
      };
    });
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].dialogues = [
      ...updatedScenes[currentSceneIndex].dialogues,
      ...newDialogues
    ];
    setScenes(updatedScenes);
    setShowBulkUpload(false);
    setBulkUploadContent('');
  };
  
  // Load dialogue template
  const loadTemplate = (template: DialogueTemplate) => {
    const newDialogues: DialogueLine[] = template.dialogues.map((entry: BulkDialogueEntry) => {
      const participantIndex = entry.participantIndex ?? 0;
      const participantId = participants[participantIndex]?.id || participants[0]?.id || '';
      
      return {
        id: videoCreator.generateId(),
        participantId,
        text: entry.text,
        emotion: (entry.emotion as DialogueLine['emotion']) || 'neutral',
        pauseAfter: entry.pauseAfter || 500
      };
    });
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].dialogues = newDialogues;
    setScenes(updatedScenes);
    setShowTemplates(false);
    setSuccess(`Template "${template.name}" loaded successfully!`);
  };
  
  // Download sample format
  const downloadSampleFormat = (format: 'csv' | 'json' | 'txt') => {
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
      case 'csv':
        content = bulkDialogueService.generateSampleCSV();
        filename = 'dialogue-sample.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
        content = bulkDialogueService.generateSampleJSON();
        filename = 'dialogue-sample.json';
        mimeType = 'application/json';
        break;
      case 'txt':
        content = bulkDialogueService.generateSampleTXT();
        filename = 'dialogue-sample.txt';
        mimeType = 'text/plain';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Preview avatar with canvas animation
  const previewAvatar = async (avatarId: string) => {
    setPreviewAvatarId(avatarId);
    setShowAvatarPreview(true);
    
    // Render avatar preview after a short delay to allow modal to open
    setTimeout(async () => {
      const canvas = avatarPreviewCanvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas with background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Try to find photorealistic avatar first
      const photoAvatar = PHOTOREALISTIC_AVATARS.find(a => a.id === avatarId);
      
      if (photoAvatar) {
        try {
          // Load the photorealistic image
          const img = await avatarLoader.loadImage(photoAvatar, 'full');
          
          // Calculate aspect ratio to fit image
          const aspectRatio = img.width / img.height;
          let drawWidth = canvas.width * 0.9;
          let drawHeight = drawWidth / aspectRatio;
          
          if (drawHeight > canvas.height * 0.8) {
            drawHeight = canvas.height * 0.8;
            drawWidth = drawHeight * aspectRatio;
          }
          
          const x = (canvas.width - drawWidth) / 2;
          const y = (canvas.height - drawHeight) / 2;
          
          // Draw rounded rect clip
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, drawWidth, drawHeight, 12);
          ctx.clip();
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          ctx.restore();
          
          // Draw border
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(x, y, drawWidth, drawHeight, 12);
          ctx.stroke();
          
          // Draw name label
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(x, y + drawHeight - 40, drawWidth, 40);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(photoAvatar.name, canvas.width / 2, y + drawHeight - 15);
          
        } catch (err) {
          console.error('Failed to load avatar image:', err);
          // Draw placeholder on error
          drawPlaceholder(ctx, canvas, photoAvatar.name);
        }
      } else {
        // Check if it's a Realistic 3D avatar
        const realistic3D = NIGERIAN_3D_AVATARS.find(a => a.id === avatarId);
        if (realistic3D) {
          setRealistic3DAvatar(realistic3D);
          return; // Will show 3D viewer instead of canvas
        }
        
        // Check Nigerian Avatar Library
        const nigerianAvatar = NIGERIAN_AVATAR_LIBRARY.find(a => a.id === avatarId);
        if (nigerianAvatar) {
          drawPlaceholder(ctx, canvas, nigerianAvatar.name, nigerianAvatar.skinTone);
        }
      }
    }, 150);
  };
  
  // Preview 3D avatar 
  const preview3DAvatar = (avatar: Avatar3DProfile) => {
    setRealistic3DAvatar(avatar);
    setShowAvatarPreview(true);
  };
  
  // Helper function to draw placeholder avatar
  const drawPlaceholder = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, name: string, color: string = '#3b82f6') => {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw colored circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw initial
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0), canvas.width / 2, canvas.height / 2 - 30);
    
    // Draw name
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 100);
  };
  
  // Preview dialogue
  const previewDialogue = async (dialogue: DialogueLine) => {
    const participant = participants.find(p => p.id === dialogue.participantId);
    if (!participant) return;
    
    const utterance = new SpeechSynthesisUtterance(dialogue.text);
    utterance.pitch = participant.voiceSettings.pitch;
    utterance.rate = participant.voiceSettings.rate;
    utterance.volume = participant.voiceSettings.volume;
    if (participant.voiceSettings.voice) {
      utterance.voice = participant.voiceSettings.voice;
    }
    
    speechSynthesis.speak(utterance);
  };
  
  // Save project
  const saveProject = () => {
    const project: VideoProject = {
      id: currentProject?.id || videoCreator.generateId(),
      title: topic || 'Untitled Project',
      type: projectType,
      topic,
      description,
      participants,
      scenes,
      resolution,
      createdAt: currentProject?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    videoCreator.saveProject(project);
    setCurrentProject(project);
    setProjects(videoCreator.getProjects());
    setSuccess('Project saved successfully!');
  };
  
  // Export video
  const exportVideo = async () => {
    if (participants.length === 0 || scenes.every(s => s.dialogues.length === 0)) {
      setError('Please add participants and dialogue before exporting.');
      return;
    }
    
    setIsExporting(true);
    setExportProgress({ stage: 'preparing', progress: 0, currentFrame: 0, totalFrames: 100, estimatedTimeRemaining: 60 });
    
    try {
      const project: VideoProject = {
        id: currentProject?.id || videoCreator.generateId(),
        title: topic || 'Untitled Project',
        type: projectType,
        topic,
        description,
        participants,
        scenes,
        resolution,
        createdAt: currentProject?.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      const videoBlob = await videoCreator.startRecording(project, setExportProgress);
      
      setExportProgress({ stage: 'finalizing', progress: 100, currentFrame: 100, totalFrames: 100, estimatedTimeRemaining: 0 });
      
      // Download video
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic || 'video'}-${resolution}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Video exported successfully!');
    } catch (err) {
      setError('Failed to export video. Please try again.');
      console.error(err);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };
  
  // Load existing project
  const loadProject = (project: VideoProject) => {
    setCurrentProject(project);
    setProjectType(project.type);
    setTopic(project.topic);
    setDescription(project.description);
    setParticipants(project.participants);
    setScenes(project.scenes);
    setResolution(project.resolution);
    setIsCreating(true);
    setWizardStep('dialogue');
  };
  
  // Delete project
  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      videoCreator.deleteProject(projectId);
      setProjects(videoCreator.getProjects());
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setIsCreating(false);
      }
    }
  };
  
  // Initialize preview engine when entering preview step
  useEffect(() => {
    if (wizardStep === 'preview' && previewCanvasRef.current) {
      videoPreviewEngine.initialize(previewCanvasRef.current);
      videoPreviewEngine.setSceneData(participants, scenes);
      if (scenes[currentSceneIndex]?.backgroundId) {
        videoPreviewEngine.setBackground(scenes[currentSceneIndex].backgroundId);
      }
      // Render initial static preview
      renderStaticPreview();
    }
    
    // Cleanup on unmount
    return () => {
      if (previewPlaying) {
        videoPreviewEngine.stopPreview();
      }
    };
  }, [wizardStep]);
  
  // Handle preview toggle
  const handlePreviewToggle = async () => {
    if (previewPlaying) {
      videoPreviewEngine.stopPreview();
      setPreviewPlaying(false);
      setPreviewState(null);
    } else {
      if (!previewCanvasRef.current) return;
      
      // Ensure engine is initialized
      videoPreviewEngine.initialize(previewCanvasRef.current);
      videoPreviewEngine.setSceneData(participants, scenes);
      
      setPreviewPlaying(true);
      
      await videoPreviewEngine.startPreview(
        (state) => setPreviewState(state),
        () => {
          setPreviewPlaying(false);
          setPreviewState(null);
          setSuccess('Preview completed!');
        }
      );
    }
  };
  
  // Render static preview frame
  const renderStaticPreview = useCallback(() => {
    if (!previewCanvasRef.current) return;
    
    videoPreviewEngine.initialize(previewCanvasRef.current);
    videoPreviewEngine.setSceneData(participants, scenes);
    
    const backgroundId = scenes[currentSceneIndex]?.backgroundId || 'bg-1';
    videoPreviewEngine.renderStaticPreview(participants, backgroundId);
  }, [participants, scenes, currentSceneIndex]);
  
  // Navigate wizard
  const nextStep = () => {
    const steps: WizardStep[] = ['type', 'topic', 'participants', 'dialogue', 'background', 'preview', 'export'];
    const currentIndex = steps.indexOf(wizardStep);
    if (currentIndex < steps.length - 1) {
      setWizardStep(steps[currentIndex + 1]);
    }
  };
  
  const prevStep = () => {
    const steps: WizardStep[] = ['type', 'topic', 'participants', 'dialogue', 'background', 'preview', 'export'];
    const currentIndex = steps.indexOf(wizardStep);
    if (currentIndex > 0) {
      setWizardStep(steps[currentIndex - 1]);
    }
  };
  
  // Render wizard step content
  const renderStepContent = () => {
    switch (wizardStep) {
      case 'type':
        const filteredVideoTypes = Object.entries(VIDEO_TEMPLATES).filter(([key, template]) => {
          if (videoTypeCategory === 'all') return true;
          return (template as any).category === videoTypeCategory;
        });
        
        return (
          <div className="wizard-step step-type">
            <h2>🎬 What type of video do you want to create?</h2>
            <p className="step-description">Choose from our extensive library of video formats</p>
            
            <div className="video-type-categories">
              {VIDEO_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-pill ${videoTypeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setVideoTypeCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-name">{cat.name}</span>
                </button>
              ))}
            </div>
            
            <div className="video-types extended">
              {filteredVideoTypes.map(([key, template]) => (
                <div
                  key={key}
                  className={`type-card ${projectType === key ? 'selected' : ''}`}
                  onClick={() => setProjectType(key as VideoType)}
                >
                  <div className="type-icon-large">
                    {(template as any).icon || '🎬'}
                  </div>
                  <div className="type-content">
                    <h3>{(template as any).name}</h3>
                    <p>{(template as any).description}</p>
                    <div className="type-meta">
                      <span><Users size={14} /> {(template as any).suggestedParticipants} participants</span>
                      <span>⏱️ {(template as any).suggestedDuration}</span>
                    </div>
                  </div>
                  {projectType === key && (
                    <div className="selected-badge">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {VIDEO_TEMPLATES[projectType]?.structure?.length > 0 && (
              <div className="selected-type-preview">
                <h4>📝 Suggested Structure for {VIDEO_TEMPLATES[projectType].name}</h4>
                <ol className="structure-list">
                  {VIDEO_TEMPLATES[projectType].structure.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
        
      case 'topic':
        return (
          <div className="wizard-step step-topic">
            <h2>What's your video about?</h2>
            <div className="topic-form">
              <div className="form-group">
                <label>Topic / Title</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={projectType === 'health-talk' ? 'e.g., Diabetes Prevention Tips' : 
                              projectType === 'advert' ? 'e.g., New Product Launch' : 
                              'Enter your topic'}
                  className="topic-input"
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this video will cover..."
                  className="description-input"
                  rows={4}
                />
              </div>
              
              {VIDEO_TEMPLATES[projectType].structure.length > 0 && (
                <div className="structure-preview">
                  <h4>Suggested Structure</h4>
                  <ol>
                    {VIDEO_TEMPLATES[projectType].structure.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'participants':
        // Map photorealistic avatars to match UI filter categories
        const getAvatarCategory = (avatar: PhotorealisticAvatar): string => {
          const profession = avatar.profession.toLowerCase();
          const tags = avatar.tags.map(t => t.toLowerCase());
          if (profession.includes('doctor') || profession.includes('nurse') || tags.includes('medical')) return 'medical';
          if (profession.includes('teacher') || profession.includes('student') || tags.includes('education')) return 'educational';
          if (profession.includes('traditional') || profession.includes('chief') || tags.includes('traditional')) return 'traditional';
          if (profession.includes('pastor') || profession.includes('imam') || tags.includes('religious')) return 'religious';
          if (profession.includes('business') || profession.includes('lawyer') || tags.includes('professional')) return 'professional';
          return 'casual';
        };
        
        const filteredAvatars = PHOTOREALISTIC_AVATARS.filter(avatar => {
          const category = getAvatarCategory(avatar);
          const categoryMatch = avatarCategory === 'all' || category === avatarCategory;
          const ethnicityMatch = avatarEthnicity === 'all' || avatar.ethnicity === avatarEthnicity;
          const notSelected = !participants.some(p => p.avatar.id === avatar.id);
          return categoryMatch && ethnicityMatch && notSelected;
        });
        
        return (
          <div className="wizard-step step-participants">
            <h2>Select Your Avatars</h2>
            <p className="step-description">Choose from our rich library of Nigerian characters with realistic animations</p>
            
            {participants.length > 0 && (
              <div className="selected-participants">
                <h4>Selected Participants ({participants.length})</h4>
                <div className="participants-list">
                  {participants.map((p, index) => (
                    <div key={p.id} className="participant-card">
                      <div className="participant-avatar" style={{ background: p.avatar.thumbnail ? 'transparent' : p.avatar.skinTone }}>
                        {p.avatar.thumbnail ? (
                          <img src={p.avatar.thumbnail} alt={p.avatar.name} />
                        ) : (
                          <span>{p.avatar.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="participant-info">
                        <h5>{p.name}</h5>
                        <span className="position-badge">{p.position}</span>
                      </div>
                      <div className="participant-voice">
                        <label>Language & Voice</label>
                        <select
                          value={selectedVoiceId || ''}
                          onChange={(e) => {
                            const voice = NIGERIAN_VOICE_LIBRARY.find(v => v.id === e.target.value);
                            if (voice) {
                              setSelectedVoiceId(voice.id);
                              updateParticipantVoice(p.id, { 
                                pitch: voice.defaultPitch, 
                                rate: voice.defaultRate 
                              });
                            }
                          }}
                        >
                          <option value="">Select Nigerian Voice</option>
                          {NIGERIAN_VOICE_LIBRARY.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.displayName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="participant-controls">
                        <div className="voice-slider">
                          <label>Pitch</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={p.voiceSettings.pitch}
                            onChange={(e) => updateParticipantVoice(p.id, { pitch: parseFloat(e.target.value) })}
                          />
                        </div>
                        <div className="voice-slider">
                          <label>Speed</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={p.voiceSettings.rate}
                            onChange={(e) => updateParticipantVoice(p.id, { rate: parseFloat(e.target.value) })}
                          />
                        </div>
                      </div>
                      <button className="btn-remove" onClick={() => removeParticipant(p.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Avatar Preview Modal - Realistic 3D */}
            {showAvatarPreview && (
              <div className="modal-overlay" onClick={() => { setShowAvatarPreview(false); setRealistic3DAvatar(null); }}>
                <div className="modal avatar-preview-modal avatar-3d-modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3><Box size={24} /> {realistic3DAvatar ? '3D Avatar Preview' : 'Avatar Preview'}</h3>
                    <button className="btn-close" onClick={() => { setShowAvatarPreview(false); setRealistic3DAvatar(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="modal-body">
                    {realistic3DAvatar ? (
                      <>
                        {/* Advanced 3D Avatar Viewer */}
                        <React.Suspense fallback={<div className="avatar-loading"><div className="avatar-loading-spinner"></div></div>}>
                          <Avatar3DViewer
                            avatar={realistic3DAvatar}
                            emotion={avatar3DEmotion}
                            isSpeaking={avatar3DIsSpeaking}
                            width={450}
                            height={500}
                          />
                        </React.Suspense>
                        <div className="preview-controls-3d">
                          <div className="avatar-3d-info">
                            <h4>{realistic3DAvatar.name}</h4>
                            <p><strong>Age:</strong> {realistic3DAvatar.age} years ({realistic3DAvatar.ageGroup})</p>
                            <p><strong>Ethnicity:</strong> {realistic3DAvatar.ethnicity.charAt(0).toUpperCase() + realistic3DAvatar.ethnicity.slice(1)}</p>
                            <p><strong>Gender:</strong> {realistic3DAvatar.gender}</p>
                            <p>{realistic3DAvatar.description}</p>
                          </div>
                          <div className="emotion-controls">
                            <p><strong>Test Emotions:</strong></p>
                            <div className="emotion-buttons">
                              {['neutral', 'happy', 'sad', 'surprised', 'angry'].map(em => (
                                <button 
                                  key={em}
                                  className={`btn-emotion ${avatar3DEmotion === em ? 'active' : ''}`}
                                  onClick={() => setAvatar3DEmotion(em)}
                                >
                                  {em === 'neutral' ? '😐' : em === 'happy' ? '😊' : em === 'sad' ? '😢' : em === 'surprised' ? '😲' : '😠'} {em}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="speaking-control">
                            <button 
                              className={`btn-speak ${avatar3DIsSpeaking ? 'active' : ''}`}
                              onClick={() => setAvatar3DIsSpeaking(!avatar3DIsSpeaking)}
                            >
                              <Volume2 size={16} /> {avatar3DIsSpeaking ? 'Stop Speaking' : 'Test Speech'}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Fallback Canvas Preview */}
                        <canvas 
                          ref={avatarPreviewCanvasRef} 
                          width={400} 
                          height={450}
                          className="avatar-preview-canvas"
                        />
                        <div className="preview-controls-3d">
                          <p><strong>Avatar Features:</strong></p>
                          <div className="preview-features">
                            <ul>
                              <li>🎭 Facial animations</li>
                              <li>👄 Lip sync support</li>
                              <li>👁️ Eye blinking</li>
                              <li>🎨 Emotion presets</li>
                              <li>🇳🇬 Nigerian accent support</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Realistic 3D Avatars Section */}
            <div className="realistic-3d-avatars-section">
              <h4>🌟 Realistic 3D Avatars - All Ages</h4>
              <p className="section-description">
                Professional 3D avatars with real human features - children, teens, adults, and seniors
              </p>
              
              {/* Age/Gender/Ethnicity Filters */}
              <div className="avatar-3d-filters">
                <div className="filter-group">
                  <label>Age Group:</label>
                  <select value={avatar3DAge} onChange={e => setAvatar3DAge(e.target.value)}>
                    <option value="all">All Ages</option>
                    <option value="child">Children (5-12)</option>
                    <option value="teen">Teenagers (13-19)</option>
                    <option value="young-adult">Young Adults (20-29)</option>
                    <option value="adult">Adults (30-44)</option>
                    <option value="middle-aged">Middle-aged (45-59)</option>
                    <option value="senior">Seniors (60+)</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Gender:</label>
                  <select value={avatar3DGender} onChange={e => setAvatar3DGender(e.target.value)}>
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Ethnicity:</label>
                  <select value={avatar3DEthnicity} onChange={e => setAvatar3DEthnicity(e.target.value)}>
                    <option value="all">All</option>
                    <option value="igbo">Igbo</option>
                    <option value="yoruba">Yoruba</option>
                    <option value="hausa">Hausa</option>
                    <option value="fulani">Fulani</option>
                    <option value="ijaw">Ijaw</option>
                    <option value="edo">Edo</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
              
              {/* 3D Avatar Grid */}
              <div className="realistic-3d-avatar-grid">
                <React.Suspense fallback={<div className="avatar-loading"><div className="avatar-loading-spinner"></div></div>}>
                  {filterAvatarsByEthnicity(
                    filterAvatarsByGender(
                      filterAvatarsByAge(NIGERIAN_3D_AVATARS, avatar3DAge),
                      avatar3DGender
                    ),
                    avatar3DEthnicity
                  ).map(avatar => (
                    <Avatar3DCard
                      key={avatar.id}
                      avatar={avatar}
                      selected={selected3DAvatar === avatar.id}
                      onSelect={(a) => setSelected3DAvatar(a.id)}
                      onPreview={(a) => preview3DAvatar(a)}
                    />
                  ))}
                </React.Suspense>
              </div>
            </div>
            
            <div className="available-avatars">
              <div className="avatar-filters">
                <h4>🎭 Nigerian Avatar Library ({filteredAvatars.length} avatars)</h4>
                <div className="filter-controls">
                  <div className="filter-group">
                    <label>Category:</label>
                    <select 
                      value={avatarCategory} 
                      onChange={(e) => setAvatarCategory(e.target.value)}
                    >
                      {AVATAR_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Ethnicity:</label>
                    <select 
                      value={avatarEthnicity} 
                      onChange={(e) => setAvatarEthnicity(e.target.value)}
                    >
                      {ETHNICITIES.map(eth => (
                        <option key={eth.id} value={eth.id}>{eth.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="avatars-grid nigerian-avatars">
                {filteredAvatars.map(avatar => {
                  const category = getAvatarCategory(avatar);
                  return (
                    <div key={avatar.id} className="avatar-card detailed photorealistic">
                      <div 
                        className="avatar-preview has-image" 
                      >
                        <img 
                          src={avatar.thumbnailUrl} 
                          alt={avatar.name}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            // Fallback to initial if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.style.background = '#3b82f6';
                              const span = document.createElement('span');
                              span.textContent = avatar.name.charAt(0);
                              span.className = 'avatar-fallback-initial';
                              parent.appendChild(span);
                            }
                          }}
                        />
                        <div className="avatar-badge">{category === 'medical' ? '🏥' : category === 'traditional' ? '👑' : category === 'religious' ? '⛪' : category === 'educational' ? '📚' : '✨'}</div>
                      </div>
                      <div className="avatar-info">
                        <h5>{avatar.name}</h5>
                        <span className="avatar-profession">{avatar.profession}</span>
                        <span className="avatar-meta">{avatar.ethnicity} • {avatar.gender} • {avatar.ageGroup}</span>
                      </div>
                      <div className="avatar-actions">
                        <button 
                          className="btn-preview" 
                          onClick={(e) => { e.stopPropagation(); previewAvatar(avatar.id); }}
                          title="Preview avatar"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-add" 
                          onClick={() => addParticipant(avatar)}
                          title="Add to video"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredAvatars.length === 0 && (
                <div className="no-avatars-message">
                  <p>No avatars match your filters. Try adjusting your selection.</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'dialogue':
        return (
          <div className="wizard-step step-dialogue">
            <div className="dialogue-header">
              <h2>Create Your Conversation</h2>
              <div className="dialogue-actions-header">
                <button className="btn btn-primary" onClick={() => setShowBulkUpload(true)}>
                  <Upload size={18} />
                  Bulk Upload
                </button>
                <button className="btn btn-secondary" onClick={() => setShowTemplates(true)}>
                  <FileText size={18} />
                  Templates
                </button>
                <button className="btn btn-secondary" onClick={generateDialogueSuggestion}>
                  <Sparkles size={18} />
                  AI Suggestions
                </button>
              </div>
            </div>
            
            {/* Bulk Upload Modal */}
            {showBulkUpload && (
              <div className="modal-overlay" onClick={() => setShowBulkUpload(false)}>
                <div className="modal bulk-upload-modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3><Upload size={24} /> Bulk Dialogue Upload</h3>
                    <button className="btn-close" onClick={() => setShowBulkUpload(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="upload-format-selector">
                      <label>Format:</label>
                      <div className="format-buttons">
                        {(['csv', 'json', 'txt'] as const).map(format => (
                          <button
                            key={format}
                            className={`format-btn ${uploadFormat === format ? 'active' : ''}`}
                            onClick={() => setUploadFormat(format)}
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <button className="btn-download-sample" onClick={() => downloadSampleFormat(uploadFormat)}>
                        <Download size={16} />
                        Download Sample
                      </button>
                    </div>
                    
                    <div className="file-upload-area">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv,.json,.txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <div 
                        className="drop-zone"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                        onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('dragover');
                          const file = e.dataTransfer.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => processBulkDialogue(ev.target?.result as string, file.name);
                            reader.readAsText(file);
                          }
                        }}
                      >
                        <Upload size={40} />
                        <p>Drag & drop a file here or click to browse</p>
                        <span>Supports CSV, JSON, and TXT formats</span>
                      </div>
                    </div>
                    
                    <div className="paste-area">
                      <label>Or paste content directly:</label>
                      <textarea
                        value={bulkUploadContent}
                        onChange={(e) => setBulkUploadContent(e.target.value)}
                        placeholder={uploadFormat === 'csv' ? 
                          'participant,text,emotion\nDoctor,Hello! Welcome to our health talk.,happy\nNurse,Let me explain the symptoms.,serious' :
                          uploadFormat === 'json' ?
                          '[{"participant": 0, "text": "Hello!", "emotion": "happy"}]' :
                          'Doctor: Hello! Welcome to our health talk.\nNurse: Let me explain the symptoms.'}
                        rows={6}
                      />
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowBulkUpload(false)}>
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => processBulkDialogue(bulkUploadContent, `dialogue.${uploadFormat}`)}
                      disabled={!bulkUploadContent.trim()}
                    >
                      <Upload size={16} />
                      Import Dialogue
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Templates Modal */}
            {showTemplates && (
              <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
                <div className="modal templates-modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3><FileText size={24} /> Dialogue Templates</h3>
                    <button className="btn-close" onClick={() => setShowTemplates(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="templates-grid">
                      {DIALOGUE_TEMPLATES.map(template => (
                        <div key={template.id} className="template-card">
                          <div className="template-header">
                            <h4>{template.name}</h4>
                            <span className="template-category">{template.category}</span>
                          </div>
                          <p>{template.description}</p>
                          <div className="template-preview">
                            <span>{template.dialogues.length} lines</span>
                          </div>
                          <button className="btn btn-primary" onClick={() => loadTemplate(template)}>
                            Use Template
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="scenes-tabs">
              {scenes.map((scene, i) => (
                <div
                  key={scene.id}
                  className={`scene-tab ${currentSceneIndex === i ? 'active' : ''}`}
                  onClick={() => setCurrentSceneIndex(i)}
                >
                  <span>Scene {i + 1}</span>
                  {scenes.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeScene(i); }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button className="btn-add-scene" onClick={addScene}>
                <Plus size={16} />
              </button>
            </div>
            
            <div className="dialogue-content">
              <div className="dialogue-list">
                {scenes[currentSceneIndex]?.dialogues.map((dialogue, index) => {
                  const participant = participants.find(p => p.id === dialogue.participantId);
                  return (
                    <div key={dialogue.id} className="dialogue-item">
                      <div className="dialogue-number">{index + 1}</div>
                      <div
                        className="dialogue-avatar"
                        style={{ background: participant?.avatar.skinTone }}
                      >
                        {participant?.name.charAt(0) || '?'}
                      </div>
                      <div className="dialogue-body">
                        <div className="dialogue-meta">
                          <select
                            value={dialogue.participantId}
                            onChange={(e) => updateDialogue(dialogue.id, { participantId: e.target.value })}
                          >
                            {participants.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <select
                            value={dialogue.emotion}
                            onChange={(e) => updateDialogue(dialogue.id, { emotion: e.target.value as DialogueLine['emotion'] })}
                          >
                            <option value="neutral">😐 Neutral</option>
                            <option value="happy">😊 Happy</option>
                            <option value="serious">😤 Serious</option>
                            <option value="excited">🎉 Excited</option>
                            <option value="concerned">😟 Concerned</option>
                          </select>
                        </div>
                        <textarea
                          value={dialogue.text}
                          onChange={(e) => updateDialogue(dialogue.id, { text: e.target.value })}
                          placeholder="Enter dialogue text..."
                          rows={2}
                        />
                      </div>
                      <div className="dialogue-actions">
                        <button onClick={() => previewDialogue(dialogue)} title="Preview">
                          <Volume2 size={16} />
                        </button>
                        <button onClick={() => moveDialogue(dialogue.id, 'up')} disabled={index === 0} title="Move up">
                          <ChevronLeft size={16} style={{ transform: 'rotate(90deg)' }} />
                        </button>
                        <button onClick={() => moveDialogue(dialogue.id, 'down')} disabled={index === scenes[currentSceneIndex].dialogues.length - 1} title="Move down">
                          <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                        </button>
                        <button onClick={() => removeDialogue(dialogue.id)} className="btn-danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {scenes[currentSceneIndex]?.dialogues.length === 0 && (
                  <div className="empty-dialogue">
                    <MessageSquare size={48} />
                    <p>No dialogue yet. Add your first line!</p>
                  </div>
                )}
              </div>
              
              <div className="add-dialogue-buttons">
                {participants.map(p => (
                  <button
                    key={p.id}
                    className="btn-add-dialogue"
                    onClick={() => addDialogue(p.id)}
                    style={{ borderColor: p.avatar.skinTone }}
                  >
                    <Plus size={16} />
                    Add line for {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'background':
        const filteredBackgrounds = getBackgroundsByCategory(backgroundCategory);
        
        return (
          <div className="wizard-step step-background">
            <h2>Choose Background</h2>
            <p className="step-description">Select a background for Scene {currentSceneIndex + 1}</p>
            
            <div className="background-categories">
              {BACKGROUND_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${backgroundCategory === category.id ? 'active' : ''}`}
                  onClick={() => setBackgroundCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">({category.count})</span>
                </button>
              ))}
            </div>
            
            <div className="backgrounds-grid rich-backgrounds">
              {filteredBackgrounds.map(bg => (
                <div
                  key={bg.id}
                  className={`background-card ${selectedBackground === bg.id ? 'selected' : ''}`}
                  onClick={() => updateSceneBackground(bg.id)}
                  style={{ background: bg.gradient || bg.colors.primary }}
                >
                  <div className="background-overlay">
                    <div className="bg-info">
                      <span className="bg-name">{bg.name}</span>
                      <span className="bg-mood">{bg.mood}</span>
                    </div>
                    {selectedBackground === bg.id && <Check size={24} />}
                  </div>
                  <div className="bg-elements">
                    {bg.elements.slice(0, 3).map((el, i) => (
                      <span key={i} className="bg-element-tag">{el.type}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="resolution-selector">
              <h4>Video Resolution</h4>
              <div className="resolution-options">
                {(['720p', '1080p', '4k'] as const).map(res => (
                  <button
                    key={res}
                    className={`resolution-btn ${resolution === res ? 'selected' : ''}`}
                    onClick={() => setResolution(res)}
                  >
                    <span className="res-label">{res.toUpperCase()}</span>
                    <span className="res-size">
                      {res === '720p' ? '1280×720' : res === '1080p' ? '1920×1080' : '3840×2160'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div className="wizard-step step-preview">
            <h2>🎬 Preview Your Video</h2>
            <p className="step-description">Watch your video with animated avatars, lip sync, and voice narration</p>
            
            <div className="preview-container enhanced">
              <canvas
                ref={previewCanvasRef}
                width={1280}
                height={720}
                className="preview-canvas"
              />
              
              <div className="preview-overlay">
                {previewPlaying && previewState && (
                  <div className="now-playing">
                    <span className="speaker-indicator">
                      🎤 {participants.find(p => p.id === previewState.currentSpeaker)?.name || 'Starting...'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="preview-controls enhanced">
                <button
                  className={`btn btn-primary btn-lg ${previewPlaying ? 'playing' : ''}`}
                  onClick={handlePreviewToggle}
                >
                  {previewPlaying ? <Pause size={24} /> : <Play size={24} />}
                  {previewPlaying ? 'Stop Preview' : 'Play Full Preview'}
                </button>
                
                <button
                  className="btn btn-secondary"
                  onClick={renderStaticPreview}
                >
                  <Eye size={20} />
                  Refresh Preview
                </button>
              </div>
              
              {previewPlaying && previewState && (
                <div className="preview-progress">
                  <div className="progress-info">
                    <span>Scene {previewState.currentSceneIndex + 1} of {scenes.length}</span>
                    <span>Line {previewState.currentDialogueIndex + 1} of {scenes[previewState.currentSceneIndex]?.dialogues.length || 0}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${previewState.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="preview-summary enhanced">
              <h4>📋 Video Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Video Type</span>
                  <span className="value">
                    {VIDEO_TEMPLATES[projectType]?.icon} {VIDEO_TEMPLATES[projectType]?.name}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Topic</span>
                  <span className="value">{topic || 'Untitled'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Participants</span>
                  <span className="value">{participants.length} avatars</span>
                </div>
                <div className="summary-item">
                  <span className="label">Scenes</span>
                  <span className="value">{scenes.length}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Lines</span>
                  <span className="value">{scenes.reduce((sum, s) => sum + s.dialogues.length, 0)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Resolution</span>
                  <span className="value">{resolution}</span>
                </div>
              </div>
              
              <div className="preview-features">
                <h5>✨ Preview Features</h5>
                <ul>
                  <li>✅ Real-time avatar animation</li>
                  <li>✅ Lip sync with speech</li>
                  <li>✅ Eye blink & movement</li>
                  <li>✅ Background rendering</li>
                  <li>✅ Speech bubbles</li>
                  <li>✅ Natural TTS voices</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'export':
        return (
          <div className="wizard-step step-export">
            <h2>Export Your Video</h2>
            
            {!isExporting ? (
              <div className="export-options">
                <div className="export-card">
                  <div className="export-icon">
                    <Download size={48} />
                  </div>
                  <h3>Export as HD Video</h3>
                  <p>Generate a high-definition video file with all your content, avatars, and speech.</p>
                  <div className="export-details">
                    <span>Format: WebM (MP4 compatible)</span>
                    <span>Resolution: {resolution}</span>
                    <span>With audio narration</span>
                  </div>
                  <button className="btn btn-primary btn-large" onClick={exportVideo}>
                    <Download size={20} />
                    Export Video
                  </button>
                </div>
                
                <div className="export-actions">
                  <button className="btn btn-secondary" onClick={saveProject}>
                    <Save size={18} />
                    Save Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="export-progress">
                <div className="progress-icon">
                  <Loader size={64} className="spin" />
                </div>
                <h3>Generating Your Video...</h3>
                <p>Stage: {exportProgress?.stage}</p>
                
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${exportProgress?.progress || 0}%` }}
                  />
                </div>
                <span className="progress-text">{Math.round(exportProgress?.progress || 0)}%</span>
                
                {exportProgress?.estimatedTimeRemaining && (
                  <p className="time-remaining">
                    Estimated time remaining: {Math.ceil(exportProgress.estimatedTimeRemaining / 60)} min
                  </p>
                )}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Clear alerts after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  
  return (
    <div className="video-creator-page">
      <h1>
        <Video size={32} />
        Video Creator
      </h1>
      <p className="subtitle">Create professional videos with AI avatars and natural conversations</p>
      
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <Check size={20} />
          {success}
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}
      
      {!isCreating ? (
        <div className="projects-view">
          <div className="projects-header">
            <h2>Your Projects</h2>
            <button className="btn btn-primary" onClick={startNewProject}>
              <Plus size={20} />
              Create New Video
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="empty-projects">
              <Film size={64} />
              <h3>No Projects Yet</h3>
              <p>Create your first video project to get started</p>
              <button className="btn btn-primary" onClick={startNewProject}>
                <Plus size={20} />
                Create Your First Video
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div
                    className="project-thumbnail"
                    style={{
                      background: BACKGROUNDS.find(b => b.id === project.scenes[0]?.backgroundId)?.value || '#667eea'
                    }}
                  >
                    <span className="project-type-badge">{VIDEO_TEMPLATES[project.type].name}</span>
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description || 'No description'}</p>
                    <div className="project-meta">
                      <span><Users size={14} /> {project.participants.length} avatars</span>
                      <span><MessageSquare size={14} /> {project.scenes.reduce((s, sc) => s + sc.dialogues.length, 0)} lines</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <button className="btn btn-secondary" onClick={() => loadProject(project)}>
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteProject(project.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="wizard-view">
          <div className="wizard-progress">
            {(['type', 'topic', 'participants', 'dialogue', 'background', 'preview', 'export'] as WizardStep[]).map((step, index) => (
              <div
                key={step}
                className={`progress-step ${wizardStep === step ? 'active' : ''} ${
                  ['type', 'topic', 'participants', 'dialogue', 'background', 'preview', 'export'].indexOf(wizardStep) > index ? 'completed' : ''
                }`}
                onClick={() => setWizardStep(step)}
              >
                <div className="step-dot">{index + 1}</div>
                <span className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
              </div>
            ))}
          </div>
          
          <div className="wizard-content">
            {renderStepContent()}
          </div>
          
          <div className="wizard-navigation">
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (wizardStep === 'type') {
                  setIsCreating(false);
                } else {
                  prevStep();
                }
              }}
            >
              <ChevronLeft size={20} />
              {wizardStep === 'type' ? 'Cancel' : 'Back'}
            </button>
            
            <button className="btn btn-secondary" onClick={saveProject}>
              <Save size={18} />
              Save Draft
            </button>
            
            {wizardStep !== 'export' && (
              <button
                className="btn btn-primary"
                onClick={nextStep}
                disabled={
                  (wizardStep === 'topic' && !topic) ||
                  (wizardStep === 'participants' && participants.length === 0)
                }
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
