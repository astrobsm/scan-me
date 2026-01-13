import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Copy, Download, Trash2, Globe, Settings } from 'lucide-react';
import './SpeechToTextPage.css';

interface TranscriptSegment {
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

export function SpeechToTextPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [continuousMode, setContinuousMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
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
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimText]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = continuousMode;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => [...prev, {
          text: finalTranscript,
          timestamp: new Date(),
          isFinal: true,
        }]);
      }
      
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
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
            <span className="word-count">
              {fullTranscriptText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          
          <div className="transcript-content">
            {transcript.length === 0 && !interimText ? (
              <p className="placeholder">
                Your transcribed text will appear here...
              </p>
            ) : (
              <>
                {transcript.map((segment, index) => (
                  <span key={index} className="final-text">
                    {segment.text}{' '}
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
