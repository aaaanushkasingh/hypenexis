import React from 'react';
import { 
  PlusCircle, 
  Users, 
  FileText, 
  MapPin, 
  ShieldAlert, 
  Camera, 
  Navigation, 
  Cpu, 
  Building2, 
  ArrowRight, 
  ThumbsUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Dashboard({ 
  onNavigate, 
  reports = [], 
  onUpvote, 
  isUpvoted 
}) {
  const mujReport = reports.find(r => r.location && r.location.includes('MUJ')) || reports[0];

  return (
    <div className="page-container dashboard-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldAlert size={16} />
            <span>AI-Assisted Civic Safety Platform</span>
          </div>

          <h1 className="hero-headline">
            See a Road Hazard? <br />
            <span className="hero-accent">Report in Seconds.</span>
          </h1>

          <p className="hero-subtext">
            MargMitra bridges citizens and civic road authorities. Upload hazard photos, 
            capture GPS coordinates, detect severity with AI, and track municipal repairs in real time.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn-hero-primary"
              onClick={() => onNavigate('report')}
            >
              <PlusCircle size={20} />
              <span>Report Issue</span>
              <ArrowRight size={18} />
            </button>

            <button 
              className="btn-hero-secondary"
              onClick={() => onNavigate('community')}
            >
              <Users size={18} />
              <span>Community Feed</span>
            </button>

            <button 
              className="btn-hero-secondary"
              onClick={() => onNavigate('track')}
            >
              <FileText size={18} />
              <span>Track Status</span>
            </button>
          </div>
        </div>

        {/* Hero Illustration / Uploaded Logo */}
        <div className="hero-visual">
          <div className="hero-logo-card">
            <img 
              src="/logo.png" 
              alt="MargMitra Official Logo" 
              className="hero-logo-img" 
            />
            <div className="hero-logo-glow" />
          </div>
        </div>
      </section>

      {/* Featured Community Alert (Pothole near MUJ) */}
      {mujReport && (
        <section className="featured-alert-section">
          <div className="featured-alert-card">
            <div className="featured-badge-row">
              <span className="live-pulse-dot" />
              <span className="featured-tag">Active Commuter Alert</span>
              <span className="featured-status-pill">{mujReport.status}</span>
            </div>

            <div className="featured-body">
              <div className="featured-thumb-wrap">
                <img 
                  src={mujReport.image} 
                  alt={mujReport.category} 
                  className="featured-thumb" 
                />
              </div>

              <div className="featured-details">
                <div className="featured-category">{mujReport.category} Hazard</div>
                <h3 className="featured-title">{mujReport.location}</h3>
                <p className="featured-desc">{mujReport.description}</p>
                <div className="featured-meta">
                  <span className="meta-time">
                    <Clock size={13} />
                    {mujReport.submissionDate}
                  </span>
                  <span className="meta-prio">
                    Priority: <strong>{mujReport.priority}</strong>
                  </span>
                </div>
              </div>

              <div className="featured-action">
                <button
                  className={`btn-featured-upvote ${isUpvoted(mujReport.id) ? 'active' : ''}`}
                  onClick={() => onUpvote(mujReport.id)}
                  title="Upvote to raise civic urgency"
                >
                  <ThumbsUp size={16} />
                  <span>{mujReport.upvotes || 0} Upvotes</span>
                </button>
                <button 
                  className="btn-featured-track"
                  onClick={() => onNavigate('track', mujReport.id)}
                >
                  Track Status
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick 4-Step How It Works */}
      <section className="how-it-works-section">
        <h2 className="section-title-center">How MargMitra Works</h2>
        <p className="section-sub-center">A streamlined 4-step pipeline from citizen photo to road department resolution</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <div className="step-icon-wrap">
              <Camera size={24} />
            </div>
            <h4 className="step-title">Upload / Click Image</h4>
            <p className="step-desc">Snap a clear photo or upload an image directly from your mobile or device.</p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <div className="step-icon-wrap">
              <Navigation size={24} />
            </div>
            <h4 className="step-title">Enable GPS Location</h4>
            <p className="step-desc">Click 'Enable GPS' to automatically tag exact latitude and longitude coordinates.</p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon-wrap">
              <Cpu size={24} />
            </div>
            <h4 className="step-title">AI Priority Detection</h4>
            <p className="step-desc">Automated analysis scans hazard severity, with manual override option before dispatch.</p>
          </div>

          <div className="step-card">
            <div className="step-num">04</div>
            <div className="step-icon-wrap">
              <Building2 size={24} />
            </div>
            <h4 className="step-title">Submitted to Road Dept</h4>
            <p className="step-desc">Dispatched directly to the road department with tracking ID for transparent updates.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="dashboard-bottom-banner">
        <div className="bottom-banner-content">
          <h2>Ready to report a road hazard?</h2>
          <p>Help make roads safer for thousands of daily students and commuters.</p>
          <button 
            className="btn-primary btn-large"
            onClick={() => onNavigate('report')}
          >
            <PlusCircle size={18} />
            <span>Launch Hazard Reporter</span>
          </button>
        </div>
      </section>
    </div>
  );
}
