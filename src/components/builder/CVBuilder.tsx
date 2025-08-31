import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SectionLoading } from '../ui/LoadingSpinner';

// 레이지 로딩으로 컴포넌트 분할
const SectionEditor = lazy(() => import('./SectionEditor').then(module => ({ default: module.SectionEditor })));
const Preview = lazy(() => import('./Preview').then(module => ({ default: module.Preview })));
const GhostTextarea = lazy(() => import('./GhostTextarea').then(module => ({ default: module.GhostTextarea })));
const SkillDropdown = lazy(() => import('../ui/SkillDropdown').then(module => ({ default: module.SkillDropdown })));
const StarRating = lazy(() => import('../ui/StarRating').then(module => ({ default: module.StarRating })));

const Header = lazy(() => import('../ui/Header').then(module => ({ default: module.Header })));
const Footer = lazy(() => import('../ui/Footer').then(module => ({ default: module.Footer })));
import { useCVStore } from '../../stores/cvStore';
import { useUIStore } from '../../stores/uiStore';
import { downloadCV } from '../../lib/download';
import { CV_TEMPLATES, type CVType } from '../../types/cv';
import { LocationDetector } from '../ui/LocationDetector';
import { formatPhoneNumber, getFieldValidationMessage, validateRequiredFields } from '../../lib/validation';

// 헤더 색상 옵션
const HEADER_COLOR_OPTIONS = [
  { value: '', label: '색상 없음', color: '#f8fafc' },
  { value: 'blue', label: '파란색', color: '#3b82f6' },
  { value: 'green', label: '초록색', color: '#10b981' },
  { value: 'purple', label: '보라색', color: '#8b5cf6' },
  { value: 'red', label: '빨간색', color: '#ef4444' },
  { value: 'orange', label: '주황색', color: '#f97316' },
  { value: 'teal', label: '청록색', color: '#14b8a6' },
  { value: 'pink', label: '분홍색', color: '#ec4899' },
  { value: 'indigo', label: '남색', color: '#6366f1' },
  { value: 'gray', label: '회색', color: '#6b7280' }
];

