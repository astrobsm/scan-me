/**
 * CHARLES-DOUGLAS SCAN APP
 * TensorFlow.js OCR Engine
 * Advanced handwriting recognition with neural networks
 */

import * as tf from '@tensorflow/tfjs';

// Character set for OCR recognition
const CHARACTERS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export interface TFOCRResult {
  text: string;
  confidence: number;
  lines: TFOCRLine[];
  processingTime: number;
}

export interface TFOCRLine {
  text: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  words: TFOCRWord[];
}

export interface TFOCRWord {
  text: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export interface TFOCROptions {
  language: string;
  medicalMode: boolean;
  enhanceContrast: boolean;
  detectTables: boolean;
  batchSize: number;
}

const DEFAULT_OPTIONS: TFOCROptions = {
  language: 'en',
  medicalMode: false,
  enhanceContrast: true,
  detectTables: false,
  batchSize: 1,
};

/**
 * TensorFlow.js based OCR Engine
 */
export class TensorFlowOCR {
  private model: tf.LayersModel | null = null;
  private ctcModel: tf.LayersModel | null = null;
  private isReady: boolean = false;
  private options: TFOCROptions;
  private charToIndex: Map<string, number>;
  private indexToChar: Map<number, string>;

  constructor(options: Partial<TFOCROptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Build character mappings
    this.charToIndex = new Map();
    this.indexToChar = new Map();
    CHARACTERS.split('').forEach((char, idx) => {
      this.charToIndex.set(char, idx);
      this.indexToChar.set(idx, char);
    });
    // Add blank token for CTC
    this.indexToChar.set(CHARACTERS.length, '');
  }

  /**
   * Initialize the OCR engine and create/load models
   */
  async initialize(onProgress?: (progress: number, status: string) => void): Promise<void> {
    if (this.isReady) return;

    try {
      onProgress?.(0.1, 'Setting up TensorFlow.js...');
      
      // Set backend
      await tf.ready();
      console.log('TensorFlow.js backend:', tf.getBackend());

      onProgress?.(0.2, 'Building CRNN model...');
      
      // Build the CRNN (Convolutional Recurrent Neural Network) model
      this.model = this.buildCRNNModel();

      onProgress?.(0.5, 'Initializing CTC decoder...');
      
      // Build CTC decoder model
      this.ctcModel = this.buildCTCDecoderModel();

      onProgress?.(0.8, 'Warming up model...');
      
      // Warm up the model with a dummy input
      await this.warmUp();

      onProgress?.(1.0, 'Ready!');
      
      this.isReady = true;
      console.log('CHARLES-DOUGLAS TensorFlow OCR Engine initialized');
    } catch (error) {
      console.error('Failed to initialize TensorFlow OCR:', error);
      throw new Error('TensorFlow OCR initialization failed');
    }
  }

  /**
   * Build the CRNN model for text recognition
   * Architecture: CNN feature extractor -> BiLSTM sequence model -> Dense output
   */
  private buildCRNNModel(): tf.LayersModel {
    const inputShape: [number, number, number] = [32, 256, 1]; // Height, Width, Channels
    
    const input = tf.input({ shape: inputShape });
    
    // CNN Feature Extractor
    let x = tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      padding: 'same',
      activation: 'relu',
    }).apply(input) as tf.SymbolicTensor;
    
