import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Upload, Play, Pause, Square, Download, Mic } from 'lucide-react';
import './TextToSpeechPage.css';

interface Voice {
  name: string;
  lang: string;
  default: boolean;
}

export function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [customVoices, setCustomVoices] = useState<Array<{ id: string; name: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices.map(v => ({
        name: v.name,
        lang: v.lang,
        default: v.default,
      })));
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
    if (!text) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    const voice = speechSynthesis.getVoices().find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newVoice = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
      };
      setCustomVoices([...customVoices, newVoice]);
      alert(`Voice "${newVoice.name}" uploaded! (Voice cloning requires server-side ML processing)`);
    }
  };

  const handleDownloadAudio = () => {
    alert('Audio download feature: In production, this generates an audio file using server-side TTS APIs like Azure Neural Voice or ElevenLabs.');
  };

  return (
    <div className="tts-page">
      <h1>
        <Volume2 size={32} />
        Text to Speech
      </h1>
      <p className="page-subtitle">Convert text to natural speech with custom voice support</p>

      <div className="tts-container">
        {/* Text Input */}
        <div className="tts-section">
          <label>Enter Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here to convert to speech..."
            rows={8}
          />
          <div className="char-count">{text.length} characters</div>
        </div>

        {/* Voice Selection */}
        <div className="tts-section">
          <label>Select Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            <optgroup label="System Voices">
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </optgroup>
            {customVoices.length > 0 && (
              <optgroup label="Custom Voices">
                {customVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} (Custom)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Voice Upload */}
        <div className="tts-section upload-section">
          <label>Upload Custom Voice Sample</label>
          <div
            className="upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleVoiceUpload}
              hidden
            />
            <Mic size={32} />
            <p>Click to upload a voice sample (MP3, WAV)</p>
            <span>Voice cloning will generate speech in your custom voice</span>
          </div>
        </div>

        {/* Controls */}
        <div className="tts-controls">
          <div className="control-group">
            <label>Speed: {rate.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Pitch: {pitch.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Volume: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="tts-actions">
          {!isSpeaking || isPaused ? (
            <button className="btn btn-primary btn-large" onClick={handleSpeak}>
              <Play size={24} />
              {isPaused ? 'Resume' : 'Speak'}
            </button>
          ) : (
            <button className="btn btn-secondary btn-large" onClick={handlePause}>
              <Pause size={24} />
              Pause
            </button>
          )}
          
          <button
            className="btn btn-secondary"
            onClick={handleStop}
            disabled={!isSpeaking}
          >
            <Square size={20} />
            Stop
          </button>

          <button className="btn btn-secondary" onClick={handleDownloadAudio}>
            <Download size={20} />
            Download Audio
          </button>
        </div>
      </div>
    </div>
  );
}
