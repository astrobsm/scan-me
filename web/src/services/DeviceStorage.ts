/**
 * CHARLES-DOUGLAS SCAN APP
 * Device Storage Service - Uses IndexedDB + File System Access API
 * Saves scanned documents to device storage
 */

export interface ScanDocument {
  id: string;
  name: string;
  originalImage: Blob;
  recognizedText: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  folder: string;
}

export interface StorageStats {
  totalDocuments: number;
  totalSize: number;
  folders: string[];
}

const DB_NAME = 'CharlesDouglasScanDB';
const DB_VERSION = 1;
const STORE_NAME = 'scans';

class DeviceStorageService {
  private db: IDBDatabase | null = null;
  private directoryHandle: FileSystemDirectoryHandle | null = null;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('folder', 'folder', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  /**
   * Request access to device file system (for saving to actual folders)
   */
  async requestFileSystemAccess(): Promise<boolean> {
    try {
      if ('showDirectoryPicker' in window) {
        this.directoryHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'documents',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('File system access denied:', error);
      return false;
    }
  }

  /**
   * Save a scanned document
   */
  async saveScan(document: Omit<ScanDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScanDocument> {
    const doc: ScanDocument = {
      ...document,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to IndexedDB
    await this.saveToIndexedDB(doc);

    // Also save to file system if access granted
    if (this.directoryHandle) {
      await this.saveToFileSystem(doc);
    }

    return doc;
  }

  /**
   * Save to IndexedDB
   */
  private async saveToIndexedDB(doc: ScanDocument): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(doc);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Save to device file system
   */
  private async saveToFileSystem(doc: ScanDocument): Promise<void> {
    if (!this.directoryHandle) return;

    try {
      // Create folder if needed
      const folderHandle = await this.directoryHandle.getDirectoryHandle(
        doc.folder || 'Scans',
        { create: true }
      );

      // Save image
      const imageFile = await folderHandle.getFileHandle(
        `${doc.name}.png`,
        { create: true }
      );
      const imageWritable = await imageFile.createWritable();
      await imageWritable.write(doc.originalImage);
      await imageWritable.close();

      // Save text
      const textFile = await folderHandle.getFileHandle(
        `${doc.name}.txt`,
        { create: true }
      );
      const textWritable = await textFile.createWritable();
      await textWritable.write(doc.recognizedText);
      await textWritable.close();

      console.log(`Saved to file system: ${doc.folder}/${doc.name}`);
    } catch (error) {
      console.error('Failed to save to file system:', error);
    }
  }

  /**
   * Get all scanned documents
   */
  async getAllScans(): Promise<ScanDocument[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get scans by folder
   */
  async getScansByFolder(folder: string): Promise<ScanDocument[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('folder');
      const request = index.getAll(folder);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get a single scan by ID
   */
  async getScanById(id: string): Promise<ScanDocument | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Update a scan
   */
  async updateScan(id: string, updates: Partial<ScanDocument>): Promise<void> {
    const existing = await this.getScanById(id);
    if (!existing) throw new Error('Scan not found');

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveToIndexedDB(updated);

    if (this.directoryHandle) {
      await this.saveToFileSystem(updated);
    }
  }

  /**
   * Delete a scan
   */
  async deleteScan(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get all folders
   */
  async getFolders(): Promise<string[]> {
    const scans = await this.getAllScans();
    const folders = new Set(scans.map(s => s.folder));
    return Array.from(folders);
  }

  /**
   * Create a new folder
   */
  async createFolder(name: string): Promise<void> {
    if (this.directoryHandle) {
      await this.directoryHandle.getDirectoryHandle(name, { create: true });
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<StorageStats> {
    const scans = await this.getAllScans();
    let totalSize = 0;

    for (const scan of scans) {
      totalSize += scan.originalImage.size;
      totalSize += new Blob([scan.recognizedText]).size;
    }

    return {
      totalDocuments: scans.length,
      totalSize,
      folders: await this.getFolders(),
    };
  }

  /**
   * Export scan to downloads
   */
  async exportToDownloads(id: string, format: 'png' | 'txt' | 'pdf'): Promise<void> {
    const scan = await this.getScanById(id);
    if (!scan) throw new Error('Scan not found');

    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'png':
        blob = scan.originalImage;
        filename = `${scan.name}.png`;
        break;
      case 'txt':
        blob = new Blob([scan.recognizedText], { type: 'text/plain' });
        filename = `${scan.name}.txt`;
        break;
      case 'pdf':
        // For PDF, we'd use the export service
        blob = new Blob([scan.recognizedText], { type: 'application/pdf' });
        filename = `${scan.name}.pdf`;
        break;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const deviceStorage = new DeviceStorageService();
export default deviceStorage;
