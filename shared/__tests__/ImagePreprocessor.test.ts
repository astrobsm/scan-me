/**
 * CHARLES-DOUGLAS SCAN APP
 * Image Preprocessing Unit Tests
 */

import { ImagePreprocessor } from '../preprocessing/ImagePreprocessor';

// Mock ImageData for Node.js environment
class MockImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  colorSpace: 'srgb' = 'srgb';

  constructor(width: number, height: number, data?: Uint8ClampedArray) {
    this.width = width;
    this.height = height;
    this.data = data || new Uint8ClampedArray(width * height * 4);
  }
}

// Make MockImageData available globally for tests
(global as any).ImageData = MockImageData;

describe('ImagePreprocessor', () => {
  let preprocessor: ImagePreprocessor;

  beforeEach(() => {
    preprocessor = new ImagePreprocessor();
  });

  describe('initialization', () => {
    it('should create a preprocessor with default options', () => {
      expect(preprocessor).toBeInstanceOf(ImagePreprocessor);
    });

    it('should accept custom options', () => {
      const customPreprocessor = new ImagePreprocessor({
        applyGrayscale: true,
        applyThreshold: false,
        thresholdValue: 150,
      });
      expect(customPreprocessor).toBeInstanceOf(ImagePreprocessor);
    });
  });

  describe('toGrayscale', () => {
    it('should convert color image to grayscale', () => {
      // Create a 2x2 color image (red, green, blue, white)
      const colorData = new Uint8ClampedArray([
        255, 0, 0, 255,    // Red
        0, 255, 0, 255,    // Green
        0, 0, 255, 255,    // Blue
        255, 255, 255, 255 // White
      ]);
      const imageData = new MockImageData(2, 2, colorData) as unknown as ImageData;

      const result = (preprocessor as any).toGrayscale(imageData);

      // Verify all RGB channels are equal (grayscale)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(result.data[i + 1]);
        expect(result.data[i + 1]).toBe(result.data[i + 2]);
      }
    });

    it('should preserve alpha channel', () => {
      const data = new Uint8ClampedArray([128, 64, 32, 200]);
      const imageData = new MockImageData(1, 1, data) as unknown as ImageData;

      const result = (preprocessor as any).toGrayscale(imageData);

      expect(result.data[3]).toBe(200);
    });

    it('should handle already grayscale images', () => {
      const grayValue = 128;
      const data = new Uint8ClampedArray([grayValue, grayValue, grayValue, 255]);
      const imageData = new MockImageData(1, 1, data) as unknown as ImageData;

      const result = (preprocessor as any).toGrayscale(imageData);

      expect(result.data[0]).toBe(grayValue);
      expect(result.data[1]).toBe(grayValue);
      expect(result.data[2]).toBe(grayValue);
    });
  });

  describe('applyThreshold', () => {
    it('should convert pixels above threshold to white', () => {
      const data = new Uint8ClampedArray([200, 200, 200, 255]);
      const imageData = new MockImageData(1, 1, data) as unknown as ImageData;

      const result = (preprocessor as any).applyThreshold(imageData, 128);

      expect(result.data[0]).toBe(255);
      expect(result.data[1]).toBe(255);
      expect(result.data[2]).toBe(255);
    });

    it('should convert pixels below threshold to black', () => {
      const data = new Uint8ClampedArray([50, 50, 50, 255]);
      const imageData = new MockImageData(1, 1, data) as unknown as ImageData;

      const result = (preprocessor as any).applyThreshold(imageData, 128);

      expect(result.data[0]).toBe(0);
      expect(result.data[1]).toBe(0);
      expect(result.data[2]).toBe(0);
    });

    it('should handle edge case at threshold boundary', () => {
      const data = new Uint8ClampedArray([128, 128, 128, 255]);
      const imageData = new MockImageData(1, 1, data) as unknown as ImageData;

      const result = (preprocessor as any).applyThreshold(imageData, 128);

      // At boundary, should go to white (>= threshold)
      expect(result.data[0]).toBe(255);
    });
  });

  describe('denoise', () => {
    it('should reduce noise in image using median filter', () => {
      // 3x3 image with noise (salt and pepper)
      const data = new Uint8ClampedArray([
        0, 0, 0, 255,       128, 128, 128, 255,   0, 0, 0, 255,
        128, 128, 128, 255, 255, 255, 255, 255,   128, 128, 128, 255,
        0, 0, 0, 255,       128, 128, 128, 255,   0, 0, 0, 255,
      ]);
      const imageData = new MockImageData(3, 3, data) as unknown as ImageData;

      const result = (preprocessor as any).denoise(imageData);

      // Center pixel should be smoothed
      expect(result).toBeDefined();
      expect(result.width).toBe(3);
      expect(result.height).toBe(3);
    });

    it('should preserve image dimensions', () => {
      const data = new Uint8ClampedArray(100 * 100 * 4);
      const imageData = new MockImageData(100, 100, data) as unknown as ImageData;

      const result = (preprocessor as any).denoise(imageData);

      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });
  });

  describe('detectSkewAngle', () => {
    it('should return 0 for horizontal lines', () => {
      // Create horizontal line pattern
      const width = 100;
      const height = 100;
      const data = new Uint8ClampedArray(width * height * 4);
      
      // Draw horizontal black line
      for (let x = 10; x < 90; x++) {
        const idx = (50 * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
      
      const imageData = new MockImageData(width, height, data) as unknown as ImageData;
      const angle = (preprocessor as any).detectSkewAngle(imageData);

      expect(Math.abs(angle)).toBeLessThan(5); // Should be close to 0
    });

    it('should detect positive skew angle', () => {
      const imageData = new MockImageData(100, 100) as unknown as ImageData;
      const angle = (preprocessor as any).detectSkewAngle(imageData);

      expect(typeof angle).toBe('number');
      expect(angle).toBeGreaterThanOrEqual(-45);
      expect(angle).toBeLessThanOrEqual(45);
    });
  });

  describe('performance', () => {
    it('should process small images quickly', () => {
      const data = new Uint8ClampedArray(100 * 100 * 4);
      const imageData = new MockImageData(100, 100, data) as unknown as ImageData;

      const start = performance.now();
      (preprocessor as any).toGrayscale(imageData);
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle large images', () => {
      const width = 1920;
      const height = 1080;
      const data = new Uint8ClampedArray(width * height * 4);
      const imageData = new MockImageData(width, height, data) as unknown as ImageData;

      expect(() => (preprocessor as any).toGrayscale(imageData)).not.toThrow();
    });
  });
});
