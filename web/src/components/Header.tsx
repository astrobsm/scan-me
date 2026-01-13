import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Clock, Settings, Scan, Volume2, Mic, Languages } from 'lucide-react';
import './Header.css';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: FileText },
    { path: '/scan', label: 'Scan', icon: Scan },
    { path: '/translate', label: 'Translate', icon: Languages },
    { path: '/text-to-speech', label: 'TTS', icon: Volume2 },
    { path: '/speech-to-text', label: 'STT', icon: Mic },
    { path: '/history', label: 'History', icon: Clock },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">CHARLES-DOUGLAS</span>
        </Link>

        <nav className="nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
