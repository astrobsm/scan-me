import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, Download, Copy, Share2, Loader } from 'lucide-react';
import './ScanPage.css';

export function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        processImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        processImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setRecognizedText('');
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Placeholder - replace with actual OCR
      const result = `Sample recognized text from your handwritten document.

This is where the OCR engine extracts text with high accuracy.

The SCAN ME application supports:
• Cursive and block handwriting
• Medical terminology recognition
• Multiple languages

Edit the text above as needed, then export to your preferred format.`;
      
      setRecognizedText(result);
      setConfidence(0.94);
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(recognizedText);
    alert('Text copied to clipboard!');
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    alert(`Exporting as ${format.toUpperCase()}...`);
  };

  return (
    <div className="scan-page">
      <h1>Scan Document</h1>

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
          <Upload size={48} className="upload-icon" />
          <h3>Drop image here or click to upload</h3>
          <p>Supports JPG, PNG, HEIC</p>
        </div>
      )}

      {/* Processing View */}
      {isProcessing && (
        <div className="processing">
          <Loader size={48} className="spinner" />
          <h3>Processing handwriting...</h3>
          <p>This may take a few seconds</p>
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
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setImage(null);
                  setRecognizedText('');
                }}
              >
                Scan Another
              </button>
            </div>

            {/* Recognized Text */}
            <div className="result-section">
              <div className="result-header">
                <h3>Recognized Text</h3>
                <div className="confidence-badge">
                  {(confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
              <textarea
                className="text-editor"
                value={recognizedText}
                onChange={(e) => setRecognizedText(e.target.value)}
                placeholder="Recognized text will appear here..."
              />
              
              {/* Actions */}
              <div className="actions">
                <button className="btn btn-secondary" onClick={handleCopy}>
                  <Copy size={18} />
                  Copy
                </button>
                <button className="btn btn-primary" onClick={() => handleExport('pdf')}>
                  <Download size={18} />
                  Export PDF
                </button>
                <button className="btn btn-secondary" onClick={() => handleExport('docx')}>
                  Export Word
                </button>
                <button className="btn btn-secondary" onClick={() => handleExport('txt')}>
                  Export TXT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
