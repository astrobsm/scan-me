import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Upload, Play, Pause, Square, Download, Mic, Smile, Zap, Code } from 'lucide-react';
import './TextToSpeechPage.css';
import { TextToSpeechService } from '../../../shared/speech/TextToSpeech';

interface Voice {
  name: string;
  lang: string;
  default: boolean;
}

type EmotionType = 'neutral' | 'happy' | 'sad' | 'angry' | 'excited';

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
  const [emotion, setEmotion] = useState<EmotionType>('neutral');
  const [useSSML, setUseSSML] = useState(false);
  const [emphasis, setEmphasis] = useState<'none' | 'reduced' | 'moderate' | 'strong'>('none');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [naturalPauses, setNaturalPauses] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ttsServiceRef = useRef<TextToSpeechService | null>(null);

  useEffect(() => {
    // Initialize TTS service
    ttsServiceRef.current = new TextToSpeechService({
      rate,
      pitch,
      volume,
      useSSML,
      emotion,
      emphasis,
    });

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

    return () => {
      ttsServiceRef.current?.dispose();
    };
  }, []);

  const handleSpeak = async () => {
    if (!text) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    speechSynthesis.cancel();
    setIsSpeaking(true);

    // Update service options
    if (ttsServiceRef.current) {
      ttsServiceRef.current.setOptions({
        rate,
        pitch,
        volume,
        voice: selectedVoice,
        useSSML,
        emotion,
        emphasis,
      });

      try {
        if (naturalPauses) {
          await ttsServiceRef.current.speakNaturally(text);
        } else if (emphasis !== 'none') {
          await ttsServiceRef.current.speakWithEmphasis(text, emphasis as any);
        } else {
          await ttsServiceRef.current.speak(text);
        }
      } catch (error) {
        console.error('Speech error:', error);
      } finally {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    } else {
      // Fallback to native speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      const voice = speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
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

  const insertSSMLTag = (tag: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end) || 'text';
    
    let ssmlTag = '';
    switch (tag) {
      case 'emphasis':
        ssmlTag = `<emphasis level="strong">${selectedText}</emphasis>`;
        break;
      case 'break':
        ssmlTag = `${text.substring(0, start)}<break time="500ms"/>${text.substring(start)}`;
        setText(ssmlTag);
        return;
      case 'prosody':
        ssmlTag = `<prosody rate="medium" pitch="+10%">${selectedText}</prosody>`;
        break;
      default:
        return;
    }
    
    const newText = text.substring(0, start) + ssmlTag + text.substring(end);
    setText(newText);
  };

  const nigerianVoices = voices.filter(v => 
    v.lang.includes('en-NG') || v.lang.includes('ig-') || v.lang.includes('yo-') || v.lang.includes('ha-')
  );

  const getEmotionEmoji = (emotion: EmotionType): string => {
    const emojis = {
      neutral: '😐',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      excited: '🤩',
    };
    return emojis[emotion];
  };

  return (
    <div className="tts-page">
      <h1>
        <Volume2 size={32} />
        Text to Speech
      </h1>
      <p className="page-subtitle">Convert text to natural speech with custom voice support</p>

      {/* Emotion Controls */}
      <div className="emotion-controls">
        <label><Smile size={18} /> Emotion:</label>
        <div className="emotion-buttons">
          {(['neutral', 'happy', 'sad', 'angry', 'excited'] as EmotionType[]).map(emo => (
            <button
              key={emo}
              className={`emotion-btn ${emotion === emo ? 'active' : ''}`}
              onClick={() => setEmotion(emo)}
            >
              {getEmotionEmoji(emo)} {emo}
            </button>
          ))}
        </div>
      </div>

      <div className="tts-container">
        {/* Text Input */}
        <div className="tts-section">
          <div className="section-header">
            <label>Enter Text</label>
            <div className="text-controls">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useSSML}
                  onChange={(e) => setUseSSML(e.target.checked)}
                />
                <span>SSML</span>
              </label>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={naturalPauses}
                  onChange={(e) => setNaturalPauses(e.target.checked)}
                />
                <span>Natural Pauses</span>
              </label>
            </div>
          </div>
          {useSSML && (
            <div className="ssml-toolbar">
              <button onClick={() => insertSSMLTag('emphasis')} title="Add emphasis">
                <Zap size={16} /> Emphasis
              </button>
              <button onClick={() => insertSSMLTag('break')} title="Add break">
                Break
              </button>
              <button onClick={() => insertSSMLTag('prosody')} title="Add prosody">
                Prosody
              </button>
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here to convert to speech...\n\nWith SSML enabled, you can use tags like:\n<emphasis level='strong'>important text</emphasis>\n<break time='500ms'/>\n<prosody rate='slow' pitch='+10%'>custom speech</prosody>"
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
            {nigerianVoices.length > 0 && (
              <optgroup label="Nigerian Voices">
                {nigerianVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang}) 🇳🇬
                  </option>
                ))}
              </optgroup>
            )}
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

          <div className="control-group">
            <label>Emphasis</label>
            <select value={emphasis} onChange={(e) => setEmphasis(e.target.value as any)}>
              <option value="none">None</option>
              <option value="reduced">Reduced</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
            </select>
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
