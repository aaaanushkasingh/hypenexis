/**
 * Application constants, categories, and initial seeded demo data for MargMitra.
 */

// Categories as specified: Pothole, Water Logging, Obstacle, Other
export const CATEGORIES = [
  'Pothole',
  'Water Logging',
  'Obstacle',
  'Other'
];

export const STATUS_LIST = [
  'Submitted to Road Department',
  'Under Review',
  'Work in Progress',
  'Resolved'
];

export const STATUS_DESCRIPTIONS = {
  'Submitted to Road Department': 'Report officially registered and dispatched to the Municipal & PWD Road Department.',
  'Under Review': 'Civic road engineers are inspecting severity, site location, and assigning repair teams.',
  'Work in Progress': 'Road maintenance crew and asphalt machinery deployed on site.',
  'Resolved': 'Hazard repaired, road surface restored, and verified safe for commuters.'
};

// Realistic SVG hazard illustrations
export const createHazardSvg = (category) => {
  const svgTemplates = {
    'Pothole': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#152438"/>
        <line x1="0" y1="200" x2="600" y2="200" stroke="#223854" stroke-width="8" stroke-dasharray="25,25"/>
        <ellipse cx="300" cy="220" rx="140" ry="70" fill="#0A111C" stroke="#486581" stroke-width="4"/>
        <ellipse cx="290" cy="225" rx="110" ry="50" fill="#060A10"/>
        <path d="M 160 220 L 110 200 L 80 230" stroke="#627D98" stroke-width="3" fill="none"/>
        <path d="M 440 220 L 490 240 L 530 210" stroke="#627D98" stroke-width="3" fill="none"/>
        <path d="M 320 290 L 340 330 L 380 340" stroke="#627D98" stroke-width="3" fill="none"/>
        <circle cx="300" cy="110" r="32" fill="#0E1B2D" stroke="#A1DC6A" stroke-width="3"/>
        <text x="300" y="118" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#A1DC6A" text-anchor="middle">!</text>
        <text x="300" y="375" font-family="Arial, sans-serif" font-weight="600" font-size="14" fill="#9FB3C8" text-anchor="middle">POTHOLE HAZARD ZONE</text>
      </svg>`,
    'Water Logging': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#152438"/>
        <rect x="0" y="240" width="600" height="160" fill="#0E1B2D"/>
        <ellipse cx="300" cy="250" rx="220" ry="90" fill="#1B3A57" stroke="#38BDF8" stroke-width="3" opacity="0.9"/>
        <ellipse cx="280" cy="255" rx="170" ry="60" fill="#0C4A6E" opacity="0.8"/>
        <path d="M 180 240 Q 230 250 280 240" stroke="#7DD3FC" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M 310 260 Q 360 270 410 260" stroke="#7DD3FC" stroke-width="2" fill="none" opacity="0.7"/>
        <circle cx="300" cy="110" r="34" fill="#0E1B2D" stroke="#38BDF8" stroke-width="3"/>
        <path d="M 300 90 C 290 105 285 115 285 122 A 15 15 0 0 0 315 122 C 315 115 310 105 300 90 Z" fill="#38BDF8"/>
        <text x="300" y="375" font-family="Arial, sans-serif" font-weight="600" font-size="14" fill="#38BDF8" text-anchor="middle">WATER LOGGING ON ROADWAY</text>
      </svg>`,
    'Obstacle': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#152438"/>
        <line x1="0" y1="210" x2="600" y2="210" stroke="#334E68" stroke-width="6" stroke-dasharray="25,25"/>
        <polygon points="220,290 280,180 340,180 390,290" fill="#D97706" stroke="#FDE68A" stroke-width="3"/>
        <line x1="240" y1="250" x2="310" y2="250" stroke="#1E293B" stroke-width="12"/>
        <line x1="260" y1="210" x2="330" y2="210" stroke="#1E293B" stroke-width="12"/>
        <polygon points="380,280 430,260 410,295" fill="#475569"/>
        <polygon points="170,290 210,270 200,300" fill="#334155"/>
        <circle cx="300" cy="90" r="32" fill="#0E1B2D" stroke="#F59E0B" stroke-width="3"/>
        <text x="300" y="98" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#F59E0B" text-anchor="middle">!</text>
        <text x="300" y="365" font-family="Arial, sans-serif" font-weight="600" font-size="14" fill="#FBBF24" text-anchor="middle">ROADWAY OBSTACLE / DEBRIS</text>
      </svg>`,
    'Other': `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#152438"/>
        <line x1="0" y1="220" x2="600" y2="220" stroke="#334E68" stroke-width="6" stroke-dasharray="20,20"/>
        <circle cx="300" cy="200" r="70" fill="#0E1B2D" stroke="#A1DC6A" stroke-width="4"/>
        <text x="300" y="215" font-family="Arial, sans-serif" font-weight="bold" font-size="50" fill="#A1DC6A" text-anchor="middle">?</text>
        <text x="300" y="350" font-family="Arial, sans-serif" font-weight="600" font-size="14" fill="#94A3B8" text-anchor="middle">ROAD HAZARD ALERT</text>
      </svg>`
  };

  const raw = svgTemplates[category] || svgTemplates['Other'];
  return `data:image/svg+xml;utf8,${encodeURIComponent(raw.trim())}`;
};

// Seeded initial reports - featuring the requested "near MUJ" pothole report!
export const INITIAL_SEEDED_REPORTS = [
  {
    id: '#101',
    category: 'Pothole',
    location: 'Near MUJ (Manipal University Jaipur), Dahmi Kalan, Jaipur-Ajmer Expressway',
    coordinates: '26.8439° N, 75.5652° E',
    description: 'Deep pothole on the main service lane approaching Manipal University Jaipur (MUJ) gate. Severe hazard for students, bikes, and college buses.',
    submissionDate: '12 Oct 2026, 09:15 AM',
    timestamp: 1791873300000,
    priority: 'Medium',
    status: 'Submitted to Road Department',
    upvotes: 28,
    isDemo: false,
    userEmail: 'student.citizen@muj.ac.in',
    userName: 'Aman Verma',
    image: createHazardSvg('Pothole'),
    assignedAuthority: 'Jaipur Development Authority (JDA) & State PWD Road Division',
    eta: 'Action scheduled within 24 hours'
  },
  {
    id: '#102',
    category: 'Water Logging',
    location: 'Underpass near MUJ Campus Junction, Jaipur',
    coordinates: '26.8415° N, 75.5680° E',
    description: 'Heavy water stagnation along pedestrian footpath and corner turning after recent rains.',
    submissionDate: '12 Oct 2026, 11:30 AM',
    timestamp: 1791881400000,
    priority: 'Medium',
    status: 'Under Review',
    upvotes: 19,
    isDemo: false,
    userEmail: 'rohit.sharma@gmail.com',
    userName: 'Rohit Sharma',
    image: createHazardSvg('Water Logging'),
    assignedAuthority: 'Municipal Drainage & PWD Cell',
    eta: 'Inspecting site'
  },
  {
    id: '#103',
    category: 'Obstacle',
    location: 'Highway Turn towards Dahmi Kalan, near MUJ, Jaipur',
    coordinates: '26.8472° N, 75.5620° E',
    description: 'Fallen construction barricade and gravel heap partially blocking the left lane.',
    submissionDate: '11 Oct 2026, 04:45 PM',
    timestamp: 1791813900000,
    priority: 'High',
    status: 'Work in Progress',
    upvotes: 35,
    isDemo: false,
    userEmail: 'priya.singh@gmail.com',
    userName: 'Priya Singh',
    image: createHazardSvg('Obstacle'),
    assignedAuthority: 'NHAI Highway Patrol & Traffic Division',
    eta: 'Clearing team dispatched'
  }
];
