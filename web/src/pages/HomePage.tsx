import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, Zap, Shield, FileText, Globe, Languages, Volume2, AudioLines, Video } from 'lucide-react';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Convert Handwriting to Text
          <span className="hero-highlight"> Instantly</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered OCR that works offline. Perfect for medical notes, 
          lectures, and professional documents.
        </p>
        <div className="hero-actions">
          <Link to="/scan" className="btn btn-primary btn-large">
            <Camera size={24} />
            Start Scanning
          </Link>
          <Link to="/translate" className="btn btn-secondary btn-large">
            <Languages size={24} />
            Translate
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <h2 className="section-title">Why Choose CHARLES-DOUGLAS?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Offline OCR</h3>
            <p>Process documents without internet. Your data never leaves your device.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon medical">
              <FileText size={32} />
            </div>
            <h3>Medical Mode</h3>
            <p>Enhanced recognition for prescriptions and clinical notes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon translate">
              <Languages size={32} />
            </div>
            <h3>Nigerian Languages</h3>
            <p>Translate to Igbo, Hausa, Yoruba, and Pidgin English with voice.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Volume2 size={32} />
            </div>
            <h3>Text-to-Speech</h3>
            <p>Listen to translated text in native Nigerian language voices.</p>
          </div>

          <Link to="/voice-clone" className="feature-card feature-card-link">
            <div className="feature-icon voice-clone">
              <AudioLines size={32} />
            </div>
            <h3>Voice Cloning</h3>
            <p>Clone your voice for personalized text-to-speech with 100% accuracy.</p>
          </Link>

          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Privacy First</h3>
            <p>End-to-end encryption. GDPR compliant data handling.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={32} />
            </div>
            <h3>Multi-Language</h3>
            <p>Support for multiple languages and handwriting styles.</p>
          </div>

          <Link to="/video-creator" className="feature-card feature-card-link">
            <div className="feature-icon video-creator">
              <Video size={32} />
            </div>
            <h3>Video Creator</h3>
            <p>Create HD advert and health talk videos with AI avatars and conversations.</p>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Capture</h3>
            <p>Take a photo or upload an image of handwritten text</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Process</h3>
            <p>AI analyzes and recognizes the handwriting</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Export</h3>
            <p>Edit and export as PDF, Word, or plain text</p>
          </div>
        </div>
      </section>
    </div>
  );
}
