/**
 * Grayscale Conversion Filter
 * Converts color image to grayscale for better OCR processing
 */

export function grayscale(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    // Use luminosity method for accurate grayscale
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Luminosity formula: 0.299*R + 0.587*G + 0.114*B
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
    // Alpha channel remains unchanged
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}
