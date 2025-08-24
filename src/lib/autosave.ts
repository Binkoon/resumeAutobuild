// 자동 저장 및 임시저장 기능
import { CVData } from '../types/cv';

const AUTOSAVE_KEY = 'cv_autosave';
const AUTOSAVE_INTERVAL = 30000; // 30초마다 자동저장
const MAX_AUTOSAVES = 10; // 최대 10개 버전 유지

export interface AutosaveEntry {
  id: string;
  timestamp: number;
  data: CVData;
  name: string;
  description?: string;
}

export interface AutosaveManager {
  // 자동 저장
  autoSave: (data: CVData) => void;
  
  // 수동 임시저장
  saveDraft: (data: CVData, name: string, description?: string) => string;
  
  // 임시저장 목록 조회
  getDrafts: () => AutosaveEntry[];
  
  // 특정 임시저장 불러오기
  loadDraft: (id: string) => CVData | null;
  
  // 임시저장 삭제
  deleteDraft: (id: string) => boolean;
  
  // 최신 자동저장 불러오기
  loadLatestAutosave: () => CVData | null;
  
  // 모든 임시저장 삭제
  clearAllDrafts: () => void;
  
  // 저장 공간 사용량 확인
  getStorageUsage: () => { used: number; total: number };
  
  // CV 완성 후 초기화 (자동저장 및 임시저장 모두 삭제)
  resetAfterCompletion: () => void;
}

class LocalStorageAutosaveManager implements AutosaveManager {
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private lastData: CVData | null = null;

  constructor() {
    // 페이지 로드시 자동저장 타이머 시작
    this.startAutoSave();
    
    // 페이지 언로드시 자동저장
    window.addEventListener('beforeunload', () => {
      if (this.lastData) {
        this.autoSave(this.lastData);
      }
    });
  }

  private startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(() => {
      if (this.lastData) {
        this.autoSave(this.lastData);
      }
    }, AUTOSAVE_INTERVAL);
  }

  private generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStorageKey(key: string): string {
    return `${AUTOSAVE_KEY}_${key}`;
  }

  autoSave(data: CVData): void {
    try {
      this.lastData = data;
      const autosaveData: AutosaveEntry = {
        id: 'autosave',
        timestamp: Date.now(),
        data: data,
        name: '자동저장'
      };

      localStorage.setItem(this.getStorageKey('autosave'), JSON.stringify(autosaveData));
      
      // 자동저장 성공시 콘솔에 로그 (개발용)
      if (process.env.NODE_ENV === 'development') {
        console.log('자동저장 완료:', new Date().toLocaleString());
      }
    } catch (error) {
      console.error('자동저장 실패:', error);
    }
  }

  saveDraft(data: CVData, name: string, description?: string): string {
    try {
      const drafts = this.getDrafts();
      const newDraft: AutosaveEntry = {
        id: this.generateId(),
        timestamp: Date.now(),
        data: data,
        name: name,
        description: description
      };

      // 최대 개수 제한 확인
      if (drafts.length >= MAX_AUTOSAVES) {
        // 가장 오래된 것 삭제
        const oldestDraft = drafts.reduce((oldest, current) => 
          current.timestamp < oldest.timestamp ? current : oldest
        );
        this.deleteDraft(oldestDraft.id);
      }

      drafts.push(newDraft);
      localStorage.setItem(this.getStorageKey('drafts'), JSON.stringify(drafts));
      
      return newDraft.id;
    } catch (error) {
      console.error('임시저장 실패:', error);
      throw new Error('임시저장에 실패했습니다.');
    }
  }

  getDrafts(): AutosaveEntry[] {
    try {
      const draftsJson = localStorage.getItem(this.getStorageKey('drafts'));
      if (!draftsJson) return [];
      
      const drafts: AutosaveEntry[] = JSON.parse(draftsJson);
      return drafts.sort((a, b) => b.timestamp - a.timestamp); // 최신순 정렬
    } catch (error) {
      console.error('임시저장 목록 조회 실패:', error);
      return [];
    }
  }

  loadDraft(id: string): CVData | null {
    try {
      if (id === 'autosave') {
        return this.loadLatestAutosave();
      }

      const drafts = this.getDrafts();
      const draft = drafts.find(d => d.id === id);
      
      if (draft) {
        // 로드 성공시 자동저장 업데이트
        this.lastData = draft.data;
        return draft.data;
      }
      
      return null;
    } catch (error) {
      console.error('임시저장 불러오기 실패:', error);
      return null;
    }
  }

  deleteDraft(id: string): boolean {
    try {
      if (id === 'autosave') {
        localStorage.removeItem(this.getStorageKey('autosave'));
        return true;
      }

      const drafts = this.getDrafts();
      const filteredDrafts = drafts.filter(d => d.id !== id);
      
      if (filteredDrafts.length !== drafts.length) {
        localStorage.setItem(this.getStorageKey('drafts'), JSON.stringify(filteredDrafts));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('임시저장 삭제 실패:', error);
      return false;
    }
  }

  loadLatestAutosave(): CVData | null {
    try {
      const autosaveJson = localStorage.getItem(this.getStorageKey('autosave'));
      if (!autosaveJson) return null;
      
      const autosave: AutosaveEntry = JSON.parse(autosaveJson);
      this.lastData = autosave.data;
      return autosave.data;
    } catch (error) {
      console.error('자동저장 불러오기 실패:', error);
      return null;
    }
  }

  clearAllDrafts(): void {
    try {
      // 모든 관련 키 삭제
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(AUTOSAVE_KEY)) {
          localStorage.removeItem(key);
        }
      });
      
      this.lastData = null;
    } catch (error) {
      console.error('모든 임시저장 삭제 실패:', error);
    }
  }

  getStorageUsage(): { used: number; total: number } {
    try {
      let used = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(AUTOSAVE_KEY)) {
          const value = localStorage.getItem(key);
          if (value) {
            used += new Blob([value]).size;
          }
        }
      });

      // 로컬스토리지 용량 제한 (보통 5-10MB)
      const total = 5 * 1024 * 1024; // 5MB
      
      return { used, total };
    } catch (error) {
      return { used: 0, total: 0 };
    }
  }

  // 자동저장 중지 (컴포넌트 언마운트시 호출)
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }
  
  // CV 완성 후 초기화
  resetAfterCompletion(): void {
    try {
      // 자동저장 데이터 삭제
      localStorage.removeItem(this.getStorageKey('autosave'));
      
      // 모든 임시저장 삭제
      this.clearAllDrafts();
      
      // 마지막 데이터 초기화
      this.lastData = null;
      
      // 자동저장 타이머 재시작
      this.startAutoSave();
      
      console.log('CV 완성 후 초기화 완료');
    } catch (error) {
      console.error('CV 완성 후 초기화 실패:', error);
    }
  }
}

// 싱글톤 인스턴스 생성
export const autosaveManager = new LocalStorageAutosaveManager();

// 편의 함수들
export const autoSave = (data: CVData) => autosaveManager.autoSave(data);
export const saveDraft = (data: CVData, name: string, description?: string) => 
  autosaveManager.saveDraft(data, name, description);
export const getDrafts = () => autosaveManager.getDrafts();
export const loadDraft = (id: string) => autosaveManager.loadDraft(id);
export const deleteDraft = (id: string) => autosaveManager.deleteDraft(id);
export const loadLatestAutosave = () => autosaveManager.loadLatestAutosave();
export const clearAllDrafts = () => autosaveManager.clearAllDrafts();
export const getStorageUsage = () => autosaveManager.getStorageUsage();
export const resetAfterCompletion = () => autosaveManager.resetAfterCompletion();
