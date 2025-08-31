import { create } from 'zustand';

interface UIStore {
  // 편집 모드 상태
  editingStates: {
    experience: number | null;
    education: number | null;
    externalEducation: number | null;
    project: number | null;
  };
  
  // 로딩 상태
  isLoading: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 모달 상태
  modals: {
    export: boolean;
    import: boolean;
    settings: boolean;
  };
  
  // 액션
  setEditingState: (section: 'experience' | 'education' | 'externalEducation' | 'project', index: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openModal: (modal: 'export' | 'import' | 'settings') => void;
  closeModal: (modal: 'export' | 'import' | 'settings') => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // 초기 상태
  editingStates: {
    experience: null,
    education: null,
    externalEducation: null,
    project: null
  },
  
  isLoading: false,
  error: null,
  
  modals: {
    export: false,
    import: false,
    settings: false
  },
  
  // 액션
  setEditingState: (section: 'experience' | 'education' | 'externalEducation' | 'project', index: number | null) => {
    set((state) => ({
      editingStates: {
        ...state.editingStates,
        [section]: index
      }
    }));
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
  
  openModal: (modal: 'export' | 'import' | 'settings') => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: true
      }
    }));
  },
  
  closeModal: (modal: 'export' | 'import' | 'settings') => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: false
      }
    }));
  },
  
  closeAllModals: () => {
    set({
      modals: {
        export: false,
        import: false,
        settings: false
      }
    });
  }
}));
