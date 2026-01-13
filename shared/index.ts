/**
 * CHARLES-DOUGLAS SCAN APP - Shared Module
 * Common code for Web and Mobile applications
 */

// Image Preprocessing
export { ImagePreprocessor } from './preprocessing/ImagePreprocessor';
export { grayscale } from './preprocessing/filters/grayscale';
export { threshold } from './preprocessing/filters/threshold';
export { denoise } from './preprocessing/filters/denoise';
export { correctSkew } from './preprocessing/filters/skewCorrection';
export { detectLines } from './preprocessing/segmentation/lineDetection';

// OCR Engine
export { HandwritingOCR } from './ocr/HandwritingOCR';
export { ModelLoader } from './ocr/ModelLoader';
export type { OCRResult, RecognizedWord, RecognizedLine, OCROptions } from './ocr/types';

// Post-processing
export { PostProcessor } from './postprocessing/PostProcessor';
export { SpellChecker } from './postprocessing/SpellChecker';
export { MedicalDictionary } from './postprocessing/MedicalDictionary';

// Export
export { ExportService } from './export/ExportService';
export { generatePDF } from './export/pdfExport';
export { generateWord } from './export/wordExport';
export { generateText } from './export/textExport';

// Speech (TTS/STT)
export { TextToSpeechService } from './speech/TextToSpeech';
export { SpeechToTextService } from './speech/SpeechToText';

// Table Detection
export { TableDetector } from './utils/TableDetector';
export type { DetectedTable, TableCell, TableDetectionResult } from './utils/TableDetector';

// Multi-Language Support
export { MultiLanguageOCR, SUPPORTED_LANGUAGES } from './utils/MultiLanguageOCR';
export type { Language, LanguageDetectionResult } from './utils/MultiLanguageOCR';

// Utilities
export * from './utils';
