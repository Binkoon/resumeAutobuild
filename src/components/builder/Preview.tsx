import React from 'react';
import { useCVStore } from '../../stores/cvStore';
import { formatDate } from '../../stores/utils';
import { CV_TEMPLATES, getSectionVisibility } from '../../types/cv';

interface PreviewProps {
  className?: string;
}

export function Preview({ className = '' }: PreviewProps) {
  // Zustand 스토어에서 CV 데이터 가져오기
  const { cvData } = useCVStore();
  const template = CV_TEMPLATES[cvData.type];

  // 섹션별 렌더링 함수들
  const renderContactSection = () => (
    <div className="preview-header">
      <h1 className="preview-name">
        {cvData.personalInfo.name || '이름을 입력하세요'}
      </h1>
      <div className="preview-contact">
        <p>{cvData.personalInfo.email || '이메일을 입력하세요'}</p>
        <p>{cvData.personalInfo.phone || '전화번호를 입력하세요'}</p>
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

  return (
    <div className={`preview-container ${className}`}>
      {/* A4 크기 컨테이너 */}
      <div className="preview-a4">
        {renderSections()}
      </div>
    </div>
  );
}
