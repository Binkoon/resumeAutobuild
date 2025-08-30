import React from 'react';
import { motion } from 'framer-motion';
import { useCVStore } from '../../stores/cvStore';
import { formatDate } from '../../stores/utils';
import { CV_TEMPLATES } from '../../types/cv';
import { formatPhoneForCountry } from '../../lib/validation';

// 헤더 색상 옵션 (CVBuilder와 동일)
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

interface PreviewProps {
  className?: string;
}

export function Preview({ className = '' }: PreviewProps) {
  // Zustand 스토어에서 CV 데이터 가져오기
  const { cvData } = useCVStore();
  const template = CV_TEMPLATES[cvData.type] || CV_TEMPLATES['cascade']; // 기본값으로 cascade 사용

  // Cascade 템플릿 렌더링
  const renderCascadeTemplate = () => (
    <div className="cv-container">
      {/* 사이드바 - 개인정보 */}
      <div className="cv-sidebar">
        <div className="personal-info">
          {cvData.personalInfo.profilePhoto && (
            <div className="profile-photo">
              <img 
                src={cvData.personalInfo.profilePhoto} 
                alt="프로필 사진" 
                className="profile-photo-img"
              />
            </div>
          )}
          <div className="name">{cvData.personalInfo.name || '이름을 입력하세요'}</div>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              {cvData.personalInfo.email || '이메일을 입력하세요'}
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              {cvData.personalInfo.phone 
                ? formatPhoneForCountry(cvData.personalInfo.phone, cvData.personalInfo.location || '')
                : '전화번호를 입력하세요'
              }
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              {cvData.personalInfo.location || '위치를 입력하세요'}
            </div>
            {cvData.personalInfo.github && (
              <div className="contact-item">
                <span className="contact-icon">💻</span>
                <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            )}
            {cvData.personalInfo.linkedin && (
              <div className="contact-item">
                <span className="contact-icon">🔗</span>
                <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            )}
          </div>
        </div>
      </div>

             {/* 헤더 - 직무, 소개글 */}
       <div 
         className="cv-header"
         style={{
           backgroundColor: cvData.headerColor 
             ? HEADER_COLOR_OPTIONS.find(opt => opt.value === cvData.headerColor)?.color || '#f8fafc'
             : '#f8fafc',
           color: cvData.headerColor && cvData.headerColor !== '' 
             ? (['red', 'blue', 'green', 'purple', 'indigo', 'gray'].includes(cvData.headerColor) ? 'white' : '#1e293b')
             : '#1e293b'
         }}
       >
         <div className="job-title">{cvData.personalInfo.jobTitle || '직무명을 입력하세요'}</div>
         <div className="summary">{cvData.personalInfo.summary || '자기소개를 입력하세요'}</div>
       </div>

      {/* 학력사항 */}
      <div className="cv-education">
        <div className="section-title">학력사항</div>
        {cvData.education.length > 0 ? (
          cvData.education.map((edu, index) => (
            <div key={edu.id} className="education-item">
              <div className="school-name">{edu.school || '학교명'}</div>
              <div className="degree-field">{edu.degree} {edu.field}</div>
            </div>
          ))
        ) : (
          <div className="education-item">
            <div className="school-name">학교명을 입력하세요</div>
            <div className="degree-field">학위 및 전공을 입력하세요</div>
          </div>
        )}
      </div>

      {/* 학력기간 */}
      <div className="cv-education-period">
        <div className="period">
          {cvData.education.length > 0 ? 
            cvData.education.map((edu, index) => (
              <div key={edu.id} className="education-period-item">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </div>
            )) : 
            <div className="education-period-item">기간을 입력하세요</div>
          }
        </div>
      </div>

      {/* 경력사항 */}
      <div className="cv-experience">
        <div className="section-title">경력사항</div>
        {cvData.experience.length > 0 ? (
          cvData.experience.map((exp, index) => (
            <div key={exp.id} className="experience-item">
              <div className="company-position">{exp.company} - {exp.position}</div>
              <div className="description">{exp.description || '업무 설명을 입력하세요'}</div>
            </div>
          ))
        ) : (
          <div className="experience-item">
            <div className="company-position">회사명 - 직책</div>
            <div className="description">업무 설명을 입력하세요</div>
          </div>
        )}
      </div>

      {/* 경력기간 */}
      <div className="cv-experience-period">
        <div className="period">
          {cvData.experience.length > 0 ? 
            cvData.experience.map((exp, index) => (
              <div key={exp.id} className="experience-period-item">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </div>
            )) : 
            <div className="experience-period-item">기간을 입력하세요</div>
          }
        </div>
      </div>

      {/* 프로젝트 */}
      <div className="cv-projects">
        <div className="section-title">프로젝트</div>
        {cvData.projects.length > 0 ? (
          cvData.projects.map((project, index) => (
            <div key={project.id} className="project-item">
              <div className="project-name">{project.name || '프로젝트명'}</div>
              <div className="project-description">{project.description || '프로젝트 설명을 입력하세요'}</div>
            </div>
          ))
        ) : (
          <div className="project-item">
            <div className="project-name">프로젝트명</div>
            <div className="project-description">프로젝트 설명을 입력하세요</div>
          </div>
        )}
      </div>

      {/* 프로젝트기간 */}
      <div className="cv-project-period">
        <div className="period">
          {cvData.projects.length > 0 ? 
            cvData.projects.map((project, index) => (
              <div key={project.id} className="project-period-item">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </div>
            )) : 
            <div className="project-period-item">기간을 입력하세요</div>
          }
        </div>
      </div>

      {/* 자격사항 */}
      <div className="cv-certifications">
        <div className="section-title">자격사항</div>
        <div className="certification-item">
          <div className="cert-name">자격증명</div>
          <div className="cert-org">발급기관</div>
        </div>
      </div>

      {/* 자격 취득날짜 */}
      <div className="cv-cert-date">
        <div className="date">취득날짜</div>
      </div>

      {/* 어학사항 */}
      <div className="cv-languages">
        <div className="section-title">어학사항</div>
        {cvData.languages.length > 0 ? (
          cvData.languages.map((lang, index) => (
            <div key={index} className="language-item">
              <div className="lang-name">{lang}</div>
              <div className="lang-score">점수</div>
            </div>
          ))
        ) : (
          <div className="language-item">
            <div className="lang-name">언어명</div>
            <div className="lang-score">점수</div>
          </div>
        )}
      </div>

      {/* 어학 점수 취득날짜 */}
      <div className="cv-lang-date">
        <div className="date">취득날짜</div>
      </div>

      {/* 기술스택 */}
      <div className="cv-skills">
        <div className="section-title">기술스택</div>
        <div className="skills-list">
          {cvData.skills.length > 0 ? (
            cvData.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))
          ) : (
            <span className="skill-tag">기술을 입력하세요</span>
          )}
        </div>
      </div>
    </div>
  );

  // 섹션별 렌더링 함수들
  const renderContactSection = () => (
    <div className="preview-header">
      {cvData.personalInfo.profilePhoto && (
        <div className="preview-profile-photo">
          <img 
            src={cvData.personalInfo.profilePhoto} 
            alt="프로필 사진" 
            className="preview-profile-photo-img"
          />
        </div>
      )}
      <h1 className="preview-name">
        {cvData.personalInfo.name || '이름을 입력하세요'}
      </h1>
      <div className="preview-contact">
        <p>{cvData.personalInfo.email || '이메일을 입력하세요'}</p>
        <p>{cvData.personalInfo.phone 
          ? formatPhoneForCountry(cvData.personalInfo.phone, cvData.personalInfo.location || '')
          : '전화번호를 입력하세요'
        }</p>
        <p>{cvData.personalInfo.location || '위치를 입력하세요'}</p>
      </div>
      <div className="preview-links">
        {cvData.personalInfo.linkedin && (
          <a href={cvData.personalInfo.linkedin}>
            LinkedIn
          </a>
        )}
        {cvData.personalInfo.github && (
          <a href={cvData.personalInfo.github}>
            GitHub
          </a>
        )}
        {cvData.personalInfo.website && (
          <a href={cvData.personalInfo.website}>
            Website
          </a>
        )}
        {cvData.personalInfo.portfolio && (
          <a href={cvData.personalInfo.portfolio}>
            Portfolio
          </a>
        )}
      </div>
    </div>
  );

  const renderSummarySection = () => (
    cvData.personalInfo.summary && (
      <div className="preview-section">
        <h2 className="preview-section-title">요약</h2>
        <p className="preview-section-content">
          {cvData.personalInfo.summary}
        </p>
      </div>
    )
  );

  const renderExperienceSection = () => (
    cvData.experience.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">경력사항</h2>
        <div className="preview-experience-list">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="preview-experience-item">
              <div className="preview-experience-header">
                <h3 className="preview-experience-title">
                  {exp.position || '직책'}
                </h3>
                <span className="preview-experience-date">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <h4 className="preview-experience-company">
                {exp.company || '회사명'}
              </h4>
              <p className="preview-experience-description">
                {exp.description || '업무 설명을 입력하세요'}
              </p>
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="preview-experience-tech">
                  <strong>사용 기술:</strong> {exp.technologies.join(', ')}
                </div>
              )}
              {exp.impact && (
                <div className="preview-experience-impact">
                  <strong>성과:</strong> {exp.impact}
                </div>
              )}
              {exp.achievements.length > 0 && (
                <ul className="preview-experience-achievements">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderEducationSection = () => (
    cvData.education.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">교육사항</h2>
        <div className="preview-education-list">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="preview-education-item">
              <div className="preview-education-header">
                <h3 className="preview-education-title">
                  {edu.degree || '학위'}
                </h3>
                <span className="preview-education-date">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <h4 className="preview-education-school">
                {edu.school || '학교명'}
              </h4>
              <p className="preview-education-field">
                {edu.field || '전공'}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
              {edu.thesis && (
                <p className="preview-education-thesis">
                  <strong>논문:</strong> {edu.thesis}
                </p>
              )}
              {edu.advisor && (
                <p className="preview-education-advisor">
                  <strong>지도교수:</strong> {edu.advisor}
                </p>
              )}
              {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                <p className="preview-education-courses">
                  관련 과목: {edu.relevantCourses.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderSkillsSection = () => (
    cvData.skills.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">스킬</h2>
        <div className="preview-skills">
          {cvData.skills.map((skill, index) => (
            <span key={index}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    )
  );

  const renderKeySkillsSection = () => (
    cvData.skillCategories && cvData.skillCategories.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">핵심 역량</h2>
        <div className="preview-skill-categories">
          {cvData.skillCategories.map((category) => (
            <div key={category.id} className="preview-skill-category">
              <h3 className="preview-skill-category-title">{category.name}</h3>
              <div className="preview-skill-category-skills">
                {category.skills.map((skill, index) => (
                  <span key={index} className="preview-skill-item">
                    {skill}
                  </span>
                ))}
              </div>
              {category.examples.length > 0 && (
                <div className="preview-skill-category-examples">
                  {category.examples.map((example, index) => (
                    <p key={index} className="preview-skill-example">
                      • {example}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderProjectsSection = () => (
    cvData.projects.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">프로젝트</h2>
        <div className="preview-project-list">
          {cvData.projects.map((project, index) => (
            <div key={project.id} className="preview-project-item">
              <div className="preview-project-header">
                <h3 className="preview-project-title">
                  {project.name || '프로젝트명'}
                </h3>
                <span className="preview-project-date">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </span>
              </div>
              <p className="preview-project-description">
                {project.description || '프로젝트 설명을 입력하세요'}
              </p>
              <div className="preview-project-tech">
                {project.technologies.map((tech, idx) => (
                  <span key={idx}>
                    {tech}
                  </span>
                ))}
              </div>
              {project.impact && (
                <div className="preview-project-impact">
                  <strong>성과:</strong> {project.impact}
                </div>
              )}
              {project.teamSize && (
                <div className="preview-project-team">
                  <strong>팀 규모:</strong> {project.teamSize}명
                </div>
              )}
              <div className="preview-project-links">
                {project.githubUrl && (
                  <a href={project.githubUrl}>
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl}>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderResearchSection = () => (
    cvData.researchInterests && cvData.researchInterests.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">연구 분야</h2>
        <div className="preview-research-interests">
          {cvData.researchInterests.map((interest, index) => (
            <span key={index} className="preview-research-interest">
              {interest}
            </span>
          ))}
        </div>
      </div>
    )
  );

  const renderPublicationsSection = () => (
    cvData.publications && cvData.publications.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">논문</h2>
        <div className="preview-publications-list">
          {cvData.publications.map((pub) => (
            <div key={pub.id} className="preview-publication-item">
              <h3 className="preview-publication-title">{pub.title}</h3>
              <p className="preview-publication-authors">
                {pub.authors.join(', ')}
              </p>
              <p className="preview-publication-journal">
                {pub.journal}, {pub.year}
                {pub.doi && ` • DOI: ${pub.doi}`}
                {pub.impact && ` • Impact Factor: ${pub.impact}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderConferencesSection = () => (
    cvData.conferences && cvData.conferences.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">학회 발표</h2>
        <div className="preview-conferences-list">
          {cvData.conferences.map((conf) => (
            <div key={conf.id} className="preview-conference-item">
              <h3 className="preview-conference-title">{conf.title}</h3>
              <p className="preview-conference-details">
                {conf.conference}, {conf.location}, {conf.date}
                <span className="preview-conference-type"> • {conf.type}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderGrantsSection = () => (
    cvData.grants && cvData.grants.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">연구비</h2>
        <div className="preview-grants-list">
          {cvData.grants.map((grant) => (
            <div key={grant.id} className="preview-grant-item">
              <h3 className="preview-grant-title">{grant.title}</h3>
              <p className="preview-grant-details">
                {grant.fundingAgency}, {grant.period}, {grant.role}
              </p>
              <p className="preview-grant-amount">
                <strong>금액:</strong> {grant.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderTeachingSection = () => (
    cvData.teaching && cvData.teaching.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">강의</h2>
        <div className="preview-teaching-list">
          {cvData.teaching.map((teaching) => (
            <div key={teaching.id} className="preview-teaching-item">
              <h3 className="preview-teaching-course">{teaching.course}</h3>
              <p className="preview-teaching-details">
                {teaching.institution}, {teaching.period}
              </p>
              <p className="preview-teaching-students">
                <strong>학생 수:</strong> {teaching.students}명
                {teaching.rating && ` • 평가: ${teaching.rating}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderAwardsSection = () => (
    cvData.awards && cvData.awards.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">수상</h2>
        <div className="preview-awards-list">
          {cvData.awards.map((award) => (
            <div key={award.id} className="preview-award-item">
              <h3 className="preview-award-title">{award.title}</h3>
              <p className="preview-award-organization">
                {award.organization}, {award.year}
              </p>
              <p className="preview-award-description">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderLanguagesSection = () => (
    cvData.languages && cvData.languages.length > 0 && (
      <div className="preview-section">
        <h2 className="preview-section-title">언어</h2>
        <div className="preview-languages">
          {cvData.languages.map((language, index) => (
            <span key={index}>
              {language}
            </span>
          ))}
        </div>
      </div>
    )
  );

  // 섹션별 렌더링 매핑
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    contact: renderContactSection,
    summary: renderSummarySection,
    experience: renderExperienceSection,
    education: renderEducationSection,
    skills: renderSkillsSection,
    keySkills: renderKeySkillsSection,
    projects: renderProjectsSection,
    research: renderResearchSection,
    publications: renderPublicationsSection,
    conferences: renderConferencesSection,
    grants: renderGrantsSection,
    teaching: renderTeachingSection,
    awards: renderAwardsSection,
    languages: renderLanguagesSection
  };

  // 템플릿 순서에 따라 섹션 렌더링
  const renderSections = () => {
    return template.sections.map((section) => {
      const renderer = sectionRenderers[section];
      return renderer ? renderer() : null;
    });
  };

  // Cascade 템플릿 렌더링
  if (cvData.type === 'cascade') {
    return (
      <motion.div 
        className={`preview-container template-cascade ${className}`}
        key="cascade-template"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.div 
          className="cv-preview"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {renderCascadeTemplate()}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`preview-container ${className}`}
      key="chronological-template"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* A4 크기 컨테이너 */}
      <motion.div 
        className="preview-a4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {renderSections()}
      </motion.div>
    </motion.div>
  );
}
