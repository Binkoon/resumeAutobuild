import React from 'react';

interface HeaderProps {
  progressPercentage: number;
  sections: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  stepStatus: Record<string, any>;
  onDownload: () => void;
  onReset: () => void;
  onSaveDraft: () => void;
  isDownloadReady: boolean;
  isLoading: boolean;
}

export function Header({ 
  progressPercentage, 
  sections, 
  activeSection, 
  onSectionChange, 
  stepStatus,
  onDownload,
  onReset,
  onSaveDraft,
  isDownloadReady,
  isLoading
}: HeaderProps) {
  return (
    <div className="main-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="header-text">
            <h1 className="main-title">CV 자동 빌더</h1>
            <p className="main-subtitle">
              AI 기반 이력서 작성 도구로 전문적이고 매력적인 이력서를 만들어보세요
            </p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-progress">
            <div className="progress-circle">
              <svg className="progress-ring" viewBox="0 0 60 60">
                <circle
                  className="progress-ring-bg"
                  cx="30"
                  cy="30"
                  r="25"
                  strokeWidth="4"
                />
                <circle
                  className="progress-ring-fill"
                  cx="30"
                  cy="30"
                  r="25"
                  strokeWidth="4"
                  strokeDasharray={`${(progressPercentage / 100) * 157} 157`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-number">{progressPercentage}%</span>
                <span className="progress-label">완료</span>
              </div>
            </div>
            <div className="progress-info">
              <span className="progress-status">
                {progressPercentage === 100 ? '🎉 CV 작성 완료!' : 'CV 작성 중...'}
              </span>
            </div>
          </div>
          
          {/* 헤더 액션 버튼들 */}
          <div className="header-actions">
            <button
              onClick={onSaveDraft}
              className="header-action-btn header-save-btn"
              title="임시저장"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              임시저장
            </button>
            
            <button
              onClick={onReset}
              className="header-action-btn header-reset-btn"
              title="모든 데이터 초기화"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              초기화
            </button>
            
            <button
              onClick={onDownload}
              disabled={!isDownloadReady || isLoading}
              className={`header-action-btn header-download-btn ${!isDownloadReady ? 'disabled' : ''}`}
              title={!isDownloadReady ? '모든 필수 정보를 입력해주세요' : 'CV 다운로드'}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  생성 중...
                </>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  CV 다운로드
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 헤더 하단 진행 상황 바 */}
      <div className="header-progress-bar">
        <div className="progress-steps-mini">
          {sections.map((section, index) => {
            // section.id를 stepStatus의 키에 매핑
            const stepKey = section.id === 'personal' ? 'basicInfo' : section.id;
            const isCompleted = stepStatus[stepKey as keyof typeof stepStatus];
            
            return (
              <div 
                key={section.id} 
                className={`progress-step-mini ${isCompleted ? 'completed' : ''} ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => onSectionChange(section.id)}
              >
                <span className="step-icon-mini">
                  {isCompleted ? '✓' : (index + 1)}
                </span>
                <span className="step-label-mini">{section.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
