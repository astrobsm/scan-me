import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { InstallPrompt } from './components/InstallPrompt';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { TextToSpeechPage } from './pages/TextToSpeechPage';
import { SpeechToTextPage } from './pages/SpeechToTextPage';
import { TranslationPage } from './pages/TranslationPage';
import { VoiceClonePage } from './pages/VoiceClonePage';
import { VideoCreatorPage } from './pages/VideoCreatorPage';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/translate" element={<TranslationPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/text-to-speech" element={<TextToSpeechPage />} />
          <Route path="/speech-to-text" element={<SpeechToTextPage />} />
          <Route path="/voice-clone" element={<VoiceClonePage />} />
          <Route path="/video-creator" element={<VideoCreatorPage />} />
        </Routes>
      </main>
      <InstallPrompt />
    </div>
  );
}

export default App;