export function CVBuilder() {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { cvData, updatePersonalInfo, addSkill, removeSkill, addLanguage, removeLanguage, setLanguageProficiency, resetAfterCompletion, setCVType, setHeaderColor, setSkillScore } = useCVStore();
  const { isLoading, error, setLoading, setError } = useUIStore();
  
  // 로컬 상태
  const [skillsInput, setSkillsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'markdown' | 'html'>('pdf');
  const [activeSection, setActiveSection] = useState<'personal' | 'skills' | 'languages' | 'experience' | 'education' | 'externalEducation' | 'projects'>('personal');
  const [selectedFont, setSelectedFont] = useState<string>('Arial');


  // 앱 시작 시 저장된 임시저장 데이터 불러오기
  useEffect(() => {
    const savedDraft = localStorage.getItem('cvDraft');
    if (savedDraft) {
      try {
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

  // 폰트 변경 시 CSS 변수 업데이트
  useEffect(() => {
    document.documentElement.style.setProperty('--cv-font-family', selectedFont);
  }, [selectedFont]);

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
      setLoading(true);
      await downloadCV(cvData, downloadFormat, () => {
        // 다운로드 완료 후 초기화
        resetAfterCompletion();
        alert('CV가 성공적으로 다운로드되었습니다!\n\n새로운 CV 작성을 위해 모든 데이터가 초기화되었습니다.');
      });
    } catch (error) {
      console.error('다운로드 실패:', error);
      setError('다운로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 필수 정보 입력 완료 여부 확인
  const isDownloadReady = (): boolean => {
    const { personalInfo, skills, languages, experience, education, projects } = cvData;
    
    // 필수 개인정보 검증 (이름, 이메일, 전화번호, 직무명, 자기소개)
    const hasRequiredPersonalInfo = validateRequiredFields({
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      jobTitle: personalInfo.jobTitle,
      summary: personalInfo.summary
    });
    
    // 스킬과 언어는 최소 1개 이상
    const hasSkills = skills.length > 0;
    const hasLanguages = languages.length > 0;
    
    // 최소 1개 이상의 경험/교육/프로젝트
    const hasExperience = experience.length > 0;
    const hasEducation = education.length > 0;
    const hasProjects = projects.length > 0;
    
    return Boolean(hasRequiredPersonalInfo && hasSkills && hasLanguages && (hasExperience || hasEducation || hasProjects));
  };

  // 진행 상황 계산 (0-100%)
  const getProgressPercentage = () => {
    const totalSteps = 6; // 기본정보, 스킬, 언어, 경력, 교육, 프로젝트
    let completedSteps = 0;
    
    const { personalInfo, skills, languages, experience, education, projects } = cvData;
    
    // 필수 개인정보 검증
    if (validateRequiredFields({
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      jobTitle: personalInfo.jobTitle,
      summary: personalInfo.summary
    })) completedSteps++;
    
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
      basicInfo: validateRequiredFields({
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        jobTitle: personalInfo.jobTitle,
        summary: personalInfo.summary
      }),
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
    { id: 'externalEducation', label: '외부교육', icon: '📚' },
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
              
              {/* 헤더 색상 선택 (Cascade 템플릿일 때만) */}
              {cvData.type === 'cascade' && (
                <div className="header-color-selector">
                  <label className="color-selector-label">
                    <span className="color-selector-text">헤더 색상</span>
                    <div className="color-selector-container">
                      <select
                        value={cvData.headerColor || ''}
                        onChange={(e) => setHeaderColor(e.target.value)}
                        className="color-selector-dropdown"
                      >
                        {HEADER_COLOR_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div 
                        className="color-preview"
                        style={{ backgroundColor: HEADER_COLOR_OPTIONS.find(opt => opt.value === (cvData.headerColor || ''))?.color || '#f8fafc' }}
                      ></div>
                    </div>
                  </label>
                </div>
              )}
                             <div className="input-grid input-grid-2">
                                 {/* 프로필 사진 업로드 */}
                <div className="input-field">
                  <label className="profile-photo-label">
                    <div className="profile-photo-container">
                      {cvData.personalInfo.profilePhoto ? (
                        <img 
                          src={cvData.personalInfo.profilePhoto} 
                          alt="프로필 사진" 
                          className="profile-photo-preview"
                        />
                      ) : (
                        <div className="profile-photo-placeholder">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          <span>프로필 사진</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updatePersonalInfo('profilePhoto', event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="profile-photo-input"
                    />
                    <span className="profile-photo-text">사진 업로드 (선택사항)</span>
                  </label>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    placeholder="이름 *"
                    value={cvData.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="form-input"
                  />
                  {cvData.personalInfo.name && getFieldValidationMessage('name', cvData.personalInfo.name) && (
                    <div className="validation-error">
                      {getFieldValidationMessage('name', cvData.personalInfo.name)}
                    </div>
                  )}
                </div>
                 
                 <div className="input-field">
                   <input
                     type="text"
                     placeholder="직무명 * (예: 프론트엔드 개발자)"
                     value={cvData.personalInfo.jobTitle}
                     onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                     className="form-input"
                   />
                 </div>
                
                <div className="input-field">
                  <input
                    type="email"
                    placeholder="이메일 * (예: example@gmail.com)"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="form-input"
                  />
                  {cvData.personalInfo.email && getFieldValidationMessage('email', cvData.personalInfo.email) && (
                    <div className="validation-error">
                      {getFieldValidationMessage('email', cvData.personalInfo.email)}
                    </div>
                  )}
                </div>
                
                <div className="input-field">
                  <input
                    type="tel"
                    placeholder="전화번호 * (예: 010-1234-5678)"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      updatePersonalInfo('phone', formatted);
                    }}
                    className="form-input"
                    maxLength={13}
                  />
                  {cvData.personalInfo.phone && getFieldValidationMessage('phone', cvData.personalInfo.phone) && (
                    <div className="validation-error">
                      {getFieldValidationMessage('phone', cvData.personalInfo.phone)}
                    </div>
                  )}
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
                  placeholder="자기소개를 입력하세요... *"
                  rows={4}
                  context="personal"
                  field="summary"
                />
              </div>
              
              {/* 네비게이션 버튼 */}
              <div className="section-navigation">
                <div className="navigation-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary prev-section-btn"
                    disabled={true}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>이전 단계</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSection('skills')}
                    className="btn btn-primary next-section-btn"
                    disabled={!validateRequiredFields({
                      name: cvData.personalInfo.name,
                      email: cvData.personalInfo.email,
                      phone: cvData.personalInfo.phone,
                      jobTitle: cvData.personalInfo.jobTitle,
                      summary: cvData.personalInfo.summary
                    })}
                  >
                    <span>다음 단계: 스킬</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="navigation-hint">
                  {!validateRequiredFields({
                    name: cvData.personalInfo.name,
                    email: cvData.personalInfo.email,
                    phone: cvData.personalInfo.phone,
                    jobTitle: cvData.personalInfo.jobTitle,
                    summary: cvData.personalInfo.summary
                  }) ? (
                    <span className="hint-text">필수 정보를 모두 입력하면 다음 단계로 진행할 수 있습니다</span>
                  ) : (
                    <span className="hint-text success">모든 필수 정보가 입력되었습니다!</span>
                  )}
                </div>
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
              
              {/* 스킬 목록 with 별점 */}
              <div className="skills-with-rating">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item-with-rating">
                    <div className="skill-name-section">
                      <span className="skill-name">{skill}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="skill-remove-btn"
                        title="스킬 제거"
                      >
                        ×
                      </button>
                    </div>
                    <div className="skill-rating-section">
                      <Suspense fallback={<div>별점 로딩 중...</div>}>
                        <StarRating
                          score={cvData.skillScores[skill] || 3}
                          onScoreChange={(score) => setSkillScore(skill, score)}
                          size="sm"
                        />
                      </Suspense>
                    </div>
                  </div>
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
              
              {/* 네비게이션 버튼 */}
              <div className="section-navigation">
                <div className="navigation-buttons">
                  <button
                    type="button"
                    onClick={() => setActiveSection('personal')}
                    className="btn btn-secondary prev-section-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>이전 단계: 개인정보</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSection('languages')}
                    className="btn btn-primary next-section-btn"
                    disabled={cvData.skills.length === 0}
                  >
                    <span>다음 단계: 언어</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="navigation-hint">
                  {cvData.skills.length === 0 ? (
                    <span className="hint-text">최소 1개 이상의 스킬을 추가하면 다음 단계로 진행할 수 있습니다</span>
                  ) : (
                    <span className="hint-text success">스킬이 추가되었습니다!</span>
                  )}
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
              
              <div className="language-list mt-4">
                {cvData.languages.map((language, index) => (
                  <div key={index} className="language-item">
                    <div className="language-name">
                      <span className="tag">
                        {language}
                        <button
                          onClick={() => removeLanguage(index)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                    <div className="language-proficiency">
                      <select
                        value={cvData.languageProficiencies?.[language] || 'Basic'}
                        onChange={(e) => setLanguageProficiency(language, e.target.value)}
                        className="form-select"
                      >
                        <option value="Native">Native (모국어)</option>
                        <option value="Fluent">Fluent (유창함)</option>
                        <option value="Business">Business (비즈니스)</option>
                        <option value="Intermediate">Intermediate (중급)</option>
                        <option value="Basic">Basic (기초)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 네비게이션 버튼 */}
              <div className="section-navigation">
                <div className="navigation-buttons">
                  <button
                    type="button"
                    onClick={() => setActiveSection('skills')}
                    className="btn btn-secondary prev-section-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>이전 단계: 스킬</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSection('experience')}
                    className="btn btn-primary next-section-btn"
                    disabled={cvData.languages.length === 0}
                  >
                    <span>다음 단계: 경력</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="navigation-hint">
                  {cvData.languages.length === 0 ? (
                    <span className="hint-text">최소 1개 이상의 언어를 추가하면 다음 단계로 진행할 수 있습니다</span>
                  ) : (
                    <span className="hint-text success">언어가 추가되었습니다!</span>
                  )}
                </div>
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
              <Suspense fallback={<SectionLoading message="경력 섹션을 불러오는 중..." />}>
                <SectionEditor type="experience" />
              </Suspense>
              
              {/* 네비게이션 버튼 */}
              <div className="section-navigation">
                <div className="navigation-buttons">
                  <button
                    type="button"
                    onClick={() => setActiveSection('languages')}
                    className="btn btn-secondary prev-section-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>이전 단계: 언어</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSection('education')}
                    className="btn btn-primary next-section-btn"
                  >
                    <span>다음 단계: 교육</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="navigation-hint">
                  <span className="hint-text">경력사항을 추가하고 다음 단계로 진행하세요</span>
                </div>
              </div>
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
              <Suspense fallback={<SectionLoading message="교육 섹션을 불러오는 중..." />}>
                <SectionEditor type="education" />
              </Suspense>
              
              {/* 네비게이션 버튼 */}
              <div className="section-navigation">
                <div className="navigation-buttons">
                  <button
                    type="button"
                    onClick={() => setActiveSection('experience')}
                    className="btn btn-secondary prev-section-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>이전 단계: 경력</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSection('projects')}
                    className="btn btn-primary next-section-btn"
                  >
                    <span>다음 단계: 프로젝트</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="navigation-hint">
                  <span className="hint-text">교육사항을 추가하고 다음 단계로 진행하세요</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'externalEducation':
        return (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                외부 교육사항
              </h2>
              
              <div className="section-content">
                <SectionEditor type="externalEducation" />
                
                <div className="navigation-hint">
                  <span className="hint-text">외부 교육사항을 추가하고 다음 단계로 진행하세요</span>
                </div>
              </div>
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
              <Suspense fallback={<SectionLoading message="프로젝트 섹션을 불러오는 중..." />}>
                <SectionEditor type="project" />
              </Suspense>
              
              {/* 네비게이션 버튼 */}
              <div className="section-navigation">
                <div className="navigation-buttons">
                  <button
                    type="button"
                    onClick={() => setActiveSection('education')}
                    className="btn btn-secondary prev-section-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>이전 단계: 교육</span>
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-success next-section-btn"
                    disabled={false}
                    onClick={() => {
                      // 프로젝트 섹션이 마지막이므로 완료 메시지 표시
                      alert('모든 섹션이 완료되었습니다! 이제 CV를 다운로드할 수 있습니다.');
                    }}
                  >
                    <span>CV 완성!</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
                <div className="navigation-hint">
                  <span className="hint-text success">프로젝트를 추가하고 CV 작성을 완료하세요!</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="minimal">
        <SectionLoading message="CV를 처리하는 중..." />
      </div>
    );
  }

  return (
    <div className="minimal">
      {/* 에러 상태 표시 */}
      {error && (
        <div className="error-banner">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}
      
      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <Suspense fallback={<SectionLoading message="헤더를 불러오는 중..." />}>
          <Header 
            progressPercentage={getProgressPercentage()}
            sections={sections}
            activeSection={activeSection}
            onSectionChange={(sectionId: string) => setActiveSection(sectionId as 'personal' | 'skills' | 'languages' | 'experience' | 'education' | 'projects')}
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
            downloadFormat={downloadFormat}
            onDownloadFormatChange={(format: string) => setDownloadFormat(format as 'pdf' | 'markdown' | 'html')}
          />
        </Suspense>
        
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
                    <span className="template-badge template-badge-large">
                      {cvData.type === 'chronological' && '역순 연대기형'}
                      {cvData.type === 'cascade' && 'Cascade Type'}
                    </span>
                    <p className="template-description">
                      {cvData.type === 'chronological' && '경력 중심의 역순 연대기형 이력서'}
                      {cvData.type === 'cascade' && '사이드바와 메인 콘텐츠가 균형잡힌 현대적인 레이아웃'}
                    </p>
                  </div>
                </div>
                
                {/* 템플릿 선택 옵션들 */}
                <div className="template-options">
                  <h4 className="template-options-title">템플릿 변경</h4>
                  
                  {/* 폰트 선택기 */}
                  <div className="font-selector-section">
                    <h4 className="font-selector-title">폰트 선택</h4>
                    <div className="font-selector">
                      <select 
                        value={selectedFont} 
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="font-select"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Garamond">Garamond</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="template-grid">
                    {Object.entries(CV_TEMPLATES).map(([type, template]) => (
                      <button
                        key={type}
                        onClick={() => setCVType(type as CVType)}
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
                      onClick={() => setActiveSection(section.id as 'personal' | 'skills' | 'languages' | 'experience' | 'education' | 'projects')}
                      className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
                    >
                      <span className="section-icon">{section.icon}</span>
                      <span className="section-label">{section.label}</span>
                      {getStepStatus()[section.id === 'personal' ? 'basicInfo' : section.id as keyof ReturnType<typeof getStepStatus>] && (
                        <span className="section-complete">✓</span>
                      )}
                    </button>
                  ))}
                </div>
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
            <AnimatePresence mode="wait">
              <Suspense fallback={<SectionLoading message="미리보기를 불러오는 중..." />}>
                <Preview key={cvData.type} />
              </Suspense>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Footer */}
        <Suspense fallback={<SectionLoading message="푸터를 불러오는 중..." />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
