import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  SendHorizontal
} from 'lucide-react';
import ReportCard from '../components/ReportCard';
import ReportDetailModal from '../components/ReportDetailModal';
import { CATEGORIES } from '../utils/constants';

export default function CommunityFeed({ 
  reports, 
  onUpvote, 
  isUpvoted, 
  onNavigate 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('upvotes');
  const [selectedReport, setSelectedReport] = useState(null);

  // Compute stats
  const stats = useMemo(() => {
    const total = reports.length;
    const totalVotes = reports.reduce((acc, r) => acc + (r.upvotes || 0), 0);
    const inProgressOrSubmitted = reports.filter(r => r.status !== 'Resolved').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    return { total, totalVotes, inProgressOrSubmitted, resolved };
  }, [reports]);

  // Filter and sort
  const displayedReports = useMemo(() => {
    let result = reports.filter((report) => {
      const matchesCategory = selectedCategory === 'ALL' || report.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        report.location.toLowerCase().includes(q) ||
        report.category.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q) ||
        (report.description && report.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'upvotes') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      } else {
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
    });

    return result;
  }, [reports, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-badge">
          <Users size={15} />
          <span>Community Commuter Feed</span>
        </div>
        <h1 className="page-title">Community Road Hazards</h1>
        <p className="page-subtitle">
          Real-time alerts submitted by daily commuters and university students. Upvote urgent hazards to accelerate road department repairs.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="community-stats-bar">
        <div className="community-stat-item">
          <div className="stat-circle">
            <Layers size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-text">Total Reports</span>
          </div>
        </div>

        <div className="community-stat-item">
          <div className="stat-circle warning">
            <SendHorizontal size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.inProgressOrSubmitted}</span>
            <span className="stat-text">Active Hazards</span>
          </div>
        </div>

        <div className="community-stat-item">
          <div className="stat-circle success">
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.resolved}</span>
            <span className="stat-text">Resolved Repairs</span>
          </div>
        </div>

        <div className="community-stat-item">
          <div className="stat-circle accent">
            <TrendingUp size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.totalVotes}</span>
            <span className="stat-text">Community Upvotes</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="community-controls-card">
        <div className="controls-top-row">
          <div className="search-input-box">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search reports near MUJ, Dahmi Kalan, Potholes, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input community-search-input"
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

          <div className="sort-control">
            <span className="sort-label">Sort:</span>
            <button
              className={`sort-pill ${sortBy === 'upvotes' ? 'active' : ''}`}
              onClick={() => setSortBy('upvotes')}
            >
              <TrendingUp size={14} />
              <span>Most Upvoted</span>
            </button>
            <button
              className={`sort-pill ${sortBy === 'latest' ? 'active' : ''}`}
              onClick={() => setSortBy('latest')}
            >
              <Clock size={14} />
              <span>Newest</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Pothole, Water Logging, Obstacle, Other) */}
        <div className="category-filter-bar">
          <span className="filter-lead">Category:</span>
          <button
            className={`category-pill-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Categories ({reports.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = reports.filter(r => r.category === cat).length;
            return (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                {count > 0 && <span className="cat-count-pill">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Feed Grid */}
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
            <Users size={38} className="empty-icon" />
          </div>
          <h3 className="empty-title">No Matching Reports</h3>
          <p className="empty-desc">
            No hazards match "{searchQuery}" under category "{selectedCategory}".
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
          >
            Clear Filters
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
