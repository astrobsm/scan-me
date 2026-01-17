/**
 * Main Image Preprocessor Class
 * Orchestrates the complete preprocessing pipeline
 */

import { grayscale } from './filters/grayscale';
import { threshold } from './filters/threshold';
import { denoise } from './filters/denoise';
import { correctSkew } from './filters/skewCorrection';

export interface PreprocessingOptions {
  applyGrayscale?: boolean;
  applyThreshold?: boolean;
  applyDenoise?: boolean;
  applySkewCorrection?: boolean;
  thresholdValue?: number;
  denoiseStrength?: number;
}

export interface ProcessedImage {
  data: ImageData;
  width: number;
  height: number;
  skewAngle?: number;
}

const defaultOptions: PreprocessingOptions = {
  applyGrayscale: true,
  applyThreshold: true,
  applyDenoise: true,
  applySkewCorrection: true,
  thresholdValue: 128,
  denoiseStrength: 1,
};

export class ImagePreprocessor {
  private options: PreprocessingOptions;
  private abortController: AbortController | null = null;

  constructor(options: Partial<PreprocessingOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Process an image through the full pipeline with optimization
   */
  async process(imageData: ImageData): Promise<ProcessedImage> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    let processed = imageData;
    let skewAngle = 0;

    try {
      // Check abort before each step
      if (signal.aborted) throw new Error('Processing aborted');

      // Step 1: Convert to grayscale (lightweight)
      if (this.options.applyGrayscale) {
        processed = grayscale(processed);
      }

      // Yield to main thread
      await new Promise(resolve => setTimeout(resolve, 0));
      if (signal.aborted) throw new Error('Processing aborted');

      // Step 2: Apply denoising (chunked processing)
      if (this.options.applyDenoise) {
        processed = await this.denoiseChunked(processed, this.options.denoiseStrength!, signal);
      }

      await new Promise(resolve => setTimeout(resolve, 0));
      if (signal.aborted) throw new Error('Processing aborted');

      // Step 3: Apply adaptive thresholding
      if (this.options.applyThreshold) {
        processed = threshold(processed, this.options.thresholdValue!);
      }

      await new Promise(resolve => setTimeout(resolve, 0));
      if (signal.aborted) throw new Error('Processing aborted');

      // Step 4: Correct skew (most expensive operation)
      if (this.options.applySkewCorrection) {
        const result = correctSkew(processed);
        processed = result.imageData;
        skewAngle = result.angle;
      }

      return {
        data: processed,
        width: processed.width,
        height: processed.height,
        skewAngle,
      };
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Chunked denoising to prevent blocking
   */
  private async denoiseChunked(
    imageData: ImageData,
    strength: number,
    signal: AbortSignal
  ): Promise<ImageData> {
    const chunkHeight = 100; // Process 100 rows at a time
    const { width, height } = imageData;
    const result = new ImageData(width, height);

    for (let y = 0; y < height; y += chunkHeight) {
      if (signal.aborted) return imageData;

      const endY = Math.min(y + chunkHeight, height);
      
      // Process chunk
      const chunk = new ImageData(
        width,
        endY - y
      );
      
      // Copy data to chunk
      for (let row = y; row < endY; row++) {
        const sourceOffset = row * width * 4;
        const destOffset = (row - y) * width * 4;
        for (let i = 0; i < width * 4; i++) {
          chunk.data[destOffset + i] = imageData.data[sourceOffset + i];
        }
      }

      // Apply denoise to chunk
      const processed = denoise(chunk, strength);

      // Copy back
      for (let row = 0; row < processed.height; row++) {
        const sourceOffset = row * width * 4;
        const destOffset = (y + row) * width * 4;
        for (let i = 0; i < width * 4; i++) {
          result.data[destOffset + i] = processed.data[sourceOffset + i];
        }
      }

      // Yield to main thread every few chunks
      if (y % 300 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    return result;
  }

  /**
   * Abort current processing
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Process from canvas element
   */
  async processFromCanvas(canvas: HTMLCanvasElement): Promise<ProcessedImage> {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return this.process(imageData);
  }

  /**
   * Update preprocessing options
   */
  setOptions(options: Partial<PreprocessingOptions>): void {
    this.options = { ...this.options, ...options };
  }
}
