/**
 * Noise Reduction Filter
 * Removes noise while preserving text edges
 */

export function denoise(imageData: ImageData, strength: number = 1): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = new Uint8ClampedArray(imageData.data);
  const output = new Uint8ClampedArray(data);
  
  // Apply median filter for noise reduction
  const kernelSize = Math.max(3, Math.min(7, strength * 2 + 1));
  const halfKernel = Math.floor(kernelSize / 2);
  
  for (let y = halfKernel; y < height - halfKernel; y++) {
    for (let x = halfKernel; x < width - halfKernel; x++) {
      const neighbors: number[] = [];
      
      // Collect neighborhood pixels
      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          neighbors.push(data[idx]);
        }
      }
      
      // Sort and get median
      neighbors.sort((a, b) => a - b);
      const median = neighbors[Math.floor(neighbors.length / 2)];
      
      const idx = (y * width + x) * 4;
      output[idx] = median;
      output[idx + 1] = median;
      output[idx + 2] = median;
    }
  }
  
  return new ImageData(output, width, height);
}

/**
 * Gaussian blur for gentle noise reduction
 */
export function gaussianBlur(imageData: ImageData, sigma: number = 1): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = new Uint8ClampedArray(imageData.data);
  const output = new Uint8ClampedArray(data);
  
  // Create Gaussian kernel
  const kernelSize = Math.ceil(sigma * 6) | 1;
  const halfKernel = Math.floor(kernelSize / 2);
  const kernel: number[] = [];
  let sum = 0;
  
  for (let i = -halfKernel; i <= halfKernel; i++) {
    const val = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(val);
    sum += val;
  }
  
  // Normalize kernel
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum;
  }
  
  // Apply separable convolution (horizontal pass)
  const temp = new Uint8ClampedArray(data);
  
  for (let y = 0; y < height; y++) {
    for (let x = halfKernel; x < width - halfKernel; x++) {
      let val = 0;
      for (let k = -halfKernel; k <= halfKernel; k++) {
        const idx = (y * width + (x + k)) * 4;
        val += data[idx] * kernel[k + halfKernel];
      }
      const idx = (y * width + x) * 4;
      temp[idx] = temp[idx + 1] = temp[idx + 2] = Math.round(val);
    }
  }
  
  // Vertical pass
  for (let y = halfKernel; y < height - halfKernel; y++) {
    for (let x = 0; x < width; x++) {
      let val = 0;
      for (let k = -halfKernel; k <= halfKernel; k++) {
        const idx = ((y + k) * width + x) * 4;
        val += temp[idx] * kernel[k + halfKernel];
      }
      const idx = (y * width + x) * 4;
      output[idx] = output[idx + 1] = output[idx + 2] = Math.round(val);
    }
  }
  
  return new ImageData(output, width, height);
}
