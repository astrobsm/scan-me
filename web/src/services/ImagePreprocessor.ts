/**
 * CHARLES-DOUGLAS SCAN APP
 * Advanced Image Preprocessing for OCR
 */

export interface PreprocessingOptions {
  grayscale: boolean;
  denoise: boolean;
  threshold: 'none' | 'binary' | 'adaptive' | 'otsu';
  deskew: boolean;
  removeBackground: boolean;
  enhanceContrast: boolean;
  sharpen: boolean;
  invert: boolean;
  targetDPI: number;
}

const DEFAULT_OPTIONS: PreprocessingOptions = {
  grayscale: true,
  denoise: true,
  threshold: 'adaptive',
  deskew: true,
  removeBackground: true,
  enhanceContrast: true,
  sharpen: true,
  invert: false,
  targetDPI: 300,
};

export class ImagePreprocessor {
  private options: PreprocessingOptions;

  constructor(options: Partial<PreprocessingOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Preprocess image for optimal OCR results
   */
  async preprocess(
    source: HTMLImageElement | HTMLCanvasElement | ImageData | string,
    onProgress?: (progress: number, status: string) => void
  ): Promise<HTMLCanvasElement> {
    onProgress?.(0.1, 'Loading image...');
    let canvas = await this.loadAsCanvas(source);
    
    onProgress?.(0.2, 'Converting to grayscale...');
    if (this.options.grayscale) {
      canvas = this.toGrayscale(canvas);
    }

    onProgress?.(0.3, 'Removing noise...');
    if (this.options.denoise) {
      canvas = this.denoise(canvas);
    }

    onProgress?.(0.4, 'Enhancing contrast...');
    if (this.options.enhanceContrast) {
      canvas = this.enhanceContrast(canvas);
    }

    onProgress?.(0.5, 'Removing background...');
    if (this.options.removeBackground) {
      canvas = this.removeBackground(canvas);
    }

    onProgress?.(0.6, 'Applying threshold...');
    if (this.options.threshold !== 'none') {
      canvas = this.applyThreshold(canvas, this.options.threshold);
    }

    onProgress?.(0.7, 'Correcting skew...');
    if (this.options.deskew) {
      canvas = await this.deskew(canvas);
    }

    onProgress?.(0.8, 'Sharpening...');
    if (this.options.sharpen) {
      canvas = this.sharpen(canvas);
    }

    onProgress?.(0.9, 'Finalizing...');
    if (this.options.invert) {
      canvas = this.invert(canvas);
    }

    onProgress?.(1.0, 'Complete!');
    return canvas;
  }

  /**
   * Load image source as canvas
   */
  private async loadAsCanvas(source: HTMLImageElement | HTMLCanvasElement | ImageData | string): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

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
      return canvas;
    } else if (source instanceof HTMLCanvasElement) {
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.drawImage(source, 0, 0);
      return canvas;
    } else if (source instanceof ImageData) {
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.putImageData(source, 0, 0);
      return canvas;
    }

