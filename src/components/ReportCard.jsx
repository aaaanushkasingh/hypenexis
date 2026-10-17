import React from 'react';
import { MapPin, Calendar, ThumbsUp, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function ReportCard({ 
  report, 
  onSelect, 
  onUpvote, 
  isUpvoted = false,
  showFullDetailsBtn = true
}) {
  const handleUpvoteClick = (e) => {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(report.id);
    }
  };

  return (
    <div 
      className="report-card" 
      onClick={() => onSelect && onSelect(report)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(report);
        }
      }}
    >
      {/* Top Banner / Image Container */}
      <div className="card-image-container">
        <img 
          src={report.image} 
          alt={`${report.category} hazard`} 
          className="card-image"
          loading="lazy"
        />
        <div className="card-image-gradient" />
        
        {/* Floating Badges */}
        <div className="card-floating-badges">
          <span className="card-category-badge">{report.category}</span>
          {report.isDemo ? (
            <span className="badge-demo-flag" title="Pre-seeded demonstration data for hackathon judges">
              Demo Data
            </span>
          ) : (
            <span className="badge-user-flag" title="Submitted by citizen commuter">
              User Report
            </span>
          )}
        </div>

        {/* Priority Overlay */}
        <div className="card-priority-overlay">
          <PriorityBadge priority={report.priority} />
        </div>
      </div>

      {/* Card Content Area */}
      <div className="card-body">
        {/* Header: Report ID & Status */}
        <div className="card-meta-row">
          <span className="card-id">{report.id}</span>
          <StatusBadge status={report.status} size="small" />
        </div>

        {/* Location */}
        <div className="card-location-row">
          <MapPin size={16} className="loc-icon" />
          <span className="card-location-text" title={report.location}>
            {report.location}
          </span>
        </div>

        {/* Short Description */}
        {report.description && (
          <p className="card-snippet">
            {report.description.length > 95 
              ? `${report.description.substring(0, 95)}...` 
              : report.description}
          </p>
        )}

        {/* Footer: Date & Upvote Action */}
        <div className="card-footer">
          <div className="card-date-info">
            <Calendar size={13} className="date-icon" />
            <span>{report.submissionDate}</span>
          </div>

          <div className="card-actions">
            <button
              type="button"
              className={`upvote-pill ${isUpvoted ? 'upvote-active' : ''}`}
              onClick={handleUpvoteClick}
              title={isUpvoted ? 'Click to remove upvote' : 'Click to upvote this report'}
              aria-label={`Upvote report ${report.id}. Current upvotes: ${report.upvotes || 0}`}
            >
              <ThumbsUp size={14} className="upvote-icon" />
              <span className="upvote-count">{report.upvotes || 0}</span>
            </button>

            {showFullDetailsBtn && (
              <button 
                type="button" 
                className="btn-details-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect && onSelect(report);
                }}
                aria-label="View report details"
              >
                <Eye size={14} />
                <span>Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
