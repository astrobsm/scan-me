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
  Sparkles
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
  ExportProgress
} from '../services/VideoCreator';
import './VideoCreatorPage.css';

type WizardStep = 'type' | 'topic' | 'participants' | 'dialogue' | 'background' | 'preview' | 'export';

export function VideoCreatorPage() {
  // Project state
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('type');
  
  // Form state
  const [projectType, setProjectType] = useState<'advert' | 'health-talk' | 'educational' | 'custom'>('health-talk');
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
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
  
  // Add participant
  const addParticipant = (avatar: Avatar) => {
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
        return (
          <div className="wizard-step step-type">
            <h2>What type of video do you want to create?</h2>
            <div className="video-types">
              {Object.entries(VIDEO_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className={`type-card ${projectType === key ? 'selected' : ''}`}
                  onClick={() => setProjectType(key as typeof projectType)}
                >
                  <div className="type-icon">
                    {key === 'health-talk' && <Users size={32} />}
                    {key === 'advert' && <Film size={32} />}
                    {key === 'educational' && <Video size={32} />}
                    {key === 'custom' && <Settings size={32} />}
                  </div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <div className="type-meta">
                    <span><Users size={14} /> {template.suggestedParticipants} participants</span>
                    <span>⏱️ {template.suggestedDuration}</span>
                  </div>
                </div>
              ))}
            </div>
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
        return (
          <div className="wizard-step step-participants">
            <h2>Select Your Avatars</h2>
            <p className="step-description">Choose the characters who will appear in your video</p>
            
            {participants.length > 0 && (
              <div className="selected-participants">
                <h4>Selected Participants ({participants.length})</h4>
                <div className="participants-list">
                  {participants.map((p, index) => (
                    <div key={p.id} className="participant-card">
                      <div className="participant-avatar" style={{ background: p.avatar.skinTone }}>
                        <span>{p.avatar.name.charAt(0)}</span>
                      </div>
                      <div className="participant-info">
                        <h5>{p.name}</h5>
                        <span className="position-badge">{p.position}</span>
                      </div>
                      <div className="participant-voice">
                        <label>Voice</label>
                        <select
                          value={voices.findIndex(v => v.name === p.voiceSettings.voice?.name)}
                          onChange={(e) => updateParticipantVoice(p.id, { voice: voices[parseInt(e.target.value)] })}
                        >
                          {voices.map((v, i) => (
                            <option key={i} value={i}>{v.name}</option>
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
            
            <div className="available-avatars">
              <h4>Available Avatars</h4>
              <div className="avatars-grid">
                {AVATARS.filter(a => !participants.some(p => p.avatar.id === a.id)).map(avatar => (
                  <div
                    key={avatar.id}
                    className="avatar-card"
                    onClick={() => addParticipant(avatar)}
                  >
                    <div className="avatar-preview" style={{ background: avatar.skinTone }}>
                      <span>{avatar.name.charAt(0)}</span>
                    </div>
                    <div className="avatar-info">
                      <h5>{avatar.name}</h5>
                      <span>{avatar.style} • {avatar.gender}</span>
                    </div>
                    <button className="btn-add">
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'dialogue':
        return (
          <div className="wizard-step step-dialogue">
            <div className="dialogue-header">
              <h2>Create Your Conversation</h2>
              <button className="btn btn-secondary" onClick={generateDialogueSuggestion}>
                <Sparkles size={18} />
                AI Suggestions
              </button>
            </div>
            
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
        return (
          <div className="wizard-step step-background">
            <h2>Choose Background</h2>
            <p className="step-description">Select a background for Scene {currentSceneIndex + 1}</p>
            
            <div className="background-categories">
              {['all', 'office', 'hospital', 'studio', 'outdoor', 'abstract'].map(category => (
                <button
                  key={category}
                  className={`category-btn ${category === 'all' ? 'active' : ''}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="backgrounds-grid">
              {BACKGROUNDS.map(bg => (
                <div
                  key={bg.id}
                  className={`background-card ${selectedBackground === bg.id ? 'selected' : ''}`}
                  onClick={() => updateSceneBackground(bg.id)}
                  style={{ background: bg.value }}
                >
                  <div className="background-overlay">
                    <span>{bg.name}</span>
                    {selectedBackground === bg.id && <Check size={24} />}
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
            <h2>Preview Your Video</h2>
            
            <div className="preview-container">
              <canvas
                ref={previewCanvasRef}
                width={1280}
                height={720}
                className="preview-canvas"
              />
              
              <div className="preview-controls">
                <button
                  className="btn btn-primary"
                  onClick={() => setPreviewPlaying(!previewPlaying)}
                >
                  {previewPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {previewPlaying ? 'Pause' : 'Play Preview'}
                </button>
              </div>
            </div>
            
            <div className="preview-summary">
              <h4>Video Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Type</span>
                  <span className="value">{VIDEO_TEMPLATES[projectType].name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Topic</span>
                  <span className="value">{topic || 'Untitled'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Participants</span>
                  <span className="value">{participants.length}</span>
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
