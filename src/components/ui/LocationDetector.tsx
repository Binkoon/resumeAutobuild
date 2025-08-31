import { useState } from 'react';
import { useGeolocation } from '../../lib/hooks';

interface LocationDetectorProps {
  onLocationDetected: (location: string) => void;
  className?: string;
}

export function LocationDetector({ onLocationDetected, className = '' }: LocationDetectorProps) {
  const { isLoading, error, getCurrentLocation } = useGeolocation();
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [editableLocation, setEditableLocation] = useState<string>('');

  const handleDetectLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setDetectedLocation(location);
      setEditableLocation(location);
      setShowLocationModal(true);
    }
  };

  const handleConfirmLocation = () => {
    onLocationDetected(editableLocation);
    setShowLocationModal(false);
  };

  const handleCancelLocation = () => {
    setShowLocationModal(false);
  };

  return (
    <div className={`location-detector ${className}`}>
      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={isLoading}
        className="btn btn-primary location-detect-btn"
        title="현재 위치 자동 감지"
      >
        {isLoading ? (
          <>
            <svg className="location-spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            위치 감지 중...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="location-icon">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            위치 자동 감지
          </>
        )}
      </button>
      
      {error && (
        <div className="location-error">
          <svg viewBox="0 0 24 24" className="error-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {error}
        </div>
      )}

      {/* 위치 확인 모달 */}
      {showLocationModal && (
        <div className="location-modal-overlay">
          <div className="location-modal">
            <div className="location-modal-header">
              <h3>위치 확인</h3>
              <button 
                onClick={handleCancelLocation}
                className="location-modal-close"
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className="location-modal-content">
              <div className="location-detected-info">
                <svg viewBox="0 0 24 24" className="location-icon">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p>감지된 위치가 정확한지 확인해주세요.</p>
              </div>
              
              <div className="location-input-group">
                <label htmlFor="location-edit">위치:</label>
                <input
                  id="location-edit"
                  type="text"
                  value={editableLocation}
                  onChange={(e) => setEditableLocation(e.target.value)}
                  placeholder="예: 서울, 한국"
                  className="location-edit-input"
                />
              </div>
              
              <div className="location-modal-actions">
                <button
                  onClick={handleCancelLocation}
                  className="btn btn-secondary"
                  type="button"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmLocation}
                  className="btn btn-primary"
                  type="button"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
