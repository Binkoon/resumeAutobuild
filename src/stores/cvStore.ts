import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CVData, 
  PersonalInfo, 
  ExperienceItem, 
  EduItem, 
  ProjectItem, 
  CVType,
  SkillCategory,
  Publication,
  Conference,
  Grant,
  Teaching,
  Award
} from '../types/cv';


interface CVStore {
  // 상태
  cvData: CVData;
  
  // CV 타입 관리
  setCVType: (type: CVType) => void;
  
  // 헤더 색상 관리
  setHeaderColor: (color: string) => void;
  
  // 개인정보 관련 액션
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  
  // 경력사항 관련 액션
  addExperience: (experience: ExperienceItem) => void;
  updateExperience: (index: number, experience: ExperienceItem) => void;
  deleteExperience: (index: number) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;
  
  // 교육사항 관련 액션
  addEducation: (education: EduItem) => void;
  updateEducation: (index: number, education: EduItem) => void;
  deleteEducation: (index: number) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  
  // 프로젝트 관련 액션
  addProject: (project: ProjectItem) => void;
  updateProject: (index: number, project: ProjectItem) => void;
  deleteProject: (index: number) => void;
  reorderProject: (fromIndex: number, toIndex: number) => void;
  
  // 스킬 관련 액션
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;
  setSkillScore: (skill: string, score: number) => void;
  
  // 스킬 카테고리 관련 액션 (Functional/Combination용)
  addSkillCategory: (category: SkillCategory) => void;
  updateSkillCategory: (id: string, category: SkillCategory) => void;
  deleteSkillCategory: (id: string) => void;
  
  // 언어 관련 액션
  addLanguage: (language: string) => void;
  removeLanguage: (index: number) => void;
  reorderLanguages: (fromIndex: number, toIndex: number) => void;
  
  // 학술 관련 액션 (Academic용)
  addPublication: (publication: Publication) => void;
  updatePublication: (id: string, publication: Publication) => void;
  deletePublication: (id: string) => void;
  
  addConference: (conference: Conference) => void;
  updateConference: (id: string, conference: Conference) => void;
  deleteConference: (id: string) => void;
  
  addGrant: (grant: Grant) => void;
  updateGrant: (id: string, grant: Grant) => void;
  deleteGrant: (id: string) => void;
  
  addTeaching: (teaching: Teaching) => void;
  updateTeaching: (id: string, teaching: Teaching) => void;
  deleteTeaching: (id: string) => void;
  
  addAward: (award: Award) => void;
  updateAward: (id: string, award: Award) => void;
  deleteAward: (id: string) => void;
  
  // 전체 데이터 관리
  resetCV: () => void;
  importCV: (data: CVData) => void;
  exportCV: () => CVData;
  
  // CV 완성 후 초기화 (자동저장 포함)
  resetAfterCompletion: () => void;
  
  // CV 타입별 초기화
  initializeCVType: (type: CVType) => void;
}

