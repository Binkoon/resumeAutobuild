import type { ExperienceItem, EduItem, ProjectItem, ExternalEducationItem, SkillCategory, Publication, Conference, Grant, Teaching, Award } from '../types/cv';

// 새로운 아이템 생성 유틸리티
export const createEmptyExperience = (): ExperienceItem => ({
  id: Date.now().toString(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  achievements: [],
  technologies: [],
  impact: '',
  isRequired: false
});

export const createEmptyEducation = (): EduItem => ({
  id: Date.now().toString(),
  school: '',
  degree: 'bachelor',
  field: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  status: 'graduated',
  gpa: '',
  relevantCourses: [],
  thesis: '',
  advisor: '',
  isRequired: false
});

export const createEmptyProject = (): ProjectItem => ({
  id: Date.now().toString(),
  name: '',
  description: '',
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  impact: '',
  teamSize: 1,
  isRequired: false
});

export const createEmptyExternalEducation = (): ExternalEducationItem => ({
  id: Date.now().toString(),
  institution: '',
  course: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  isRequired: false
});

// 스킬 카테고리 생성
export const createEmptySkillCategory = (): SkillCategory => ({
  id: Date.now().toString(),
  name: '',
  skills: [],
  examples: []
});

// 학술 관련 아이템 생성
export const createEmptyPublication = (): Publication => ({
  id: Date.now().toString(),
  title: '',
  authors: [],
  journal: '',
  year: '',
  doi: '',
  impact: ''
});

export const createEmptyConference = (): Conference => ({
  id: Date.now().toString(),
  title: '',
  conference: '',
  location: '',
  date: '',
  type: 'oral'
});

export const createEmptyGrant = (): Grant => ({
  id: Date.now().toString(),
  title: '',
  fundingAgency: '',
  amount: '',
  period: '',
  role: ''
});

export const createEmptyTeaching = (): Teaching => ({
  id: Date.now().toString(),
  course: '',
  institution: '',
  period: '',
  students: 0,
  rating: ''
});

export const createEmptyAward = (): Award => ({
  id: Date.now().toString(),
  title: '',
  organization: '',
  year: '',
  description: ''
});

// 아이템 타입별 생성 함수
export const createEmptyItem = (type: 'experience' | 'education' | 'externalEducation' | 'project') => {
  switch (type) {
    case 'experience':
      return createEmptyExperience();
    case 'education':
      return createEmptyEducation();
    case 'externalEducation':
      return createEmptyExternalEducation();
    case 'project':
      return createEmptyProject();
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

// 날짜 포맷팅 유틸리티
export const formatDate = (date: string): string => {
  if (!date) return '';
  if (date === '현재' || date.toLowerCase() === 'present') return '현재';
  
  // YYYY-MM-DD 형식을 DD/MM/YY 형식으로 변환
  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = date.split('-');
    const shortYear = year.slice(-2);
    return `${day}/${month}/${shortYear}`;
  }
  
  return date;
};

// CV 데이터 검증 유틸리티
export const validateCVData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  // 필수 필드 검증
  const requiredFields = ['type', 'personalInfo', 'experience', 'education', 'projects', 'skills', 'languages'];
  for (const field of requiredFields) {
    if (!(field in data)) return false;
  }
  
  return true;
};

// CV 타입별 필수 섹션 검증
export const validateCVType = (cvData: any): string[] => {
  const errors: string[] = [];
  
  if (!cvData.type) {
    errors.push('CV 타입이 선택되지 않았습니다.');
  }
  
  if (!cvData.personalInfo?.name) {
    errors.push('이름은 필수 입력 항목입니다.');
  }
  
  if (!cvData.personalInfo?.email) {
    errors.push('이메일은 필수 입력 항목입니다.');
  }
  
  if (cvData.experience.length === 0) {
    errors.push('최소 하나의 경력사항을 입력해주세요.');
  }
  
  if (cvData.education.length === 0) {
    errors.push('최소 하나의 교육사항을 입력해주세요.');
  }
  
  return errors;
};

// 스킬 카테고리 관리 유틸리티
export const addSkillToCategory = (categories: SkillCategory[], categoryId: string, skill: string): SkillCategory[] => {
  return categories.map(cat => 
    cat.id === categoryId 
      ? { ...cat, skills: [...cat.skills, skill] }
      : cat
  );
};

export const removeSkillFromCategory = (categories: SkillCategory[], categoryId: string, skillIndex: number): SkillCategory[] => {
  return categories.map(cat => 
    cat.id === categoryId 
      ? { ...cat, skills: cat.skills.filter((_, i) => i !== skillIndex) }
      : cat
  );
};

// 학술 성과 정렬 유틸리티
export const sortPublicationsByYear = (publications: Publication[]): Publication[] => {
  return [...publications].sort((a, b) => parseInt(b.year) - parseInt(a.year));
};

export const sortConferencesByDate = (conferences: Conference[]): Conference[] => {
  return [...conferences].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sortGrantsByAmount = (grants: Grant[]): Grant[] => {
  return [...grants].sort((a, b) => {
    const amountA = parseFloat(a.amount.replace(/[^0-9.]/g, ''));
    const amountB = parseFloat(b.amount.replace(/[^0-9.]/g, ''));
    return amountB - amountA;
  });
};
