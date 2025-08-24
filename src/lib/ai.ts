import type { CVData } from '../types/cv';

export interface AISuggestion {
  text: string;
  confidence: number;
  type: 'experience' | 'education' | 'project' | 'skill';
}

/**
 * AI 제안을 받아오는 함수 (현재는 stub, 추후 OpenAI API 연동)
 */
export async function suggest(
  context: string,
  field: string,
  cvData: Partial<CVData>
): Promise<AISuggestion[]> {
  // TODO: OpenAI API 연동
  // 현재는 더미 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const suggestions: AISuggestion[] = [
    {
      text: `AI가 제안하는 ${field} 내용입니다.`,
      confidence: 0.8,
      type: 'experience'
    },
    {
      text: `다른 ${field} 옵션도 고려해보세요.`,
      confidence: 0.6,
      type: 'experience'
    }
  ];
  
  return suggestions;
}

/**
 * 텍스트 자동완성 제안
 */
export async function getAutocompleteSuggestions(
  partialText: string,
  context: string
): Promise<string[]> {
  // TODO: 실제 AI 모델 연동
  const suggestions = [
    `${partialText}을 성공적으로 완료했습니다.`,
    `${partialText}를 통해 사용자 경험을 개선했습니다.`,
    `${partialText}를 구현하여 성능을 향상시켰습니다.`
  ];
  
  return suggestions.filter(s => s.includes(partialText));
}
