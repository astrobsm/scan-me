import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Play, Pause, Trash2, Save, User, Volume2,
  Settings, Download, Upload, Check, AlertCircle, RefreshCw,
  Square, Circle, Waves, Sparkles
} from 'lucide-react';
import { VoiceRecorder, VoiceSample } from '../services/VoiceRecorder';
import { VoiceCloneService, VoiceProfile } from '../services/VoiceCloneService';
import './VoiceClonePage.css';

// Sample scripts for recording
const SAMPLE_SCRIPTS = [
  "Hello, my name is Charles Douglas. I am testing my voice for the scan application.",
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  "Today is a beautiful day for scanning documents and converting handwritten text to digital format.",
  "Medical prescriptions require careful attention to detail. The dosage must be accurate.",
  "I enjoy reading books, exploring new technologies, and helping others with their work.",
];

export function VoiceClonePage() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentSamples, setCurrentSamples] = useState<VoiceSample[]>([]);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [testText, setTestText] = useState('Hello, this is a test of my cloned voice.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const recorderRef = useRef<VoiceRecorder | null>(null);
  const cloneServiceRef = useRef<VoiceCloneService | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize services
  useEffect(() => {
    cloneServiceRef.current = new VoiceCloneService();
    recorderRef.current = new VoiceRecorder();
    
    loadProfiles();

    return () => {
      if (recorderRef.current) {
        recorderRef.current.dispose();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Load voice profiles
  const loadProfiles = () => {
    if (cloneServiceRef.current) {
      const loadedProfiles = cloneServiceRef.current.getProfiles();
      setProfiles(loadedProfiles);
      
      const defaultProfile = loadedProfiles.find(p => p.isDefault);
      if (defaultProfile) {
        setSelectedProfile(defaultProfile.id);
      }
    }
  };

  // Visualize audio levels
  const visualizeAudio = useCallback(() => {
    if (!recorderRef.current || !isRecording) return;

    const level = recorderRef.current.getAudioLevel();
    setAudioLevel(level);

    // Draw waveform
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const waveformData = recorderRef.current.getWaveformData();
        drawWaveform(ctx, canvas, waveformData);
      }
    }

    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  }, [isRecording]);

  // Draw waveform visualization
  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: Uint8Array
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 10;
    ctx.stroke();
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      
      if (!recorderRef.current) {
        recorderRef.current = new VoiceRecorder();
      }

      await recorderRef.current.initialize();
      await recorderRef.current.startRecording();
      
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 100);
      }, 100);

      // Start visualization
      visualizeAudio();

    } catch (err) {
      setError('Failed to access microphone. Please grant permission.');
      console.error(err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;

    try {
      const sample = await recorderRef.current.stopRecording(
        SAMPLE_SCRIPTS[currentScriptIndex]
      );
      
      setCurrentSamples(prev => [...prev, sample]);
      setIsRecording(false);

      // Stop timers
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Move to next script
      if (currentScriptIndex < SAMPLE_SCRIPTS.length - 1) {
        setCurrentScriptIndex(prev => prev + 1);
      }

      setSuccess(`Sample ${currentSamples.length + 1} recorded successfully!`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      setError('Failed to save recording');
      console.error(err);
    }
  };

  // Play sample
  const playSample = (sample: VoiceSample) => {
    const url = URL.createObjectURL(sample.blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(url);
  };

  // Delete sample
  const deleteSample = (index: number) => {
    setCurrentSamples(prev => prev.filter((_, i) => i !== index));
  };

  // Create voice profile
  const createProfile = async () => {
    if (!cloneServiceRef.current || currentSamples.length < 3) {
      setError('Please record at least 3 voice samples');
      return;
    }

    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    setIsCreatingProfile(true);
    setProgress(0);

    try {
      const profile = await cloneServiceRef.current.createProfile(
        profileName,
        currentSamples,
        (p, status) => {
          setProgress(p * 100);
          setProgressStatus(status);
        }
      );

      setProfiles(prev => [...prev, profile]);
      setSelectedProfile(profile.id);
      setCurrentSamples([]);
      setCurrentScriptIndex(0);
      setProfileName('');
      setSuccess('Voice profile created successfully!');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      setError('Failed to create voice profile');
      console.error(err);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  // Test voice with TTS
  const testVoice = async () => {
    if (!cloneServiceRef.current || !testText.trim()) return;

    setIsSpeaking(true);
    
    try {
      await cloneServiceRef.current.speak(testText, selectedProfile || undefined);
    } catch (err) {
      setError('Failed to synthesize speech');
    }

    // Speech synthesis is async, estimate duration
    const estimatedDuration = testText.length * 60;
    setTimeout(() => setIsSpeaking(false), estimatedDuration);
  };

  // Stop speech
  const stopSpeech = () => {
    if (cloneServiceRef.current) {
      cloneServiceRef.current.stop();
    }
    setIsSpeaking(false);
  };

  // Delete profile
  const deleteProfile = (id: string) => {
    if (cloneServiceRef.current) {
      cloneServiceRef.current.deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (selectedProfile === id) {
        setSelectedProfile(null);
      }
    }
  };

  // Set default profile
  const setDefault = (id: string) => {
    if (cloneServiceRef.current) {
      cloneServiceRef.current.setDefaultProfile(id);
      loadProfiles();
    }
  };

  // Export profile
  const exportProfile = async (id: string) => {
    if (!cloneServiceRef.current) return;

    try {
      const blob = await cloneServiceRef.current.exportProfile(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-profile-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export profile');
    }
  };

  // Import profile
  const importProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cloneServiceRef.current) return;

    try {
      const profile = await cloneServiceRef.current.importProfile(file);
      setProfiles(prev => [...prev, profile]);
      setSuccess('Voice profile imported successfully!');
    } catch (err) {
      setError('Failed to import profile');
    }
  };

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-clone-page">
      <h1>
        <Sparkles size={32} />
        Voice Cloning
      </h1>
      <p className="subtitle">Record your voice to create a personalized TTS experience</p>

      {/* Alerts */}
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
        </div>
      )}

      <div className="voice-clone-content">
        {/* Recording Section */}
        <div className="section recording-section">
          <h2>
            <Mic size={24} />
            Record Voice Samples
          </h2>
          <p className="section-description">
            Record at least 3 samples for accurate voice cloning. Speak clearly in a quiet environment.
          </p>

          {/* Current Script */}
          <div className="script-card">
            <div className="script-header">
              <span className="script-number">Script {currentScriptIndex + 1} of {SAMPLE_SCRIPTS.length}</span>
              <button 
                className="btn btn-text"
                onClick={() => setCurrentScriptIndex(Math.floor(Math.random() * SAMPLE_SCRIPTS.length))}
              >
                <RefreshCw size={16} />
                Random Script
              </button>
            </div>
            <p className="script-text">{SAMPLE_SCRIPTS[currentScriptIndex]}</p>
          </div>

          {/* Waveform Visualization */}
          <div className="waveform-container">
            <canvas ref={canvasRef} width={600} height={100} className="waveform-canvas" />
            {isRecording && (
              <div className="recording-indicator">
                <Circle size={12} className="pulse" />
                Recording... {formatDuration(recordingDuration)}
              </div>
            )}
          </div>

          {/* Audio Level Meter */}
          <div className="audio-level-container">
            <span>Level:</span>
            <div className="audio-level-bar">
              <div 
                className="audio-level-fill" 
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>

          {/* Recording Controls */}
          <div className="recording-controls">
            {!isRecording ? (
              <button className="btn btn-record" onClick={startRecording}>
                <Mic size={24} />
                Start Recording
              </button>
            ) : (
              <button className="btn btn-stop" onClick={stopRecording}>
                <Square size={24} />
                Stop Recording
              </button>
            )}
          </div>

          {/* Recorded Samples */}
          {currentSamples.length > 0 && (
            <div className="samples-list">
              <h3>Recorded Samples ({currentSamples.length}/3 minimum)</h3>
              {currentSamples.map((sample, index) => (
                <div key={sample.id} className="sample-item">
                  <div className="sample-waveform">
                    {sample.waveform.map((v, i) => (
                      <div 
                        key={i} 
                        className="waveform-bar"
                        style={{ height: `${v * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="sample-info">
                    <span>Sample {index + 1}</span>
                    <span className="sample-duration">
                      {formatDuration(sample.duration)}
                    </span>
                  </div>
                  <div className="sample-actions">
                    <button 
                      className="btn btn-icon"
                      onClick={() => playSample(sample)}
                      title="Play"
                    >
                      <Play size={18} />
                    </button>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={() => deleteSample(index)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Profile */}
          {currentSamples.length >= 3 && (
            <div className="create-profile-section">
              <input
                type="text"
                placeholder="Enter voice profile name..."
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="profile-name-input"
              />
              <button 
                className="btn btn-primary btn-create-profile"
                onClick={createProfile}
                disabled={isCreatingProfile || !profileName.trim()}
              >
                {isCreatingProfile ? (
                  <>
                    <RefreshCw size={20} className="spin" />
                    Creating... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Voice Profile
                  </>
                )}
              </button>
              {isCreatingProfile && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voice Profiles Section */}
        <div className="section profiles-section">
          <div className="section-header">
            <h2>
              <User size={24} />
              Voice Profiles
            </h2>
            <label className="btn btn-secondary btn-import">
              <Upload size={18} />
              Import
              <input type="file" accept=".json" onChange={importProfile} hidden />
            </label>
          </div>

          {profiles.length === 0 ? (
            <div className="empty-state">
              <Waves size={48} />
              <p>No voice profiles yet</p>
              <span>Record voice samples above to create your first profile</span>
            </div>
          ) : (
            <div className="profiles-list">
              {profiles.map(profile => (
                <div 
                  key={profile.id}
                  className={`profile-card ${selectedProfile === profile.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProfile(profile.id)}
                >
                  <div className="profile-avatar">
                    <User size={32} />
                    {profile.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  <div className="profile-info">
                    <h4>{profile.name}</h4>
                    <span>{profile.samples.length} samples</span>
                    <div className="profile-characteristics">
                      <span title="Pitch">🎵 {profile.characteristics.pitch.toFixed(1)}</span>
                      <span title="Speed">⚡ {profile.characteristics.speed.toFixed(1)}</span>
                      <span title="Energy">💪 {profile.characteristics.energy.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="profile-actions">
                    {!profile.isDefault && (
                      <button 
                        className="btn btn-icon"
                        onClick={(e) => { e.stopPropagation(); setDefault(profile.id); }}
                        title="Set as Default"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button 
                      className="btn btn-icon"
                      onClick={(e) => { e.stopPropagation(); exportProfile(profile.id); }}
                      title="Export"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={(e) => { e.stopPropagation(); deleteProfile(profile.id); }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test TTS Section */}
        <div className="section test-section">
          <h2>
            <Volume2 size={24} />
            Test Your Voice
          </h2>
          <p className="section-description">
            Enter text below to hear it spoken with your cloned voice.
          </p>

          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="test-text-input"
            rows={4}
          />

          <div className="test-controls">
            {selectedProfile && (
              <div className="selected-profile-badge">
                <User size={16} />
                Using: {profiles.find(p => p.id === selectedProfile)?.name || 'Default'}
              </div>
            )}
            
            {!isSpeaking ? (
              <button 
                className="btn btn-primary btn-speak"
                onClick={testVoice}
                disabled={!testText.trim()}
              >
                <Play size={20} />
                Speak
              </button>
            ) : (
              <button 
                className="btn btn-secondary btn-stop-speak"
                onClick={stopSpeech}
              >
                <Pause size={20} />
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceClonePage;