    throw new Error('Unsupported image source');
  }

  /**
   * Convert to grayscale
   */
  private toGrayscale(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Simple noise reduction using median filter
   */
  private denoise(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const output = new Uint8ClampedArray(data);

    const kernelSize = 3;
    const halfKernel = Math.floor(kernelSize / 2);

    for (let y = halfKernel; y < height - halfKernel; y++) {
      for (let x = halfKernel; x < width - halfKernel; x++) {
        const neighbors: number[] = [];

        for (let ky = -halfKernel; ky <= halfKernel; ky++) {
          for (let kx = -halfKernel; kx <= halfKernel; kx++) {
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

    const newImageData = new ImageData(output, width, height);
    ctx.putImageData(newImageData, 0, 0);
    return canvas;
  }

  /**
   * Enhance contrast using histogram equalization
   */
  private enhanceContrast(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Build histogram
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++;
    }

    // Calculate cumulative distribution
    const cdf = new Array(256).fill(0);
    cdf[0] = histogram[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }

    // Find minimum non-zero CDF value
    const cdfMin = cdf.find(v => v > 0) || 0;
    const totalPixels = (data.length / 4);

    // Apply histogram equalization
    for (let i = 0; i < data.length; i += 4) {
      const equalized = Math.round(((cdf[data[i]] - cdfMin) / (totalPixels - cdfMin)) * 255);
      data[i] = equalized;
      data[i + 1] = equalized;
      data[i + 2] = equalized;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Remove background using local thresholding
   */
  private removeBackground(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Estimate background using large kernel average
    const blockSize = 31;
    const halfBlock = Math.floor(blockSize / 2);
    const background = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;

        for (let ky = Math.max(0, y - halfBlock); ky <= Math.min(height - 1, y + halfBlock); ky++) {
          for (let kx = Math.max(0, x - halfBlock); kx <= Math.min(width - 1, x + halfBlock); kx++) {
            const idx = (ky * width + kx) * 4;
            sum += data[idx];
            count++;
          }
        }

        background[y * width + x] = sum / count;
      }
    }

    // Subtract background
    for (let i = 0; i < data.length; i += 4) {
      const pixelIdx = i / 4;
      const diff = data[i] - background[pixelIdx] + 128;
      const clamped = Math.max(0, Math.min(255, diff));
      data[i] = clamped;
      data[i + 1] = clamped;
      data[i + 2] = clamped;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Apply thresholding
   */
  private applyThreshold(canvas: HTMLCanvasElement, method: 'binary' | 'adaptive' | 'otsu'): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    let threshold: number;

    if (method === 'otsu') {
      threshold = this.calculateOtsuThreshold(data);
    } else if (method === 'binary') {
      threshold = 128;
    } else {
      // Adaptive thresholding
      return this.adaptiveThreshold(canvas);
    }

    // Apply global threshold
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] < threshold ? 0 : 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Calculate Otsu's threshold
   */
  private calculateOtsuThreshold(data: Uint8ClampedArray): number {
    // Build histogram
    const histogram = new Array(256).fill(0);
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++;
    }

    // Calculate Otsu's threshold
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVariance = 0;
    let threshold = 0;

    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;

      wF = totalPixels - wB;
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
   * Adaptive thresholding using local mean
   */
  private adaptiveThreshold(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const output = new Uint8ClampedArray(data);

    const blockSize = 15;
    const C = 10; // Constant subtracted from mean

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        const halfBlock = Math.floor(blockSize / 2);

        for (let ky = Math.max(0, y - halfBlock); ky <= Math.min(height - 1, y + halfBlock); ky++) {
          for (let kx = Math.max(0, x - halfBlock); kx <= Math.min(width - 1, x + halfBlock); kx++) {
            const idx = (ky * width + kx) * 4;
            sum += data[idx];
            count++;
          }
        }

        const mean = sum / count;
        const idx = (y * width + x) * 4;
        const value = data[idx] < (mean - C) ? 0 : 255;
        output[idx] = value;
        output[idx + 1] = value;
        output[idx + 2] = value;
        output[idx + 3] = 255;
      }
    }

    const newImageData = new ImageData(output, width, height);
    ctx.putImageData(newImageData, 0, 0);
    return canvas;
  }

  /**
   * Deskew image using projection profile
   */
  private async deskew(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Try different angles and find the one with minimum variance in projection
    const angles = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    let bestAngle = 0;
    let minVariance = Infinity;

    for (const angle of angles) {
      const rotated = this.rotateImageData(data, width, height, angle);
      const variance = this.calculateProjectionVariance(rotated, width, height);
      
      if (variance < minVariance) {
        minVariance = variance;
        bestAngle = angle;
      }
    }

    // Apply best rotation
    if (bestAngle !== 0) {
      return this.rotateCanvas(canvas, bestAngle);
    }

    return canvas;
  }

  /**
   * Rotate image data
   */
  private rotateImageData(data: Uint8ClampedArray, width: number, height: number, angle: number): Uint8ClampedArray {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const cx = width / 2;
    const cy = height / 2;
    const output = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcX = Math.round(cos * (x - cx) - sin * (y - cy) + cx);
        const srcY = Math.round(sin * (x - cx) + cos * (y - cy) + cy);

        const dstIdx = (y * width + x) * 4;

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const srcIdx = (srcY * width + srcX) * 4;
          output[dstIdx] = data[srcIdx];
          output[dstIdx + 1] = data[srcIdx + 1];
          output[dstIdx + 2] = data[srcIdx + 2];
          output[dstIdx + 3] = data[srcIdx + 3];
        } else {
          output[dstIdx] = 255;
          output[dstIdx + 1] = 255;
          output[dstIdx + 2] = 255;
          output[dstIdx + 3] = 255;
        }
      }
    }

    return output;
  }

  /**
   * Calculate variance of horizontal projection
   */
  private calculateProjectionVariance(data: Uint8ClampedArray, width: number, height: number): number {
    const projection = new Array(height).fill(0);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx] < 128) {
          projection[y]++;
        }
      }
    }

    const mean = projection.reduce((a, b) => a + b, 0) / height;
    const variance = projection.reduce((sum, val) => sum + (val - mean) ** 2, 0) / height;

    return variance;
  }

  /**
   * Rotate canvas
   */
  private rotateCanvas(canvas: HTMLCanvasElement, angle: number): HTMLCanvasElement {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));

    const newWidth = Math.ceil(canvas.width * cos + canvas.height * sin);
    const newHeight = Math.ceil(canvas.width * sin + canvas.height * cos);

    const rotated = document.createElement('canvas');
    rotated.width = newWidth;
    rotated.height = newHeight;
    const ctx = rotated.getContext('2d', { willReadFrequently: true })!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, newWidth, newHeight);

    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    return rotated;
  }

  /**
   * Sharpen image using unsharp mask
   */
  private sharpen(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const output = new Uint8ClampedArray(data);

    // Sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0,
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
        const clamped = Math.max(0, Math.min(255, sum));
        output[idx] = clamped;
        output[idx + 1] = clamped;
        output[idx + 2] = clamped;
      }
    }

    const newImageData = new ImageData(output, width, height);
    ctx.putImageData(newImageData, 0, 0);
    return canvas;
  }

  /**
   * Invert image colors
   */
  private invert(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }
}

export default ImagePreprocessor;
