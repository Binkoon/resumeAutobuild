import React, { useState, useEffect } from 'react';
import { SectionEditor } from './SectionEditor';
import { Preview } from './Preview';
import { GhostTextarea } from './GhostTextarea';
import { SkillDropdown } from '../ui/SkillDropdown';
import { Translator } from '../ui/Translator';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';
import { useCVStore } from '../../stores/cvStore';
import { useUIStore } from '../../stores/uiStore';
import { downloadCV } from '../../lib/download';
import { CV_TEMPLATES } from '../../types/cv';
import { LocationDetector } from '../ui/LocationDetector';

export function CVBuilder() {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { cvData, updatePersonalInfo, addSkill, removeSkill, addLanguage, removeLanguage, resetAfterCompletion, setCVType } = useCVStore();
  const { isLoading, error } = useUIStore();
  
  // 로컬 상태
  const [skillsInput, setSkillsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'markdown' | 'html'>('pdf');
  const [activeSection, setActiveSection] = useState<'personal' | 'skills' | 'languages' | 'experience' | 'education' | 'projects'>('personal');

  // 앱 시작 시 저장된 임시저장 데이터 불러오기
  useEffect(() => {
    const savedDraft = localStorage.getItem('cvDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        // 저장된 데이터가 있으면 사용자에게 복원 여부 확인
        if (confirm('이전에 임시저장된 CV 데이터가 있습니다. 복원하시겠습니까?')) {
          // cvData를 draftData로 복원하는 함수가 필요합니다
          // 현재는 간단히 alert로 표시
          alert('임시저장된 데이터를 복원하려면 개발자가 구현해야 합니다.');
        }
      } catch (error) {
        console.error('임시저장 데이터 파싱 오류:', error);
        localStorage.removeItem('cvDraft');
      }
    }
  }, []);

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

  // 스킬 선택 처리
  const handleSkillSelect = (skill: string) => {
    addSkill(skill);
  };

  // CV 다운로드 처리
  const handleDownload = async () => {
    try {
      await downloadCV(cvData, downloadFormat, () => {
        // 다운로드 완료 후 초기화
        resetAfterCompletion();
        alert('CV가 성공적으로 다운로드되었습니다!\n\n새로운 CV 작성을 위해 모든 데이터가 초기화되었습니다.');
      });
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 필수 정보 입력 완료 여부 확인
  const isDownloadReady = (): boolean => {
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
    
    return Boolean(hasBasicInfo && hasSkills && hasLanguages && (hasExperience || hasEducation || hasProjects));
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

  // 섹션 네비게이션
  const sections = [
    { id: 'personal', label: '기본정보', icon: '👤' },
    { id: 'skills', label: '스킬', icon: '⚡' },
    { id: 'languages', label: '언어', icon: '🌐' },
    { id: 'experience', label: '경력', icon: '💼' },
    { id: 'education', label: '교육', icon: '🎓' },
    { id: 'projects', label: '프로젝트', icon: '🚀' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
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
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="input-field">
                  <input
                    type="email"
                    placeholder="이메일"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="input-field">
                  <input
                    type="tel"
                    placeholder="전화번호 (예: 010-1234-5678)"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                {/* 위치 입력 */}
                <div className="input-group">
                  <div className="location-input-container">
                    <input
                      type="text"
                      id="location"
                      value={cvData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="예: 서울, 한국"
                      className="form-input"
                    />
                    <LocationDetector
                      onLocationDetected={(location) => updatePersonalInfo('location', location)}
                      className="location-detector-inline"
                    />
                  </div>
                </div>
                
                <div className="input-field">
                  <input
                    type="url"
                    placeholder="LinkedIn URL (선택사항)"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="input-field">
                  <input
                    type="url"
                    placeholder="GitHub URL (선택사항)"
                    value={cvData.personalInfo.github}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    className="form-input"
                  />
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
        );

      case 'skills':
        return (
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
        );

      case 'languages':
        return (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.5 5H3m2 5h4m1-12l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                언어
              </h2>
              
              <div className="tag-input">
                <input
                  type="text"
                  placeholder="언어를 입력하고 Enter를 누르세요 (예: 한국어, 영어, 일본어)"
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
              
              <div className="tag-list mt-4">
                {cvData.languages.map((language, index) => (
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
        );

      case 'experience':
        return (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M9 16h.01M19 21a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
                경력사항
              </h2>
              <SectionEditor type="experience" />
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                교육사항
              </h2>
              <SectionEditor type="education" />
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                프로젝트
              </h2>
              <SectionEditor type="project" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="minimal">
      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <Header 
          progressPercentage={getProgressPercentage()}
          sections={sections}
          activeSection={activeSection}
          onSectionChange={(sectionId) => setActiveSection(sectionId as any)}
          stepStatus={getStepStatus()}
          onDownload={handleDownload}
          onReset={() => {
            if (confirm('정말로 모든 CV 데이터를 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 작성 중인 모든 내용이 사라집니다.')) {
              resetAfterCompletion();
              alert('CV 데이터가 초기화되었습니다.\n\n새로운 CV 작성을 시작할 수 있습니다.');
            }
          }}
          onSaveDraft={() => {
            // 임시저장 기능 구현
            localStorage.setItem('cvDraft', JSON.stringify(cvData));
            alert('임시저장되었습니다!');
          }}
          isDownloadReady={isDownloadReady()}
          isLoading={isLoading}
        />
        
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
                </div>
                
                {/* 템플릿 선택 옵션들 */}
                <div className="template-options">
                  <h4 className="template-options-title">템플릿 변경</h4>
                  <div className="template-grid">
                    {Object.entries(CV_TEMPLATES).map(([type, template]) => (
                      <button
                        key={type}
                        onClick={() => setCVType(type as any)}
                        className={`template-option ${cvData.type === type ? 'template-option-active' : ''}`}
                      >
                        <div className="template-option-header">
                          <h5 className="template-option-name">{template.name}</h5>
                          {template.isATSCompatible && (
                            <span className="template-ats-badge">ATS</span>
                          )}
                        </div>
                        <p className="template-option-desc">{template.description}</p>
                        <div className="template-option-tags">
                          {template.recommendedFor.map((tag, index) => (
                            <span key={index} className="template-tag">{tag}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* CV 다운로드 섹션 제거 - 헤더로 통합됨 */}
            </div>
          </div>
        </div>
        
        {/* TemplateSelector 모달 제거 - card-body 안에 통합됨 */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 편집 영역 (섹션 네비게이션 + 번역기 + 편집) */}
          <div className="lg:col-span-1">
            {/* 섹션 네비게이션 */}
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">섹션 네비게이션</h3>
                <div className="section-nav">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
                    >
                      <span className="section-icon">{section.icon}</span>
                      <span className="section-label">{section.label}</span>
                      {getStepStatus()[section.id as keyof ReturnType<typeof getStepStatus>] && (
                        <span className="section-complete">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 번역기 */}
            <div className="card mt-4">
              <div className="card-body">
                <h3 className="card-title">번역 도구</h3>
                <Translator />
              </div>
            </div>
            
            {/* 현재 선택된 섹션 편집 */}
            <div className="card mt-4">
              <div className="card-body">
                {renderSection()}
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 실시간 미리보기 */}
          <div className="lg:col-span-1">
            <div className="preview-card">
              <h3 className="preview-title">실시간 미리보기</h3>
              <p className="preview-description">
                오른쪽에서 실시간으로 CV를 확인할 수 있습니다. A4 크기로 최적화되어 있어 인쇄 시에도 완벽합니다.
              </p>
            </div>
            <Preview />
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
