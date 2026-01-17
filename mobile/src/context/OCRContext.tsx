import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface OCRSettings {
  medicalMode: boolean;
  offlineMode: boolean;
  highQuality: boolean;
  language: string;
}

interface OCRContextType {
  isReady: boolean;
  isProcessing: boolean;
  settings: OCRSettings;
  updateSettings: (settings: Partial<OCRSettings>) => void;
  processImage: (imageUri: string) => Promise<string>;
}

const defaultSettings: OCRSettings = {
  medicalMode: false,
  offlineMode: true,
  highQuality: true,
  language: 'en',
};

const OCRContext = createContext<OCRContextType | undefined>(undefined);

export function OCRProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<OCRSettings>(defaultSettings);
  const isMountedRef = useRef(true);
  const processingQueueRef = useRef<string[]>([]);

  useEffect(() => {
    isMountedRef.current = true;
    initializeOCR();
    
    return () => {
      isMountedRef.current = false;
      // Clear processing queue on unmount
      processingQueueRef.current = [];
    };
  }, []);

  const initializeOCR = async () => {
    try {
      // Initialize OCR engine
      // In production: await ocrEngine.initialize();
      await new Promise(resolve => setTimeout(resolve, 500));
      if (isMountedRef.current) {
        setIsReady(true);
      }
    } catch (error) {
      console.error('Failed to initialize OCR:', error);
      if (isMountedRef.current) {
        setIsReady(false);
      }
    }
  };

  const updateSettings = useCallback((newSettings: Partial<OCRSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const processImage = useCallback(async (imageUri: string): Promise<string> => {
    if (!isMountedRef.current) return '';
    
    // Check if already processing this image
    if (processingQueueRef.current.includes(imageUri)) {
      console.warn('Image already in processing queue');
      return '';
    }
    
    processingQueueRef.current.push(imageUri);
    setIsProcessing(true);
    
    try {
      // In production: use actual OCR engine with web workers
      // For now, simulate with shorter delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isMountedRef.current) return '';
      
      return 'Recognized text from image...';
    } catch (error) {
      console.error('OCR processing error:', error);
      return '';
    } finally {
      // Remove from queue
      processingQueueRef.current = processingQueueRef.current.filter(uri => uri !== imageUri);
      
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, []);

  return (
    <OCRContext.Provider
      value={{
        isReady,
        isProcessing,
        settings,
        updateSettings,
        processImage,
      }}
    >
      {children}
    </OCRContext.Provider>
  );
}

export function useOCR(): OCRContextType {
  const context = useContext(OCRContext);
  if (!context) {
    throw new Error('useOCR must be used within an OCRProvider');
  }
  return context;
}
