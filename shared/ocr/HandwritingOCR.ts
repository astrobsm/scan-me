/**
 * Handwriting OCR Engine
 * Uses TensorFlow.js for offline handwriting recognition
 */

import { OCRResult, OCROptions, RecognizedLine, RecognizedWord, BoundingBox } from './types';
import { ModelLoader } from './ModelLoader';

const DEFAULT_OPTIONS: OCROptions = {
  language: 'en',
  medicalMode: false,
  enhanceContrast: true,
  detectTables: false,
  maxWidth: 1024,
  maxHeight: 1024,
};

export class HandwritingOCR {
  private modelLoader: ModelLoader;
  private options: OCROptions;
  private isReady: boolean = false;
  private vocabulary: string[] = [];

  constructor(options: Partial<OCROptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.modelLoader = new ModelLoader();
  }

  /**
   * Initialize the OCR engine and load models
   */
  async initialize(): Promise<void> {
    if (this.isReady) return;

    try {
      await this.modelLoader.loadModel();
      this.vocabulary = await this.loadVocabulary();
      this.isReady = true;
      console.log('SCAN ME OCR Engine initialized');
    } catch (error) {
      console.error('Failed to initialize OCR:', error);
      throw new Error('OCR initialization failed');
    }
  }

  /**
   * Recognize text from ImageData
   */
  async recognize(imageData: ImageData): Promise<OCRResult> {
    if (!this.isReady) {
      await this.initialize();
    }

    const startTime = performance.now();

    // Segment image into lines
    const lines = await this.segmentLines(imageData);
    
    // Recognize each line
    const recognizedLines: RecognizedLine[] = [];
    let fullText = '';

    for (const lineData of lines) {
      const recognizedLine = await this.recognizeLine(lineData.imageData, lineData.boundingBox);
      recognizedLines.push(recognizedLine);
      fullText += recognizedLine.text + '\n';
    }

    const processingTime = performance.now() - startTime;

    // Calculate overall confidence
    const avgConfidence = recognizedLines.length > 0
      ? recognizedLines.reduce((sum, line) => sum + line.confidence, 0) / recognizedLines.length
      : 0;

    return {
      text: fullText.trim(),
      lines: recognizedLines,
      confidence: avgConfidence,
      processingTime,
    };
  }

