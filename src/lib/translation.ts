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

// 무료 대안: LibreTranslate API (CORS 에러 방지)
export async function translateWithLibreTranslate(request: TranslationRequest): Promise<TranslationResponse> {
  try {
    console.log('번역 요청:', request);
    
    // CORS 에러를 방지하기 위해 mode: 'cors' 명시적 설정
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // CORS 모드 명시적 설정
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
    
    // CORS 에러나 네트워크 에러인 경우 더 자세한 로깅
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('CORS 또는 네트워크 에러가 발생했습니다. 기본 번역을 사용합니다.');
    }
    
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
        '이름': 'Name',
        '직함': 'Job Title',
        '회사': 'Company',
        '기간': 'Period',
        '설명': 'Description',
        '학력': 'Education',
        '전공': 'Major',
        '학위': 'Degree',
        '졸업': 'Graduation',
        '수상': 'Awards',
        '자격증': 'Certifications',
        '활동': 'Activities',
        '봉사': 'Volunteer',
        '취미': 'Hobbies',
        '관심사': 'Interests',
      };
      
      const translated = simpleTranslations[request.text] || request.text;
      return {
        translatedText: translated,
        success: true,
        error: 'LibreTranslate API 오류로 인해 기본 번역을 사용했습니다.',
      };
    }
    
    // 영어-한국어 번역도 추가
    if (request.from === 'en' && request.to === 'ko') {
      const reverseTranslations: Record<string, string> = {
        'Hello': '안녕하세요',
        'Thank you': '감사합니다',
        'Resume': '이력서',
        'Experience': '경력',
        'Education': '교육',
        'Project': '프로젝트',
        'Skills': '스킬',
        'Languages': '언어',
        'Self Introduction': '자기소개',
        'Contact': '연락처',
        'Address': '주소',
        'Phone Number': '전화번호',
        'Email': '이메일',
        'Name': '이름',
        'Job Title': '직함',
        'Company': '회사',
        'Period': '기간',
        'Description': '설명',
        'Major': '전공',
        'Degree': '학위',
        'Graduation': '졸업',
        'Awards': '수상',
        'Certifications': '자격증',
        'Activities': '활동',
        'Volunteer': '봉사',
        'Hobbies': '취미',
        'Interests': '관심사',
      };
      
      const translated = reverseTranslations[request.text] || request.text;
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
