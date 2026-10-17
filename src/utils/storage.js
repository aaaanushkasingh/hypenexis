import { INITIAL_SEEDED_REPORTS } from './constants';

const STORAGE_KEY_REPORTS = 'margmitra_reports_v2';
const STORAGE_KEY_USER = 'margmitra_user_v2';
const STORAGE_KEY_VOTES = 'margmitra_votes_v2';
const STORAGE_KEY_NEXT_ID = 'margmitra_next_id_v2';

function safeGetJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (err) {
    console.error(`Error saving to localStorage for key ${key}:`, err);
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      return {
        success: false,
        error: 'Browser local storage limit reached. Please remove old reports or use smaller photos.'
      };
    }
    return {
      success: false,
      error: 'Could not save data to browser local storage.'
    };
  }
}

export function getReports() {
  const existing = safeGetJSON(STORAGE_KEY_REPORTS, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    safeSetJSON(STORAGE_KEY_REPORTS, INITIAL_SEEDED_REPORTS);
    return [...INITIAL_SEEDED_REPORTS];
  }
  return existing;
}

export function generateNextReportId() {
  const rawId = localStorage.getItem(STORAGE_KEY_NEXT_ID);
  let nextNum = rawId ? parseInt(rawId, 10) : 123;
  if (isNaN(nextNum)) nextNum = 123;
  localStorage.setItem(STORAGE_KEY_NEXT_ID, (nextNum + 1).toString());
  return `#${nextNum}`;
}

export function addReport(newReport) {
  const currentReports = getReports();
  const updated = [newReport, ...currentReports];
  const saveResult = safeSetJSON(STORAGE_KEY_REPORTS, updated);

  if (!saveResult.success) {
    return saveResult;
  }
  return { success: true, report: newReport };
}

export function getReportById(id) {
  if (!id) return null;
  const reports = getReports();
  const cleanId = id.trim().toLowerCase();
  return reports.find(r => r.id.toLowerCase() === cleanId) || null;
}

export function getUserReports(userEmail) {
  const reports = getReports();
  if (!userEmail) return [];
  const cleanEmail = userEmail.trim().toLowerCase();
  return reports.filter(r => r.userEmail && r.userEmail.trim().toLowerCase() === cleanEmail);
}

export function getUpvotedMap() {
  return safeGetJSON(STORAGE_KEY_VOTES, {});
}

export function isReportUpvoted(reportId) {
  const votes = getUpvotedMap();
  return Boolean(votes[reportId]);
}

export function toggleReportVote(reportId) {
  const votes = getUpvotedMap();
  const currentVoted = Boolean(votes[reportId]);
  const newVoted = !currentVoted;

  const reports = getReports();
  let updatedCount = 0;

  const updatedReports = reports.map(report => {
    if (report.id === reportId) {
      const currentCount = report.upvotes || 0;
      const countChange = newVoted ? 1 : -1;
      updatedCount = Math.max(0, currentCount + countChange);
      return {
        ...report,
        upvotes: updatedCount
      };
    }
    return report;
  });

  safeSetJSON(STORAGE_KEY_REPORTS, updatedReports);
  votes[reportId] = newVoted;
  safeSetJSON(STORAGE_KEY_VOTES, votes);

  return {
    upvoted: newVoted,
    newCount: updatedCount
  };
}

export function getCurrentUser() {
  return safeGetJSON(STORAGE_KEY_USER, null);
}

export function saveCurrentUser(user) {
  return safeSetJSON(STORAGE_KEY_USER, user);
}

export function clearCurrentUser() {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
    return true;
  } catch (err) {
    console.error('Failed to log out:', err);
    return false;
  }
}

export function resetToDemoData() {
  safeSetJSON(STORAGE_KEY_REPORTS, INITIAL_SEEDED_REPORTS);
  localStorage.setItem(STORAGE_KEY_NEXT_ID, '123');
  return [...INITIAL_SEEDED_REPORTS];
}