  /**
   * Segment image into text lines
   */
  private async segmentLines(imageData: ImageData): Promise<Array<{ imageData: ImageData; boundingBox: BoundingBox }>> {
    const { width, height, data } = imageData;
    const lines: Array<{ imageData: ImageData; boundingBox: BoundingBox }> = [];
    
    // Horizontal projection profile
    const profile: number[] = new Array(height).fill(0);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx] < 128) { // Dark pixel
          profile[y]++;
        }
      }
    }

    // Find line boundaries
    const threshold = Math.max(...profile) * 0.1;
    let lineStart = -1;
    
    for (let y = 0; y < height; y++) {
      if (profile[y] > threshold) {
        if (lineStart === -1) lineStart = y;
      } else {
        if (lineStart !== -1) {
          const lineHeight = y - lineStart;
          if (lineHeight > 10) { // Minimum line height
            const boundingBox: BoundingBox = {
              x: 0,
              y: lineStart,
              width: width,
              height: lineHeight,
            };
            
            // Extract line image data
            const lineImageData = this.extractRegion(imageData, boundingBox);
            lines.push({ imageData: lineImageData, boundingBox });
          }
          lineStart = -1;
        }
      }
    }

    // Handle last line
    if (lineStart !== -1) {
      const boundingBox: BoundingBox = {
        x: 0,
        y: lineStart,
        width: width,
        height: height - lineStart,
      };
      const lineImageData = this.extractRegion(imageData, boundingBox);
      lines.push({ imageData: lineImageData, boundingBox });
    }

    return lines;
  }

  /**
   * Recognize a single line of text
   */
  private async recognizeLine(lineImage: ImageData, boundingBox: BoundingBox): Promise<RecognizedLine> {
    // Preprocess line for model
    const processed = this.preprocessForModel(lineImage);
    
    // Run inference
    const prediction = await this.modelLoader.predict(processed);
    
    // Decode prediction to text
    const { text, confidence } = this.decodeOutput(prediction);
    
    // Segment into words
    const words = this.segmentWords(text, boundingBox, confidence);

    return {
      text,
      words,
      confidence,
      boundingBox,
    };
  }

  /**
   * Preprocess image for model input
   */
  private preprocessForModel(imageData: ImageData): Float32Array {
    const targetHeight = 32;
    const targetWidth = 128;
    
    // Resize and normalize
    const resized = this.resizeImage(imageData, targetWidth, targetHeight);
    const normalized = new Float32Array(targetWidth * targetHeight);
    
    for (let i = 0; i < normalized.length; i++) {
      // Normalize to [-1, 1]
      normalized[i] = (resized.data[i * 4] / 255.0) * 2 - 1;
    }
    
    return normalized;
  }

  /**
   * Resize image to target dimensions
   */
  private resizeImage(imageData: ImageData, targetWidth: number, targetHeight: number): ImageData {
    const { width, height, data } = imageData;
    const output = new Uint8ClampedArray(targetWidth * targetHeight * 4);
    
    const xRatio = width / targetWidth;
    const yRatio = height / targetHeight;
    
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const srcX = Math.floor(x * xRatio);
        const srcY = Math.floor(y * yRatio);
        const srcIdx = (srcY * width + srcX) * 4;
        const dstIdx = (y * targetWidth + x) * 4;
        
        output[dstIdx] = data[srcIdx];
        output[dstIdx + 1] = data[srcIdx + 1];
        output[dstIdx + 2] = data[srcIdx + 2];
        output[dstIdx + 3] = 255;
      }
    }
    
    return new ImageData(output, targetWidth, targetHeight);
  }

  /**
   * Extract a region from image
   */
  private extractRegion(imageData: ImageData, box: BoundingBox): ImageData {
    const { width, data } = imageData;
    const output = new Uint8ClampedArray(box.width * box.height * 4);
    
    for (let y = 0; y < box.height; y++) {
      for (let x = 0; x < box.width; x++) {
        const srcIdx = ((box.y + y) * width + (box.x + x)) * 4;
        const dstIdx = (y * box.width + x) * 4;
        
        output[dstIdx] = data[srcIdx];
        output[dstIdx + 1] = data[srcIdx + 1];
        output[dstIdx + 2] = data[srcIdx + 2];
        output[dstIdx + 3] = data[srcIdx + 3];
      }
    }
    
    return new ImageData(output, box.width, box.height);
  }

  /**
   * Decode model output to text
   */
  private decodeOutput(prediction: Float32Array): { text: string; confidence: number } {
    // CTC decoding
    let text = '';
    let totalConfidence = 0;
    let prevChar = -1;
    let charCount = 0;
    
    const seqLength = prediction.length / this.vocabulary.length;
    
    for (let t = 0; t < seqLength; t++) {
      let maxProb = -Infinity;
      let maxIdx = 0;
      
      for (let c = 0; c < this.vocabulary.length; c++) {
        const prob = prediction[t * this.vocabulary.length + c];
        if (prob > maxProb) {
          maxProb = prob;
          maxIdx = c;
        }
      }
      
      if (maxIdx !== 0 && maxIdx !== prevChar) { // 0 is blank token
        text += this.vocabulary[maxIdx];
        totalConfidence += maxProb;
        charCount++;
      }
      
      prevChar = maxIdx;
    }
    
    const confidence = charCount > 0 ? totalConfidence / charCount : 0;
    return { text, confidence };
  }

  /**
   * Segment recognized text into words
   */
  private segmentWords(text: string, lineBBox: BoundingBox, lineConfidence: number): RecognizedWord[] {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordWidth = lineBBox.width / Math.max(words.length, 1);
    
    return words.map((word, index) => ({
      text: word,
      confidence: lineConfidence,
      boundingBox: {
        x: lineBBox.x + index * wordWidth,
        y: lineBBox.y,
        width: wordWidth,
        height: lineBBox.height,
      },
    }));
  }

  /**
   * Load character vocabulary
   */
  private async loadVocabulary(): Promise<string[]> {
    // Default vocabulary for handwriting recognition
    const chars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    return ['<blank>', ...chars.split('')];
  }

  /**
   * Check if OCR is ready
   */
  get ready(): boolean {
    return this.isReady;
  }

  /**
   * Update OCR options
   */
  setOptions(options: Partial<OCROptions>): void {
    this.options = { ...this.options, ...options };
  }
}
