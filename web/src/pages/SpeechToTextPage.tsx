import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Copy, Download, Trash2, Globe, Settings, Activity, Zap } from 'lucide-react';
import './SpeechToTextPage.css';
import { SpeechToTextService } from '../../../shared/speech/SpeechToText';

interface TranscriptSegment {
  text: string;
  timestamp: Date;
  isFinal: boolean;
  confidence?: number;
}

export function SpeechToTextPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [continuousMode, setContinuousMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [punctuation, setPunctuation] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [audioQuality, setAudioQuality] = useState<{ noise: number; clarity: number; quality: string } | null>(null);
  const [averageConfidence, setAverageConfidence] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const recognitionRef = useRef<any>(null);
  const sttServiceRef = useRef<SpeechToTextService | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const qualityCheckInterval = useRef<any>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-NG', name: 'English (Nigeria)' },
    { code: 'ig-NG', name: 'Igbo' },
    { code: 'yo-NG', name: 'Yoruba' },
    { code: 'ha-NG', name: 'Hausa' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
  ];

  useEffect(() => {
    // Initialize speech service
    sttServiceRef.current = new SpeechToTextService({
      language,
      continuous: continuousMode,
      interimResults: true,
      punctuation,
      confidenceThreshold,
      noiseReduction: true,
    });

    return () => {
      if (qualityCheckInterval.current) {
        clearInterval(qualityCheckInterval.current);
      }
      sttServiceRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimText]);

  useEffect(() => {
    // Calculate average confidence
    const confidences = transcript
      .filter(s => s.confidence !== undefined)
      .map(s => s.confidence!);
    
    if (confidences.length > 0) {
      const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      setAverageConfidence(avg);
    }
  }, [transcript]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Update service options
    if (sttServiceRef.current) {
      sttServiceRef.current.setOptions({
        language,
        continuous: continuousMode,
        punctuation,
        confidenceThreshold,
      });
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = continuousMode;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      
      // Start audio quality monitoring
      qualityCheckInterval.current = setInterval(() => {
        if (sttServiceRef.current) {
          const quality = sttServiceRef.current.getAudioQuality();
          setAudioQuality(quality);
        }
      }, 500);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';
      let finalConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const confidence = result[0].confidence || 0.9;
        
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          finalConfidence = confidence;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript && finalConfidence >= confidenceThreshold) {
        const processedText = punctuation 
          ? finalTranscript.trim().charAt(0).toUpperCase() + finalTranscript.trim().slice(1) + '.'
          : finalTranscript;
          
        setTranscript(prev => [...prev, {
          text: processedText,
          timestamp: new Date(),
          isFinal: true,
          confidence: finalConfidence,
        }]);
      }
      
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
      
      if (qualityCheckInterval.current) {
        clearInterval(qualityCheckInterval.current);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
      
      if (qualityCheckInterval.current) {
        clearInterval(qualityCheckInterval.current);
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (qualityCheckInterval.current) {
      clearInterval(qualityCheckInterval.current);
      qualityCheckInterval.current = null;
    }
  };

  const clearTranscript = () => {
    setTranscript([]);
    setInterimText('');
  };

  const copyToClipboard = () => {
    const fullText = transcript.map(s => s.text).join(' ');
    navigator.clipboard.writeText(fullText);
    alert('Transcript copied to clipboard!');
  };

  const downloadTranscript = () => {
    const fullText = transcript.map(s => {
      const time = s.timestamp.toLocaleTimeString();
      return `[${time}] ${s.text}`;
    }).join('\n');
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fullTranscriptText = transcript.map(s => s.text).join(' ');

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#4caf50';
    if (confidence >= 0.6) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="stt-page">
      <h1>
        <Mic size={32} />
        Speech to Text
      </h1>
      <p className="page-subtitle">Convert your voice to text with excellent recognition accuracy</p>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {audioQuality && isListening && (
        <div className={`audio-quality-banner quality-${audioQuality.quality}`}>
          <Activity size={18} />
          <span>Audio Quality: {audioQuality.quality.toUpperCase()} | Noise: {Math.round(audioQuality.noise * 100)}% | Clarity: {Math.round(audioQuality.clarity * 100)}%</span>
        </div>
      )}

      <div className="stt-container">
        {/* Controls Bar */}
        <div className="stt-controls">
          <div className="control-left">
            <div className="language-select">
              <Globe size={18} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isListening}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={continuousMode}
                onChange={(e) => setContinuousMode(e.target.checked)}
                disabled={isListening}
              />
              <span>Continuous Mode</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={punctuation}
                onChange={(e) => setPunctuation(e.target.checked)}
                disabled={isListening}
              />
              <span>Auto Punctuation</span>
            </label>

            <button
              className="btn btn-icon"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="control-right">
            <button
              className="btn btn-icon"
              onClick={copyToClipboard}
              disabled={transcript.length === 0}
              title="Copy to clipboard"
            >
              <Copy size={20} />
            </button>
            <button
              className="btn btn-icon"
              onClick={downloadTranscript}
              disabled={transcript.length === 0}
              title="Download transcript"
            >
              <Download size={20} />
            </button>
            <button
              className="btn btn-icon btn-danger"
              onClick={clearTranscript}
              disabled={transcript.length === 0}
              title="Clear transcript"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h4>Advanced Settings</h4>
            <div className="setting-group">
              <label>Confidence Threshold: {Math.round(confidenceThreshold * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                disabled={isListening}
              />
              <small>Transcripts below this confidence will be ignored</small>
            </div>
          </div>
        )}

        {/* Microphone Button */}
        <div className="mic-container">
          <button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <MicOff size={48} /> : <Mic size={48} />}
          </button>
          <p className="mic-status">
            {isListening ? 'Listening... Click to stop' : 'Click to start speaking'}
          </p>
          {isListening && (
            <div className="pulse-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        <div className="transcript-container">
          <div className="transcript-header">
            <h3>Transcript</h3>
            <div className="header-stats">
              <span className="word-count">
                {fullTranscriptText.split(/\s+/).filter(Boolean).length} words
              </span>
              {averageConfidence > 0 && (
                <span className="confidence-badge" style={{ backgroundColor: getConfidenceColor(averageConfidence) }}>
                  <Zap size={14} />
                  {Math.round(averageConfidence * 100)}% confidence
                </span>
              )}
            </div>
          </div>
          
          <div className="transcript-content">
            {transcript.length === 0 && !interimText ? (
              <p className="placeholder">
                Your transcribed text will appear here...
              </p>
            ) : (
              <>
                {transcript.map((segment, index) => (
                  <span key={index} className="final-text" title={`Confidence: ${Math.round((segment.confidence || 0) * 100)}%`}>
                    {segment.text}{' '}
                    {segment.confidence && segment.confidence < 0.7 && (
                      <span className="confidence-indicator" style={{ color: getConfidenceColor(segment.confidence) }}>
                        [{Math.round(segment.confidence * 100)}%]
                      </span>
                    )}
                  </span>
                ))}
                {interimText && (
                  <span className="interim-text">{interimText}</span>
                )}
              </>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Stats */}
        <div className="stt-stats">
          <div className="stat">
            <span className="stat-label">Segments</span>
            <span className="stat-value">{transcript.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Characters</span>
            <span className="stat-value">{fullTranscriptText.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Language</span>
            <span className="stat-value">{languages.find(l => l.code === language)?.name || language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
