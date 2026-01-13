import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  useEffect(() => {
    initializeOCR();
  }, []);

  const initializeOCR = async () => {
    try {
      // Initialize OCR engine
      // In production: await ocrEngine.initialize();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize OCR:', error);
    }
  };

  const updateSettings = (newSettings: Partial<OCRSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const processImage = async (imageUri: string): Promise<string> => {
    setIsProcessing(true);
    try {
      // In production: use actual OCR engine
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'Recognized text from image...';
    } finally {
      setIsProcessing(false);
    }
  };

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
