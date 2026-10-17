import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  ThumbsUp, 
  Copy, 
  Check, 
  Building2, 
  CheckCircle2,
  Clock,
  SendHorizontal
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { STATUS_LIST, STATUS_DESCRIPTIONS } from '../utils/constants';

export default function ReportDetailModal({ report, isOpen, onClose, onUpvote, isUpvoted }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(report.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStatusIndex = Math.max(0, STATUS_LIST.indexOf(report.status));

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card track-status-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-id-pill">
              <span className="id-code">Report ID {report.id}</span>
              <button 
                className="copy-btn" 
                onClick={handleCopyId} 
                title="Copy Report ID"
                aria-label="Copy Report ID"
              >
                {copied ? <Check size={14} className="copy-success" /> : <Copy size={14} />}
              </button>
            </div>
            <span className="verified-tag">Civic Hazard Report</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body">
          {/* Prominent Announcement Banner */}
          <div className="road-dept-banner">
            <div className="road-dept-icon-circle">
              <SendHorizontal size={22} className="road-dept-icon" />
            </div>
            <div className="road-dept-text">
              <h3 className="road-dept-headline">Report Submitted to Road Department</h3>
              <p className="road-dept-sub">
                This incident has been officially transmitted to municipal road engineers for site inspection and repair triage.
              </p>
            </div>
          </div>

          {/* Main Photo / Image */}
          <div className="modal-image-wrapper">
            <img 
              src={report.image} 
              alt={`${report.category} hazard evidence`} 
              className="modal-image"
            />
            <div className="modal-image-overlay">
              <span className="category-tag">{report.category}</span>
              <PriorityBadge priority={report.priority} />
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="modal-quick-stats">
            <div className="quick-stat-item">
              <span className="stat-label">Current Status</span>
              <div className="stat-value">
                <StatusBadge status={report.status} />
              </div>
            </div>
            <div className="quick-stat-item">
              <span className="stat-label">Assessed Priority</span>
              <div className="stat-value">
                <span className="priority-pill-text">{report.priority} Priority</span>
              </div>
            </div>
            <div className="quick-stat-item">
              <span className="stat-label">Community Support</span>
              <button 
                className={`stat-upvote-btn ${isUpvoted ? 'active' : ''}`}
                onClick={() => onUpvote && onUpvote(report.id)}
              >
                <ThumbsUp size={15} />
                <span>{report.upvotes || 0} Upvotes</span>
              </button>
            </div>
          </div>

          {/* Status Progression Timeline */}
          <div className="timeline-section">
            <h4 className="section-heading">Road Department Resolution Progress</h4>
            <div className="status-timeline">
              {STATUS_LIST.map((step, idx) => {
                const isCompleted = idx < currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <div 
                    key={step} 
                    className={`timeline-step ${isCompleted ? 'step-done' : ''} ${isCurrent ? 'step-active' : ''}`}
                  >
                    <div className="step-indicator">
                      <div className="indicator-circle">
                        {isCompleted ? <Check size={12} /> : idx + 1}
                      </div>
                      {idx < STATUS_LIST.length - 1 && <div className="step-line" />}
                    </div>
                    <div className="step-content">
                      <span className="step-title">{step}</span>
                      <span className="step-desc">{STATUS_DESCRIPTIONS[step]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location & Authority Details */}
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon">
                <MapPin size={18} />
              </div>
              <div className="detail-text">
                <span className="detail-label">Location</span>
                <span className="detail-value">{report.location}</span>
                {report.coordinates && (
                  <span className="detail-subvalue coordinates-code">
                    GPS: {report.coordinates}
                  </span>
                )}
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Calendar size={18} />
              </div>
              <div className="detail-text">
                <span className="detail-label">Date Logged</span>
                <span className="detail-value">{report.submissionDate}</span>
                <span className="detail-subvalue">Registered in civic system</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <Building2 size={18} />
              </div>
              <div className="detail-text">
                <span className="detail-label">Assigned Department</span>
                <span className="detail-value">
                  {report.assignedAuthority || 'State Highway & Municipal Road Department'}
                </span>
                <span className="detail-subvalue">
                  Timeline: {report.eta || 'Standard Dispatch SLA'}
                </span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">
                <User size={18} />
              </div>
              <div className="detail-text">
                <span className="detail-label">Submitted By</span>
                <span className="detail-value">{report.userName || 'Commuter'}</span>
                <span className="detail-subvalue">
                  {report.userEmail || 'Direct Citizen Submission'}
                </span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {report.description && (
            <div className="description-section">
              <h4 className="section-heading">Citizen Remarks</h4>
              <div className="description-box">
                <p>{report.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className={`btn-primary upvote-action-btn ${isUpvoted ? 'btn-voted' : ''}`}
            onClick={() => onUpvote && onUpvote(report.id)}
          >
            <ThumbsUp size={16} />
            <span>{isUpvoted ? 'Remove Upvote' : 'Upvote Road Hazard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
