/**
 * OCR Type Definitions
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RecognizedWord {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  alternatives?: string[];
}

export interface RecognizedLine {
  text: string;
  words: RecognizedWord[];
  confidence: number;
  boundingBox: BoundingBox;
}

export interface OCRResult {
  text: string;
  lines: RecognizedLine[];
  confidence: number;
  processingTime: number;
  warnings?: string[];
}

export interface OCROptions {
  language?: string;
  medicalMode?: boolean;
  enhanceContrast?: boolean;
  detectTables?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ModelConfig {
  modelPath: string;
  vocabPath: string;
  inputShape: [number, number, number];
  outputLength: number;
}
