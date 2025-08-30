// 이메일 검증 (더 엄격한 검증)
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 이메일 도메인 검증 (실제 존재하는 도메인인지 확인)
export const validateEmailDomain = (email: string): boolean => {
  if (!validateEmail(email)) return false;
  
  const domain = email.split('@')[1].toLowerCase();
  const commonDomains = [
    'gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'yahoo.com',
    'hotmail.com', 'outlook.com', 'icloud.com', 'hanmail.net',
    'nate.com', 'live.com', 'msn.com', 'aol.com'
  ];
  
  return commonDomains.includes(domain);
};

// 전화번호 하이픈 자동 포맷팅
export const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');
  
  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (numbers.length <= 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

// 전화번호 검증 (한국 전화번호 형식)
export const validatePhone = (phone: string): boolean => {
  // 010-1234-5678, 010-123-4567, 02-123-4567, 031-123-4567 등
  const phoneRegex = /^(01[016789]|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// 국가별 전화번호 포맷 변환
export const formatPhoneForCountry = (phone: string, location: string): string => {
  if (!phone || !location) return phone;
  
  // 한국인 경우
  if (location.toLowerCase().includes('한국') || location.toLowerCase().includes('korea')) {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.startsWith('010')) {
      return `+82 10-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else if (numbers.startsWith('02')) {
      return `+82 2-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else if (numbers.startsWith('0')) {
      const areaCode = numbers.slice(0, 3);
      return `+82 ${areaCode.slice(1)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
  }
  
  // 미국인 경우
  if (location.toLowerCase().includes('미국') || location.toLowerCase().includes('usa') || location.toLowerCase().includes('america')) {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 10) {
      return `+1 ${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
  }
  
  // 일본인 경우
  if (location.toLowerCase().includes('일본') || location.toLowerCase().includes('japan')) {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.startsWith('090') || numbers.startsWith('080') || numbers.startsWith('070')) {
      return `+81 ${numbers.slice(1, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8)}`;
    }
  }
  
  // 기본값 (변환할 수 없는 경우)
  return phone;
};

// URL 검증
export const validateURL = (url: string): boolean => {
  if (!url) return true; // 빈 값은 허용 (선택사항)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 이름 검증 (한글, 영문, 공백 허용)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[가-힣a-zA-Z\s]{2,20}$/;
  return nameRegex.test(name.trim());
};

// 위치 검증 (도시, 국가 형식)
export const validateLocation = (location: string): boolean => {
  if (!location) return true; // 빈 값은 허용
  const locationRegex = /^[가-힣a-zA-Z\s,]+$/;
  return locationRegex.test(location.trim()) && location.trim().length >= 2;
};

// 개인정보 전체 검증
export const validatePersonalInfo = (data: {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // 이름 검증
  if (!data.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  } else if (!validateName(data.name)) {
    errors.name = '이름은 2-20자의 한글, 영문, 공백만 허용됩니다.';
  }

  // 이메일 검증
  if (!data.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!validateEmail(data.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요. (예: example@gmail.com)';
  } else if (!validateEmailDomain(data.email)) {
    errors.email = '일반적인 이메일 도메인을 사용해주세요. (gmail.com, naver.com 등)';
  }

  // 전화번호 검증
  if (!data.phone.trim()) {
    errors.phone = '전화번호를 입력해주세요.';
  } else if (!validatePhone(data.phone)) {
    errors.phone = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
  }

  // 위치 검증
  if (data.location && !validateLocation(data.location)) {
    errors.location = '올바른 위치 형식을 입력해주세요. (예: 서울, 대한민국)';
  }

  // LinkedIn URL 검증
  if (data.linkedin && !validateURL(data.linkedin)) {
    errors.linkedin = '올바른 LinkedIn URL을 입력해주세요.';
  }

  // GitHub URL 검증
  if (data.github && !validateURL(data.github)) {
    errors.github = '올바른 GitHub URL을 입력해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 필수 정보 검증 (완료 표시용)
export const validateRequiredFields = (data: {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  summary: string;
}): boolean => {
  return !!(
    data.name?.trim() &&
    data.email?.trim() &&
    data.phone?.trim() &&
    data.jobTitle?.trim() &&
    data.summary?.trim() &&
    validateEmail(data.email) &&
    validatePhone(data.phone)
  );
};

// 실시간 검증 함수 (입력 중에도 사용 가능)
export const getFieldValidationMessage = (
  field: string,
  value: string
): string => {
  switch (field) {
    case 'name':
      if (!value.trim()) return '';
      if (!validateName(value)) return '2-20자의 한글, 영문, 공백만 허용됩니다.';
      return '';
    
    case 'email':
      if (!value.trim()) return '';
      if (!validateEmail(value)) return '올바른 이메일 형식을 입력해주세요.';
      if (!validateEmailDomain(value)) return '일반적인 이메일 도메인을 사용해주세요.';
      return '';
    
    case 'phone':
      if (!value.trim()) return '';
      if (!validatePhone(value)) return '올바른 전화번호 형식을 입력해주세요.';
      return '';
    
    case 'location':
      if (!value.trim()) return '';
      if (!validateLocation(value)) return '올바른 위치 형식을 입력해주세요.';
      return '';
    
    case 'linkedin':
      if (!value.trim()) return '';
      if (!validateURL(value)) return '올바른 URL을 입력해주세요.';
      return '';
    
    case 'github':
      if (!value.trim()) return '';
      if (!validateURL(value)) return '올바른 URL을 입력해주세요.';
      return '';
    
    default:
      return '';
  }
};
