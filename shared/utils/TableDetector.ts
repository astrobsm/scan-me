/**
 * CHARLES-DOUGLAS SCAN APP
 * Table Detection and Extraction Module
 * 
 * Detects tables in document images and extracts structured data
 */

export interface TableCell {
  row: number;
  col: number;
  text: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rowSpan: number;
  colSpan: number;
}

export interface DetectedTable {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rows: number;
  cols: number;
  cells: TableCell[][];
  confidence: number;
}

export interface TableDetectionResult {
  tables: DetectedTable[];
  processingTime: number;
}

export interface TableDetectorConfig {
  minTableWidth: number;
  minTableHeight: number;
  minCells: number;
  lineThreshold: number;
  cellPadding: number;
}

export class TableDetector {
  private config: TableDetectorConfig;

  constructor(config: Partial<TableDetectorConfig> = {}) {
    this.config = {
      minTableWidth: 100,
      minTableHeight: 50,
      minCells: 4,
      lineThreshold: 10,
      cellPadding: 5,
      ...config,
    };
  }

  /**
   * Detect tables in an image
   */
  async detect(imageData: ImageData): Promise<TableDetectionResult> {
    const startTime = performance.now();
    
    // Step 1: Detect horizontal and vertical lines
    const horizontalLines = this.detectHorizontalLines(imageData);
    const verticalLines = this.detectVerticalLines(imageData);

    // Step 2: Find line intersections to identify table structure
    const intersections = this.findIntersections(horizontalLines, verticalLines);

    // Step 3: Identify table regions
    const tableRegions = this.identifyTableRegions(intersections, imageData);

    // Step 4: Extract cell structure
    const tables: DetectedTable[] = [];
    
    for (const region of tableRegions) {
      const table = await this.extractTable(region, imageData);
      if (table) {
        tables.push(table);
      }
    }

    return {
      tables,
      processingTime: performance.now() - startTime,
    };
  }

