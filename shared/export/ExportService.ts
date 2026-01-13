/**
 * Export Service
 * Handles all export operations
 */

import { generatePDF } from './pdfExport';
import { generateWord } from './wordExport';
import { generateText } from './textExport';

export type ExportFormat = 'pdf' | 'docx' | 'txt';

export interface ExportOptions {
  filename: string;
  title?: string;
  includeMetadata?: boolean;
  includeImage?: boolean;
}

export class ExportService {
  /**
   * Export text to specified format
   */
  async export(
    text: string,
    format: ExportFormat,
    options: ExportOptions
  ): Promise<Blob> {
    switch (format) {
      case 'pdf':
        return generatePDF(text, options);
      case 'docx':
        return generateWord(text, options);
      case 'txt':
        return generateText(text, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export and download file
   */
  async exportAndDownload(
    text: string,
    format: ExportFormat,
    options: ExportOptions
  ): Promise<void> {
    const blob = await this.export(text, format, options);
    const extension = format === 'docx' ? 'docx' : format;
    const filename = `${options.filename}.${extension}`;
    
    this.downloadBlob(blob, filename);
  }

  /**
   * Trigger file download
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
