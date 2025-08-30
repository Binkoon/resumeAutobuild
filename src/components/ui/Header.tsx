import { motion } from 'framer-motion';

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
  downloadFormat: string;
  onDownloadFormatChange: (format: string) => void;
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
  isLoading,
  downloadFormat,
  onDownloadFormatChange
}: HeaderProps) {
  return (
    <motion.div 
      className="main-header"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="header-content">
        <motion.div 
          className="header-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="header-icon"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          <motion.div 
            className="header-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.h1 
              className="main-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              CV 자동 빌더
            </motion.h1>
            <motion.p 
              className="main-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              AI 기반 이력서 작성 도구로 전문적이고 매력적인 이력서를 만들어보세요
            </motion.p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="header-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div 
            className="header-progress"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="progress-circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <svg className="progress-ring" viewBox="0 0 60 60">
                <circle
                  className="progress-ring-bg"
                  cx="30"
                  cy="30"
                  r="25"
                  strokeWidth="4"
                />
                <motion.circle
                  className="progress-ring-fill"
                  cx="30"
                  cy="30"
                  r="25"
                  strokeWidth="4"
                  initial={{ strokeDasharray: "0 157" }}
                  animate={{ strokeDasharray: `${(progressPercentage / 100) * 157} 157` }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                  strokeDashoffset="0"
                />
              </svg>
              <motion.div 
                className="progress-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <span className="progress-number">{progressPercentage}%</span>
                <span className="progress-label">완료</span>
              </motion.div>
            </motion.div>
            <div className="progress-info">
              <span className="progress-status">
                {progressPercentage === 100 ? '🎉 CV 작성 완료!' : 'CV 작성 중...'}
              </span>
            </div>
          </motion.div>
          
          {/* 헤더 액션 버튼들 */}
          <motion.div 
            className="header-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* 다운로드 형식 선택 */}
            <div className="download-format-selector">
              <label htmlFor="download-format" className="format-label">형식:</label>
              <select
                id="download-format"
                value={downloadFormat}
                onChange={(e) => onDownloadFormatChange(e.target.value)}
                className="format-select"
              >
                <option value="pdf">PDF (권장)</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </select>
            </div>
            
            <motion.button
              onClick={onSaveDraft}
              className="header-action-btn header-save-btn"
              title="임시저장"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              임시저장
            </motion.button>
            
            <motion.button
              onClick={onReset}
              className="header-action-btn header-reset-btn"
              title="모든 데이터 초기화"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              초기화
            </motion.button>
            
            <motion.button
              onClick={onDownload}
              disabled={!isDownloadReady || isLoading}
              className={`header-action-btn header-download-btn ${!isDownloadReady ? 'disabled' : ''}`}
              title={!isDownloadReady ? '모든 필수 정보를 입력해주세요' : 'CV 다운로드'}
              whileHover={isDownloadReady ? { scale: 1.05, y: -2 } : {}}
              whileTap={isDownloadReady ? { scale: 0.95 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  다운로드 중...
                </>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  CV 다운로드
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* 헤더 하단 진행 상황 바 */}
      <motion.div 
        className="header-progress-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="progress-steps-mini">
          {sections.map((section, index) => {
            // section.id를 stepStatus의 키에 매핑
            const stepKey = section.id === 'personal' ? 'basicInfo' : section.id;
            const isCompleted = stepStatus[stepKey as keyof typeof stepStatus];
            
            return (
              <motion.div 
                key={section.id} 
                className={`progress-step-mini ${isCompleted ? 'completed' : ''} ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => onSectionChange(section.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="step-icon-mini"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {isCompleted ? '✓' : (index + 1)}
                </motion.span>
                <span className="step-label-mini">{section.label}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}