  /**
   * Detect horizontal lines using projection profile
   */
  private detectHorizontalLines(imageData: ImageData): number[] {
    const { width, height, data } = imageData;
    const horizontalProfile = new Array(height).fill(0);

    // Calculate horizontal projection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const grayscale = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (grayscale < 128) {
          horizontalProfile[y]++;
        }
      }
    }

    // Find peaks (potential horizontal lines)
    const lines: number[] = [];
    const threshold = width * 0.3; // Line must span at least 30% of width

    for (let y = 0; y < height; y++) {
      if (horizontalProfile[y] > threshold) {
        // Check if it's a local peak
        const isPeak = 
          (y === 0 || horizontalProfile[y] >= horizontalProfile[y - 1]) &&
          (y === height - 1 || horizontalProfile[y] >= horizontalProfile[y + 1]);
        
        if (isPeak) {
          lines.push(y);
        }
      }
    }

    return this.mergeNearbyLines(lines, this.config.lineThreshold);
  }

  /**
   * Detect vertical lines using projection profile
   */
  private detectVerticalLines(imageData: ImageData): number[] {
    const { width, height, data } = imageData;
    const verticalProfile = new Array(width).fill(0);

    // Calculate vertical projection
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        const grayscale = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (grayscale < 128) {
          verticalProfile[x]++;
        }
      }
    }

    // Find peaks (potential vertical lines)
    const lines: number[] = [];
    const threshold = height * 0.3;

    for (let x = 0; x < width; x++) {
      if (verticalProfile[x] > threshold) {
        const isPeak = 
          (x === 0 || verticalProfile[x] >= verticalProfile[x - 1]) &&
          (x === width - 1 || verticalProfile[x] >= verticalProfile[x + 1]);
        
        if (isPeak) {
          lines.push(x);
        }
      }
    }

    return this.mergeNearbyLines(lines, this.config.lineThreshold);
  }

  /**
   * Merge lines that are close together
   */
  private mergeNearbyLines(lines: number[], threshold: number): number[] {
    if (lines.length === 0) return [];

    const merged: number[] = [];
    let currentGroup: number[] = [lines[0]];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] - lines[i - 1] <= threshold) {
        currentGroup.push(lines[i]);
      } else {
        // Average the group
        merged.push(Math.round(currentGroup.reduce((a, b) => a + b) / currentGroup.length));
        currentGroup = [lines[i]];
      }
    }

    // Add last group
    merged.push(Math.round(currentGroup.reduce((a, b) => a + b) / currentGroup.length));

    return merged;
  }

  /**
   * Find intersections between horizontal and vertical lines
   */
  private findIntersections(
    horizontalLines: number[],
    verticalLines: number[]
  ): Array<{ x: number; y: number }> {
    const intersections: Array<{ x: number; y: number }> = [];

    for (const y of horizontalLines) {
      for (const x of verticalLines) {
        intersections.push({ x, y });
      }
    }

    return intersections;
  }

  /**
   * Identify rectangular table regions from intersections
   */
  private identifyTableRegions(
    intersections: Array<{ x: number; y: number }>,
    imageData: ImageData
  ): Array<{ x: number; y: number; width: number; height: number }> {
    if (intersections.length < 4) return [];

    const regions: Array<{ x: number; y: number; width: number; height: number }> = [];

    // Find bounding boxes that form valid tables
    const xs = [...new Set(intersections.map(i => i.x))].sort((a, b) => a - b);
    const ys = [...new Set(intersections.map(i => i.y))].sort((a, b) => a - b);

    if (xs.length >= 2 && ys.length >= 2) {
      const x = xs[0];
      const y = ys[0];
      const width = xs[xs.length - 1] - x;
      const height = ys[ys.length - 1] - y;

      if (width >= this.config.minTableWidth && height >= this.config.minTableHeight) {
        regions.push({ x, y, width, height });
      }
    }

    return regions;
  }

  /**
   * Extract table structure from a region
   */
  private async extractTable(
    region: { x: number; y: number; width: number; height: number },
    imageData: ImageData
  ): Promise<DetectedTable | null> {
    // Extract region from image
    const regionData = this.extractRegion(imageData, region);
    
    // Detect cell structure
    const horizontalLines = this.detectHorizontalLines(regionData);
    const verticalLines = this.detectVerticalLines(regionData);

    const rows = horizontalLines.length - 1;
    const cols = verticalLines.length - 1;

    if (rows * cols < this.config.minCells) {
      return null;
    }

    // Create cell grid
    const cells: TableCell[][] = [];

    for (let row = 0; row < rows; row++) {
      cells[row] = [];
      for (let col = 0; col < cols; col++) {
        const cellBounds = {
          x: region.x + verticalLines[col],
          y: region.y + horizontalLines[row],
          width: verticalLines[col + 1] - verticalLines[col],
          height: horizontalLines[row + 1] - horizontalLines[row],
        };

        cells[row][col] = {
          row,
          col,
          text: '', // Text will be filled by OCR
          bounds: cellBounds,
          rowSpan: 1,
          colSpan: 1,
        };
      }
    }

    return {
      id: `table_${Date.now()}`,
      bounds: region,
      rows,
      cols,
      cells,
      confidence: this.calculateConfidence(horizontalLines, verticalLines),
    };
  }

  /**
   * Extract a region from ImageData
   */
  private extractRegion(
    imageData: ImageData,
    region: { x: number; y: number; width: number; height: number }
  ): ImageData {
    const { x, y, width, height } = region;
    const regionData = new Uint8ClampedArray(width * height * 4);

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const srcIdx = ((y + row) * imageData.width + (x + col)) * 4;
        const dstIdx = (row * width + col) * 4;

        regionData[dstIdx] = imageData.data[srcIdx];
        regionData[dstIdx + 1] = imageData.data[srcIdx + 1];
        regionData[dstIdx + 2] = imageData.data[srcIdx + 2];
        regionData[dstIdx + 3] = imageData.data[srcIdx + 3];
      }
    }

    return {
      data: regionData,
      width,
      height,
      colorSpace: 'srgb' as const,
    };
  }

  /**
   * Calculate confidence score for detected table
   */
  private calculateConfidence(horizontalLines: number[], verticalLines: number[]): number {
    // More regular grid = higher confidence
    const hSpacing = this.calculateSpacingVariance(horizontalLines);
    const vSpacing = this.calculateSpacingVariance(verticalLines);
    
    // Lower variance = more regular = higher confidence
    const regularity = 1 / (1 + (hSpacing + vSpacing) / 1000);
    
    // More lines = higher confidence (up to a point)
    const lineDensity = Math.min(1, (horizontalLines.length + verticalLines.length) / 20);
    
    return (regularity + lineDensity) / 2;
  }

  /**
   * Calculate variance in spacing between lines
   */
  private calculateSpacingVariance(lines: number[]): number {
    if (lines.length < 2) return 0;

    const spacings: number[] = [];
    for (let i = 1; i < lines.length; i++) {
      spacings.push(lines[i] - lines[i - 1]);
    }

    const mean = spacings.reduce((a, b) => a + b) / spacings.length;
    const variance = spacings.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / spacings.length;

    return variance;
  }

  /**
   * Convert detected table to Markdown format
   */
  tableToMarkdown(table: DetectedTable): string {
    const { rows, cols, cells } = table;
    const lines: string[] = [];

    for (let row = 0; row < rows; row++) {
      const rowCells = cells[row].map(cell => cell.text || ' ');
      lines.push('| ' + rowCells.join(' | ') + ' |');
      
      // Add header separator after first row
      if (row === 0) {
        lines.push('| ' + new Array(cols).fill('---').join(' | ') + ' |');
      }
    }

    return lines.join('\n');
  }

  /**
   * Convert detected table to CSV format
   */
  tableToCSV(table: DetectedTable): string {
    const { rows, cells } = table;
    const lines: string[] = [];

    for (let row = 0; row < rows; row++) {
      const rowCells = cells[row].map(cell => {
        const text = cell.text || '';
        // Escape quotes and wrap in quotes if contains comma
        if (text.includes(',') || text.includes('"')) {
          return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      });
      lines.push(rowCells.join(','));
    }

    return lines.join('\n');
  }

  /**
   * Convert detected table to JSON format
   */
  tableToJSON(table: DetectedTable): object {
    const { rows, cols, cells } = table;
    const headers = cells[0]?.map(cell => cell.text) || [];
    const data: Record<string, string>[] = [];

    for (let row = 1; row < rows; row++) {
      const rowData: Record<string, string> = {};
      for (let col = 0; col < cols; col++) {
        const header = headers[col] || `col_${col}`;
        rowData[header] = cells[row][col]?.text || '';
      }
      data.push(rowData);
    }

    return {
      headers,
      data,
      metadata: {
        rows,
        cols,
        confidence: table.confidence,
      },
    };
  }
}

export default TableDetector;
