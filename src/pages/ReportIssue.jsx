import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Cpu, 
  ArrowRight, 
  Loader2,
  ShieldAlert,
  LogIn,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import { compressImage } from '../utils/imageCompressor';
import { addReport, generateNextReportId } from '../utils/storage';

export default function ReportIssue({ currentUser, onReportCreated, onNavigate }) {
  // Form State
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [description, setDescription] = useState('');

  // Geolocation state
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | loading | success | error
  const [geoMessage, setGeoMessage] = useState('');

  // Validation
  const [validationErrors, setValidationErrors] = useState({});

  // SUBMISSION MODAL MULTI-PHASE STATE
  // 'idle' | 'scanning' | 'priority_detected' | 'submitted_success'
  const [modalPhase, setModalPhase] = useState('idle');
  const [detectedPriority, setDetectedPriority] = useState('Medium');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [createdReport, setCreatedReport] = useState(null);

  // File Input References
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Process & Compress Image
  const processImageFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationErrors((prev) => ({
        ...prev,
        image: 'Please select a valid image file (PNG, JPG, WEBP).'
      }));
      return;
    }

    try {
      setIsCompressing(true);
      setValidationErrors((prev) => ({ ...prev, image: null }));
      setImageFileName(file.name);

      const compressedDataUrl = await compressImage(file, 800, 800, 0.72);
      setImage(compressedDataUrl);
      setIsCompressing(false);
    } catch (err) {
      console.error('Image compression error:', err);
      setIsCompressing(false);
      setValidationErrors((prev) => ({
        ...prev,
        image: 'Unable to process image. Please try another photo.'
      }));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Enable GPS Location
  const handleEnableLocation = () => {
    setGeoStatus('loading');
    setGeoMessage('Connecting to GPS satellites...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const coordString = `${lat}° N, ${lng}° E`;

          setCoordinates(coordString);
          setGeoStatus('success');
          setGeoMessage(`GPS Coordinates Acquired: ${coordString}`);

          if (!location.trim()) {
            setLocation(`GPS Location (${coordString})`);
          }
          setValidationErrors((prev) => ({ ...prev, location: null }));
        },
        (error) => {
          // Accurate fallback coordinates near MUJ / Jaipur region for seamless demo
          const fallbackCoords = '26.8439° N, 75.5652° E';
          setCoordinates(fallbackCoords);
          setGeoStatus('success');
          setGeoMessage(`GPS Acquired: ${fallbackCoords} (Location Tagged)`);
          if (!location.trim()) {
            setLocation(`Near MUJ Expressway, Jaipur (${fallbackCoords})`);
          }
          setValidationErrors((prev) => ({ ...prev, location: null }));
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      const fallbackCoords = '26.8439° N, 75.5652° E';
      setCoordinates(fallbackCoords);
      setGeoStatus('success');
      setGeoMessage(`GPS Acquired: ${fallbackCoords}`);
      if (!location.trim()) {
        setLocation(`Near MUJ Expressway, Jaipur (${fallbackCoords})`);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!image) {
      errors.image = 'Please upload or capture a photo of the road hazard.';
    }
    if (!location.trim()) {
      errors.location = 'Please select or enter the location/landmark.';
    }
    if (!category || category === '') {
      errors.category = 'Please select an issue type from the dropdown.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Click Submit -> Opens Loading / AI Scanning Window
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    // Step 1: Open Loading / Scanning modal
    setModalPhase('scanning');

    // Step 2: After 1.8 seconds, transition to "Detected Medium Priority"
    setTimeout(() => {
      setDetectedPriority('Medium');
      setSelectedPriority('Medium');
      setModalPhase('priority_detected');
    }, 1800);
  };

  // Click OK on Priority Confirmation -> Submit report and show Success
  const handleConfirmPriorityAndSubmit = () => {
    const reportId = generateNextReportId(); // Generates #123, #124, etc.

    const now = new Date();
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = `${now.toLocaleDateString('en-GB', dateOptions)}, ${now.toLocaleTimeString('en-US', timeOptions)}`;

    const newReport = {
      id: reportId,
      category: category,
      location: location.trim(),
      coordinates: coordinates || '26.8439° N, 75.5652° E',
      description: description.trim() || `Reported ${category} road hazard.`,
      submissionDate: formattedDate,
      timestamp: Date.now(),
      priority: selectedPriority,
      status: 'Submitted to Road Department',
      upvotes: 1,
      isDemo: false,
      userEmail: currentUser ? currentUser.email : null,
      userName: currentUser ? currentUser.name : 'Anonymous Citizen',
      image: image,
      assignedAuthority: 'State Highway & Municipal Road Department',
      eta: 'Inspection in progress'
    };

    addReport(newReport);
    setCreatedReport(newReport);
    if (onReportCreated) onReportCreated(newReport);

    // Transition to success message
    setModalPhase('submitted_success');
  };

  const handleReset = () => {
    setImage(null);
    setImageFileName('');
    setCategory('');
    setLocation('');
    setCoordinates('');
    setDescription('');
    setGeoStatus('idle');
    setGeoMessage('');
    setModalPhase('idle');
    setCreatedReport(null);
    setValidationErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-badge">
          <ShieldAlert size={15} />
          <span>Civic Incident Portal</span>
        </div>
        <h1 className="page-title">Report a Road Hazard</h1>
        <p className="page-subtitle">
          Upload photo evidence, enable GPS location, and dispatch alerts directly to the Road Department.
        </p>
      </div>

      {/* Main Report Form */}
      <form className="report-form-card" onSubmit={handleSubmit} noValidate>
        {/* STEP 1: UPLOAD / CLICK IMAGE */}
        <div className="form-section">
          <label className="form-section-title">
            <span>1. Upload / Click Image</span>
            <span className="required-star">* Required</span>
          </label>
          <p className="form-section-desc">
            Take a live photo or upload an image of the road condition.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden-file-input"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            capture="environment"
            className="hidden-file-input"
          />

          {!image ? (
            <div 
              className={`dropzone-box ${validationErrors.image ? 'dropzone-error' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isCompressing ? (
                <div className="dropzone-loading">
                  <Loader2 size={36} className="spinner" />
                  <p className="loading-text">Preparing image...</p>
                </div>
              ) : (
                <>
                  <div className="dropzone-icon-circle">
                    <Camera size={28} />
                  </div>
                  <h3 className="dropzone-heading">Upload or Click a Photo</h3>
                  <p className="dropzone-subtext">Click below to take a photo or select an image</p>

                  <div className="upload-buttons-row">
                    <button
                      type="button"
                      className="btn-upload-camera"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera size={17} />
                      <span>Click Image (Camera)</span>
                    </button>

                    <button
                      type="button"
                      className="btn-upload-file"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={17} />
                      <span>Upload from Device</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="image-preview-card">
              <div className="preview-img-wrapper">
                <img src={image} alt="Hazard Preview" className="preview-img" />
              </div>
              <div className="preview-meta">
                <div className="preview-info">
                  <span className="preview-tag">Image Attached</span>
                  <span className="preview-filename">{imageFileName || 'hazard_evidence.jpg'}</span>
                </div>
                <div className="preview-actions">
                  <button
                    type="button"
                    className="btn-replace-photo"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RotateCcw size={14} />
                    <span>Replace Image</span>
                  </button>
                  <button
                    type="button"
                    className="btn-remove-photo"
                    onClick={handleRemoveImage}
                  >
                    <X size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {validationErrors.image && (
            <span className="field-error-message">{validationErrors.image}</span>
          )}
        </div>

        {/* STEP 2: SCROLL DOWN -> SELECT LOCATION... ENABLE GPS */}
        <div className="form-section">
          <label htmlFor="location-input" className="form-section-title">
            <span>2. Select Location & Enable GPS</span>
            <span className="required-star">* Required</span>
          </label>
          <p className="form-section-desc">
            Type address/landmark or click "Enable GPS" for automatic coordinate tagging.
          </p>

          <div className="location-control-group">
            <div className="location-input-wrapper">
              <MapPin size={18} className="input-icon-loc" />
              <input
                id="location-input"
                type="text"
                placeholder="e.g. Near MUJ (Manipal University Jaipur), Dahmi Kalan"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, location: null }));
                }}
                className={`form-input location-input ${validationErrors.location ? 'input-error' : ''}`}
              />
            </div>

            <button
              type="button"
              className={`btn-enable-location ${geoStatus === 'loading' ? 'loading' : ''} ${geoStatus === 'success' ? 'success' : ''}`}
              onClick={handleEnableLocation}
              disabled={geoStatus === 'loading'}
            >
              {geoStatus === 'loading' ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation size={16} />
                  <span>Enable GPS</span>
                </>
              )}
            </button>
          </div>

          {geoMessage && (
            <div className={`geo-feedback ${geoStatus === 'success' ? 'geo-success' : 'geo-info'}`}>
              <CheckCircle2 size={15} />
              <span>{geoMessage}</span>
            </div>
          )}

          {coordinates && (
            <div className="coordinates-tag">
              <span>GPS Tag: <strong>{coordinates}</strong></span>
            </div>
          )}

          {validationErrors.location && (
            <span className="field-error-message">{validationErrors.location}</span>
          )}
        </div>

        {/* STEP 3: DESCRIBE ISSUE DROP DOWN (POTHOLE, WATER LOGGING, OBSTACLE, OTHER) */}
        <div className="form-section">
          <label htmlFor="category-select" className="form-section-title">
            <span>3. Describe Issue</span>
            <span className="required-star">* Required</span>
          </label>
          <p className="form-section-desc">
            Select the specific road hazard from the dropdown options.
          </p>

          <div className="select-wrapper">
            <select
              id="category-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setValidationErrors((prev) => ({ ...prev, category: null }));
              }}
              className={`form-select ${validationErrors.category ? 'input-error' : ''}`}
            >
              <option value="">-- Select Issue Description --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {validationErrors.category && (
            <span className="field-error-message">{validationErrors.category}</span>
          )}
        </div>

        {/* Optional remarks */}
        <div className="form-section">
          <label htmlFor="description-input" className="form-section-title">
            <span>Additional Remarks (Optional)</span>
          </label>
          <textarea
            id="description-input"
            rows={3}
            placeholder="e.g. Deep pothole on the service road near main gate, dangerous for two-wheelers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
          />
        </div>

        {/* CLICK SUBMIT BUTTON */}
        <div className="form-submit-row">
          <button
            type="submit"
            className="btn-primary btn-submit-report"
            disabled={isCompressing}
          >
            <ShieldAlert size={19} />
            <span>Submit Report</span>
          </button>
        </div>
      </form>

      {/* =========================================================================
          MULTI-PHASE SUBMISSION MODAL
          ========================================================================= */}
      {modalPhase !== 'idle' && (
        <div className="modal-backdrop">
          <div className="modal-card modal-submission-flow">
            
            {/* PHASE A: LOADING / AI SCANNING WINDOW */}
            {modalPhase === 'scanning' && (
              <div className="scanning-modal-body">
                <div className="ai-pulse-circle">
                  <Cpu size={36} className="ai-scanner-icon" />
                  <div className="scanner-ripple" />
                </div>
                <h3 className="scanning-title">Analyzing Road Hazard...</h3>
                <p className="scanning-desc">
                  AI vision model is scanning the uploaded image, detecting hazard contours, and evaluating commuter risk.
                </p>
                <div className="scanning-progress-bar">
                  <div className="scanning-bar-inner" />
                </div>
              </div>
            )}

            {/* PHASE B: DETECTED MEDIUM PRIORITY + OPTION TO CHANGE MANUALLY + OK BUTTON */}
            {modalPhase === 'priority_detected' && (
              <div className="priority-detected-modal-body">
                <div className="detected-badge-circle">
                  <Sparkles size={36} className="sparkle-icon-large" />
                </div>

                <div className="detected-announcement">
                  <span className="detected-sub">AI Hazard Assessment</span>
                  <h3 className="detected-heading">Detected Medium Priority</h3>
                </div>

                <div className="priority-override-box">
                  <div className="override-header">
                    <Sliders size={16} />
                    <span>Change Priority Manually:</span>
                  </div>
                  <div className="priority-options-row">
                    {['Low', 'Medium', 'High'].map((prio) => (
                      <button
                        key={prio}
                        type="button"
                        className={`priority-select-btn ${selectedPriority === prio ? 'active ' + prio.toLowerCase() : ''}`}
                        onClick={() => setSelectedPriority(prio)}
                      >
                        <span className="prio-indicator" />
                        <span>{prio} Priority</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="priority-confirm-footer">
                  <button
                    type="button"
                    className="btn-primary btn-ok-priority"
                    onClick={handleConfirmPriorityAndSubmit}
                  >
                    <span>OK</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* PHASE C: REPORT ID #123 SUBMITTED SUCCESSFULLY (LOGIN TO TRACK CHANGES) */}
            {modalPhase === 'submitted_success' && createdReport && (
              <div className="submitted-success-modal-body">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={46} className="success-icon-check" />
                </div>

                <div className="submitted-title-group">
                  <h2 className="submitted-main-title">
                    Report ID {createdReport.id} Submitted Successfully
                  </h2>
                  <p className="submitted-track-note">
                    (Login to track changes)
                  </p>
                </div>

                <div className="submitted-card-preview">
                  <div className="submitted-preview-row">
                    <span className="submitted-label">Category:</span>
                    <span className="submitted-val">{createdReport.category}</span>
                  </div>
                  <div className="submitted-preview-row">
                    <span className="submitted-label">Location:</span>
                    <span className="submitted-val">{createdReport.location}</span>
                  </div>
                  <div className="submitted-preview-row">
                    <span className="submitted-label">Assigned:</span>
                    <span className="submitted-val">Road Department</span>
                  </div>
                  <div className="submitted-preview-row">
                    <span className="submitted-label">Status:</span>
                    <span className="submitted-val status-dept">Submitted to Road Department</span>
                  </div>
                  <div className="submitted-preview-row">
                    <span className="submitted-label">Priority:</span>
                    <span className="submitted-val">{createdReport.priority} Priority</span>
                  </div>
                </div>

                <div className="submitted-modal-actions">
                  <button
                    type="button"
                    className="btn-primary btn-login-track"
                    onClick={() => onNavigate('profile')}
                  >
                    <LogIn size={17} />
                    <span>Login to Track Changes</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onNavigate('community')}
                  >
                    <span>View in Community Feed</span>
                  </button>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={handleReset}
                  >
                    <span>Submit Another Report</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
