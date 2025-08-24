// CV 유형 정의
export type CVType = 'chronological' | 'functional' | 'combination' | 'academic' | 'creative';

// CV 템플릿 설정
export interface CVTemplate {
  id: CVType;
  name: string;
  description: string;
  sections: string[];
  isATSCompatible: boolean;
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
  description: string;
  achievements: string[];
  technologies?: string[]; // 사용된 기술 스택
  impact?: string; // 정량적 성과 (예: "매출 20% 증가")
}

export interface EduItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  relevantCourses: string[];
  thesis?: string; // 학위 논문 제목
  advisor?: string; // 지도교수
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
  impact?: string; // 프로젝트 성과
  teamSize?: number; // 팀 규모
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  website?: string; // 개인 웹사이트
  portfolio?: string; // 포트폴리오 링크
}

// 확장된 CV 데이터 인터페이스
export interface CVData {
  // 기본 정보
  type: CVType;
  personalInfo: PersonalInfo;
  
  // 경력 및 교육
  experience: ExperienceItem[];
  education: EduItem[];
  projects: ProjectItem[];
  
  // 스킬 및 언어
  skills: string[];
  skillCategories?: SkillCategory[]; // Functional/Combination용
  languages: string[];
  
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
}

// CV 템플릿 설정 상수
export const CV_TEMPLATES: Record<CVType, CVTemplate> = {
  chronological: {
    id: 'chronological',
    name: 'Chronological Resume',
    description: '경력 중심의 표준 이력서. 최신 경력부터 과거 순으로 정렬',
    sections: ['contact', 'summary', 'experience', 'education', 'skills', 'projects'],
    isATSCompatible: true,
    recommendedFor: ['경력자', '직무 변경', '일반 지원']
  },
  
  functional: {
    id: 'functional',
    name: 'Functional Resume',
    description: '스킬과 역량 중심. 경력 단절이나 커리어 전환 시 적합',
    sections: ['contact', 'summary', 'skills', 'projects', 'experience', 'education'],
    isATSCompatible: true,
    recommendedFor: ['경력 단절자', '커리어 전환자', '신입']
  },
  
  combination: {
    id: 'combination',
    name: 'Combination Resume',
    description: '스킬과 경력을 균형있게 보여주는 하이브리드 형태',
    sections: ['contact', 'summary', 'keySkills', 'experience', 'projects', 'education'],
    isATSCompatible: true,
    recommendedFor: ['중간 경력자', '다양한 경험 보유자', 'ATS 최적화 원하는 지원자']
  },
  
  academic: {
    id: 'academic',
    name: 'Academic CV',
    description: '학술 연구 중심. 논문, 발표, 연구비 등 학술 성과 위주',
    sections: ['contact', 'education', 'research', 'publications', 'conferences', 'grants', 'teaching', 'awards'],
    isATSCompatible: false,
    recommendedFor: ['연구자', '교수', '박사과정 지원자', '학계 진출자']
  },
  
  creative: {
    id: 'creative',
    name: 'Creative Resume',
    description: '디자인과 창의성 중심. 시각적 임팩트가 중요한 직무에 적합',
    sections: ['contact', 'summary', 'experience', 'skills', 'projects', 'education'],
    isATSCompatible: false,
    recommendedFor: ['디자이너', '마케터', '크리에이터', '창의적 직무 지원자']
  }
};

// 섹션별 표시 여부 결정 함수
export const getSectionVisibility = (cvType: CVType, section: string): boolean => {
  const template = CV_TEMPLATES[cvType];
  return template.sections.includes(section);
};

// 유형별 필수 섹션
export const getRequiredSections = (cvType: CVType): string[] => {
  const template = CV_TEMPLATES[cvType];
  return template.sections.filter(section => 
    ['contact', 'summary', 'experience', 'education'].includes(section)
  );
};

// 유형별 선택 섹션
export const getOptionalSections = (cvType: CVType): string[] => {
  const template = CV_TEMPLATES[cvType];
  return template.sections.filter(section => 
    !['contact', 'summary', 'experience', 'education'].includes(section)
  );
};
