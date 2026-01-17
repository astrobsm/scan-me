/**
 * Mobile Performance Monitoring Utility
 * Helps diagnose performance issues and prevent app hanging
 */

import { InteractionManager } from 'react-native';

export interface PerformanceMetrics {
  fps: number;
  memoryUsageMB: number;
  jsHeapSizeMB: number;
  renderTime: number;
  lastMeasurement: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsageMB: 0,
    jsHeapSizeMB: 0,
    renderTime: 0,
    lastMeasurement: Date.now(),
  };

  private frameCount = 0;
  private lastFrameTime = performance.now();
  private rafId: number | null = null;
  private isMonitoring = false;

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.monitorFrameRate();
    this.measureMemory();
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.isMonitoring = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Monitor frame rate
   */
  private monitorFrameRate(): void {
    const measure = () => {
      if (!this.isMonitoring) return;

      const currentTime = performance.now();
      const delta = currentTime - this.lastFrameTime;

      this.frameCount++;

      // Calculate FPS every second
      if (delta >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }

      this.rafId = requestAnimationFrame(measure);
    };

    this.rafId = requestAnimationFrame(measure);
  }

  /**
   * Measure memory usage
   */
  private measureMemory(): void {
    const measure = () => {
      if (!this.isMonitoring) return;

      // @ts-ignore - performance.memory is not in TypeScript definitions
      if (performance.memory) {
        // @ts-ignore
        const memory = performance.memory;
        this.metrics.jsHeapSizeMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
        this.metrics.memoryUsageMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
      }

      this.metrics.lastMeasurement = Date.now();

      // Measure again in 2 seconds
      setTimeout(measure, 2000);
    };

    measure();
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Check if performance is degraded
   */
  isPerformanceDegraded(): boolean {
    return this.metrics.fps < 30 || this.metrics.memoryUsageMB > 100;
  }

  /**
   * Get performance warning message
   */
  getPerformanceWarning(): string | null {
    if (this.metrics.fps < 20) {
      return 'Low frame rate detected. Consider reducing image quality or closing other apps.';
    }
    if (this.metrics.memoryUsageMB > 150) {
      return 'High memory usage detected. App may slow down or crash.';
    }
    if (this.metrics.fps < 30) {
      return 'Performance degraded. Try restarting the app.';
    }
    return null;
  }
}

/**
 * Run task after interactions complete (prevents jank)
 */
export function runAfterInteractions<T>(
  task: () => Promise<T> | T
): Promise<T> {
  return new Promise((resolve, reject) => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Batch multiple tasks to run after interactions
 */
export async function batchTasks<T>(
  tasks: Array<() => Promise<T> | T>,
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(task => runAfterInteractions(task))
    );
    results.push(...batchResults);

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Profile async function execution time
 */
export async function profileAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  console.log(`[Performance] Starting: ${name}`);

  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] Completed: ${name} in ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] Failed: ${name} after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Profile synchronous function execution time
 */
export function profileSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  console.log(`[Performance] Starting: ${name}`);

  try {
    const result = fn();
    const duration = performance.now() - start;
    console.log(`[Performance] Completed: ${name} in ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] Failed: ${name} after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Request idle callback (fallback to setTimeout)
 */
export function requestIdleCallback(
  callback: () => void,
  options?: { timeout?: number }
): number {
  // @ts-ignore
  if (typeof window.requestIdleCallback === 'function') {
    // @ts-ignore
    return window.requestIdleCallback(callback, options);
  }

  // Fallback to setTimeout
  return setTimeout(callback, 1) as unknown as number;
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number): void {
  // @ts-ignore
  if (typeof window.cancelIdleCallback === 'function') {
    // @ts-ignore
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Memory-aware task scheduler
 */
export class TaskScheduler {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private maxConcurrent = 2;
  private currentTasks = 0;
  private monitor = new PerformanceMonitor();

  constructor() {
    this.monitor.start();
  }

  /**
   * Add task to queue
   */
  enqueue(task: () => Promise<void>): void {
    this.queue.push(task);
    this.processQueue();
  }

  /**
   * Process task queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.currentTasks >= this.maxConcurrent) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    // Check performance before starting new task
    if (this.monitor.isPerformanceDegraded()) {
      // Re-queue task and wait
      this.queue.unshift(task);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    this.currentTasks++;
    this.isProcessing = true;

    try {
      await task();
    } catch (error) {
      console.error('Task execution failed:', error);
    } finally {
      this.currentTasks--;
      this.isProcessing = false;
      
      // Process next task
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.clear();
    this.monitor.stop();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
export const taskScheduler = new TaskScheduler();
