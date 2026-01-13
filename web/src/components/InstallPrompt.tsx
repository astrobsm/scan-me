/**
 * CHARLES-DOUGLAS SCAN APP
 * PWA Install Prompt Component
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import './InstallPrompt.css';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      console.log('App installed successfully!');
    }
  };

  if (isIOS) {
    return (
      <>
        <div className="install-banner ios-banner">
          <div className="install-content">
            <div className="install-icon">📲</div>
            <div className="install-text">
              <strong>Install CHARLES-DOUGLAS SCAN</strong>
              <span>Add to Home Screen for the best experience</span>
            </div>
            <button className="install-button" onClick={() => setShowIOSGuide(true)}>
              How to Install
            </button>
            <button className="dismiss-button" onClick={() => setDismissed(true)}>
              ✕
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <div className="ios-guide-overlay" onClick={() => setShowIOSGuide(false)}>
            <div className="ios-guide-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Install on iOS</h3>
              <ol className="ios-steps">
                <li>
                  <span className="step-icon">📤</span>
                  <span>Tap the <strong>Share</strong> button in Safari</span>
                </li>
                <li>
                  <span className="step-icon">➕</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                </li>
                <li>
                  <span className="step-icon">✓</span>
                  <span>Tap <strong>"Add"</strong> to confirm</span>
                </li>
              </ol>
              <button className="close-guide-button" onClick={() => setShowIOSGuide(false)}>
                Got it!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="install-banner">
      <div className="install-content">
        <div className="install-icon">📱</div>
        <div className="install-text">
          <strong>Install CHARLES-DOUGLAS SCAN</strong>
          <span>Get instant access and offline scanning</span>
        </div>
        <button className="install-button" onClick={handleInstall}>
          Install App
        </button>
        <button className="dismiss-button" onClick={() => setDismissed(true)}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
