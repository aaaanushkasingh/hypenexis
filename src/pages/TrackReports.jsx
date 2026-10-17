import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  PlusCircle, 
  LogIn, 
  MapPin, 
  Calendar, 
  Filter, 
  SendHorizontal
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ReportCard from '../components/ReportCard';
import ReportDetailModal from '../components/ReportDetailModal';
import { STATUS_LIST } from '../utils/constants';

export default function TrackReports({ 
  currentUser, 
  reports, 
  initialSearchId = '', 
  onNavigate, 
  onUpvote, 
  isUpvoted 
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchId);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  // If user is signed in, highlight their reports; if not, show all registered reports with instant ID search
  const displayedReports = useMemo(() => {
    return reports.filter(report => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        report.id.toLowerCase().includes(q) ||
        report.location.toLowerCase().includes(q) ||
        report.category.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-badge">
          <SendHorizontal size={15} />
          <span>Road Department Tracking</span>
        </div>
        <h1 className="page-title">Track Status of Road Reports</h1>
        <p className="page-subtitle">
          Click any report below to open the status window and verify municipal dispatch to the Road Department.
        </p>
      </div>

      {/* Search & Status Filters */}
      <div className="track-controls-card">
        <div className="track-search-box">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search by Report ID (e.g. #101, #123), location near MUJ, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input track-search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>

        <div className="status-filter-scroll">
          <button
            className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Reports ({reports.length})
          </button>
          {STATUS_LIST.map((st) => {
            const count = reports.filter(r => r.status === st).length;
            return (
              <button
                key={st}
                className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                <span>{st}</span>
                <span className="filter-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Grid */}
      {displayedReports.length > 0 ? (
        <div className="reports-grid">
          {displayedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onSelect={(rep) => setSelectedReport(rep)}
              onUpvote={onUpvote}
              isUpvoted={isUpvoted(report.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-circle">
            <FileText size={38} className="empty-icon" />
          </div>
          <h3 className="empty-title">No Reports Found</h3>
          <p className="empty-desc">
            No incident matches "{searchQuery}". You can submit a new hazard report to track it here.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => onNavigate('report')}
          >
            <PlusCircle size={17} />
            <span>Report an Issue</span>
          </button>
        </div>
      )}

      {/* Report Detail Modal ("Report Submitted to Road Department") */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        onUpvote={onUpvote}
        isUpvoted={selectedReport ? isUpvoted(selectedReport.id) : false}
      />
    </div>
  );
}
