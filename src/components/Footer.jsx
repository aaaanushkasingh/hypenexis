import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Footer({ onResetDemo, onNavigate }) {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-top-row">
          <div className="footer-brand-info">
            <div className="footer-logo">
              <img src="/logo.png" alt="MargMitra Logo" className="footer-logo-img" />
              <span className="footer-brand-name">MargMitra</span>
            </div>
            <p className="footer-desc">
              Civic-tech road hazard reporting and commuter safety platform. 
              Connecting everyday travelers with road engineering departments for rapid incident resolution.
            </p>
          </div>

          <div className="footer-links-group">
            <span className="footer-heading">Navigation</span>
            <button className="footer-link-btn" onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <button className="footer-link-btn" onClick={() => onNavigate('report')}>Report Hazard</button>
            <button className="footer-link-btn" onClick={() => onNavigate('community')}>Community Feed</button>
            <button className="footer-link-btn" onClick={() => onNavigate('track')}>Track Status</button>
          </div>

          <div className="footer-demo-controls">
            <span className="footer-heading">Data Management</span>
            <p className="footer-demo-text">
              Testing incident submission? Restore sample data (including MUJ Pothole) anytime.
            </p>
            <button className="btn-reset-demo" onClick={onResetDemo} title="Reset reports to initial sample data">
              <RefreshCw size={14} />
              <span>Reset Sample Reports</span>
            </button>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom-row">
          <div className="footer-copyright">
            <span>© 2026 MargMitra • Civic Road Safety Network</span>
          </div>
          <div className="footer-badges">
            <span className="tech-badge">React + Vite</span>
            <span className="tech-badge">Local Persistence</span>
            <span className="tech-badge accent">Civic Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
