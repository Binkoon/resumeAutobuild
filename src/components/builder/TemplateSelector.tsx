import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../../stores/cvStore';
import { CV_TEMPLATES } from '../../types/cv';

interface TemplateSelectorProps {
  onClose: () => void;
}

export function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { cvData, setCVType } = useCVStore();

  const handleTemplateSelect = (type: any) => {
    setCVType(type);
    onClose(); // 템플릿 선택 후 모달 닫기
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="template-selector-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="template-selector-overlay" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div 
          className="template-selector-content"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.4 
          }}
        >
        <div className="template-selector-header">
          <h2 className="template-selector-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            CV 템플릿 선택
          </h2>
          <p className="template-selector-description">
            원하는 CV 유형을 선택하세요. 각 템플릿은 다른 구성과 강조점을 가지고 있습니다.
          </p>
          <button className="template-close-btn" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            닫기
          </button>
        </div>

        <div className="template-grid">
          {Object.entries(CV_TEMPLATES).map(([type, template], index) => (
            <motion.div
              key={type}
              className={`template-card ${cvData.type === type ? 'template-card-active' : ''}`}
              onClick={() => handleTemplateSelect(type)}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="template-card-header">
                <h3 className="template-card-title">{template.name}</h3>
                <div className="template-card-badges">
                  {template.atsFriendly && (
                    <span className="template-badge template-badge-ats">ATS 친화적</span>
                  )}
                  {template.creative && (
                    <span className="template-badge template-badge-creative">창의적</span>
                  )}
                </div>
              </div>
              
              <p className="template-card-description">{template.description}</p>
              
              <div className="template-card-recommended">
                <span className="template-recommended-label">추천 대상</span>
                <div className="template-recommended-tags">
                  {template.recommendedFor.map((tag, index) => (
                    <span key={index} className="template-recommended-tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="template-card-sections">
                <span className="template-sections-label">주요 섹션</span>
                <div className="template-sections-list">
                  {template.sections.map((section, index) => (
                    <span key={index} className="template-section-item">{section}</span>
                  ))}
                </div>
              </div>
              
              {cvData.type === type && (
                <motion.div 
                  className="template-card-selected"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 10 
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  선택됨
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="template-selector-footer">
          <p className="template-selector-note">
            템플릿을 선택하면 CV 구성이 자동으로 변경됩니다. 언제든지 다시 변경할 수 있습니다.
          </p>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
