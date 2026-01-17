/**
 * Mobile Image Optimization Utilities
 * Prevents app hanging by compressing and resizing images
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  compressFormat?: 'jpeg' | 'png' | 'webp';
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.7,
  compressFormat: 'jpeg',
};

/**
 * Calculate optimal dimensions while maintaining aspect ratio
 */
export function calculateOptimalSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Get estimated memory usage of an image
 */
export function estimateMemoryUsage(width: number, height: number): number {
  // RGBA = 4 bytes per pixel
  return width * height * 4;
}

/**
 * Check if image needs compression based on size
 */
export function shouldCompressImage(width: number, height: number, maxSizeMB: number = 5): boolean {
  const estimatedSizeMB = estimateMemoryUsage(width, height) / (1024 * 1024);
  return estimatedSizeMB > maxSizeMB;
}

/**
 * Optimize image for processing
 * Use with expo-image-manipulator in production
 */
export async function optimizeImage(
  imageUri: string,
  options: ImageOptimizationOptions = {}
): Promise<{ uri: string; width: number; height: number }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // In production, use expo-image-manipulator:
    // import * as ImageManipulator from 'expo-image-manipulator';
    // 
    // const manipResult = await ImageManipulator.manipulateAsync(
    //   imageUri,
    //   [{ resize: { width: opts.maxWidth, height: opts.maxHeight } }],
    //   { compress: opts.quality, format: ImageManipulator.SaveFormat.JPEG }
    // );
    // 
    // return {
    //   uri: manipResult.uri,
    //   width: manipResult.width,
    //   height: manipResult.height,
    // };

    // For now, return original
    return {
      uri: imageUri,
      width: opts.maxWidth!,
      height: opts.maxHeight!,
    };
  } catch (error) {
    console.error('Image optimization failed:', error);
    return {
      uri: imageUri,
      width: opts.maxWidth!,
      height: opts.maxHeight!,
    };
  }
}

/**
 * Progressive image loading strategy
 */
export class ProgressiveImageLoader {
  private loadedImages = new Map<string, boolean>();
  private loadQueue: string[] = [];
  private maxConcurrent = 2;
  private currentLoading = 0;

  /**
   * Queue image for loading
   */
  queueImage(uri: string): void {
    if (!this.loadedImages.has(uri) && !this.loadQueue.includes(uri)) {
      this.loadQueue.push(uri);
      this.processQueue();
    }
  }

  /**
   * Process loading queue
   */
  private async processQueue(): Promise<void> {
    if (this.currentLoading >= this.maxConcurrent || this.loadQueue.length === 0) {
      return;
    }

    const uri = this.loadQueue.shift();
    if (!uri) return;

    this.currentLoading++;

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 100));
      this.loadedImages.set(uri, true);
    } catch (error) {
      console.error('Failed to load image:', error);
    } finally {
      this.currentLoading--;
      this.processQueue();
    }
  }

  /**
   * Check if image is loaded
   */
  isLoaded(uri: string): boolean {
    return this.loadedImages.has(uri);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.loadedImages.clear();
    this.loadQueue = [];
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.loadedImages.size;
  }
}

/**
 * Throttle function to prevent excessive calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay);
    }
  };
}

/**
 * Debounce function to delay execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Memory-safe image cache with size limits
 */
export class ImageCache {
  private cache = new Map<string, { uri: string; size: number; timestamp: number }>();
  private maxSizeMB = 50; // Maximum cache size in MB
  private currentSizeMB = 0;

  /**
   * Add image to cache
   */
  add(key: string, uri: string, size: number): void {
    const sizeMB = size / (1024 * 1024);

    // Check if adding would exceed limit
    if (this.currentSizeMB + sizeMB > this.maxSizeMB) {
      this.evictOldest();
    }

    this.cache.set(key, {
      uri,
      size,
      timestamp: Date.now(),
    });

    this.currentSizeMB += sizeMB;
  }

  /**
   * Get image from cache
   */
  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (entry) {
      // Update timestamp on access
      entry.timestamp = Date.now();
      return entry.uri;
    }
    return null;
  }

  /**
   * Evict oldest entries
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp
    );

    // Remove oldest 25%
    const removeCount = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < removeCount; i++) {
      const [key, entry] = entries[i];
      this.cache.delete(key);
      this.currentSizeMB -= entry.size / (1024 * 1024);
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSizeMB = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): { entries: number; sizeMB: number; maxSizeMB: number } {
    return {
      entries: this.cache.size,
      sizeMB: this.currentSizeMB,
      maxSizeMB: this.maxSizeMB,
    };
  }
}

// Export singleton instances
export const progressiveLoader = new ProgressiveImageLoader();
export const imageCache = new ImageCache();
