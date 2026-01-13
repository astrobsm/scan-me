import React, { useState } from 'react';
import { Stethoscope, Wifi, Zap, Shield, Trash2 } from 'lucide-react';
import './SettingsPage.css';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    medicalMode: false,
    offlineMode: true,
    highQuality: true,
    saveHistory: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* OCR Settings */}
      <section className="settings-section">
        <h2>OCR Settings</h2>
        
        <div className="setting-row">
          <div className="setting-info">
            <Stethoscope size={24} />
            <div>
              <h3>Medical Mode</h3>
              <p>Enhanced recognition for medical terminology</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.medicalMode}
              onChange={() => toggle('medicalMode')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <Wifi size={24} />
            <div>
              <h3>Offline Mode</h3>
              <p>Process images without internet connection</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.offlineMode}
              onChange={() => toggle('offlineMode')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <Zap size={24} />
            <div>
              <h3>High Quality</h3>
              <p>Better accuracy, slower processing</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.highQuality}
              onChange={() => toggle('highQuality')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </section>

      {/* Privacy */}
      <section className="settings-section">
        <h2>Privacy</h2>
        
        <div className="setting-row">
          <div className="setting-info">
            <Shield size={24} />
            <div>
              <h3>Save History</h3>
              <p>Keep scanned documents locally</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={() => toggle('saveHistory')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <button className="btn btn-danger">
          <Trash2 size={18} />
          Clear All Data
        </button>
      </section>

      {/* About */}
      <section className="settings-section">
        <h2>About</h2>
        <div className="about-row">
          <span>Version</span>
          <span>1.0.0</span>
        </div>
        <div className="about-row">
          <a href="#">Privacy Policy</a>
        </div>
        <div className="about-row">
          <a href="#">Terms of Service</a>
        </div>
      </section>
    </div>
  );
}
