import React, { useState, useRef, useEffect } from 'react';
import { SKILL_CATEGORIES, searchSkills } from '../../data/skills';

interface SkillDropdownProps {
  onSkillSelect: (skill: string) => void;
  placeholder?: string;
  className?: string;
}

export function SkillDropdown({ 
  onSkillSelect, 
  placeholder = '스킬을 검색하거나 입력하세요',
  className = '' 
}: SkillDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customSkill, setCustomSkill] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 검색 결과
  const filteredSkills = searchQuery
    ? searchSkills(searchQuery)
    : selectedCategory === 'all'
    ? SKILL_CATEGORIES.flatMap(cat => cat.skills)
    : SKILL_CATEGORIES.find(cat => cat.id === selectedCategory)?.skills || [];

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 스킬 선택 처리
  const handleSkillSelect = (skill: string) => {
    onSkillSelect(skill);
    setSearchQuery('');
    setIsOpen(false);
  };

  // 커스텀 스킬 추가 처리
  const handleCustomSkillAdd = () => {
    if (customSkill.trim()) {
      onSkillSelect(customSkill.trim());
      setCustomSkill('');
      setIsOpen(false);
    }
  };

  // Enter 키로 커스텀 스킬 추가
  const handleCustomSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSkillAdd();
    }
  };

  return (
    <div className={`skill-dropdown ${className}`} ref={dropdownRef}>
      {/* 검색 입력 필드 */}
      <div className="skill-dropdown-input">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="form-input"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="skill-dropdown-toggle"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="skill-dropdown-menu">
          {/* 카테고리 선택 */}
          <div className="skill-category-selector">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="skill-category-select"
            >
              <option value="all">모든 카테고리</option>
              {SKILL_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 검색 결과 */}
          {filteredSkills.length > 0 && (
            <div className="skill-search-results">
              <div className="skill-results-header">
                <span>검색 결과 ({filteredSkills.length})</span>
              </div>
              <div className="skill-results-list">
                {filteredSkills.slice(0, 20).map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => handleSkillSelect(skill)}
                    className="skill-result-item"
                  >
                    {skill}
                  </button>
                ))}
                {filteredSkills.length > 20 && (
                  <div className="skill-results-more">
                    ... {filteredSkills.length - 20}개 더
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 커스텀 스킬 입력 */}
          <div className="skill-custom-input">
            <div className="skill-custom-header">
              <span>직접 입력</span>
            </div>
            <div className="skill-custom-field">
              <input
                type="text"
                placeholder="새로운 스킬을 입력하세요"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={handleCustomSkillKeyPress}
                className="form-input"
              />
              <button
                onClick={handleCustomSkillAdd}
                disabled={!customSkill.trim()}
                className="btn btn-primary btn-sm"
              >
                추가
              </button>
            </div>
          </div>

          {/* 인기 스킬 */}
          <div className="skill-popular">
            <div className="skill-popular-header">
              <span>인기 스킬</span>
            </div>
            <div className="skill-popular-list">
              {['JavaScript', 'React', 'Python', 'Node.js', 'TypeScript'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillSelect(skill)}
                  className="skill-popular-item"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
