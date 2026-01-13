/**
 * Adaptive Thresholding Filter
 * Converts grayscale to binary for cleaner text extraction
 */

export function threshold(imageData: ImageData, globalThreshold: number = 128): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  // Use adaptive thresholding with local window
  const windowSize = 15;
  const c = 10; // Constant subtracted from mean
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const pixel = data[idx];
      
      // Calculate local mean
      let sum = 0;
      let count = 0;
      
      const halfWindow = Math.floor(windowSize / 2);
      for (let wy = -halfWindow; wy <= halfWindow; wy++) {
        for (let wx = -halfWindow; wx <= halfWindow; wx++) {
          const ny = y + wy;
          const nx = x + wx;
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const nidx = (ny * width + nx) * 4;
            sum += data[nidx];
            count++;
          }
        }
      }
      
      const localMean = sum / count;
      const localThreshold = localMean - c;
      
      // Apply threshold
      const value = pixel < localThreshold ? 0 : 255;
      
      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
    }
  }
  
  return new ImageData(data, width, height);
}

/**
 * Simple global thresholding (faster but less accurate)
 */
export function globalThreshold(imageData: ImageData, threshold: number = 128): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    const value = data[i] < threshold ? 0 : 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}
