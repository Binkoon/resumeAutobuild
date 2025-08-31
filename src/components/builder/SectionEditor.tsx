import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GhostTextarea } from './GhostTextarea';
import { DatePicker } from '../ui/DatePicker';
import { useCVStore } from '../../stores/cvStore';
import { useUIStore } from '../../stores/uiStore';
import { createEmptyItem } from '../../stores/utils';
import type { ExperienceItem, EduItem, ProjectItem, ExternalEducationItem } from '../../types/cv';

interface SectionEditorProps {
  type: 'experience' | 'education' | 'externalEducation' | 'project';
}

export function SectionEditor({ type }: SectionEditorProps) {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { cvData, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, addExternalEducation, updateExternalEducation, deleteExternalEducation, addProject, updateProject, deleteProject } = useCVStore();
  const { editingStates, setEditingState } = useUIStore();
  
  // 현재 섹션의 편집 상태와 아이템들
  const editingIndex = editingStates[type];
  const items = cvData[type === 'experience' ? 'experience' : type === 'education' ? 'education' : type === 'externalEducation' ? 'externalEducation' : 'projects'];
  
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
      case 'externalEducation':
        addExternalEducation(newItem as ExternalEducationItem);
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

  const updateItem = (index: number, updatedItem: ExperienceItem | EduItem | ExternalEducationItem | ProjectItem) => {
    switch (type) {
      case 'experience':
        updateExperience(index, updatedItem as ExperienceItem);
        break;
      case 'education':
        updateEducation(index, updatedItem as EduItem);
        break;
      case 'externalEducation':
        updateExternalEducation(index, updatedItem as ExternalEducationItem);
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
      case 'externalEducation':
        deleteExternalEducation(index);
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

  const renderItemForm = (item: ExperienceItem | EduItem | ExternalEducationItem | ProjectItem, index: number) => {
    const isEditing = editingIndex === index;
    
    if (!isEditing) {
      return (
        <div className="section-item">
          <div className="section-item-header">
            <h4 className="section-item-title">
              {type === 'experience' && (item as ExperienceItem).position}
              {type === 'education' && (item as EduItem).degree}
              {type === 'externalEducation' && (item as ExternalEducationItem).course}
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
            
            {type === 'externalEducation' && (
              <div>
                <p><strong>교육기관:</strong> {(item as ExternalEducationItem).institution}</p>
                <p><strong>교육과정:</strong> {(item as ExternalEducationItem).course}</p>
                <p><strong>기간:</strong> {(item as ExternalEducationItem).startDate} - {(item as ExternalEducationItem).endDate}</p>
                {(item as ExternalEducationItem).description && (
                  <p><strong>설명:</strong> {(item as ExternalEducationItem).description}</p>
                )}
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
                <DatePicker
                  value={(item as ExperienceItem).startDate}
                  onChange={(date) => updateItem(index, { ...item, startDate: date })}
                  placeholder="시작일 선택"
                  maxDate={(item as ExperienceItem).endDate && (item as ExperienceItem).endDate !== '현재' ? (item as ExperienceItem).endDate : undefined}
                />
                <div className="date-input-group">
                  <DatePicker
                    value={(item as ExperienceItem).endDate}
                    onChange={(date) => updateItem(index, { ...item, endDate: date })}
                    placeholder="종료일 선택"
                    disabled={(item as ExperienceItem).isCurrent}
                    minDate={(item as ExperienceItem).startDate}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(item as ExperienceItem).isCurrent}
                      onChange={(e) => {
                        const isCurrent = e.target.checked;
                        updateItem(index, { 
                          ...item, 
                          isCurrent,
                          endDate: isCurrent ? '현재' : (item as ExperienceItem).endDate
                        });
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">재직중</span>
                  </label>
                </div>
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
                <DatePicker
                  value={(item as EduItem).startDate}
                  onChange={(date) => updateItem(index, { ...item, startDate: date })}
                  placeholder="시작일 선택"
                  maxDate={(item as EduItem).endDate && (item as EduItem).endDate !== '현재' ? (item as EduItem).endDate : undefined}
                />
                <div className="date-input-group">
                  <DatePicker
                    value={(item as EduItem).endDate}
                    onChange={(date) => updateItem(index, { ...item, endDate: date })}
                    placeholder="종료일 선택"
                    disabled={(item as EduItem).isCurrent}
                    minDate={(item as EduItem).startDate}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(item as EduItem).isCurrent}
                      onChange={(e) => {
                        const isCurrent = e.target.checked;
                        updateItem(index, { 
                          ...item, 
                          isCurrent,
                          endDate: isCurrent ? '현재' : (item as EduItem).endDate
                        });
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">재학중</span>
                  </label>
                </div>
              </>
            )}

            {type === 'externalEducation' && (
              <>
                <input
                  type="text"
                  placeholder="교육기관명"
                  value={(item as ExternalEducationItem).institution}
                  onChange={(e) => updateItem(index, { ...item, institution: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="교육과정명"
                  value={(item as ExternalEducationItem).course}
                  onChange={(e) => updateItem(index, { ...item, course: e.target.value })}
                  className="form-input"
                />
                <DatePicker
                  value={(item as ExternalEducationItem).startDate}
                  onChange={(date) => updateItem(index, { ...item, startDate: date })}
                  placeholder="시작일 선택"
                  maxDate={(item as ExternalEducationItem).endDate && (item as ExternalEducationItem).endDate !== '현재' ? (item as ExternalEducationItem).endDate : undefined}
                />
                <div className="date-input-group">
                  <DatePicker
                    value={(item as ExternalEducationItem).endDate}
                    onChange={(date) => updateItem(index, { ...item, endDate: date })}
                    placeholder="종료일 선택"
                    disabled={(item as ExternalEducationItem).isCurrent}
                    minDate={(item as ExternalEducationItem).startDate}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(item as ExternalEducationItem).isCurrent}
                      onChange={(e) => {
                        const isCurrent = e.target.checked;
                        updateItem(index, { 
                          ...item, 
                          isCurrent,
                          endDate: isCurrent ? '현재' : (item as ExternalEducationItem).endDate
                        });
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">수강중</span>
                  </label>
                </div>
                <div className="input-grid-2" style={{ gridColumn: 'span 2' }}>
                  <GhostTextarea
                    value={(item as ExternalEducationItem).description || ''}
                    onChange={(value) => updateItem(index, { ...item, description: value })}
                    placeholder="교육 내용 설명을 입력하세요..."
                    rows={3}
                  />
                </div>
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
                <DatePicker
                  value={(item as ProjectItem).startDate}
                  onChange={(date) => updateItem(index, { ...item, startDate: date })}
                  placeholder="시작일 선택"
                  maxDate={(item as ProjectItem).endDate && (item as ProjectItem).endDate !== '현재' ? (item as ProjectItem).endDate : undefined}
                />
                <div className="date-input-group">
                  <DatePicker
                    value={(item as ProjectItem).endDate}
                    onChange={(date) => updateItem(index, { ...item, endDate: date })}
                    placeholder="종료일 선택"
                    disabled={(item as ProjectItem).isCurrent}
                    minDate={(item as ProjectItem).startDate}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(item as ProjectItem).isCurrent}
                      onChange={(e) => {
                        const isCurrent = e.target.checked;
                        updateItem(index, { 
                          ...item, 
                          isCurrent,
                          endDate: isCurrent ? '현재' : (item as ProjectItem).endDate
                        });
                      }}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">진행중</span>
                  </label>
                </div>
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
        <motion.button
          onClick={addItem}
          className={`btn ${getButtonClassByType(type)}`}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.svg 
            className="btn-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </motion.svg>
            추가
        </motion.button>
      </div>
      
      <div className="section-content">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              layout
            >
              {renderItemForm(item, index)}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div 
              className="section-empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.svg 
                className="section-empty-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </motion.svg>
              <motion.div 
                className="section-empty-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {type === 'experience' && '아직 경력사항이 없습니다. 추가해보세요!'}
                {type === 'education' && '아직 교육사항이 없습니다. 추가해보세요!'}
                {type === 'externalEducation' && '아직 외부 교육사항이 없습니다. 추가해보세요!'}
                {type === 'project' && '아직 프로젝트가 없습니다. 추가해보세요!'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
