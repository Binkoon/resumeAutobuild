// CV 유형 정의
export type CVType = 'chronological' | 'cascade';

// CV 템플릿 설정
export interface CVTemplate {
  id: CVType;
  name: string;
  description: string;
  sections: string[];
  isATSCompatible: boolean;
  atsFriendly?: boolean;
  creative?: boolean;
  recommendedFor: string[];
}

// 스킬 카테고리 (Functional/Combination용)
export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
  examples: string[]; // 각 스킬별 근거 사례
}

// 학술 관련 항목 (Academic용)
export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  doi?: string;
  impact?: string;
}

export interface Conference {
  id: string;
  title: string;
  conference: string;
  location: string;
  date: string;
  type: 'oral' | 'poster' | 'workshop';
}

export interface Grant {
  id: string;
  title: string;
  fundingAgency: string;
  amount: string;
  period: string;
  role: string;
}

export interface Teaching {
  id: string;
  course: string;
  institution: string;
  period: string;
  students: number;
  rating?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

// 기존 인터페이스들
export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean; // 재직중 여부
  description: string;
  achievements: string[];
  technologies?: string[]; // 사용된 기술 스택
  impact?: string; // 정량적 성과 (예: "매출 20% 증가")
  isRequired: boolean; // 필수 항목 여부
}

// 학력사항 (학교 정보)
export interface AcademicBackground {
  id: string;
  school: string;
  schoolType: 'elementary' | 'middle' | 'high' | 'college' | 'university' | 'graduate';
  startDate: string;
  endDate: string;
  isCurrent: boolean; // 재학중 여부
  isRequired: boolean; // 필수 항목 여부
}

export interface EduItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean; // 재학중 여부
  status: 'graduated' | 'enrolled' | 'dropped' | 'transferred' | 'completed' | 'suspended' | 'attending'; // 교육 상태
  gpa: string;
  relevantCourses: string[];
  thesis?: string; // 학위 논문 제목
  advisor?: string; // 지도교수
  isRequired: boolean; // 필수 항목 여부
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean; // 진행중 여부
  impact?: string; // 프로젝트 성과
  teamSize?: number; // 팀 규모
  isRequired: boolean; // 필수 항목 여부
}

export interface ExternalEducationItem {
  id: string;
  institution: string; // 교육기관명
  course: string; // 교육과정명
  startDate: string;
  endDate: string;
  isCurrent: boolean; // 수강중 여부
  description?: string; // 교육 내용 설명
  isRequired: boolean; // 필수 항목 여부
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  jobTitle: string; // 직무명
  website?: string; // 개인 웹사이트
  portfolio?: string; // 포트폴리오 링크
  profilePhoto?: string; // 프로필 사진 (base64 또는 URL)
  isRequired: boolean; // 필수 항목 여부
}

// 확장된 CV 데이터 인터페이스
export interface CVData {
  // 기본 정보
  type: CVType;
  personalInfo: PersonalInfo;
  
  // 학력사항 (학교 정보)
  academicBackground: AcademicBackground[];
  
  // 경력 및 교육
  experience: ExperienceItem[];
  education: EduItem[];
  externalEducation: ExternalEducationItem[]; // 외부 교육사항
  projects: ProjectItem[];
  
  // 스킬 및 언어
  skills: string[];
  skillScores: Record<string, number>; // 스킬별 점수 (1-5점)
  skillCategories?: SkillCategory[]; // Functional/Combination용
  languages: string[];
  languageProficiencies: Record<string, string>; // 언어별 수준 (Native, Fluent, Business, Intermediate, Basic)
  
  // 학술 관련 (Academic용)
  publications?: Publication[];
  conferences?: Conference[];
  grants?: Grant[];
  teaching?: Teaching[];
  awards?: Award[];
  
  // 연구 관련 (Academic용)
  researchInterests?: string[];
  references?: string[];
  
  // 메타데이터
  lastModified: string;
  version: string;
  headerColor?: string; // 헤더 색상 (Cascade 템플릿용)
}

// CV 템플릿 설정 상수
export const CV_TEMPLATES: Record<CVType, CVTemplate> = {
  chronological: {
    id: 'chronological',
    name: 'Chronological Resume',
    description: '경력 중심의 표준 이력서. 최신 경력부터 과거 순으로 정렬',
    sections: ['contact', 'summary', 'experience', 'education', 'skills', 'languages', 'projects'],
    isATSCompatible: true,
    atsFriendly: true,
    creative: false,
    recommendedFor: ['경력자', '직무 변경', '일반 지원']
  },
  
  cascade: {
    id: 'cascade',
    name: 'Cascade Type Resume',
    description: '사이드바와 메인 콘텐츠가 균형잡힌 현대적인 레이아웃',
    sections: ['contact', 'summary', 'education', 'externalEducation', 'experience', 'projects', 'certifications', 'languages', 'skills'],
    isATSCompatible: true,
    atsFriendly: true,
    creative: true,
    recommendedFor: ['경력자', '전문직', '현대적 디자인 선호자', '정보량이 많은 지원자']
  }
};

// 섹션별 표시 여부 결정 함수
export const getSectionVisibility = (cvType: CVType, section: string): boolean => {
  const template = CV_TEMPLATES[cvType];
  return template?.sections?.includes(section) || false;
};

// 유형별 필수 섹션
export const getRequiredSections = (cvType: CVType): string[] => {
  const template = CV_TEMPLATES[cvType];
  return template?.sections?.filter(section => 
    ['contact', 'summary', 'experience', 'education'].includes(section)
  ) || [];
};

// 유형별 선택 섹션
export const getOptionalSections = (cvType: CVType): string[] => {
  const template = CV_TEMPLATES[cvType];
  return template?.sections?.filter(section => 
    !['contact', 'summary', 'experience', 'education'].includes(section)
  ) || [];
};
