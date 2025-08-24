// 번역기 API 관련 함수들
export type TranslationRequest = {
  text: string;
  from: string;
  to: string;
}

export type TranslationResponse = {
  translatedText: string;
  detectedLanguage?: string;
  success: boolean;
  error?: string;
}

// Google Translate API (무료 버전)
export async function translateText(request: TranslationRequest): Promise<TranslationResponse> {
  try {
    // Google Translate API 사용 (실제 구현시 API 키 필요)
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: request.text,
        source: request.from,
        target: request.to,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return {
      translatedText: data.data.translations[0].translatedText,
      detectedLanguage: data.data.translations[0].detectedSourceLanguage,
      success: true,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: request.text,
      success: false,
      error: 'Google Translate API 키가 필요합니다.',
    };
  }
}

// 무료 대안: LibreTranslate API
export async function translateWithLibreTranslate(request: TranslationRequest): Promise<TranslationResponse> {
  try {
    console.log('번역 요청:', request);
    
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: request.text,
        source: request.from,
        target: request.to,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LibreTranslate API 응답 오류:', response.status, errorText);
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log('번역 응답:', data);
    
    if (data.translatedText) {
      return {
        translatedText: data.translatedText,
        success: true,
      };
    } else {
      throw new Error('번역 결과가 없습니다.');
    }
  } catch (error) {
    console.error('LibreTranslate 번역 오류:', error);
    
    // 간단한 한국어-영어 번역 (테스트용)
    if (request.from === 'ko' && request.to === 'en') {
      const simpleTranslations: Record<string, string> = {
        '안녕하세요': 'Hello',
        '감사합니다': 'Thank you',
        '이력서': 'Resume',
        '경력': 'Experience',
        '교육': 'Education',
        '프로젝트': 'Project',
        '스킬': 'Skills',
        '언어': 'Languages',
        '자기소개': 'Self Introduction',
        '연락처': 'Contact',
        '주소': 'Address',
        '전화번호': 'Phone Number',
        '이메일': 'Email',
        'GitHub': 'GitHub',
        'LinkedIn': 'LinkedIn',
      };
      
      const translated = simpleTranslations[request.text] || request.text;
      return {
        translatedText: translated,
        success: true,
        error: 'LibreTranslate API 오류로 인해 기본 번역을 사용했습니다.',
      };
    }
    
    return {
      translatedText: request.text,
      success: false,
      error: '번역에 실패했습니다. LibreTranslate API를 확인해주세요.',
    };
  }
}

// 지원 언어 목록
export const supportedLanguages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
];
