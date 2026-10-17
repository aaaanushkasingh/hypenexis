import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import TrackReports from './pages/TrackReports';
import CommunityFeed from './pages/CommunityFeed';
import AuthProfile from './pages/AuthProfile';
import { 
  getReports, 
  getCurrentUser, 
  isReportUpvoted, 
  toggleReportVote, 
  resetToDemoData 
} from './utils/storage';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Starts on Dashboard
  const [reports, setReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [trackSearchId, setTrackSearchId] = useState('');
  const [voteVersion, setVoteVersion] = useState(0);

  // Initialize data on load
  useEffect(() => {
    const loadedReports = getReports();
    setReports(loadedReports);

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast({ message: '', type: 'success' });
  }, []);

  // Navigation handler
  const handleNavigate = useCallback((tabId, searchId = '') => {
    if (searchId) {
      setTrackSearchId(searchId);
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Upvote toggle
  const handleToggleUpvote = useCallback((reportId) => {
    const result = toggleReportVote(reportId);
    const updated = getReports();
    setReports(updated);
    setVoteVersion(v => v + 1);

    if (result.upvoted) {
      showToast('Upvoted! Incident flagged for high civic attention.', 'success');
    } else {
      showToast('Upvote removed.', 'info');
    }
  }, [showToast]);

  const checkIsUpvoted = useCallback((reportId) => {
    return isReportUpvoted(reportId);
  }, [voteVersion]);

  // When report is created
  const handleReportCreated = useCallback((newReport) => {
    const updated = getReports();
    setReports(updated);
    showToast(`Report ${newReport.id} submitted to Road Department!`, 'success');
  }, [showToast]);

  // Demo data reset
  const handleResetDemoData = useCallback(() => {
    const resetList = resetToDemoData();
    setReports(resetList);
    setVoteVersion(v => v + 1);
    showToast('Reset to original sample reports (including MUJ Pothole).', 'info');
  }, [showToast]);

  return (
    <div className="app-layout">
      {/* Navbar with Uploaded Logo & Top Right Login/Signup buttons */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onOpenAuth={() => handleNavigate('profile')}
      />

      {/* Main Views */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            onNavigate={handleNavigate}
            reports={reports}
            onUpvote={handleToggleUpvote}
            isUpvoted={checkIsUpvoted}
          />
        )}

        {activeTab === 'report' && (
          <ReportIssue 
            currentUser={currentUser}
            onReportCreated={handleReportCreated}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'community' && (
          <CommunityFeed 
            reports={reports}
            onUpvote={handleToggleUpvote}
            isUpvoted={checkIsUpvoted}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'track' && (
          <TrackReports 
            currentUser={currentUser}
            reports={reports}
            initialSearchId={trackSearchId}
            onNavigate={handleNavigate}
            onUpvote={handleToggleUpvote}
            isUpvoted={checkIsUpvoted}
          />
        )}

        {activeTab === 'profile' && (
          <AuthProfile 
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onResetDemo={handleResetDemoData}
        onNavigate={handleNavigate}
      />

      {/* Toast Feedback */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={handleCloseToast} 
      />
    </div>
  );
}
