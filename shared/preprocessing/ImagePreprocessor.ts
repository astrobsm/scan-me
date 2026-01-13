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

  constructor(options: Partial<PreprocessingOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Process an image through the full pipeline
   */
  async process(imageData: ImageData): Promise<ProcessedImage> {
    let processed = imageData;
    let skewAngle = 0;

    // Step 1: Convert to grayscale
    if (this.options.applyGrayscale) {
      processed = grayscale(processed);
    }

    // Step 2: Apply denoising
    if (this.options.applyDenoise) {
      processed = denoise(processed, this.options.denoiseStrength!);
    }

    // Step 3: Apply adaptive thresholding
    if (this.options.applyThreshold) {
      processed = threshold(processed, this.options.thresholdValue!);
    }

    // Step 4: Correct skew
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
