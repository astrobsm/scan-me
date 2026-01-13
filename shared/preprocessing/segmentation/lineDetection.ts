/**
 * Line Detection
 * Segments image into individual text lines for OCR
 */

export interface TextLine {
  imageData: ImageData;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  baseline: number;
}

export function detectLines(imageData: ImageData, minLineHeight: number = 10): TextLine[] {
  const { width, height, data } = imageData;
  const lines: TextLine[] = [];
  
  // Calculate horizontal projection profile
  const profile = calculateProjectionProfile(data, width, height);
  
  // Find line boundaries using profile
  const boundaries = findLineBoundaries(profile, minLineHeight);
  
  // Extract each line
  for (const { start, end } of boundaries) {
    const lineHeight = end - start;
    const lineData = extractLineData(imageData, 0, start, width, lineHeight);
    
    lines.push({
      imageData: lineData,
      boundingBox: {
        x: 0,
        y: start,
        width: width,
        height: lineHeight,
      },
      baseline: estimateBaseline(lineData),
    });
  }
  
  return lines;
}

/**
 * Calculate horizontal projection profile
 */
function calculateProjectionProfile(data: Uint8ClampedArray, width: number, height: number): number[] {
  const profile: number[] = new Array(height).fill(0);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Count dark pixels (text)
      if (data[idx] < 128) {
        profile[y]++;
      }
    }
  }
  
  return profile;
}

/**
 * Find line boundaries from projection profile
 */
function findLineBoundaries(
  profile: number[],
  minLineHeight: number
): Array<{ start: number; end: number }> {
  const boundaries: Array<{ start: number; end: number }> = [];
  const threshold = Math.max(...profile) * 0.05;
  
  let inLine = false;
  let lineStart = 0;
  
  for (let y = 0; y < profile.length; y++) {
    if (!inLine && profile[y] > threshold) {
      inLine = true;
      lineStart = y;
    } else if (inLine && profile[y] <= threshold) {
      inLine = false;
      const lineHeight = y - lineStart;
      
      if (lineHeight >= minLineHeight) {
        boundaries.push({ start: lineStart, end: y });
      }
    }
  }
  
  // Handle last line
  if (inLine) {
    const lineHeight = profile.length - lineStart;
    if (lineHeight >= minLineHeight) {
      boundaries.push({ start: lineStart, end: profile.length });
    }
  }
  
  return boundaries;
}

/**
 * Extract line image data
 */
function extractLineData(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData {
  const srcWidth = imageData.width;
  const output = new Uint8ClampedArray(width * height * 4);
  
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const srcIdx = ((y + dy) * srcWidth + (x + dx)) * 4;
      const dstIdx = (dy * width + dx) * 4;
      
      output[dstIdx] = imageData.data[srcIdx];
      output[dstIdx + 1] = imageData.data[srcIdx + 1];
      output[dstIdx + 2] = imageData.data[srcIdx + 2];
      output[dstIdx + 3] = imageData.data[srcIdx + 3];
    }
  }
  
  return new ImageData(output, width, height);
}

/**
 * Estimate baseline position within a line
 */
function estimateBaseline(lineData: ImageData): number {
  const { width, height, data } = lineData;
  
  // Find the row with maximum ink density in lower half
  let maxDensity = 0;
  let baseline = Math.floor(height * 0.7);
  
  for (let y = Math.floor(height * 0.5); y < height; y++) {
    let density = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 128) {
        density++;
      }
    }
    
    if (density > maxDensity) {
      maxDensity = density;
      baseline = y;
    }
  }
  
  return baseline;
}
