import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Users, 
  User, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo with User-Uploaded Image */}
        <div className="navbar-brand" onClick={() => handleNavClick('dashboard')} role="button" tabIndex={0}>
          <img 
            src="/logo.png" 
            alt="MargMitra Logo" 
            className="brand-logo-img" 
          />
          <div className="logo-text-group">
            <span className="brand-name">
              Marg<span className="brand-accent">Mitra</span>
            </span>
            <span className="brand-badge">Civic Road Safety</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <button
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'nav-active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <LayoutDashboard size={17} className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'community' ? 'nav-active' : ''}`}
            onClick={() => handleNavClick('community')}
          >
            <Users size={17} className="nav-icon" />
            <span>Community</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'track' ? 'nav-active' : ''}`}
            onClick={() => handleNavClick('track')}
          >
            <FileText size={17} className="nav-icon" />
            <span>Track Status</span>
          </button>

          {/* Prominent Report Issue Button */}
          <button
            className={`nav-report-btn ${activeTab === 'report' ? 'nav-report-active' : ''}`}
            onClick={() => handleNavClick('report')}
          >
            <PlusCircle size={17} />
            <span>Report Issue</span>
          </button>
        </nav>

        {/* Top Right Corner -> Login / Sign Up buttons */}
        <div className="navbar-auth-group">
          {currentUser ? (
            <button 
              className="user-profile-pill"
              onClick={() => handleNavClick('profile')}
              title={`Logged in as ${currentUser.name}`}
            >
              <div className="user-avatar-mini">
                <User size={15} />
              </div>
              <span className="user-name-label">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <div className="auth-buttons-header">
              <button 
                className="btn-auth-nav btn-login"
                onClick={() => onOpenAuth ? onOpenAuth('login') : handleNavClick('profile')}
              >
                <LogIn size={15} />
                <span>Login</span>
              </button>

              <button 
                className="btn-auth-nav btn-signup"
                onClick={() => onOpenAuth ? onOpenAuth('signup') : handleNavClick('profile')}
              >
                <UserPlus size={15} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-links">
            <button
              className={`mobile-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </button>

            <button
              className={`mobile-nav-link ${activeTab === 'report' ? 'active' : ''}`}
              onClick={() => handleNavClick('report')}
            >
              <PlusCircle size={19} />
              <span>Report Issue</span>
            </button>

            <button
              className={`mobile-nav-link ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => handleNavClick('community')}
            >
              <Users size={19} />
              <span>Community Feed</span>
            </button>

            <button
              className={`mobile-nav-link ${activeTab === 'track' ? 'active' : ''}`}
              onClick={() => handleNavClick('track')}
            >
              <FileText size={19} />
              <span>Track Status</span>
            </button>

            <div className="mobile-drawer-auth">
              {currentUser ? (
                <button
                  className="mobile-nav-link user"
                  onClick={() => handleNavClick('profile')}
                >
                  <User size={19} />
                  <span>Profile ({currentUser.name})</span>
                </button>
              ) : (
                <div className="mobile-auth-row">
                  <button
                    className="btn-secondary w-full"
                    onClick={() => { setMobileMenuOpen(false); handleNavClick('profile'); }}
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                  <button
                    className="btn-primary w-full"
                    onClick={() => { setMobileMenuOpen(false); handleNavClick('profile'); }}
                  >
                    <UserPlus size={16} />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
