import type { CVData, ExperienceItem, EduItem, ProjectItem } from '../types/cv';

/**
 * 줄바꿈 추가
 */
export function nl(count: number = 1): string {
  return '\n'.repeat(count);
}

/**
 * 텍스트 포맷팅 (볼드, 이탤릭 등)
 */
export function fmt(text: string, type: 'bold' | 'italic' | 'code'): string {
  switch (type) {
    case 'bold':
      return `**${text}**`;
    case 'italic':
      return `*${text}*`;
    case 'code':
      return `\`${text}\``;
    default:
      return text;
  }
}

/**
 * CV 데이터를 마크다운으로 변환
 */
export function buildMarkdown(cvData: CVData): string {
  let markdown = '';
  
  // 헤더
  markdown += `# ${cvData.personalInfo.name}${nl(2)}`;
  
  // 연락처 정보
  markdown += `**Email:** ${cvData.personalInfo.email} | **Phone:** ${cvData.personalInfo.phone}${nl()}`;
  markdown += `**Location:** ${cvData.personalInfo.location}${nl(2)}`;
  
  // 소셜 링크
  if (cvData.personalInfo.linkedin || cvData.personalInfo.github) {
    if (cvData.personalInfo.linkedin) {
      markdown += `**LinkedIn:** ${cvData.personalInfo.linkedin}${nl()}`;
    }
    if (cvData.personalInfo.github) {
      markdown += `**GitHub:** ${cvData.personalInfo.github}${nl()}`;
    }
    markdown += nl();
  }
  
  // 요약
  markdown += `## Summary${nl()}`;
  markdown += `${cvData.personalInfo.summary}${nl(2)}`;
  
  // 경험
  if (cvData.experience.length > 0) {
    markdown += `## Professional Experience${nl(2)}`;
    cvData.experience.forEach(exp => {
      markdown += buildExperienceMarkdown(exp);
    });
  }
  
  // 교육
  if (cvData.education.length > 0) {
    markdown += `## Education${nl(2)}`;
    cvData.education.forEach(edu => {
      markdown += buildEducationMarkdown(edu);
    });
  }
  
  // 프로젝트
  if (cvData.projects.length > 0) {
    markdown += `## Projects${nl(2)}`;
    cvData.projects.forEach(project => {
      markdown += buildProjectMarkdown(project);
    });
  }
  
  // 스킬
  if (cvData.skills.length > 0) {
    markdown += `## Skills${nl(2)}`;
    markdown += `${cvData.skills.join(', ')}${nl(2)}`;
  }
  
  // 언어
  if (cvData.languages && cvData.languages.length > 0) {
    markdown += `## Languages${nl(2)}`;
    markdown += `${cvData.languages.join(', ')}${nl()}`;
  }
  
  return markdown;
}

function buildExperienceMarkdown(exp: ExperienceItem): string {
  let markdown = '';
  markdown += `### ${exp.position} at ${exp.company}${nl()}`;
  markdown += `*${exp.startDate} - ${exp.endDate}*${nl(2)}`;
  markdown += `${exp.description}${nl()}`;
  
  if (exp.achievements.length > 0) {
    markdown += nl();
    exp.achievements.forEach(achievement => {
      markdown += `• ${achievement}${nl()}`;
    });
  }
  
  markdown += nl();
  return markdown;
}

function buildEducationMarkdown(edu: EduItem): string {
  let markdown = '';
  markdown += `### ${edu.degree} in ${edu.field}${nl()}`;
  markdown += `**${edu.school}** | *${edu.startDate} - ${edu.endDate}*${nl()}`;
  
  if (edu.gpa) {
    markdown += `**GPA:** ${edu.gpa}${nl()}`;
  }
  
  if (edu.relevantCourses && edu.relevantCourses.length > 0) {
    markdown += `**Relevant Courses:** ${edu.relevantCourses.join(', ')}${nl()}`;
  }
  
  markdown += nl(2);
  return markdown;
}

function buildProjectMarkdown(project: ProjectItem): string {
  let markdown = '';
  markdown += `### ${project.name}${nl()}`;
  markdown += `*${project.startDate} - ${project.endDate}*${nl(2)}`;
  markdown += `${project.description}${nl()}`;
  markdown += `**Technologies:** ${project.technologies.join(', ')}${nl()}`;
  
  if (project.githubUrl || project.liveUrl) {
    markdown += nl();
    if (project.githubUrl) {
      markdown += `**GitHub:** ${project.githubUrl}${nl()}`;
    }
    if (project.liveUrl) {
      markdown += `**Live Demo:** ${project.liveUrl}${nl()}`;
    }
  }
  
  markdown += nl(2);
  return markdown;
}
