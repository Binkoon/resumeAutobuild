import { useState, useEffect } from 'react';
import { 
  getDrafts, 
  saveDraft, 
  loadDraft, 
  deleteDraft, 
  clearAllDrafts, 
  getStorageUsage
} from '../../lib/autosave';
import type { CVData } from '../../types/cv';

interface DraftManagerProps {
  currentData: CVData;
  onLoadDraft: (data: CVData) => void;
  onSaveDraft?: (draftId: string) => void;
}

export function DraftManager({ currentData, onLoadDraft, onSaveDraft }: DraftManagerProps) {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0 });
  const [selectedDraft, setSelectedDraft] = useState<any | null>(null);

  useEffect(() => {
    loadDrafts();
    updateStorageUsage();
  }, []);

  const loadDrafts = () => {
    const draftList = getDrafts();
    setDrafts(draftList);
  };

  const updateStorageUsage = () => {
    const usage = getStorageUsage();
    setStorageUsage(usage);
  };

  const handleSaveDraft = () => {
    if (!draftName.trim()) {
      alert('임시저장명을 입력해주세요.');
      return;
    }

    try {
      const draftId = saveDraft(currentData, draftName.trim(), draftDescription.trim());
      setDraftName('');
      setDraftDescription('');
      setShowSaveModal(false);
      loadDrafts();
      updateStorageUsage();
      
      if (onSaveDraft) {
        onSaveDraft(draftId);
      }
      
      alert('임시저장이 완료되었습니다.');
    } catch (error) {
      alert('임시저장에 실패했습니다.');
      console.error(error);
    }
  };

  const handleLoadDraft = (draft: any) => {
    const data = loadDraft(draft.id);
    if (data) {
      onLoadDraft(data);
      setShowLoadModal(false);
      alert(`${draft.name}을 불러왔습니다.`);
    } else {
      alert('임시저장을 불러오는데 실패했습니다.');
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    if (confirm('정말로 이 임시저장을 삭제하시겠습니까?')) {
      if (deleteDraft(draftId)) {
        loadDrafts();
        updateStorageUsage();
        alert('임시저장이 삭제되었습니다.');
      } else {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const handleClearAllDrafts = () => {
    if (confirm('모든 임시저장을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      clearAllDrafts();
      loadDrafts();
      updateStorageUsage();
      alert('모든 임시저장이 삭제되었습니다.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR');
  };

  const getStoragePercentage = (): number => {
    return (storageUsage.used / storageUsage.total) * 100;
  };

  return (
    <div className="draft-manager">
      <div className="draft-header">
        <h3>임시저장 관리</h3>
        <div className="draft-actions">
          <button 
            onClick={() => setShowSaveModal(true)}
            className="save-draft-btn"
          >
            💾 임시저장
          </button>
          <button 
            onClick={() => setShowLoadModal(true)}
            className="load-draft-btn"
            disabled={drafts.length === 0}
          >
            📂 불러오기
          </button>
        </div>
      </div>

      {/* 저장 공간 사용량 */}
      <div className="storage-info">
        <div className="storage-bar">
          <div 
            className="storage-fill"
            style={{ width: `${getStoragePercentage()}%` }}
          ></div>
        </div>
        <div className="storage-text">
          저장 공간: {formatFileSize(storageUsage.used)} / {formatFileSize(storageUsage.total)}
          <span className={`storage-percentage ${getStoragePercentage() > 80 ? 'warning' : ''}`}>
            ({getStoragePercentage().toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* 임시저장 목록 */}
      {drafts.length > 0 && (
        <div className="drafts-list">
          <h4>저장된 임시저장 ({drafts.length}개)</h4>
          <div className="drafts-grid">
            {drafts.map((draft) => (
              <div key={draft.id} className="draft-item">
                <div className="draft-info">
                  <h5>{draft.name}</h5>
                  {draft.description && (
                    <p className="draft-description">{draft.description}</p>
                  )}
                  <p className="draft-date">{formatDate(draft.timestamp)}</p>
                </div>
                <div className="draft-actions">
                  <button 
                    onClick={() => handleLoadDraft(draft)}
                    className="load-btn"
                    title="불러오기"
                  >
                    📂
                  </button>
                  <button 
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="delete-btn"
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleClearAllDrafts}
            className="clear-all-btn"
          >
            모든 임시저장 삭제
          </button>
        </div>
      )}

      {/* 임시저장 모달 */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>임시저장</h3>
            <div className="form-group">
              <label>저장명 *</label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="예: 첫 번째 버전, 회사 지원용 등"
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label>설명 (선택사항)</label>
              <textarea
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                placeholder="이 버전에 대한 간단한 설명을 입력하세요"
                rows={3}
                maxLength={200}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowSaveModal(false)} className="cancel-btn">
                취소
              </button>
              <button onClick={handleSaveDraft} className="confirm-btn">
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 불러오기 모달 */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>임시저장 불러오기</h3>
            <div className="drafts-selection">
              {drafts.map((draft) => (
                <div 
                  key={draft.id} 
                  className={`draft-selection-item ${selectedDraft?.id === draft.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDraft(draft)}
                >
                  <div className="draft-selection-info">
                    <h5>{draft.name}</h5>
                    {draft.description && (
                      <p>{draft.description}</p>
                    )}
                    <small>{formatDate(draft.timestamp)}</small>
                  </div>
                  <div className="draft-selection-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadDraft(draft);
                      }}
                      className="load-now-btn"
                    >
                      불러오기
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowLoadModal(false)} className="cancel-btn">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
