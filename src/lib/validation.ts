// 이메일 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 검증 (한국 전화번호 형식)
export const validatePhone = (phone: string): boolean => {
  // 010-1234-5678, 010-123-4567, 02-123-4567, 031-123-4567 등
  const phoneRegex = /^(01[016789]|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
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
    errors.email = '올바른 이메일 형식을 입력해주세요. (예: example@email.com)';
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