// 초기 CV 데이터
const createInitialCVData = (type: CVType = 'cascade'): CVData => ({
  type,
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    jobTitle: '',
    isRequired: true
  },
  academicBackground: [],
  experience: [],
  education: [],
  projects: [],
  skills: [],
  skillScores: {},
  languages: [],
  lastModified: new Date().toISOString(),
  version: '1.0.0'
});

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      cvData: createInitialCVData(),
      
      // CV 타입 설정
      setCVType: (type: CVType) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            type
          }
        }));
      },
      
      // 헤더 색상 설정
      setHeaderColor: (color: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            headerColor: color
          }
        }));
      },
      
      // 개인정보 업데이트
      updatePersonalInfo: (field: keyof PersonalInfo, value: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: {
              ...state.cvData.personalInfo,
              [field]: value
            }
          }
        }));
      },
      
      // 경력사항 관리
      addExperience: (experience: ExperienceItem) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: [...state.cvData.experience, experience]
          }
        }));
      },
      
      updateExperience: (index: number, experience: ExperienceItem) => {
        set((state) => {
          const newExperience = [...state.cvData.experience];
          newExperience[index] = experience;
          return {
            cvData: {
              ...state.cvData,
              experience: newExperience
            }
          };
        });
      },
      
      deleteExperience: (index: number) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: state.cvData.experience.filter((_, i) => i !== index)
          }
        }));
      },
      
      reorderExperience: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newExperience = [...state.cvData.experience];
          const [removed] = newExperience.splice(fromIndex, 1);
          newExperience.splice(toIndex, 0, removed);
          return {
            cvData: {
              ...state.cvData,
              experience: newExperience
            }
          };
        });
      },
      
      // 교육사항 관리
      addEducation: (education: EduItem) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: [...state.cvData.education, education]
          }
        }));
      },
      
      updateEducation: (index: number, education: EduItem) => {
        set((state) => {
          const newEducation = [...state.cvData.education];
          newEducation[index] = education;
          return {
            cvData: {
              ...state.cvData,
              education: newEducation
            }
          };
        });
      },
      
      deleteEducation: (index: number) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.filter((_, i) => i !== index)
          }
        }));
      },
      
      reorderEducation: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newEducation = [...state.cvData.education];
          const [removed] = newEducation.splice(fromIndex, 1);
          newEducation.splice(toIndex, 0, removed);
          return {
            cvData: {
              ...state.cvData,
              education: newEducation
            }
          };
        });
      },
      
      // 프로젝트 관리
      addProject: (project: ProjectItem) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: [...state.cvData.projects, project]
          }
        }));
      },
      
      updateProject: (index: number, project: ProjectItem) => {
        set((state) => {
          const newProjects = [...state.cvData.projects];
          newProjects[index] = project;
          return {
            cvData: {
              ...state.cvData,
              projects: newProjects
            }
          };
        });
      },
      
      deleteProject: (index: number) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.filter((_, i) => i !== index)
          }
        }));
      },
      
      reorderProject: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newProjects = [...state.cvData.projects];
          const [removed] = newProjects.splice(fromIndex, 1);
          newProjects.splice(toIndex, 0, removed);
          return {
            cvData: {
              ...state.cvData,
              projects: newProjects
            }
          };
        });
      },
      
      // 스킬 관리
      addSkill: (skill: string) => {
        if (skill.trim()) {
          set((state) => ({
            cvData: {
              ...state.cvData,
              skills: [...state.cvData.skills, skill.trim()],
              skillScores: {
                ...state.cvData.skillScores,
                [skill.trim()]: 3 // 기본 점수 3점
              }
            }
          }));
        }
      },
      
      removeSkill: (index: number) => {
        set((state) => {
          const skillToRemove = state.cvData.skills[index];
          const newSkillScores = { ...state.cvData.skillScores };
          delete newSkillScores[skillToRemove];
          
          return {
            cvData: {
              ...state.cvData,
              skills: state.cvData.skills.filter((_, i) => i !== index),
              skillScores: newSkillScores
            }
          };
        });
      },
      
      reorderSkills: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newSkills = [...state.cvData.skills];
          const [removed] = newSkills.splice(fromIndex, 1);
          newSkills.splice(toIndex, 0, removed);
          return {
            cvData: {
              ...state.cvData,
              skills: newSkills
            }
          };
        });
      },
      
      setSkillScore: (skill: string, score: number) => {
        // 점수는 1-5 사이로 제한
        const validScore = Math.min(5, Math.max(1, score));
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillScores: {
              ...state.cvData.skillScores,
              [skill]: validScore
            }
          }
        }));
      },
      
      // 스킬 카테고리 관리
      addSkillCategory: (category: SkillCategory) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillCategories: [...(state.cvData.skillCategories || []), category]
          }
        }));
      },
      
      updateSkillCategory: (id: string, category: SkillCategory) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillCategories: (state.cvData.skillCategories || []).map(cat => 
              cat.id === id ? category : cat
            )
          }
        }));
      },
      
      deleteSkillCategory: (id: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            skillCategories: (state.cvData.skillCategories || []).filter(cat => cat.id !== id)
          }
        }));
      },
      
      // 언어 관리
      addLanguage: (language: string) => {
        if (language.trim()) {
          set((state) => ({
            cvData: {
              ...state.cvData,
              languages: [...(state.cvData.languages || []), language.trim()]
            }
          }));
        }
      },
      
      removeLanguage: (index: number) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: (state.cvData.languages || []).filter((_, i) => i !== index)
          }
        }));
      },
      
      reorderLanguages: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newLanguages = [...(state.cvData.languages || [])];
          const [removed] = newLanguages.splice(fromIndex, 1);
          newLanguages.splice(toIndex, 0, removed);
          return {
            cvData: {
              ...state.cvData,
              languages: newLanguages
            }
          };
        });
      },
      
      // 학술 관련 관리
      addPublication: (publication: Publication) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            publications: [...(state.cvData.publications || []), publication]
          }
        }));
      },
      
      updatePublication: (id: string, publication: Publication) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            publications: (state.cvData.publications || []).map(pub => 
              pub.id === id ? publication : pub
            )
          }
        }));
      },
      
      deletePublication: (id: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            publications: (state.cvData.publications || []).filter(pub => pub.id !== id)
          }
        }));
      },
      
      addConference: (conference: Conference) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            conferences: [...(state.cvData.conferences || []), conference]
          }
        }));
      },
      
      updateConference: (id: string, conference: Conference) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            conferences: (state.cvData.conferences || []).map(conf => 
              conf.id === id ? conference : conf
            )
          }
        }));
      },
      
      deleteConference: (id: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            conferences: (state.cvData.conferences || []).filter(conf => conf.id !== id)
          }
        }));
      },
      
      addGrant: (grant: Grant) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            grants: [...(state.cvData.grants || []), grant]
          }
        }));
      },
      
      updateGrant: (id: string, grant: Grant) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            grants: (state.cvData.grants || []).map(g => 
              g.id === id ? grant : g
            )
          }
        }));
      },
      
      deleteGrant: (id: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            grants: (state.cvData.grants || []).filter(g => g.id !== id)
          }
        }));
      },
      
      addTeaching: (teaching: Teaching) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            teaching: [...(state.cvData.teaching || []), teaching]
          }
        }));
      },
      
      updateTeaching: (id: string, teaching: Teaching) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            teaching: (state.cvData.teaching || []).map(t => 
              t.id === id ? teaching : t
            )
          }
        }));
      },
      
      deleteTeaching: (id: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            teaching: (state.cvData.teaching || []).filter(t => t.id !== id)
          }
        }));
      },
      
      addAward: (award: Award) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            awards: [...(state.cvData.awards || []), award]
          }
        }));
      },
      
      updateAward: (id: string, award: Award) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            awards: (state.cvData.awards || []).map(a => 
              a.id === id ? award : a
            )
          }
        }));
      },
      
      deleteAward: (id: string) => {
        set((state) => ({
          cvData: {
            ...state.cvData,
            awards: (state.cvData.awards || []).filter(a => a.id !== id)
          }
        }));
      },
      
      // 전체 데이터 관리
      resetCV: () => {
        const currentType = get().cvData.type;
        set({ cvData: createInitialCVData(currentType) });
      },
      
      importCV: (data: CVData) => {
        set({ cvData: data });
      },
      
      exportCV: () => {
        return get().cvData;
      },
      
      // CV 완성 후 초기화 (자동저장 포함)
      resetAfterCompletion: () => {
        const currentType = get().cvData.type;
        set({ cvData: createInitialCVData(currentType) });
        
        // 자동저장 및 임시저장 초기화
        import('../lib/autosave').then(({ resetAfterCompletion }) => {
          resetAfterCompletion();
        });
      },
      
      // CV 타입별 초기화
      initializeCVType: (type: CVType) => {
        set({ cvData: createInitialCVData(type) });
      }
    }),
    {
      name: 'cv-storage',
      partialize: (state) => ({ cvData: state.cvData }),
    }
  )
);
