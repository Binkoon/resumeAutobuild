import React, { useState } from 'react';
import { SectionEditor } from './SectionEditor';
import { Preview } from './Preview';
import { GhostTextarea } from './GhostTextarea';
import { TemplateSelector } from './TemplateSelector';
import { SkillDropdown } from '../ui/SkillDropdown';
import { Footer } from '../ui/Footer';
import { useCVStore } from '../../stores/cvStore';
import { useUIStore } from '../../stores/uiStore';
import { getFieldValidationMessage } from '../../lib/validation';
import { LocationDetector } from '../ui/LocationDetector';
import { downloadCV } from '../../lib/download';

export function CVBuilder() {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { cvData, updatePersonalInfo, addSkill, removeSkill, addLanguage, removeLanguage } = useCVStore();
  const { isLoading, error } = useUIStore();
  
  // 로컬 상태 (입력 필드용)
  const [skillsInput, setSkillsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'markdown' | 'html'>('pdf');

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleAddSkill = () => {
    if (skillsInput.trim()) {
      addSkill(skillsInput.trim());
      setSkillsInput('');
    }
  };

  const handleAddLanguage = () => {
    if (languagesInput.trim()) {
      addLanguage(languagesInput.trim());
      setLanguagesInput('');
    }
  };

  // 개인정보 업데이트 및 검증
  const handlePersonalInfoUpdate = (field: string, value: string) => {
    updatePersonalInfo(field as any, value);
    
    // 실시간 검증
    const errorMessage = getFieldValidationMessage(field, value);
    if (errorMessage) {
      setValidationErrors(prev => ({ ...prev, [field]: errorMessage }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 스킬 선택 처리
  const handleSkillSelect = (skill: string) => {
    addSkill(skill);
  };

  // CV 다운로드 처리
  const handleDownload = async () => {
    try {
      await downloadCV(cvData, downloadFormat);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 필수 정보 입력 완료 여부 확인
  const isDownloadReady = () => {
    const { personalInfo, skills, languages, experience, education, projects } = cvData;
    
    // 기본 정보 필수 항목 확인
    const hasBasicInfo = personalInfo.name && personalInfo.email && personalInfo.phone && personalInfo.location;
    
    // 스킬과 언어는 최소 1개 이상
    const hasSkills = skills.length > 0;
    const hasLanguages = languages.length > 0;
    
    // 최소 1개 이상의 경험/교육/프로젝트
    const hasExperience = experience.length > 0;
    const hasEducation = education.length > 0;
    const hasProjects = projects.length > 0;
    
    return hasBasicInfo && hasSkills && hasLanguages && (hasExperience || hasEducation || hasProjects);
  };

  // 진행 상황 계산 (0-100%)
  const getProgressPercentage = () => {
    const totalSteps = 6; // 기본정보, 스킬, 언어, 경력, 교육, 프로젝트
    let completedSteps = 0;
    
    const { personalInfo, skills, languages, experience, education, projects } = cvData;
    
    if (personalInfo.name && personalInfo.email && personalInfo.phone && personalInfo.location) completedSteps++;
    if (skills.length > 0) completedSteps++;
    if (languages.length > 0) completedSteps++;
    if (experience.length > 0) completedSteps++;
    if (education.length > 0) completedSteps++;
    if (projects.length > 0) completedSteps++;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  // 진행 상황 단계별 상태
  const getStepStatus = () => {
    const { personalInfo, skills, languages, experience, education, projects } = cvData;
    
    return {
      basicInfo: !!(personalInfo.name && personalInfo.email && personalInfo.phone && personalInfo.location),
      skills: skills.length > 0,
      languages: languages.length > 0,
      experience: experience.length > 0,
      education: education.length > 0,
      projects: projects.length > 0
    };
  };

  return (
    <div className="minimal">
      {/* 광고 공간을 위한 레이아웃 */}
      <div className="main-layout">
        {/* 왼쪽 광고 공간 */}
        <div className="ad-space-left">
          광고 공간
          <br />
          (200px × 600px)
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="main-content">
          <div className="main-header">
            <h1 className="main-title">CV 자동 빌더</h1>
            <p className="main-subtitle">
              AI 기반 이력서 작성 도구로 전문적이고 매력적인 이력서를 만들어보세요
            </p>
          </div>
          
          {/* 에러 표시 */}
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}
          
          {/* CV 템플릿 및 다운로드 통합 섹션 */}
          <div className="card">
            <div className="card-body">
              <div className="cv-controls-header">
                <h2 className="card-title">CV 설정</h2>
              </div>
              
              <div className="cv-controls-content">
                {/* CV 템플릿 정보 */}
                <div className="cv-template-section">
                  <div className="template-info">
                    <h3 className="template-title">현재 템플릿</h3>
                    <div className="current-template-info">
                      <div className="template-badge">
                        <span className="template-type">
                          {cvData.type === 'chronological' && '역순 연대기형'}
                          {cvData.type === 'functional' && '기능형'}
                          {cvData.type === 'combination' && '혼합형'}
                          {cvData.type === 'academic' && '학문형'}
                          {cvData.type === 'creative' && '크리에이티브'}
                        </span>
                      </div>
                      <p className="template-description">
                        {cvData.type === 'chronological' && '경력 중심의 역순 연대기형 이력서'}
                        {cvData.type === 'functional' && '스킬과 역량 중심의 기능형 이력서'}
                        {cvData.type === 'combination' && '스킬과 경력을 조합한 혼합형 이력서'}
                        {cvData.type === 'academic' && '학술 연구 중심의 학문형 이력서'}
                        {cvData.type === 'creative' && '창의적 디자인 중심의 크리에이티브 이력서'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowTemplateSelector(true)}
                      className="btn btn-primary btn-sm"
                    >
                      템플릿 변경
                    </button>
                  </div>
                </div>
                
                {/* CV 다운로드 섹션 */}
                <div className="cv-download-section">
                  <div className="download-header">
                    <h3 className="download-title">CV 다운로드</h3>
                    <div className="download-controls">
                      <div className="format-selector">
                        <label htmlFor="download-format" className="format-label">형식:</label>
                        <select
                          id="download-format"
                          value={downloadFormat}
                          onChange={(e) => setDownloadFormat(e.target.value as 'pdf' | 'markdown' | 'html')}
                          className="format-select"
                        >
                          <option value="pdf">PDF (권장)</option>
                          <option value="markdown">Markdown</option>
                          <option value="html">HTML</option>
                        </select>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="btn btn-success btn-lg download-btn"
                        disabled={isLoading || !isDownloadReady()}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            생성 중...
                          </>
                        ) : (
                          'CV 다운로드'
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* 진행 상황 브레드크럼 */}
                  <div className="progress-breadcrumb">
                    <div className="progress-header">
                      <h4 className="progress-title">CV 작성 진행 상황</h4>
                      <div className="progress-percentage">{getProgressPercentage()}% 완료</div>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                    
                    <div className="progress-steps">
                      <div className={`progress-step ${getStepStatus().basicInfo ? 'completed' : ''}`}>
                        <div className="step-icon">
                          {getStepStatus().basicInfo ? '✓' : '1'}
                        </div>
                        <div className="step-label">기본 정보</div>
                      </div>
                      
                      <div className={`progress-step ${getStepStatus().skills ? 'completed' : ''}`}>
                        <div className="step-icon">
                          {getStepStatus().skills ? '✓' : '2'}
                        </div>
                        <div className="step-label">스킬</div>
                      </div>
                      
                      <div className={`progress-step ${getStepStatus().languages ? 'completed' : ''}`}>
                        <div className="step-icon">
                          {getStepStatus().languages ? '✓' : '3'}
                        </div>
                        <div className="step-label">언어</div>
                      </div>
                      
                      <div className={`progress-step ${getStepStatus().experience ? 'completed' : ''}`}>
                        <div className="step-icon">
                          {getStepStatus().experience ? '✓' : '4'}
                        </div>
                        <div className="step-label">경력사항</div>
                      </div>
                      
                      <div className={`progress-step ${getStepStatus().education ? 'completed' : ''}`}>
                        <div className="step-icon">
                          {getStepStatus().education ? '✓' : '5'}
                        </div>
                        <div className="step-label">교육사항</div>
                      </div>
                      
                      <div className={`progress-step ${getStepStatus().projects ? 'completed' : ''}`}>
                        <div className="step-icon">
                          {getStepStatus().projects ? '✓' : '6'}
                        </div>
                        <div className="step-label">프로젝트</div>
                      </div>
                    </div>
                    
                    {!isDownloadReady() && (
                      <div className="progress-hint">
                        <p>모든 필수 정보를 입력하면 CV를 다운로드할 수 있습니다.</p>
                        <p>현재 {getProgressPercentage()}% 완료되었습니다.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="download-info">
                    <p className="download-description">
                      {downloadFormat === 'pdf' && '프로페셔널한 PDF 형식으로 다운로드됩니다. 인쇄와 공유에 최적화되어 있습니다.'}
                      {downloadFormat === 'markdown' && 'Markdown 형식으로 다운로드됩니다. GitHub, Notion 등에서 편집하기 쉽습니다.'}
                      {downloadFormat === 'html' && '웹 브라우저에서 열 수 있는 HTML 형식으로 다운로드됩니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {showTemplateSelector && (
            <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 왼쪽 편집 영역 */}
            <div className="space-y-8">
              {/* 개인정보 */}
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    개인정보
                  </h2>
                  <div className="input-grid input-grid-2">
                    <div className="input-field">
                      <input
                        type="text"
                        placeholder="이름"
                        value={cvData.personalInfo.name}
                        onChange={(e) => handlePersonalInfoUpdate('name', e.target.value)}
                        className={`form-input ${validationErrors.name ? 'form-input-error' : ''}`}
                      />
                      {validationErrors.name && (
                        <div className="validation-error">{validationErrors.name}</div>
                      )}
                    </div>
                    
                    <div className="input-field">
                      <input
                        type="email"
                        placeholder="이메일"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoUpdate('email', e.target.value)}
                        className={`form-input ${validationErrors.email ? 'form-input-error' : ''}`}
                      />
                      {validationErrors.email && (
                        <div className="validation-error">{validationErrors.email}</div>
                      )}
                    </div>
                    
                    <div className="input-field">
                      <input
                        type="tel"
                        placeholder="전화번호 (예: 010-1234-5678)"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoUpdate('phone', e.target.value)}
                        className={`form-input ${validationErrors.phone ? 'form-input-error' : ''}`}
                      />
                      {validationErrors.phone && (
                        <div className="validation-error">{validationErrors.phone}</div>
                      )}
                    </div>
                    
                    {/* 위치 입력 */}
                    <div className="input-group">
                      <div className="location-input-container">
                        <input
                          type="text"
                          id="location"
                          value={cvData.personalInfo.location}
                          onChange={(e) => handlePersonalInfoUpdate('location', e.target.value)}
                          placeholder="예: 서울, 한국"
                          className={`form-input ${validationErrors.location ? 'form-input-error' : ''}`}
                        />
                        <LocationDetector
                          onLocationDetected={(location) => handlePersonalInfoUpdate('location', location)}
                          className="location-detector-inline"
                        />
                      </div>
                      {validationErrors.location && (
                        <div className="validation-error">{validationErrors.location}</div>
                      )}
                    </div>
                    
                    <div className="input-field">
                      <input
                        type="url"
                        placeholder="LinkedIn URL (선택사항)"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoUpdate('linkedin', e.target.value)}
                        className={`form-input ${validationErrors.linkedin ? 'form-input-error' : ''}`}
                      />
                      {validationErrors.linkedin && (
                        <div className="validation-error">{validationErrors.linkedin}</div>
                      )}
                    </div>
                    
                    <div className="input-field">
                      <input
                        type="url"
                        placeholder="GitHub URL (선택사항)"
                        value={cvData.personalInfo.github}
                        onChange={(e) => handlePersonalInfoUpdate('github', e.target.value)}
                        className={`form-input ${validationErrors.github ? 'form-input-error' : ''}`}
                      />
                      {validationErrors.github && (
                        <div className="validation-error">{validationErrors.github}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <GhostTextarea
                      value={cvData.personalInfo.summary}
                      onChange={(value) => updatePersonalInfo('summary', value)}
                      placeholder="자기소개를 입력하세요..."
                      rows={4}
                      context="personal"
                      field="summary"
                    />
                  </div>
                </div>
              </div>

              {/* 스킬 */}
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    스킬
                  </h2>
                  
                  {/* 스킬 드롭다운 */}
                  <div className="mb-4">
                    <SkillDropdown onSkillSelect={handleSkillSelect} />
                  </div>
                  
                  {/* 기존 스킬 목록 */}
                  <div className="tag-list">
                    {cvData.skills.map((skill, index) => (
                      <span key={index} className="tag">
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {/* 기존 입력 방식 (백업용) */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600 mb-2">직접 입력:</div>
                    <div className="tag-input">
                      <input
                        type="text"
                        placeholder="스킬을 입력하고 Enter를 누르세요"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
                        className="form-input"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="btn btn-success btn-md"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 언어 */}
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    언어
                  </h2>
                  <div className="tag-input">
                    <input
                      type="text"
                      placeholder="언어를 입력하고 Enter를 누르세요"
                      value={languagesInput}
                      onChange={(e) => setLanguagesInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleAddLanguage)}
                      className="form-input"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="btn btn-success btn-md"
                    >
                      추가
                    </button>
                  </div>
                  <div className="tag-list">
                    {cvData.languages?.map((language, index) => (
                      <span key={index} className="tag">
                        {language}
                        <button
                          onClick={() => removeLanguage(index)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 섹션 에디터들 - CV 타입에 따라 조건부 렌더링 */}
                      {cvData.type === 'chronological' && (
                        <>
                          <div className="section-type-header">
                            <h3 className="section-type-title">역순 연대기형 구성</h3>
                            <p className="section-type-description">경력 중심으로 최신부터 과거 순으로 정렬됩니다.</p>
                          </div>
                          <SectionEditor type="experience" />
                          <SectionEditor type="education" />
                          <SectionEditor type="project" />
                        </>
                      )}
                      
                      {cvData.type === 'functional' && (
                        <>
                          <div className="section-type-header">
                            <h3 className="section-type-title">기능형 구성</h3>
                            <p className="section-type-description">스킬과 역량을 중심으로 프로젝트와 경험을 정리합니다.</p>
                          </div>
                          <SectionEditor type="project" />
                          <SectionEditor type="experience" />
                          <SectionEditor type="education" />
                        </>
                      )}
                      
                      {cvData.type === 'combination' && (
                        <>
                          <div className="section-type-header">
                            <h3 className="section-type-title">혼합형 구성</h3>
                            <p className="section-type-description">스킬과 경력을 조합하여 ATS 호환성을 높입니다.</p>
                          </div>
                          <SectionEditor type="experience" />
                          <SectionEditor type="project" />
                          <SectionEditor type="education" />
                        </>
                      )}
                      
                      {cvData.type === 'academic' && (
                        <>
                          <div className="section-type-header">
                            <h3 className="section-type-title">학문형 구성</h3>
                            <p className="section-type-description">교육과 연구 중심으로 학술적 성과를 강조합니다.</p>
                          </div>
                          <SectionEditor type="education" />
                          <SectionEditor type="project" />
                          <SectionEditor type="experience" />
                          
                          {/* Academic CV 전용 섹션들 */}
                          <div className="card">
                            <div className="card-body">
                              <h2 className="card-title">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                연구 분야
                              </h2>
                              <div className="research-areas">
                                <div className="research-area-item">
                                  <input
                                    type="text"
                                    placeholder="주요 연구 분야 (예: 인공지능, 머신러닝)"
                                    className="form-input"
                                  />
                                </div>
                                <div className="research-area-item">
                                  <input
                                    type="text"
                                    placeholder="세부 연구 주제 (예: 자연어 처리, 컴퓨터 비전)"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="card">
                            <div className="card-body">
                              <h2 className="card-title">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                논문 및 출판물
                              </h2>
                              <div className="publications-section">
                                <button className="btn btn-info">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  논문 추가
                                </button>
                                <p className="section-hint">학술 논문, 저서, 연구 보고서 등을 추가하세요</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {cvData.type === 'creative' && (
                        <>
                          <div className="section-type-header">
                            <h3 className="section-type-title">크리에이티브 구성</h3>
                            <p className="section-type-description">창의적 프로젝트와 시각적 요소를 강조합니다.</p>
                          </div>
                          <SectionEditor type="experience" />
                          <SectionEditor type="project" />
                          <SectionEditor type="education" />
                          
                          {/* Creative CV 전용 섹션들 */}
                          <div className="card">
                            <div className="card-body">
                              <h2 className="card-title">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                포트폴리오 링크
                              </h2>
                              <div className="portfolio-links">
                                <div className="portfolio-link-item">
                                  <input
                                    type="url"
                                    placeholder="Behance 포트폴리오 URL"
                                    className="form-input"
                                  />
                                </div>
                                <div className="portfolio-link-item">
                                  <input
                                    type="url"
                                    placeholder="Dribbble 포트폴리오 URL"
                                    className="form-input"
                                  />
                                </div>
                                <div className="portfolio-link-item">
                                  <input
                                    type="url"
                                    placeholder="개인 포트폴리오 웹사이트"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="card">
                            <div className="card-body">
                              <h2 className="card-title">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                </svg>
                                디자인 스타일
                              </h2>
                              <div className="design-style-section">
                                <div className="style-tags">
                                  <span className="style-tag">미니멀</span>
                                  <span className="style-tag">모던</span>
                                  <span className="style-tag">클래식</span>
                                  <span className="style-tag">플레이풀</span>
                                  <span className="style-tag">엘레간트</span>
                                </div>
                                <p className="section-hint">자신의 디자인 스타일을 선택하거나 추가하세요</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
            </div>

            {/* 오른쪽 미리보기 */}
            <div className="lg:sticky">
              <div className="preview-card">
                <h3 className="preview-title">실시간 미리보기</h3>
                <p className="preview-description">
                  오른쪽에서 실시간으로 CV를 확인할 수 있습니다. A4 크기로 최적화되어 있어 인쇄 시에도 완벽합니다.
                </p>
              </div>
              <Preview />
            </div>
          </div>
        </div>
        
        {/* 오른쪽 광고 공간 */}
        <div className="ad-space-right">
          광고 공간
          <br />
          (200px × 600px)
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
