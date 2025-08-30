/**
 * OS 감지 유틸리티
 * 사용자의 운영체제를 감지하여 적절한 스타일링을 적용하기 위함
 */

export type OperatingSystem = 'windows' | 'macos' | 'linux' | 'unknown';

/**
 * 사용자의 운영체제를 감지합니다
 */
export function detectOS(): OperatingSystem {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  // Windows 감지
  if (userAgent.includes('windows') || platform.includes('win')) {
    return 'windows';
  }

  // macOS 감지
  if (userAgent.includes('mac') || platform.includes('mac')) {
    return 'macos';
  }

  // Linux 감지
  if (userAgent.includes('linux') || platform.includes('linux')) {
    return 'linux';
  }

  return 'unknown';
}

/**
 * OS에 따른 CSS 클래스명을 반환합니다
 */
export function getOSClassName(): string {
  const os = detectOS();
  return `os-${os}`;
}

/**
 * OS별 폰트 스택을 반환합니다
 */
export function getOSFontStack(): string {
  const os = detectOS();
  
  switch (os) {
    case 'windows':
      return "'Segoe UI', 'Microsoft YaHei', 'Malgun Gothic', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";
    case 'macos':
      return "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', sans-serif";
    case 'linux':
      return "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
    default:
      return "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";
  }
}

/**
 * OS별 기본 색상 테마를 반환합니다
 */
export function getOSColorTheme() {
  const os = detectOS();
  
  switch (os) {
    case 'windows':
      return {
        primary: '#0078d4',
        secondary: '#106ebe',
        accent: '#00bcf2',
        background: '#f3f2f1',
        surface: '#ffffff',
        text: '#323130'
      };
    case 'macos':
      return {
        primary: '#007aff',
        secondary: '#0051d5',
        accent: '#30d158',
        background: '#f2f2f7',
        surface: '#ffffff',
        text: '#1d1d1f'
      };
    case 'linux':
      return {
        primary: '#77216f',
        secondary: '#5e2750',
        accent: '#e95420',
        background: '#f7f7f7',
        surface: '#ffffff',
        text: '#2c2c2c'
      };
    default:
      return {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#10b981',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b'
      };
  }
}
