import React, { useState } from 'react';
import { translateWithLibreTranslate, supportedLanguages } from '../../lib/translation';
import type { TranslationRequest } from '../../lib/translation';

interface TranslatorProps {
  onTranslate?: (translatedText: string) => void;
  placeholder?: string;
}

export function Translator({ onTranslate, placeholder = "번역할 텍스트를 입력하세요" }: TranslatorProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('ko');
  const [toLang, setToLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const request: TranslationRequest = {
        text: inputText,
        from: fromLang,
        to: toLang,
      };

      const response = await translateWithLibreTranslate(request);
      setTranslatedText(response.translatedText);
      
      if (onTranslate) {
        onTranslate(response.translatedText);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('번역에 실패했습니다.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
