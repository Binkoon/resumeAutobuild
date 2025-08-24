import React from 'react';
import { GhostTextarea } from './GhostTextarea';
import { useCVStore } from '../../stores/cvStore';
import { useUIStore } from '../../stores/uiStore';
import { createEmptyItem } from '../../stores/utils';
import type { ExperienceItem, EduItem, ProjectItem } from '../../types/cv';

interface SectionEditorProps {
  type: 'experience' | 'education' | 'project';
}

export function SectionEditor({ type }: SectionEditorProps) {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { cvData, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, addProject, updateProject, deleteProject } = useCVStore();
  const { editingStates, setEditingState } = useUIStore();
  
  // 현재 섹션의 편집 상태와 아이템들
  const editingIndex = editingStates[type];
  const items = cvData[type === 'experience' ? 'experience' : type === 'education' ? 'education' : 'projects'];
  
  // 편집 시작 시 원본 데이터 백업
  const [originalData, setOriginalData] = React.useState<any>(null);

  const addItem = () => {
    const newItem = createEmptyItem(type);
    
    switch (type) {
      case 'experience':
        addExperience(newItem as ExperienceItem);
        break;
      case 'education':
        addEducation(newItem as EduItem);
        break;
      case 'project':
        addProject(newItem as ProjectItem);
        break;
    }
    
    // 새로 추가된 아이템을 편집 모드로 설정
    setEditingState(type, items.length);
  };

  const startEditing = (index: number) => {
    // 편집 시작 시 원본 데이터 백업
    setOriginalData(JSON.parse(JSON.stringify(items[index])));
    setEditingState(type, index);
  };

  const cancelEditing = () => {
    if (editingIndex !== null) {
      if (originalData) {
        // 기존 아이템 편집 취소: 원본 데이터로 복원
        updateItem(editingIndex, originalData);
      } else {
        // 새로 추가된 아이템 편집 취소: 삭제
        deleteItem(editingIndex);
      }
    }
    setEditingState(type, null);
    setOriginalData(null);
  };

  const finishEditing = () => {
    setEditingState(type, null);
    setOriginalData(null);
  };

  const updateItem = (index: number, updatedItem: ExperienceItem | EduItem | ProjectItem) => {
    switch (type) {
      case 'experience':
        updateExperience(index, updatedItem as ExperienceItem);
        break;
      case 'education':
        updateEducation(index, updatedItem as EduItem);
        break;
      case 'project':
        updateProject(index, updatedItem as ProjectItem);
        break;
    }
  };

  const deleteItem = (index: number) => {
    switch (type) {
      case 'experience':
        deleteExperience(index);
        break;
      case 'education':
        deleteEducation(index);
        break;
      case 'project':
        deleteProject(index);
        break;
    }
    
    // 삭제된 아이템이 편집 중이었다면 편집 모드 해제
    if (editingIndex === index) {
      setEditingState(type, null);
    }
  };

  const renderItemForm = (item: ExperienceItem | EduItem | ProjectItem, index: number) => {
    const isEditing = editingIndex === index;
    
    if (!isEditing) {
      return (
        <div className="section-item">
          <div className="section-item-header">
            <h4 className="section-item-title">
              {type === 'experience' && (item as ExperienceItem).position}
              {type === 'education' && (item as EduItem).degree}
              {type === 'project' && (item as ProjectItem).name}
            </h4>
            <div className="section-item-actions">
              <button
                onClick={() => startEditing(index)}
                className="btn btn-primary btn-sm"
              >
                편집
              </button>
              <button
                onClick={() => deleteItem(index)}
                className="btn btn-danger btn-sm"
              >
                삭제
              </button>
            </div>
          </div>
          
          <div className="section-item-content">
            {type === 'experience' && (
              <div>
                <p><strong>회사:</strong> {(item as ExperienceItem).company}</p>
                <p><strong>기간:</strong> {(item as ExperienceItem).startDate} - {(item as ExperienceItem).endDate}</p>
                <p><strong>설명:</strong> {(item as ExperienceItem).description}</p>
              </div>
            )}
            
            {type === 'education' && (
              <div>
                <p><strong>학교:</strong> {(item as EduItem).school}</p>
                <p><strong>전공:</strong> {(item as EduItem).field}</p>
                <p><strong>기간:</strong> {(item as EduItem).startDate} - {(item as EduItem).endDate}</p>
              </div>
            )}
            
            {type === 'project' && (
              <div>
                <p><strong>기술:</strong> {(item as ProjectItem).technologies.join(', ')}</p>
                <p><strong>기간:</strong> {(item as ProjectItem).startDate} - {(item as ProjectItem).endDate}</p>
                <p><strong>설명:</strong> {(item as ProjectItem).description}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="section-item section-item-editing">
        <div className="section-item-content">
          <div className="input-grid-2">
            {type === 'experience' && (
              <>
                <input
                  type="text"
                  placeholder="회사명"
                  value={(item as ExperienceItem).company}
                  onChange={(e) => updateItem(index, { ...item, company: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="직책"
                  value={(item as ExperienceItem).position}
                  onChange={(e) => updateItem(index, { ...item, position: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="시작일 (YYYY-MM)"
                  value={(item as ExperienceItem).startDate}
                  onChange={(e) => updateItem(index, { ...item, startDate: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="종료일 (YYYY-MM 또는 현재)"
                  value={(item as ExperienceItem).endDate}
                  onChange={(e) => updateItem(index, { ...item, endDate: e.target.value })}
                  className="form-input"
                />
                <div className="input-grid-2" style={{ gridColumn: 'span 2' }}>
                  <GhostTextarea
                    value={(item as ExperienceItem).description}
                    onChange={(value) => updateItem(index, { ...item, description: value })}
                    placeholder="업무 설명을 입력하세요..."
                    rows={3}
                    context="experience"
                    field="description"
                  />
                </div>
              </>
            )}

            {type === 'education' && (
              <>
                <input
                  type="text"
                  placeholder="학교명"
                  value={(item as EduItem).school}
                  onChange={(e) => updateItem(index, { ...item, school: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="학위"
                  value={(item as EduItem).degree}
                  onChange={(e) => updateItem(index, { ...item, degree: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="전공"
                  value={(item as EduItem).field}
                  onChange={(e) => updateItem(index, { ...item, field: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="GPA (선택사항)"
                  value={(item as EduItem).gpa || ''}
                  onChange={(e) => updateItem(index, { ...item, gpa: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="시작일 (YYYY-MM)"
                  value={(item as EduItem).startDate}
                  onChange={(e) => updateItem(index, { ...item, startDate: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="종료일 (YYYY-MM 또는 현재)"
                  value={(item as EduItem).endDate}
                  onChange={(e) => updateItem(index, { ...item, endDate: e.target.value })}
                  className="form-input"
                />
              </>
            )}

            {type === 'project' && (
              <>
                <input
                  type="text"
                  placeholder="프로젝트명"
                  value={(item as ProjectItem).name}
                  onChange={(e) => updateItem(index, { ...item, name: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="기술 스택 (쉼표로 구분)"
                  value={(item as ProjectItem).technologies.join(', ')}
                  onChange={(e) => updateItem(index, { ...item, technologies: e.target.value.split(',').map(t => t.trim()) })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="GitHub URL (선택사항)"
                  value={(item as ProjectItem).githubUrl || ''}
                  onChange={(e) => updateItem(index, { ...item, githubUrl: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Live Demo URL (선택사항)"
                  value={(item as ProjectItem).liveUrl || ''}
                  onChange={(e) => updateItem(index, { ...item, liveUrl: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="시작일 (YYYY-MM)"
                  value={(item as ProjectItem).startDate}
                  onChange={(e) => updateItem(index, { ...item, startDate: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="종료일 (YYYY-MM 또는 현재)"
                  value={(item as ProjectItem).endDate}
                  onChange={(e) => updateItem(index, { ...item, endDate: e.target.value })}
                  className="form-input"
                />
                <div className="input-grid-2" style={{ gridColumn: 'span 2' }}>
                  <GhostTextarea
                    value={(item as ProjectItem).description}
                    onChange={(value) => updateItem(index, { ...item, description: value })}
                    placeholder="프로젝트 설명을 입력하세요..."
                    rows={3}
                    context="project"
                    field="description"
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="section-item-actions" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              onClick={cancelEditing}
              className="btn btn-cancel btn-md"
              style={{ marginRight: '8px' }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              취소
            </button>
            <button
              onClick={finishEditing}
              className="btn btn-secondary btn-md"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              완료
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getButtonClassByType = (sectionType: 'experience' | 'education' | 'project') => {
    switch (sectionType) {
      case 'experience':
        return 'btn-primary';
      case 'education':
        return 'btn-info';
      case 'project':
        return 'btn-success';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">
          {type === 'experience' && '경력사항'}
          {type === 'education' && '교육사항'}
          {type === 'project' && '프로젝트'}
        </h3>
        <button
          onClick={addItem}
          className={`btn ${getButtonClassByType(type)}`}
        >
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
            추가
        </button>
      </div>
      
      <div className="section-content">
        {items.map((item, index) => (
          <div key={item.id}>
            {renderItemForm(item, index)}
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="section-empty">
            <svg className="section-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="section-empty-text">
              {type === 'experience' && '아직 경력사항이 없습니다. 추가해보세요!'}
              {type === 'education' && '아직 교육사항이 없습니다. 추가해보세요!'}
              {type === 'project' && '아직 프로젝트가 없습니다. 추가해보세요!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
