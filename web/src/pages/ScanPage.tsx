import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, Download, Copy, Share2, Loader, RefreshCw, Settings, Cpu, Zap } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { TensorFlowOCR } from '../services/TensorFlowOCR';
import { ImagePreprocessor, PreprocessingOptions } from '../services/ImagePreprocessor';
import './ScanPage.css';

type OCREngine = 'tesseract' | 'tensorflow' | 'hybrid';

export function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [ocrLanguage, setOcrLanguage] = useState('eng');
  const [ocrEngine, setOcrEngine] = useState<OCREngine>('tesseract');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [preprocessingEnabled, setPreprocessingEnabled] = useState(true);
  const [preprocessingOptions, setPreprocessingOptions] = useState<Partial<PreprocessingOptions>>({
    grayscale: true,
    denoise: true,
    threshold: 'adaptive',
    deskew: true,
    removeBackground: true,
    enhanceContrast: true,
    sharpen: true,
    invert: false,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const tfOcrRef = useRef<TensorFlowOCR | null>(null);
  const preprocessorRef = useRef<ImagePreprocessor | null>(null);
  
  // Initialize TensorFlow OCR model
  useEffect(() => {
    if (ocrEngine === 'tensorflow' || ocrEngine === 'hybrid') {
      if (!tfOcrRef.current) {
        const tfOcr = new TensorFlowOCR();
        tfOcr.initialize().then(() => {
          tfOcrRef.current = tfOcr;
        }).catch(console.error);
      }
    }
    
    // Initialize preprocessor
    if (!preprocessorRef.current) {
      preprocessorRef.current = new ImagePreprocessor(preprocessingOptions);
    }
    
    return () => {
      if (tfOcrRef.current) {
        tfOcrRef.current.dispose();
        tfOcrRef.current = null;
      }
    };
  }, [ocrEngine]);

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
    setProgressStatus('Preparing image...');
    
    try {
      let processedImage = imageData;
      
      // Apply preprocessing if enabled
      if (preprocessingEnabled && preprocessorRef.current) {
        setProgressStatus('Preprocessing image...');
        const img = new Image();
        img.src = imageData;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });
        
        const preprocessor = new ImagePreprocessor(preprocessingOptions);
        const canvas = await preprocessor.preprocess(img, (p, status) => {
          setProgress(Math.round(p * 20)); // 0-20% for preprocessing
          setProgressStatus(status);
        });
        processedImage = canvas.toDataURL('image/png');
      }
      
      let text = '';
      let conf = 0;
      
      if (ocrEngine === 'tensorflow') {
        // Use TensorFlow.js OCR
        const result = await processWithTensorFlow(processedImage);
        text = result.text;
        conf = result.confidence;
      } else if (ocrEngine === 'tesseract') {
        // Use Tesseract.js OCR
        const result = await processWithTesseract(processedImage);
        text = result.text;
        conf = result.confidence;
      } else if (ocrEngine === 'hybrid') {
        // Use both engines and combine results
        const [tfResult, tessResult] = await Promise.all([
          processWithTensorFlow(processedImage).catch(() => ({ text: '', confidence: 0 })),
          processWithTesseract(processedImage).catch(() => ({ text: '', confidence: 0 })),
        ]);
        
        // Prefer higher confidence result
        if (tessResult.confidence > tfResult.confidence) {
          text = tessResult.text || tfResult.text;
          conf = tessResult.confidence;
        } else {
          text = tfResult.text || tessResult.text;
          conf = tfResult.confidence;
        }
      }
      
      if (text) {
        setRecognizedText(text);
        setConfidence(conf);
      } else {
        setRecognizedText('No text detected in this image. Please try:\n\n• A clearer image\n• Better lighting\n• Ensure text is visible and not too small\n• Try a different OCR engine');
        setConfidence(0);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setRecognizedText('Error processing image. Please try again with a different image or OCR engine.');
      setConfidence(0);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const processWithTensorFlow = async (imageData: string): Promise<{ text: string; confidence: number }> => {
    setProgressStatus('Initializing TensorFlow OCR...');
    setProgress(25);
    
    if (!tfOcrRef.current) {
      const tfOcr = new TensorFlowOCR();
      await tfOcr.initialize();
      tfOcrRef.current = tfOcr;
    }
    
    setProgressStatus('Running neural network recognition...');
    setProgress(50);
    
    // Create image element
    const img = new Image();
    img.src = imageData;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });
    
    setProgress(75);
    const result = await tfOcrRef.current.recognize(img);
    setProgress(100);
    
    return {
      text: result.text,
      confidence: result.confidence,
    };
  };

  const processWithTesseract = async (imageData: string): Promise<{ text: string; confidence: number }> => {
    setProgressStatus('Initializing Tesseract OCR...');
    
    const result = await Tesseract.recognize(
      imageData,
      ocrLanguage,
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(20 + m.progress * 75)); // 20-95%
            setProgressStatus('Recognizing text...');
          } else if (m.status === 'loading language traineddata') {
            setProgress(Math.round(20 + m.progress * 30)); // 20-50%
            setProgressStatus('Loading language model...');
          } else if (m.status === 'initializing tesseract') {
            setProgressStatus('Initializing OCR engine...');
          } else if (m.status === 'loading tesseract core') {
            setProgressStatus('Loading OCR core...');
          }
        }
      }
    );
    
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence / 100,
    };
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
        <div className="ocr-settings">
          <div className="setting-row">
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
          
          <div className="setting-row">
            <label>OCR Engine:</label>
            <div className="engine-selector">
              <button
                className={`engine-btn ${ocrEngine === 'tesseract' ? 'active' : ''}`}
                onClick={() => setOcrEngine('tesseract')}
                title="Tesseract.js - Best for printed text"
              >
                <Zap size={16} />
                Tesseract
              </button>
              <button
                className={`engine-btn ${ocrEngine === 'tensorflow' ? 'active' : ''}`}
                onClick={() => setOcrEngine('tensorflow')}
                title="TensorFlow.js - Best for handwriting"
              >
                <Cpu size={16} />
                TensorFlow
              </button>
              <button
                className={`engine-btn ${ocrEngine === 'hybrid' ? 'active' : ''}`}
                onClick={() => setOcrEngine('hybrid')}
                title="Use both engines for best results"
              >
                <Cpu size={16} />
                <Zap size={16} />
                Hybrid
              </button>
            </div>
          </div>
          
          <div className="setting-row">
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <Settings size={16} />
              {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
            </button>
          </div>
          
          {showAdvancedSettings && (
            <div className="advanced-settings">
              <h4>Image Preprocessing</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preprocessingEnabled}
                  onChange={(e) => setPreprocessingEnabled(e.target.checked)}
                />
                Enable Image Preprocessing
              </label>
              
              {preprocessingEnabled && (
                <>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preprocessingOptions.grayscale}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        grayscale: e.target.checked,
                      })}
                    />
                    Convert to Grayscale
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preprocessingOptions.denoise}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        denoise: e.target.checked,
                      })}
                    />
                    Noise Reduction
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preprocessingOptions.enhanceContrast}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        enhanceContrast: e.target.checked,
                      })}
                    />
                    Enhance Contrast
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preprocessingOptions.removeBackground}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        removeBackground: e.target.checked,
                      })}
                    />
                    Remove Background
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preprocessingOptions.deskew}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        deskew: e.target.checked,
                      })}
                    />
                    Auto Deskew
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={preprocessingOptions.sharpen}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        sharpen: e.target.checked,
                      })}
                    />
                    Sharpen Text
                  </label>
                  <div className="threshold-selector">
                    <label>Thresholding:</label>
                    <select
                      value={preprocessingOptions.threshold}
                      onChange={(e) => setPreprocessingOptions({
                        ...preprocessingOptions,
                        threshold: e.target.value as 'none' | 'binary' | 'adaptive' | 'otsu',
                      })}
                    >
                      <option value="none">None</option>
                      <option value="binary">Binary</option>
                      <option value="adaptive">Adaptive</option>
                      <option value="otsu">Otsu's</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
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
                <div className="rescan-option">
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
                <div className="rescan-option">
                  <label>Engine:</label>
                  <select
                    value={ocrEngine}
                    onChange={(e) => setOcrEngine(e.target.value as OCREngine)}
                  >
                    <option value="tesseract">Tesseract (Printed)</option>
                    <option value="tensorflow">TensorFlow (Handwriting)</option>
                    <option value="hybrid">Hybrid (Best)</option>
                  </select>
                </div>
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
