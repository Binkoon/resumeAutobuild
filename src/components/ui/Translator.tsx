import React, { useState } from 'react';
import { translateWithLibreTranslate, supportedLanguages } from '../../lib/translation';
import type { TranslationRequest } from '../../lib/translation';

interface TranslatorProps {
  onTranslate?: (translatedText: string) => void;
  placeholder?: string;
  reset?: boolean; // 초기화 트리거
}

export function Translator({ onTranslate, placeholder = "번역할 텍스트를 입력하세요", reset = false }: TranslatorProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('ko');
  const [toLang, setToLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // reset prop이 true가 되면 모든 상태 초기화
  React.useEffect(() => {
    if (reset) {
      setInputText('');
      setTranslatedText('');
      setFromLang('ko');
      setToLang('en');
      setIsTranslating(false);
      setTranslationStatus('idle');
      setErrorMessage('');
    }
  }, [reset]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setTranslationStatus('idle');
    setErrorMessage('');
    
    try {
      const request: TranslationRequest = {
        text: inputText,
        from: fromLang,
        to: toLang,
      };

      console.log('번역 시작:', request);
      const response = await translateWithLibreTranslate(request);
      
      if (response.success) {
        setTranslatedText(response.translatedText);
        setTranslationStatus('success');
        
        if (response.error) {
          setErrorMessage(response.error);
        }
        
        if (onTranslate) {
          onTranslate(response.translatedText);
        }
      } else {
        setTranslatedText(inputText);
        setTranslationStatus('error');
        setErrorMessage(response.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText(inputText);
      setTranslationStatus('error');
      setErrorMessage('번역 중 오류가 발생했습니다.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
    setTranslationStatus('idle');
    setErrorMessage('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = () => {
    switch (translationStatus) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <div className="translator-container">
      <div className="translator-header">
        <h3>번역기</h3>
        <div className="language-selectors">
          <select 
            value={fromLang} 
            onChange={(e) => setFromLang(e.target.value)}
            className="lang-select"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={swapLanguages}
            className="swap-btn"
            title="언어 바꾸기"
          >
            ⇄
          </button>
          
          <select 
            value={toLang} 
            onChange={(e) => setToLang(e.target.value)}
            className="lang-select"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="translator-content">
        <div className="input-section">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={placeholder}
            className="translation-input"
            rows={4}
          />
          <button 
            onClick={() => copyToClipboard(inputText)}
            className="copy-btn"
            title="복사"
          >
            📋
          </button>
        </div>

        <button 
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
          className="translate-btn"
        >
          {isTranslating ? '번역 중...' : '번역하기'}
        </button>

        {/* 상태 표시 */}
        {translationStatus !== 'idle' && (
          <div className={`translation-status ${translationStatus}`}>
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-text">
              {translationStatus === 'success' ? '번역 완료' : '번역 실패'}
            </span>
            {errorMessage && (
              <span className="error-message">({errorMessage})</span>
            )}
          </div>
        )}

        <div className="output-section">
          <textarea
            value={translatedText}
            readOnly
            placeholder="번역 결과가 여기에 표시됩니다"
            className="translation-output"
            rows={4}
          />
          <button 
            onClick={() => copyToClipboard(translatedText)}
            className="copy-btn"
            title="복사"
            disabled={!translatedText}
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
}