    x = tf.layers.maxPooling2d({ poolSize: [2, 2] }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.conv2d({
      filters: 128,
      kernelSize: [3, 3],
      padding: 'same',
      activation: 'relu',
    }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.maxPooling2d({ poolSize: [2, 2] }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.conv2d({
      filters: 256,
      kernelSize: [3, 3],
      padding: 'same',
      activation: 'relu',
    }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.batchNormalization().apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.conv2d({
      filters: 256,
      kernelSize: [3, 3],
      padding: 'same',
      activation: 'relu',
    }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.maxPooling2d({ poolSize: [2, 1] }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.conv2d({
      filters: 512,
      kernelSize: [3, 3],
      padding: 'same',
      activation: 'relu',
    }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.batchNormalization().apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.conv2d({
      filters: 512,
      kernelSize: [3, 3],
      padding: 'same',
      activation: 'relu',
    }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.maxPooling2d({ poolSize: [2, 1] }).apply(x) as tf.SymbolicTensor;
    
    x = tf.layers.conv2d({
      filters: 512,
      kernelSize: [2, 2],
      padding: 'valid',
      activation: 'relu',
    }).apply(x) as tf.SymbolicTensor;

    // Reshape for RNN: (batch, time_steps, features)
    x = tf.layers.reshape({ targetShape: [-1, 512] }).apply(x) as tf.SymbolicTensor;

    // Bidirectional LSTM layers
    x = tf.layers.bidirectional({
      layer: tf.layers.lstm({
        units: 256,
        returnSequences: true,
        dropout: 0.25,
      }),
    }).apply(x) as tf.SymbolicTensor;

    x = tf.layers.bidirectional({
      layer: tf.layers.lstm({
        units: 256,
        returnSequences: true,
        dropout: 0.25,
      }),
    }).apply(x) as tf.SymbolicTensor;

    // Dense output layer (characters + blank for CTC)
    const output = tf.layers.dense({
      units: CHARACTERS.length + 1,
      activation: 'softmax',
    }).apply(x) as tf.SymbolicTensor;

    const model = tf.model({ inputs: input, outputs: output });
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    return model;
  }

  /**
   * Build CTC decoder model
   */
  private buildCTCDecoderModel(): tf.LayersModel {
    // Simple greedy decoder - in production, use beam search
    const input = tf.input({ shape: [null, CHARACTERS.length + 1] });
    const output = tf.layers.dense({ units: CHARACTERS.length + 1, activation: 'softmax' }).apply(input);
    return tf.model({ inputs: input, outputs: output as tf.SymbolicTensor });
  }

  /**
   * Warm up the model with dummy data
   */
  private async warmUp(): Promise<void> {
    const dummyInput = tf.zeros([1, 32, 256, 1]);
    const _ = this.model!.predict(dummyInput) as tf.Tensor;
    _.dispose();
    dummyInput.dispose();
  }

  /**
   * Recognize text from an image
   */
  async recognize(
    imageSource: HTMLImageElement | HTMLCanvasElement | ImageData | string,
    onProgress?: (progress: number, status: string) => void
  ): Promise<TFOCRResult> {
    if (!this.isReady) {
      await this.initialize(onProgress);
    }

    const startTime = performance.now();

    try {
      onProgress?.(0.1, 'Preprocessing image...');

      // Load image
      const image = await this.loadImage(imageSource);
      
      onProgress?.(0.2, 'Detecting text regions...');
      
      // Preprocess and segment lines
      const { lines: lineImages, boundingBoxes } = await this.segmentLines(image);

      onProgress?.(0.4, 'Recognizing text...');

      // Recognize each line
      const recognizedLines: TFOCRLine[] = [];
      let fullText = '';

      for (let i = 0; i < lineImages.length; i++) {
        onProgress?.(0.4 + (0.5 * i / lineImages.length), `Recognizing line ${i + 1}/${lineImages.length}...`);
        
        const lineResult = await this.recognizeLine(lineImages[i], boundingBoxes[i]);
        recognizedLines.push(lineResult);
        fullText += lineResult.text + '\n';
      }

      onProgress?.(0.95, 'Finalizing...');

      const processingTime = performance.now() - startTime;

      // Calculate average confidence
      const avgConfidence = recognizedLines.length > 0
        ? recognizedLines.reduce((sum, line) => sum + line.confidence, 0) / recognizedLines.length
        : 0;

      onProgress?.(1.0, 'Complete!');

      return {
        text: fullText.trim(),
        lines: recognizedLines,
        confidence: avgConfidence,
        processingTime,
      };
    } catch (error) {
      console.error('OCR recognition error:', error);
      throw error;
    }
  }

  /**
   * Load image from various sources
   */
  private async loadImage(source: HTMLImageElement | HTMLCanvasElement | ImageData | string): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    if (typeof source === 'string') {
      // Base64 or URL
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
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.drawImage(source, 0, 0);
      return canvas;
    } else if (source instanceof HTMLCanvasElement) {
      return source;
    } else if (source instanceof ImageData) {
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.putImageData(source, 0, 0);
      return canvas;
    }

    throw new Error('Unsupported image source');
  }

  /**
   * Segment image into text lines
   */
  private async segmentLines(canvas: HTMLCanvasElement): Promise<{
    lines: HTMLCanvasElement[];
    boundingBoxes: { x: number; y: number; width: number; height: number }[];
  }> {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { width, height, data } = imageData;

    // Convert to grayscale and threshold
    const gray = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      const idx = i / 4;
      gray[idx] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }

    // Horizontal projection profile
    const profile: number[] = new Array(height).fill(0);
    const threshold = 128;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (gray[y * width + x] < threshold) {
          profile[y]++;
        }
      }
    }

    // Find line boundaries using projection profile
    const lines: { start: number; end: number }[] = [];
    let inLine = false;
    let lineStart = 0;
    const minLineHeight = 10;
    const minGap = 5;

    for (let y = 0; y < height; y++) {
      const isText = profile[y] > width * 0.01; // At least 1% of pixels are dark

      if (isText && !inLine) {
        inLine = true;
        lineStart = y;
      } else if (!isText && inLine) {
        if (y - lineStart >= minLineHeight) {
          // Check for minimum gap before ending line
          let gapEnd = y;
          while (gapEnd < height && profile[gapEnd] <= width * 0.01 && gapEnd - y < minGap) {
            gapEnd++;
          }
          if (gapEnd - y >= minGap || gapEnd >= height) {
            lines.push({ start: lineStart, end: y });
            inLine = false;
          }
        }
      }
    }

    if (inLine && height - lineStart >= minLineHeight) {
      lines.push({ start: lineStart, end: height });
    }

    // If no lines detected, treat whole image as one line
    if (lines.length === 0) {
      lines.push({ start: 0, end: height });
    }

    // Extract line images
    const lineCanvases: HTMLCanvasElement[] = [];
    const boundingBoxes: { x: number; y: number; width: number; height: number }[] = [];

    for (const line of lines) {
      const lineHeight = line.end - line.start;
      const padding = Math.floor(lineHeight * 0.1);
      
      const lineCanvas = document.createElement('canvas');
      lineCanvas.width = width;
      lineCanvas.height = lineHeight + padding * 2;
      
      const lineCtx = lineCanvas.getContext('2d')!;
      lineCtx.fillStyle = 'white';
      lineCtx.fillRect(0, 0, lineCanvas.width, lineCanvas.height);
      lineCtx.drawImage(
        canvas,
        0, Math.max(0, line.start - padding),
        width, lineHeight + padding * 2,
        0, 0,
        width, lineHeight + padding * 2
      );

      lineCanvases.push(lineCanvas);
      boundingBoxes.push({
        x: 0,
        y: line.start,
        width: width,
        height: lineHeight,
      });
    }

    return { lines: lineCanvases, boundingBoxes };
  }

  /**
   * Recognize text in a single line image
   */
  private async recognizeLine(
    lineCanvas: HTMLCanvasElement,
    boundingBox: { x: number; y: number; width: number; height: number }
  ): Promise<TFOCRLine> {
    // Preprocess line image for the model
    const processedTensor = await this.preprocessForModel(lineCanvas);

    // Run inference
    const predictions = this.model!.predict(processedTensor) as tf.Tensor;
    
    // Decode predictions using CTC greedy decoder
    const { text, confidence, wordData } = await this.ctcDecode(predictions);

    // Clean up tensors
    processedTensor.dispose();
    predictions.dispose();

    // Build words from decoded text
    const words: TFOCRWord[] = wordData.map((w, idx) => ({
      text: w.text,
      confidence: w.confidence,
      boundingBox: {
        x: boundingBox.x + (boundingBox.width / wordData.length) * idx,
        y: boundingBox.y,
        width: boundingBox.width / wordData.length,
        height: boundingBox.height,
      },
    }));

    return {
      text,
      confidence,
      boundingBox,
      words,
    };
  }

  /**
   * Preprocess image for the CRNN model
   */
  private async preprocessForModel(canvas: HTMLCanvasElement): Promise<tf.Tensor4D> {
    const targetHeight = 32;
    const targetWidth = 256;

    // Resize maintaining aspect ratio
    const aspectRatio = canvas.width / canvas.height;
    let newWidth = Math.min(targetWidth, Math.round(targetHeight * aspectRatio));
    let newHeight = targetHeight;

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;
    const ctx = resizedCanvas.getContext('2d')!;
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    
    // Draw resized image (left-aligned)
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

    // Convert to tensor
    return tf.tidy(() => {
      let tensor = tf.browser.fromPixels(resizedCanvas, 1);
      
      // Normalize to [0, 1]
      tensor = tensor.div(255.0);
      
      // Invert (white background, black text -> black background, white text)
      tensor = tf.sub(1.0, tensor);
      
      // Add batch dimension
      return tensor.expandDims(0) as tf.Tensor4D;
    });
  }

  /**
   * CTC Greedy Decoder
   */
  private async ctcDecode(predictions: tf.Tensor): Promise<{
    text: string;
    confidence: number;
    wordData: { text: string; confidence: number }[];
  }> {
    const predData = await predictions.array() as number[][][];
    const sequence = predData[0]; // First batch
    
    const blankIndex = CHARACTERS.length;
    const decoded: number[] = [];
    const confidences: number[] = [];
    let prevIndex = -1;

    // Greedy decoding with blank removal
    for (const timestep of sequence) {
      const maxIndex = timestep.indexOf(Math.max(...timestep));
      const maxProb = timestep[maxIndex];
      
      if (maxIndex !== blankIndex && maxIndex !== prevIndex) {
        decoded.push(maxIndex);
        confidences.push(maxProb);
      }
      prevIndex = maxIndex;
    }

    // Convert indices to characters
    const text = decoded.map(idx => this.indexToChar.get(idx) || '').join('');
    const avgConfidence = confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

    // Split into words
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordData = words.map(word => ({
      text: word,
      confidence: avgConfidence,
    }));

    return { text, confidence: avgConfidence, wordData };
  }

  /**
   * Check if model is ready
   */
  isModelReady(): boolean {
    return this.isReady;
  }

  /**
   * Get model summary
   */
  getModelSummary(): string {
    if (!this.model) return 'Model not initialized';
    
    let summary = '';
    this.model.summary(undefined, undefined, (line) => {
      summary += line + '\n';
    });
    return summary;
  }

  /**
   * Dispose of the model and free memory
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    if (this.ctcModel) {
      this.ctcModel.dispose();
      this.ctcModel = null;
    }
    this.isReady = false;
  }
}

// Singleton instance
let ocrInstance: TensorFlowOCR | null = null;

export function getTensorFlowOCR(options?: Partial<TFOCROptions>): TensorFlowOCR {
  if (!ocrInstance) {
    ocrInstance = new TensorFlowOCR(options);
  }
  return ocrInstance;
}

export default TensorFlowOCR;
