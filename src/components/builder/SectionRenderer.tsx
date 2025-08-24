import React from 'react';
import { SectionEditor } from './SectionEditor';
import { GhostTextarea } from './GhostTextarea';
import { SkillDropdown } from '../ui/SkillDropdown';
import { LocationDetector } from '../ui/LocationDetector';
import type { CVData, PersonalInfo } from '../../types/cv';

interface SectionRendererProps {
  activeSection: string;
  cvData: CVData;
  onPersonalInfoUpdate: (field: keyof PersonalInfo, value: string) => void;
  onSkillAdd: (skill: string) => void;
  onSkillRemove: (index: number) => void;
  onLanguageAdd: (language: string) => void;
  onLanguageRemove: (index: number) => void;
  skillsInput: string;
  setSkillsInput: (value: string) => void;
  languagesInput: string;
  setLanguagesInput: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent, action: () => void) => void;
}

export function SectionRenderer({
  activeSection,
  cvData,
  onPersonalInfoUpdate,
  onSkillAdd,
  onSkillRemove,
  onLanguageAdd,
  onLanguageRemove,
  skillsInput,
  setSkillsInput,
  languagesInput,
  setLanguagesInput,
  onKeyPress
}: SectionRendererProps) {
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
                    onChange={(e) => onPersonalInfoUpdate('name', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="input-field">
                  <input
                    type="email"
                    placeholder="이메일"
                    value={cvData.personalInfo.email}
                    onChange={(e) => onPersonalInfoUpdate('email', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="input-field">
                  <input
                    type="tel"
                    placeholder="전화번호 (예: 010-1234-5678)"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => onPersonalInfoUpdate('phone', e.target.value)}
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
                      onChange={(e) => onPersonalInfoUpdate('location', e.target.value)}
                      placeholder="예: 서울, 한국"
                      className="form-input"
                    />
                    <LocationDetector
                      onLocationDetected={(location) => onPersonalInfoUpdate('location', location)}
                      className="location-detector-inline"
                    />
                  </div>
                </div>
                
                <div className="input-field">
                  <input
                    type="url"
                    placeholder="LinkedIn URL (선택사항)"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) => onPersonalInfoUpdate('linkedin', e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="input-field">
                  <input
                    type="url"
                    placeholder="GitHub URL (선택사항)"
                    value={cvData.personalInfo.github}
                    onChange={(e) => onPersonalInfoUpdate('github', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="mt-6">
                <GhostTextarea
                  value={cvData.personalInfo.summary}
                  onChange={(value) => onPersonalInfoUpdate('summary', value)}
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
                <SkillDropdown onSkillSelect={onSkillAdd} />
              </div>
              
              {/* 기존 스킬 목록 */}
              <div className="tag-list">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="tag">
                    {skill}
                    <button
                      onClick={() => onSkillRemove(index)}
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
                    onKeyPress={(e) => onKeyPress(e, () => onSkillAdd(skillsInput))}
                    className="form-input"
                  />
                  <button
                    onClick={() => onSkillAdd(skillsInput)}
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
                  onKeyPress={(e) => onKeyPress(e, () => onLanguageAdd(languagesInput))}
                  className="form-input"
                />
                <button
                  onClick={() => onLanguageAdd(languagesInput)}
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
                      onClick={() => onLanguageRemove(index)}
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

  return renderSection();
}
