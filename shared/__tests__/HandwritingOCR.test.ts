/**
 * CHARLES-DOUGLAS SCAN APP
 * OCR Engine Unit Tests
 */

import { HandwritingOCR } from '../ocr/HandwritingOCR';
import { OCRResult, OCROptions } from '../ocr/types';

// Mock TensorFlow.js
jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn().mockReturnValue({
      dataSync: () => new Float32Array(100).fill(0.1),
      shape: [1, 10, 80],
      dispose: jest.fn(),
    }),
  }),
  tensor: jest.fn().mockReturnValue({
    expandDims: jest.fn().mockReturnThis(),
    div: jest.fn().mockReturnThis(),
    dispose: jest.fn(),
  }),
  browser: {
    fromPixels: jest.fn().mockReturnValue({
      toFloat: jest.fn().mockReturnValue({
        div: jest.fn().mockReturnValue({
          expandDims: jest.fn().mockReturnThis(),
          dispose: jest.fn(),
        }),
      }),
    }),
  },
  dispose: jest.fn(),
  ready: jest.fn().mockResolvedValue(undefined),
}));

describe('HandwritingOCR', () => {
  let ocr: HandwritingOCR;

  beforeEach(() => {
    ocr = new HandwritingOCR();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create OCR instance with default config', () => {
      expect(ocr).toBeInstanceOf(HandwritingOCR);
    });

    it('should accept custom configuration', () => {
      const customConfig: Partial<OCROptions> = {
        language: 'en',
        medicalMode: true,
        enhanceContrast: true,
      };
      const customOCR = new HandwritingOCR(customConfig);
      expect(customOCR).toBeInstanceOf(HandwritingOCR);
    });
  });

  describe('initialize', () => {
    it('should initialize successfully', async () => {
      await expect(ocr.initialize()).resolves.not.toThrow();
    });
  });

  describe('recognize', () => {
    beforeEach(async () => {
      await ocr.initialize();
    });

    it('should return OCRResult object', async () => {
      const mockImageData = createMockImageData(100, 32);
      const result = await ocr.recognize(mockImageData);

      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('lines');
      expect(result).toHaveProperty('processingTime');
    });

    it('should return confidence between 0 and 1', async () => {
      const mockImageData = createMockImageData(100, 32);
      const result = await ocr.recognize(mockImageData);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should track processing time', async () => {
      const mockImageData = createMockImageData(100, 32);
      const result = await ocr.recognize(mockImageData);

      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('error handling', () => {
    it('should throw if recognizing before initialization', async () => {
      const newOCR = new HandwritingOCR();
      const mockImageData = createMockImageData(100, 32);

      await expect(newOCR.recognize(mockImageData)).rejects.toThrow();
    });
  });
});

// Helper function to create mock ImageData
function createMockImageData(width: number, height: number): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  // Fill with white background
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;     // R
    data[i + 1] = 255; // G
    data[i + 2] = 255; // B
    data[i + 3] = 255; // A
  }
  return {
    data,
    width,
    height,
    colorSpace: 'srgb' as const,
  };
}
