import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, Download, Copy, Share2, Loader, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';
import './ScanPage.css';

export function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [ocrLanguage, setOcrLanguage] = useState('eng');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const supportedLanguages = [
    { code: 'eng', name: 'English' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'spa', name: 'Spanish' },
    { code: 'por', name: 'Portuguese' },
    { code: 'ita', name: 'Italian' },
    { code: 'ara', name: 'Arabic' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'hin', name: 'Hindi' },
    { code: 'rus', name: 'Russian' },
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  }, [ocrLanguage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  }, [ocrLanguage]);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setRecognizedText('');
    setProgress(0);
    setProgressStatus('Initializing OCR engine...');
    
    try {
      // Use Tesseract.js for real OCR
      const result = await Tesseract.recognize(
        imageData,
        ocrLanguage,
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
              setProgressStatus('Recognizing text...');
            } else if (m.status === 'loading language traineddata') {
              setProgress(Math.round(m.progress * 50));
              setProgressStatus('Loading language model...');
            } else if (m.status === 'initializing tesseract') {
              setProgressStatus('Initializing OCR engine...');
            } else if (m.status === 'loading tesseract core') {
              setProgressStatus('Loading OCR core...');
            }
          }
        }
      );
      
      const text = result.data.text.trim();
      const conf = result.data.confidence / 100;
      
      if (text) {
        setRecognizedText(text);
        setConfidence(conf);
      } else {
        setRecognizedText('No text detected in this image. Please try:\n\n• A clearer image\n• Better lighting\n• Ensure text is visible and not too small');
        setConfidence(0);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setRecognizedText('Error processing image. Please try again with a different image.');
      setConfidence(0);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleRescan = () => {
    if (image) {
      processImage(image);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recognizedText);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    const filename = `scan-${new Date().toISOString().slice(0, 10)}`;
    
    if (format === 'txt') {
      const blob = new Blob([recognizedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert(`${format.toUpperCase()} export coming soon!`);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="scan-page">
      <h1>Scan Document</h1>

      {/* Language Selector */}
      {!image && (
        <div className="language-selector-scan">
          <label>OCR Language:</label>
          <select
            value={ocrLanguage}
            onChange={(e) => setOcrLanguage(e.target.value)}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Upload Area */}
      {!image && (
        <div
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            hidden
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            hidden
          />
          <Upload size={48} className="upload-icon" />
          <h3>Drop image here or click to upload</h3>
          <p>Supports JPG, PNG, HEIC, WebP</p>
          <div className="upload-buttons">
            <button
              className="btn btn-secondary camera-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCameraCapture();
              }}
            >
              <Camera size={20} />
              Use Camera
            </button>
          </div>
        </div>
      )}

      {/* Processing View */}
      {isProcessing && (
        <div className="processing">
          <Loader size={48} className="spinner" />
          <h3>Processing your document...</h3>
          <p>{progressStatus}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}

      {/* Results View */}
      {image && !isProcessing && (
        <div className="results">
          <div className="results-grid">
            {/* Original Image */}
            <div className="result-section">
              <h3>Original Image</h3>
              <div className="image-preview">
                <img src={image} alt="Scanned document" />
              </div>
              <div className="image-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setImage(null);
                    setRecognizedText('');
                    setConfidence(0);
                  }}
                >
                  Scan Another
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleRescan}
                  title="Re-scan with different settings"
                >
                  <RefreshCw size={18} />
                  Rescan
                </button>
              </div>
              <div className="rescan-options">
                <label>Language:</label>
                <select
                  value={ocrLanguage}
                  onChange={(e) => setOcrLanguage(e.target.value)}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recognized Text */}
            <div className="result-section">
              <div className="result-header">
                <h3>Recognized Text</h3>
                {confidence > 0 && (
                  <div className={`confidence-badge ${confidence >= 0.8 ? 'high' : confidence >= 0.5 ? 'medium' : 'low'}`}>
                    {(confidence * 100).toFixed(0)}% confidence
                  </div>
                )}
              </div>
              <textarea
                className="text-editor"
                value={recognizedText}
                onChange={(e) => setRecognizedText(e.target.value)}
                placeholder="Recognized text will appear here..."
              />
              
              {/* Actions */}
              <div className="actions">
                <button className="btn btn-secondary" onClick={handleCopy} disabled={!recognizedText}>
                  <Copy size={18} />
                  Copy
                </button>
                <button className="btn btn-primary" onClick={() => handleExport('txt')} disabled={!recognizedText}>
                  <Download size={18} />
                  Export TXT
                </button>
                <button className="btn btn-secondary" onClick={() => handleExport('pdf')} disabled={!recognizedText}>
                  Export PDF
                </button>
                <button className="btn btn-secondary" onClick={() => handleExport('docx')} disabled={!recognizedText}>
                  Export Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanPage;
