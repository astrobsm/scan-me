/**
 * CHARLES-DOUGLAS SCAN APP
 * Advanced OCR Engine - Maximum Accuracy for Faint & Poor Handwriting
 * Multi-pass recognition with intelligent preprocessing and post-processing
 */

import Tesseract, { RecognizeResult } from 'tesseract.js';

export interface AdvancedOCRResult {
  text: string;
  confidence: number;
  rawResults: PassResult[];
  corrections: CorrectionInfo[];
  processingTime: number;
}

export interface PassResult {
  passName: string;
  text: string;
  confidence: number;
  preprocessingUsed: string[];
}

export interface CorrectionInfo {
  original: string;
  corrected: string;
  reason: string;
}

export interface AdvancedOCROptions {
  language: string;
  multiPass: boolean;
  aggressiveEnhancement: boolean;
  spellCheck: boolean;
  contextualCorrection: boolean;
  medicalMode: boolean;
  maxPasses: number;
}

const DEFAULT_OPTIONS: AdvancedOCROptions = {
  language: 'eng',
  multiPass: true,
  aggressiveEnhancement: true,
  spellCheck: true,
  contextualCorrection: true,
  medicalMode: false,
  maxPasses: 5,
};

// Common English words for spell checking
const COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'does', 'did',
  'name', 'date', 'patient', 'doctor', 'medical', 'health', 'prescription', 'diagnosis',
  'treatment', 'medication', 'dose', 'tablet', 'capsule', 'injection', 'once', 'twice',
  'daily', 'morning', 'evening', 'night', 'before', 'after', 'meals', 'water',
]);

// Medical terms for medical mode
const MEDICAL_TERMS = new Set([
  'mg', 'ml', 'mcg', 'kg', 'g', 'l', 'iu', 'bid', 'tid', 'qid', 'prn', 'stat',
  'po', 'iv', 'im', 'sc', 'sl', 'pr', 'od', 'os', 'ou', 'ac', 'pc', 'hs',
  'acetaminophen', 'ibuprofen', 'aspirin', 'amoxicillin', 'metformin', 'lisinopril',
  'atorvastatin', 'omeprazole', 'amlodipine', 'metoprolol', 'losartan', 'gabapentin',
  'hydrocodone', 'sertraline', 'fluoxetine', 'escitalopram', 'trazodone', 'alprazolam',
  'prednisone', 'levothyroxine', 'pantoprazole', 'furosemide', 'montelukast',
  'hypertension', 'diabetes', 'hyperlipidemia', 'hypothyroidism', 'anxiety', 'depression',
  'arthritis', 'asthma', 'copd', 'gerd', 'infection', 'inflammation', 'pain', 'fever',
]);

// Common OCR mistakes mapping
const OCR_CORRECTIONS: Record<string, string> = {
  '0': 'O', 'O': '0', '1': 'l', 'l': '1', 'I': '1', '|': 'l',
  '5': 'S', 'S': '5', '8': 'B', 'B': '8', '6': 'G', 'G': '6',
  '2': 'Z', 'Z': '2', '9': 'g', 'g': '9', 'rn': 'm', 'nn': 'm',
  'vv': 'w', 'cl': 'd', 'cI': 'd', 'li': 'h', 'Ii': 'h',
};

/**
 * Advanced OCR Engine with multi-pass recognition
 */
export class AdvancedOCR {
  private options: AdvancedOCROptions;
  private worker: Tesseract.Worker | null = null;
  private isInitialized = false;

