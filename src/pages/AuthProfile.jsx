import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  FileText, 
  PlusCircle, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { saveCurrentUser, clearCurrentUser, getUserReports } from '../utils/storage';

export default function AuthProfile({ currentUser, onUserChange, onNavigate, showToast }) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    if (!phone.trim()) {
      errs.phone = 'Contact phone number is required.';
    } else if (phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please enter a valid phone number with at least 10 digits.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userProfile = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    saveCurrentUser(userProfile);
    onUserChange(userProfile);
    if (showToast) showToast(`Welcome back, ${userProfile.name}! Demo session active.`);
  };

  // Quick 1-Click Demo Login for Hackathon Judges
  const handleQuickDemoLogin = (demoName, demoEmail, demoPhone) => {
    const userProfile = {
      name: demoName,
      email: demoEmail,
      phone: demoPhone,
      joinedDate: '10 Oct 2026'
    };
    saveCurrentUser(userProfile);
    onUserChange(userProfile);
    if (showToast) showToast(`Signed in as demo citizen: ${demoName}`);
  };

  const handleLogout = () => {
    clearCurrentUser();
    onUserChange(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setErrors({});
    if (showToast) showToast('Logged out of demo citizen profile.');
  };

  // IF USER IS ALREADY SIGNED IN -> DISPLAY PROFILE DASHBOARD
  if (currentUser) {
    const userReports = getUserReports(currentUser.email);

    return (
      <div className="page-container">
        <div className="profile-dashboard-card">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              <User size={38} className="avatar-icon" />
            </div>
            <div className="profile-header-info">
              <div className="profile-name-row">
                <h2 className="profile-name">{currentUser.name}</h2>
                <span className="profile-badge-active">Active Demo Session</span>
              </div>
              <p className="profile-email">{currentUser.email}</p>
              <p className="profile-joined">Citizen Member Since: {currentUser.joinedDate || 'October 2026'}</p>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Log out of demo session">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Demo Notice Banner */}
          <div className="demo-disclaimer-banner">
            <Info size={17} className="banner-icon" />
            <div className="banner-text">
              <strong>Demonstration Authentication Notice:</strong> This profile is maintained in your browser's local storage for evaluation purposes. No passwords are stored or required.
            </div>
          </div>

          {/* Stats Bar */}
          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <span className="stat-label">Your Submitted Reports</span>
              <span className="stat-number">{userReports.length}</span>
              <span className="stat-hint">Stored in this browser session</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-label">Phone Verified</span>
              <span className="stat-contact-val">{currentUser.phone}</span>
              <span className="stat-hint">Civic SMS notification ready</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-label">Community Status</span>
              <span className="stat-tag-comm">Verified Commuter</span>
              <span className="stat-hint">Active Contributor</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="profile-actions-section">
            <h4 className="actions-heading">Quick Actions</h4>
            <div className="actions-button-grid">
              <button 
                className="action-card-btn"
                onClick={() => onNavigate('track')}
              >
                <div className="action-btn-icon">
                  <FileText size={20} />
                </div>
                <div className="action-btn-text">
                  <span className="action-title">Track My Reports</span>
                  <span className="action-sub">View status timeline for your {userReports.length} reports</span>
                </div>
                <ArrowRight size={18} className="action-arrow" />
              </button>

              <button 
                className="action-card-btn highlight"
                onClick={() => onNavigate('report')}
              >
                <div className="action-btn-icon highlight">
                  <PlusCircle size={20} />
                </div>
                <div className="action-btn-text">
                  <span className="action-title">Report New Road Hazard</span>
                  <span className="action-sub">Upload photo & GPS to alert municipal workers</span>
                </div>
                <ArrowRight size={18} className="action-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SIGN IN / REGISTRATION INTERFACE
  return (
    <div className="page-container">
      <div className="auth-card-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-circle">
            <User size={28} />
          </div>
          <h1 className="auth-title">Citizen Sign In / Registration</h1>
          <p className="auth-subtitle">
            Sign in to track your road reports, receive municipal status updates, and build safer roads.
          </p>
        </div>

        {/* Clear Prototype Notice */}
        <div className="demo-disclaimer-banner">
          <Info size={18} className="banner-icon" />
          <div className="banner-text">
            <strong>Hackathon Demo Session:</strong> Enter your basic details below or click one-click demo login. No passwords or sensitive data are collected.
          </div>
        </div>

        {/* 1-Click Quick Demo Login for Judges */}
        <div className="judge-quick-bar">
          <span className="judge-quick-title">
            <Sparkles size={14} />
            Quick Demo Profiles for Hackathon Evaluators:
          </span>
          <div className="judge-preset-buttons">
            <button
              type="button"
              className="btn-preset"
              onClick={() => handleQuickDemoLogin('Karan Sharma', 'demo.citizen@margmitra.org', '+91 98765 43210')}
            >
              Log In as Karan Sharma (Demo Citizen)
            </button>
            <button
              type="button"
              className="btn-preset secondary"
              onClick={() => handleQuickDemoLogin('Priya Mehra', 'priya.mehra@civic.test', '+91 91234 56789')}
            >
              Log In as Priya Mehra
            </button>
          </div>
        </div>

        <div className="auth-or-divider">
          <span>or enter your details</span>
        </div>

        {/* Main Login Form */}
        <form className="auth-form" onSubmit={handleSignIn} noValidate>
          {/* Full Name */}
          <div className="form-field-group">
            <label htmlFor="auth-name" className="field-label">
              Full Name <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <User size={17} className="field-icon" />
              <input
                id="auth-name"
                type="text"
                placeholder="e.g. Karan Sharma"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((prev) => ({ ...prev, fullName: null }));
                }}
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              />
            </div>
            {errors.fullName && <span className="field-error-message">{errors.fullName}</span>}
          </div>

          {/* Email Address */}
          <div className="form-field-group">
            <label htmlFor="auth-email" className="field-label">
              Email Address <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <Mail size={17} className="field-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: null }));
                }}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
              />
            </div>
            {errors.email && <span className="field-error-message">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-field-group">
            <label htmlFor="auth-phone" className="field-label">
              Phone Number <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <Phone size={17} className="field-icon" />
              <input
                id="auth-phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: null }));
                }}
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
              />
            </div>
            {errors.phone && <span className="field-error-message">{errors.phone}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary btn-auth-submit">
            <ShieldCheck size={18} />
            <span>Enter Demo Platform</span>
          </button>
        </form>
      </div>
    </div>
  );
}
