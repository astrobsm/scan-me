/**
 * Skew Correction
 * Detects and corrects document rotation for better OCR
 */

export interface SkewResult {
  imageData: ImageData;
  angle: number;
}

export function correctSkew(imageData: ImageData): SkewResult {
  const angle = detectSkewAngle(imageData);
  
  if (Math.abs(angle) < 0.5) {
    // No significant skew detected
    return { imageData, angle: 0 };
  }
  
  const rotated = rotateImage(imageData, -angle);
  return { imageData: rotated, angle };
}

/**
 * Detect skew angle using projection profile analysis
 */
export function detectSkewAngle(imageData: ImageData): number {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  let bestAngle = 0;
  let maxVariance = 0;
  
  // Test angles from -15 to +15 degrees
  for (let angle = -15; angle <= 15; angle += 0.5) {
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    // Calculate horizontal projection profile
    const profile: number[] = new Array(height).fill(0);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Rotate point
        const cx = width / 2;
        const cy = height / 2;
        const rx = (x - cx) * cos - (y - cy) * sin + cx;
        const ry = (x - cx) * sin + (y - cy) * cos + cy;
        
        const projY = Math.round(ry);
        if (projY >= 0 && projY < height) {
          const idx = (y * width + x) * 4;
          // Count dark pixels (text)
          if (data[idx] < 128) {
            profile[projY]++;
          }
        }
      }
    }
    
    // Calculate variance of profile
    const mean = profile.reduce((a, b) => a + b, 0) / profile.length;
    const variance = profile.reduce((sum, val) => sum + (val - mean) ** 2, 0) / profile.length;
    
    if (variance > maxVariance) {
      maxVariance = variance;
      bestAngle = angle;
    }
  }
  
  return bestAngle;
}

/**
 * Rotate image by given angle
 */
export function rotateImage(imageData: ImageData, angleDegrees: number): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  // Fill with white
  output.fill(255);
  
  const radians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = width / 2;
  const cy = height / 2;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Inverse rotation to find source pixel
      const sx = (x - cx) * cos + (y - cy) * sin + cx;
      const sy = -(x - cx) * sin + (y - cy) * cos + cy;
      
      const srcX = Math.round(sx);
      const srcY = Math.round(sy);
      
      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const srcIdx = (srcY * width + srcX) * 4;
        const dstIdx = (y * width + x) * 4;
        
        output[dstIdx] = data[srcIdx];
        output[dstIdx + 1] = data[srcIdx + 1];
        output[dstIdx + 2] = data[srcIdx + 2];
        output[dstIdx + 3] = data[srcIdx + 3];
      }
    }
  }
  
  return new ImageData(output, width, height);
}
