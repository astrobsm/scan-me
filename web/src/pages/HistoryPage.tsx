import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import './HistoryPage.css';

interface ScanItem {
  id: string;
  text: string;
  date: string;
  confidence: number;
}

const sampleHistory: ScanItem[] = [
  { id: '1', text: 'Meeting notes from project review...', date: '2026-01-12', confidence: 0.95 },
  { id: '2', text: 'Prescription for patient medication...', date: '2026-01-11', confidence: 0.88 },
  { id: '3', text: 'Lecture notes - Introduction to AI...', date: '2026-01-10', confidence: 0.92 },
];

export function HistoryPage() {
  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Scan History</h1>
        <button className="btn btn-secondary danger">
          <Trash2 size={18} />
          Clear All
        </button>
      </div>

      {sampleHistory.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <h3>No scans yet</h3>
          <p>Your scanned documents will appear here</p>
        </div>
      ) : (
        <div className="history-list">
          {sampleHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="item-icon">
                <FileText size={24} />
              </div>
              <div className="item-content">
                <p className="item-text">{item.text}</p>
                <div className="item-meta">
                  <span className="item-date">{item.date}</span>
                  <span className="item-confidence">
                    {(item.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>
              <button className="btn-icon">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