  constructor(options: Partial<AdvancedOCROptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Initialize Tesseract worker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.worker = await Tesseract.createWorker(this.options.language, 1, {
      logger: () => {},
    });

    // Set optimal parameters for handwriting recognition
    await this.worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      tessedit_char_whitelist: '',
      preserve_interword_spaces: '1',
    });

    this.isInitialized = true;
  }

  /**
   * Main recognition method with multi-pass approach
   */
  async recognize(
    image: HTMLImageElement | HTMLCanvasElement | string,
    onProgress?: (progress: number, status: string) => void
  ): Promise<AdvancedOCRResult> {
    const startTime = performance.now();
    
    await this.initialize();
    
    // Convert image to canvas for preprocessing
    const canvas = await this.imageToCanvas(image);
    
    const passResults: PassResult[] = [];
    
    if (this.options.multiPass) {
      // Multi-pass recognition with different preprocessing
      const preprocessingConfigs = [
        { name: 'Original', config: {} },
        { name: 'High Contrast', config: { contrast: 2.0, brightness: 1.1 } },
        { name: 'Extreme Contrast', config: { contrast: 3.0, brightness: 1.2, threshold: true } },
        { name: 'Inverted', config: { invert: true, contrast: 1.5 } },
        { name: 'Sharpened', config: { sharpen: 2.0, contrast: 1.5 } },
        { name: 'Denoised', config: { denoise: 3, contrast: 1.8 } },
        { name: 'Adaptive Threshold', config: { adaptiveThreshold: true, blockSize: 15 } },
        { name: 'CLAHE Enhanced', config: { clahe: true, clipLimit: 3.0 } },
        { name: 'Morphological', config: { dilate: 1, contrast: 2.0 } },
        { name: 'Ultra Enhancement', config: { contrast: 4.0, sharpen: 3.0, denoise: 2, threshold: true } },
      ];

      const maxPasses = Math.min(this.options.maxPasses, preprocessingConfigs.length);
      
      for (let i = 0; i < maxPasses; i++) {
        const { name, config } = preprocessingConfigs[i];
        onProgress?.(0.1 + (i / maxPasses) * 0.6, `Pass ${i + 1}/${maxPasses}: ${name}`);
        
        try {
          const preprocessed = await this.preprocess(canvas, config);
          const result = await this.recognizeSingle(preprocessed);
          
          passResults.push({
            passName: name,
            text: result.data.text.trim(),
            confidence: result.data.confidence / 100,
            preprocessingUsed: Object.keys(config),
          });
        } catch (e) {
          console.warn(`Pass ${name} failed:`, e);
        }
      }
    } else {
      // Single pass with aggressive enhancement
      onProgress?.(0.3, 'Processing with aggressive enhancement...');
      const enhanced = await this.preprocess(canvas, {
        contrast: 2.5,
        sharpen: 2.0,
        denoise: 2,
        adaptiveThreshold: true,
      });
      const result = await this.recognizeSingle(enhanced);
      passResults.push({
        passName: 'Enhanced',
        text: result.data.text.trim(),
        confidence: result.data.confidence / 100,
        preprocessingUsed: ['contrast', 'sharpen', 'denoise', 'adaptiveThreshold'],
      });
    }

    onProgress?.(0.75, 'Combining results...');
    
    // Combine results from all passes
    const combinedText = this.combineResults(passResults);
    
    onProgress?.(0.85, 'Applying corrections...');
    
    // Apply post-processing corrections
    const { text: correctedText, corrections } = this.postProcess(combinedText);
    
    // Calculate final confidence
    const avgConfidence = passResults.length > 0
      ? passResults.reduce((sum, r) => sum + r.confidence, 0) / passResults.length
      : 0;
    
    // Boost confidence based on corrections and validation
    const finalConfidence = this.calculateFinalConfidence(correctedText, avgConfidence, corrections);
    
    onProgress?.(1.0, 'Complete!');
    
    return {
      text: correctedText,
      confidence: finalConfidence,
      rawResults: passResults,
      corrections,
      processingTime: performance.now() - startTime,
    };
  }

  /**
   * Convert various image sources to canvas
   */
  private async imageToCanvas(
    source: HTMLImageElement | HTMLCanvasElement | string
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    if (typeof source === 'string') {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        };
        img.onerror = reject;
        img.src = source;
      });
    } else if (source instanceof HTMLImageElement) {
      canvas.width = source.naturalWidth || source.width;
      canvas.height = source.naturalHeight || source.height;
      ctx.drawImage(source, 0, 0);
    } else {
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.drawImage(source, 0, 0);
    }

    return canvas;
  }

  /**
   * Advanced preprocessing with multiple enhancement options
   */
  private async preprocess(
    canvas: HTMLCanvasElement,
    config: Record<string, any>
  ): Promise<HTMLCanvasElement> {
    const result = document.createElement('canvas');
    result.width = canvas.width;
    result.height = canvas.height;
    const ctx = result.getContext('2d')!;
    
    // Get image data
    const srcCtx = canvas.getContext('2d')!;
    let imageData = srcCtx.getImageData(0, 0, canvas.width, canvas.height);
    let data: Uint8ClampedArray = new Uint8ClampedArray(imageData.data);

    // Convert to grayscale first
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    // Apply contrast and brightness
    if (config.contrast || config.brightness) {
      const contrast = config.contrast || 1;
      const brightness = config.brightness || 1;
      
      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          let value = data[i + c];
          // Apply contrast
          value = ((value / 255 - 0.5) * contrast + 0.5) * 255;
          // Apply brightness
          value *= brightness;
          data[i + c] = Math.max(0, Math.min(255, Math.round(value)));
        }
      }
    }

    // Apply denoising (median filter)
    if (config.denoise) {
      const filtered = this.medianFilter(data, canvas.width, canvas.height, config.denoise);
      data = new Uint8ClampedArray(filtered);
    }

    // Apply sharpening
    if (config.sharpen) {
      const sharpened = this.sharpenFilter(data, canvas.width, canvas.height, config.sharpen);
      data = new Uint8ClampedArray(sharpened);
    }

    // Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    if (config.clahe) {
      const claheResult = this.applyCLAHE(data, canvas.width, canvas.height, config.clipLimit || 2.0);
      data = new Uint8ClampedArray(claheResult);
    }

    // Apply adaptive threshold
    if (config.adaptiveThreshold) {
      const thresholded = this.adaptiveThreshold(data, canvas.width, canvas.height, config.blockSize || 11);
      data = new Uint8ClampedArray(thresholded);
    }

    // Apply simple threshold
    if (config.threshold && !config.adaptiveThreshold) {
      const threshold = this.otsuThreshold(data);
      for (let i = 0; i < data.length; i += 4) {
        const value = data[i] < threshold ? 0 : 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
      }
    }

    // Apply morphological dilation
    if (config.dilate) {
      const dilated = this.dilate(data, canvas.width, canvas.height, config.dilate);
      data = new Uint8ClampedArray(dilated);
    }

    // Invert colors
    if (config.invert) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
    }

    // Create final ImageData - copy to new ArrayBuffer to ensure proper typing
    const finalBuffer = new ArrayBuffer(data.length);
    const finalData = new Uint8ClampedArray(finalBuffer);
    finalData.set(data);
    const finalImageData = new ImageData(finalData, canvas.width, canvas.height);
    ctx.putImageData(finalImageData, 0, 0);
    return result;
  }

  /**
   * Median filter for noise reduction
   */
  private medianFilter(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data);
    
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const neighbors: number[] = [];
        
        for (let ky = -radius; ky <= radius; ky++) {
          for (let kx = -radius; kx <= radius; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            neighbors.push(data[idx]);
          }
        }
        
        neighbors.sort((a, b) => a - b);
        const median = neighbors[Math.floor(neighbors.length / 2)];
        const idx = (y * width + x) * 4;
        output[idx] = median;
        output[idx + 1] = median;
        output[idx + 2] = median;
      }
    }
    
    return output;
  }

  /**
   * Sharpening filter
   */
  private sharpenFilter(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    strength: number
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data);
    
    // Unsharp mask kernel scaled by strength
    const center = 1 + 4 * strength;
    const kernel = [
      0, -strength, 0,
      -strength, center, -strength,
      0, -strength, 0,
    ];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const kIdx = (ky + 1) * 3 + (kx + 1);
            sum += data[idx] * kernel[kIdx];
          }
        }
        
        const idx = (y * width + x) * 4;
        const value = Math.max(0, Math.min(255, Math.round(sum)));
        output[idx] = value;
        output[idx + 1] = value;
        output[idx + 2] = value;
      }
    }
    
    return output;
  }

  /**
   * CLAHE - Contrast Limited Adaptive Histogram Equalization
   */
  private applyCLAHE(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    clipLimit: number
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data);
    const tileSize = 64;
    const tilesX = Math.ceil(width / tileSize);
    const tilesY = Math.ceil(height / tileSize);
    
    // Process each tile
    for (let ty = 0; ty < tilesY; ty++) {
      for (let tx = 0; tx < tilesX; tx++) {
        const startX = tx * tileSize;
        const startY = ty * tileSize;
        const endX = Math.min(startX + tileSize, width);
        const endY = Math.min(startY + tileSize, height);
        
        // Build histogram for tile
        const histogram = new Array(256).fill(0);
        let pixelCount = 0;
        
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            histogram[data[idx]]++;
            pixelCount++;
          }
        }
        
        // Clip histogram
        const clipValue = Math.floor(clipLimit * pixelCount / 256);
        let excess = 0;
        
        for (let i = 0; i < 256; i++) {
          if (histogram[i] > clipValue) {
            excess += histogram[i] - clipValue;
            histogram[i] = clipValue;
          }
        }
        
        // Redistribute excess
        const redistribute = Math.floor(excess / 256);
        for (let i = 0; i < 256; i++) {
          histogram[i] += redistribute;
        }
        
        // Build CDF
        const cdf = new Array(256);
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
          cdf[i] = cdf[i - 1] + histogram[i];
        }
        
        // Normalize CDF
        const cdfMin = cdf.find(v => v > 0) || 0;
        const scale = 255 / (pixelCount - cdfMin);
        
        // Apply equalization
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            const value = Math.round((cdf[data[idx]] - cdfMin) * scale);
            output[idx] = Math.max(0, Math.min(255, value));
            output[idx + 1] = output[idx];
            output[idx + 2] = output[idx];
          }
        }
      }
    }
    
    return output;
  }

  /**
   * Adaptive thresholding
   */
  private adaptiveThreshold(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    blockSize: number
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data);
    const halfBlock = Math.floor(blockSize / 2);
    const C = 5; // Constant subtracted from mean
    
    // Compute integral image for fast mean calculation
    const integral = new Float64Array((width + 1) * (height + 1));
    
    for (let y = 0; y < height; y++) {
      let rowSum = 0;
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        rowSum += data[idx];
        integral[(y + 1) * (width + 1) + (x + 1)] = 
          rowSum + integral[y * (width + 1) + (x + 1)];
      }
    }
    
    // Apply adaptive threshold using integral image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const x1 = Math.max(0, x - halfBlock);
        const y1 = Math.max(0, y - halfBlock);
        const x2 = Math.min(width - 1, x + halfBlock);
        const y2 = Math.min(height - 1, y + halfBlock);
        
        const count = (x2 - x1 + 1) * (y2 - y1 + 1);
        
        const sum = integral[(y2 + 1) * (width + 1) + (x2 + 1)]
          - integral[(y2 + 1) * (width + 1) + x1]
          - integral[y1 * (width + 1) + (x2 + 1)]
          + integral[y1 * (width + 1) + x1];
        
        const mean = sum / count;
        const idx = (y * width + x) * 4;
        const value = data[idx] < (mean - C) ? 0 : 255;
        output[idx] = value;
        output[idx + 1] = value;
        output[idx + 2] = value;
      }
    }
    
    return output;
  }

  /**
   * Calculate Otsu's threshold
   */
  private otsuThreshold(data: Uint8ClampedArray): number {
    const histogram = new Array(256).fill(0);
    const totalPixels = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++;
    }
    
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }
    
    let sumB = 0;
    let wB = 0;
    let maxVariance = 0;
    let threshold = 128;
    
    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;
      
      const wF = totalPixels - wB;
      if (wF === 0) break;
      
      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      
      const variance = wB * wF * (mB - mF) * (mB - mF);
      
      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }
    
    return threshold;
  }

  /**
   * Morphological dilation
   */
  private dilate(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(data);
    
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        let maxVal = 0;
        
        for (let ky = -radius; ky <= radius; ky++) {
          for (let kx = -radius; kx <= radius; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            maxVal = Math.max(maxVal, data[idx]);
          }
        }
        
        const idx = (y * width + x) * 4;
        output[idx] = maxVal;
        output[idx + 1] = maxVal;
        output[idx + 2] = maxVal;
      }
    }
    
    return output;
  }

  /**
   * Perform single OCR recognition
   */
  private async recognizeSingle(canvas: HTMLCanvasElement): Promise<RecognizeResult> {
    if (!this.worker) {
      throw new Error('Worker not initialized');
    }
    
    return this.worker.recognize(canvas);
  }

  /**
   * Combine results from multiple passes using voting
   */
  private combineResults(results: PassResult[]): string {
    if (results.length === 0) return '';
    if (results.length === 1) return results[0].text;
    
    // Sort by confidence
    const sortedResults = [...results].sort((a, b) => b.confidence - a.confidence);
    
    // Use highest confidence as base
    let baseText = sortedResults[0].text;
    
    // Build word frequency map from all results
    const wordFrequency = new Map<string, { count: number; confidence: number }>();
    
    for (const result of results) {
      const words = result.text.split(/\s+/).filter(w => w.length > 0);
      for (const word of words) {
        const normalized = word.toLowerCase();
        const existing = wordFrequency.get(normalized);
        if (existing) {
          existing.count++;
          existing.confidence = Math.max(existing.confidence, result.confidence);
        } else {
          wordFrequency.set(normalized, { count: 1, confidence: result.confidence });
        }
      }
    }
    
    // Replace words in base text with most frequent/confident versions
    const baseWords = baseText.split(/(\s+)/);
    const enhancedWords = baseWords.map(word => {
      if (!word.trim()) return word;
      
      const normalized = word.toLowerCase();
      const freq = wordFrequency.get(normalized);
      
      // If word appears in majority of results with high confidence, keep it
      if (freq && freq.count >= results.length / 2) {
        return word;
      }
      
      // Find similar words that appear more frequently
      let bestMatch = word;
      let bestScore = 0;
      
      for (const [candidate, data] of wordFrequency) {
        if (data.count > bestScore && this.levenshtein(normalized, candidate) <= 2) {
          bestScore = data.count;
          bestMatch = candidate;
        }
      }
      
      // Preserve original case
      if (bestMatch !== normalized && bestMatch !== word.toLowerCase()) {
        return this.matchCase(bestMatch, word);
      }
      
      return word;
    });
    
    return enhancedWords.join('');
  }

  /**
   * Post-process text for corrections
   */
  private postProcess(text: string): { text: string; corrections: CorrectionInfo[] } {
    const corrections: CorrectionInfo[] = [];
    let result = text;
    
    // Apply OCR-specific corrections
    result = this.fixOCRErrors(result, corrections);
    
    // Apply spell checking if enabled
    if (this.options.spellCheck) {
      result = this.spellCheck(result, corrections);
    }
    
    // Apply contextual corrections
    if (this.options.contextualCorrection) {
      result = this.contextualCorrect(result, corrections);
    }
    
    // Clean up formatting
    result = this.cleanFormatting(result);
    
    return { text: result, corrections };
  }

  /**
   * Fix common OCR errors
   */
  private fixOCRErrors(text: string, corrections: CorrectionInfo[]): string {
    let result = text;
    
    // Fix common character substitutions in words
    const words = result.split(/(\s+)/);
    const fixedWords = words.map(word => {
      if (!word.trim()) return word;
      
      let fixed = word;
      
      // Fix 'rn' -> 'm' when it makes a valid word
      if (fixed.includes('rn')) {
        const withM = fixed.replace(/rn/g, 'm');
        if (this.isLikelyWord(withM) && !this.isLikelyWord(fixed)) {
          corrections.push({ original: word, corrected: withM, reason: 'OCR: rn→m' });
          fixed = withM;
        }
      }
      
      // Fix '1' -> 'l' or 'I' in words
      if (/\d/.test(fixed) && /[a-zA-Z]/.test(fixed)) {
        let numFixed = fixed
          .replace(/1(?=[a-zA-Z])/g, 'l')
          .replace(/(?<=[a-zA-Z])1/g, 'l')
          .replace(/0(?=[a-zA-Z])/g, 'o')
          .replace(/(?<=[a-zA-Z])0/g, 'o');
        
        if (numFixed !== fixed && this.isLikelyWord(numFixed)) {
          corrections.push({ original: word, corrected: numFixed, reason: 'OCR: number→letter' });
          fixed = numFixed;
        }
      }
      
      return fixed;
    });
    
    return fixedWords.join('');
  }

  /**
   * Basic spell checking
   */
  private spellCheck(text: string, corrections: CorrectionInfo[]): string {
    const words = text.split(/(\s+)/);
    const dictionary = this.options.medicalMode 
      ? new Set([...COMMON_WORDS, ...MEDICAL_TERMS])
      : COMMON_WORDS;
    
    const checked = words.map(word => {
      if (!word.trim() || word.length < 3) return word;
      
      const lower = word.toLowerCase().replace(/[^a-z]/g, '');
      if (!lower || dictionary.has(lower)) return word;
      
      // Find closest dictionary word
      let bestMatch = word;
      let bestDistance = 3; // Max edit distance
      
      for (const dictWord of dictionary) {
        if (Math.abs(dictWord.length - lower.length) > 2) continue;
        
        const distance = this.levenshtein(lower, dictWord);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = this.matchCase(dictWord, word);
        }
      }
      
      if (bestMatch !== word) {
        corrections.push({ original: word, corrected: bestMatch, reason: 'Spell check' });
        return bestMatch;
      }
      
      return word;
    });
    
    return checked.join('');
  }

  /**
   * Contextual corrections
   */
  private contextualCorrect(text: string, corrections: CorrectionInfo[]): string {
    let result = text;
    
    // Fix common word pairs/phrases
    const contextualFixes = [
      [/\bthe the\b/gi, 'the'],
      [/\ban an\b/gi, 'an'],
      [/\ba a\b/gi, 'a'],
      [/\bof of\b/gi, 'of'],
      [/\bto to\b/gi, 'to'],
      [/\band and\b/gi, 'and'],
      [/\bI'm\b/g, "I'm"],
      [/\bl'm\b/g, "I'm"],
      [/\b1'm\b/g, "I'm"],
      [/\bdon 't\b/gi, "don't"],
      [/\bcan 't\b/gi, "can't"],
      [/\bwon 't\b/gi, "won't"],
    ];
    
    for (const [pattern, replacement] of contextualFixes) {
      const original = result;
      result = result.replace(pattern as RegExp, replacement as string);
      if (result !== original) {
        corrections.push({ 
          original: String(pattern), 
          corrected: replacement as string, 
          reason: 'Contextual fix' 
        });
      }
    }
    
    return result;
  }

  /**
   * Clean up formatting issues
   */
  private cleanFormatting(text: string): string {
    return text
      // Fix multiple spaces
      .replace(/ {2,}/g, ' ')
      // Fix space before punctuation
      .replace(/ ([.,;:!?])/g, '$1')
      // Fix missing space after punctuation
      .replace(/([.,;:!?])([A-Za-z])/g, '$1 $2')
      // Fix multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim lines
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .trim();
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix: number[][] = [];
    
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    return matrix[b.length][a.length];
  }

  /**
   * Check if a word is likely valid
   */
  private isLikelyWord(word: string): boolean {
    const lower = word.toLowerCase();
    
    // Check dictionary
    if (COMMON_WORDS.has(lower) || MEDICAL_TERMS.has(lower)) {
      return true;
    }
    
    // Check for valid letter patterns (consonant-vowel sequences)
    const hasVowels = /[aeiou]/i.test(word);
    const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/i.test(word);
    
    return hasVowels && hasConsonants;
  }

  /**
   * Match the case of a replacement to the original
   */
  private matchCase(replacement: string, original: string): string {
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
    }
    return replacement.toLowerCase();
  }

  /**
   * Calculate final confidence score
   */
  private calculateFinalConfidence(
    text: string,
    rawConfidence: number,
    corrections: CorrectionInfo[]
  ): number {
    let confidence = rawConfidence;
    
    // Boost confidence if we made successful corrections
    const correctionBoost = Math.min(corrections.length * 0.02, 0.15);
    confidence += correctionBoost;
    
    // Boost based on valid words ratio
    const words = text.split(/\s+/).filter(w => w.length > 2);
    const validWords = words.filter(w => this.isLikelyWord(w));
    const validRatio = words.length > 0 ? validWords.length / words.length : 0;
    confidence = confidence * 0.7 + validRatio * 0.3;
    
    // Boost if text has good structure
    if (text.length > 50 && /[.!?]/.test(text)) {
      confidence += 0.05;
    }
    
    // Cap at realistic maximum
    return Math.min(Math.max(confidence, 0), 0.99);
  }

  /**
   * Dispose of resources
   */
  async dispose(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
    this.isInitialized = false;
  }
}

export default AdvancedOCR;
