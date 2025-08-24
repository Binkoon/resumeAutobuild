// 기본 제공 스킬 카테고리 및 스킬들
export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming',
    name: '프로그래밍 언어',
    skills: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
      'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Dart'
    ]
  },
  {
    id: 'frontend',
    name: '프론트엔드',
    skills: [
      'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
      'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap',
      'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier'
    ]
  },
  {
    id: 'backend',
    name: '백엔드',
    skills: [
      'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'Spring Boot',
      'FastAPI', 'ASP.NET Core', 'Laravel', 'Ruby on Rails', 'Gin',
      'GraphQL', 'REST API', 'gRPC', 'WebSocket'
    ]
  },
  {
    id: 'database',
    name: '데이터베이스',
    skills: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
      'SQL Server', 'MariaDB', 'Cassandra', 'DynamoDB', 'Firebase',
      'Elasticsearch', 'Neo4j', 'InfluxDB'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & 클라우드',
    skills: [
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform',
      'Jenkins', 'GitLab CI', 'GitHub Actions', 'Ansible', 'Chef',
      'Prometheus', 'Grafana', 'ELK Stack', 'Istio'
    ]
  },
  {
    id: 'mobile',
    name: '모바일 개발',
    skills: [
      'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova',
      'Android Studio', 'Xcode', 'Kotlin', 'Swift', 'Objective-C'
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI & 머신러닝',
    skills: [
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenCV',
      'NLTK', 'spaCy', 'Hugging Face', 'Pandas', 'NumPy',
      'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter'
    ]
  },
  {
    id: 'design',
    name: '디자인 & 크리에이티브',
    skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
      'InDesign', 'After Effects', 'Premiere Pro', 'Blender', 'Unity',
      'Framer', 'Webflow', 'Canva'
    ]
  },
  {
    id: 'marketing',
    name: '마케팅 & 분석',
    skills: [
      'Google Analytics', 'Google Ads', 'Facebook Ads', 'SEO', 'SEM',
      'Email Marketing', 'Content Marketing', 'Social Media Marketing',
      'HubSpot', 'Mailchimp', 'Buffer', 'Hootsuite'
    ]
  },
  {
    id: 'business',
    name: '비즈니스 & 관리',
    skills: [
      'Project Management', 'Agile', 'Scrum', 'Kanban', 'JIRA',
      'Confluence', 'Slack', 'Microsoft Office', 'Google Workspace',
      'Salesforce', 'SAP', 'Oracle ERP'
    ]
  },
  {
    id: 'languages',
    name: '언어',
    skills: [
      '한국어', '영어', '일본어', '중국어', '스페인어', '프랑스어',
      '독일어', '이탈리아어', '포르투갈어', '러시아어', '아랍어'
    ]
  }
];

// 모든 스킬을 평면화
export const ALL_SKILLS = SKILL_CATEGORIES.flatMap(category => category.skills);

// 스킬 검색 함수
export const searchSkills = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  return ALL_SKILLS.filter(skill => 
    skill.toLowerCase().includes(lowercaseQuery)
  );
};

// 카테고리별 스킬 검색
export const searchSkillsByCategory = (query: string, categoryId?: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  if (categoryId) {
    const category = SKILL_CATEGORIES.find(cat => cat.id === categoryId);
    if (category) {
      return category.skills.filter(skill => 
        skill.toLowerCase().includes(lowercaseQuery)
      );
    }
    return [];
  }
  
  return searchSkills(query);
};
