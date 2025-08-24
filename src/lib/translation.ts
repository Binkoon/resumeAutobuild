// 번역기 API 관련 함수들
export type TranslationRequest = {
  text: string;
  from: string;
  to: string;
}

export type TranslationResponse = {
  translatedText: string;
  detectedLanguage?: string;
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
    };
  } catch (error) {
    console.error('Translation error:', error);
    // 에러 발생시 원본 텍스트 반환
    return {
      translatedText: request.text,
    };
  }
}

// 무료 대안: LibreTranslate API
export async function translateWithLibreTranslate(request: TranslationRequest): Promise<TranslationResponse> {
  try {
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
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return {
      translatedText: data.translatedText,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: request.text,
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
