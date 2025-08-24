import React, { useState, useRef, useEffect } from 'react';
import { useAIAutocomplete } from '../../lib/hooks';
import { useCVStore } from '../../stores/cvStore';

interface GhostTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  context?: string;
  field?: string;
}

export function GhostTextarea({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  className = '',
  rows = 4,
  context = '',
  field = ''
}: GhostTextareaProps) {
  const [ghostText, setGhostText] = useState('');
  const [showGhost, setShowGhost] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { suggestions, isLoading, getSuggestions } = useAIAutocomplete();
  const { cvData } = useCVStore();

  // AI 제안 가져오기
  useEffect(() => {
    if (value.length > 10 && context && field) {
      const timer = setTimeout(() => {
        getSuggestions(value, field, cvData);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [value, context, field, cvData, getSuggestions]);

  // Tab 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // 커서 위치 조정
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // AI 제안 적용
  const applySuggestion = (suggestion: string) => {
    onChange(value + suggestion);
    setShowGhost(false);
  };

  // 텍스트 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // AI 제안이 있으면 고스트 텍스트 표시
    if (suggestions.length > 0 && newValue.length > 0) {
      const bestSuggestion = suggestions[0];
      setGhostText(bestSuggestion.text);
      setShowGhost(true);
    } else {
      setShowGhost(false);
    }
  };

  return (
    <div className={`ghost-textarea ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea"
      />
      
      {/* 고스트 텍스트 */}
      {showGhost && ghostText && (
        <div className="ghost-text">
          {value}
          <span className="ghost-suggestion">{ghostText}</span>
        </div>
      )}
      
      {/* AI 제안 목록 */}
      {suggestions.length > 0 && (
        <div className="ai-suggestions">
          <div className="ai-suggestions-title">AI 제안:</div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => applySuggestion(suggestion.text)}
              className="ai-suggestion-item"
            >
              {suggestion.text}
              <span className="ai-suggestion-confidence">
                (신뢰도: {Math.round(suggestion.confidence * 100)}%)
              </span>
            </button>
          ))}
        </div>
      )}
      
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="ai-loading">
          <div className="ai-loading-spinner"></div>
          AI 제안을 생성하고 있습니다...
        </div>
      )}
    </div>
  );
}
