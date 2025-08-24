import { useState, useCallback, useEffect } from 'react';
import { suggest, getAutocompleteSuggestions } from './ai';
import type { AISuggestion } from './ai';

export function useAIAutocomplete() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = useCallback(async (
    context: string,
    field: string,
    cvData: any
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await suggest(context, field, cvData);
      setSuggestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 제안을 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAutocomplete = useCallback(async (
    partialText: string,
    context: string
  ) => {
    try {
      const options = await getAutocompleteSuggestions(partialText, context);
      setAutocompleteOptions(options);
    } catch (err) {
      console.error('자동완성 옵션을 가져오는데 실패했습니다:', err);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setAutocompleteOptions([]);
  }, []);

  return {
    suggestions,
    autocompleteOptions,
    isLoading,
    error,
    getSuggestions,
    getAutocomplete,
    clearSuggestions
  };
}

/**
 * 디바운스 훅 - AI 제안 요청 최적화용
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 위치 자동 감지 훅
export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getCurrentLocation = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    setError('');

    try {
      // 1. 먼저 저장된 위치가 있는지 확인
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setIsLoading(false);
        return savedLocation;
      }

      // 2. Geolocation API 사용
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5분
          });
        });

        const { latitude, longitude } = position.coords;
        
        // 3. 좌표를 주소로 변환 (Reverse Geocoding)
        const address = await reverseGeocode(latitude, longitude);
        
        // 4. 로컬 스토리지에 저장
        localStorage.setItem('userLocation', address);
        setIsLoading(false);
        return address;
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (err) {
      console.error('Location detection failed:', err);
      
      // 5. IP 기반 위치 추정 (fallback)
      try {
        const ipLocation = await getLocationByIP();
        localStorage.setItem('userLocation', ipLocation);
        setIsLoading(false);
        return ipLocation;
      } catch (ipErr) {
        setError('위치를 자동으로 감지할 수 없습니다. 수동으로 입력해주세요.');
        setIsLoading(false);
        return '';
      }
    }
  }, []);

  return {
    isLoading,
    error,
    getCurrentLocation
  };
}

// 좌표를 주소로 변환하는 함수
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // OpenStreetMap Nominatim API 사용 (무료)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
    );
    const data = await response.json();
    
    if (data.display_name) {
      // 한국 주소인 경우 한국어로 표시
      const address = data.display_name;
      if (data.address?.country_code === 'kr') {
        return `${data.address.city || data.address.town || data.address.village || ''}, 한국`;
      }
      return address;
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// IP 기반 위치 추정 함수
async function getLocationByIP(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code === 'KR') {
      return `${data.city || '서울'}, 한국`;
    }
    
    return `${data.city || ''}, ${data.country_name || ''}`;
  } catch (error) {
    console.error('IP location detection failed:', error);
    throw error;
  }
}
