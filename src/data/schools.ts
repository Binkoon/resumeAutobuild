// 한국 주요 학교 리스트
export interface SchoolInfo {
  id: string;
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'college' | 'university' | 'graduate';
  location: string;
  isPublic: boolean;
}

export const SCHOOLS: SchoolInfo[] = [
  // 초등학교 (주요 사립)
  { id: 'e1', name: '서울초등학교', type: 'elementary', location: '서울', isPublic: true },
  { id: 'e2', name: '한국초등학교', type: 'elementary', location: '서울', isPublic: false },
  
  // 중학교 (주요 사립)
  { id: 'm1', name: '서울중학교', type: 'middle', location: '서울', isPublic: true },
  { id: 'm2', name: '한국중학교', type: 'middle', location: '서울', isPublic: false },
  { id: 'm3', name: '대원중학교', type: 'middle', location: '서울', isPublic: false },
  
  // 고등학교 (주요 사립)
  { id: 'h1', name: '서울고등학교', type: 'high', location: '서울', isPublic: true },
  { id: 'h2', name: '한국고등학교', type: 'high', location: '서울', isPublic: false },
  { id: 'h3', name: '대원고등학교', type: 'high', location: '서울', isPublic: false },
  { id: 'h4', name: '경기고등학교', type: 'high', location: '서울', isPublic: true },
  { id: 'h5', name: '경복고등학교', type: 'high', location: '서울', isPublic: true },
  
  // 전문대학
  { id: 'c1', name: '서울전문대학', type: 'college', location: '서울', isPublic: true },
  { id: 'c2', name: '한국전문대학', type: 'college', location: '서울', isPublic: false },
  
  // 4년제 대학
  { id: 'u1', name: '서울대학교', type: 'university', location: '서울', isPublic: true },
  { id: 'u2', name: '연세대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u3', name: '고려대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u4', name: '성균관대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u5', name: '한양대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u6', name: '중앙대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u7', name: '경희대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u8', name: '서강대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u9', name: '동국대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u10', name: '국민대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u11', name: '숙명여자대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u12', name: '이화여자대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u13', name: '숭실대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u14', name: '건국대학교', type: 'university', location: '서울', isPublic: false },
  { id: 'u15', name: '단국대학교', type: 'university', location: '서울', isPublic: false },
  
  // 지방 주요 대학
  { id: 'u16', name: '부산대학교', type: 'university', location: '부산', isPublic: true },
  { id: 'u17', name: '전남대학교', type: 'university', location: '광주', isPublic: true },
  { id: 'u18', name: '전북대학교', type: 'university', location: '전주', isPublic: true },
  { id: 'u19', name: '경북대학교', type: 'university', location: '대구', isPublic: true },
  { id: 'u20', name: '충남대학교', type: 'university', location: '대전', isPublic: true },
  { id: 'u21', name: '충북대학교', type: 'university', location: '청주', isPublic: true },
  { id: 'u22', name: '강원대학교', type: 'university', location: '춘천', isPublic: true },
  { id: 'u23', name: '제주대학교', type: 'university', location: '제주', isPublic: true },
  
  // 사립 지방 대학
  { id: 'u24', name: '부산외국어대학교', type: 'university', location: '부산', isPublic: false },
  { id: 'u25', name: '동아대학교', type: 'university', location: '부산', isPublic: false },
  { id: 'u26', name: '경성대학교', type: 'university', location: '부산', isPublic: false },
  { id: 'u27', name: '동의대학교', type: 'university', location: '부산', isPublic: false },
  { id: 'u28', name: '부경대학교', type: 'university', location: '부산', isPublic: false },
  
  // 대학원
  { id: 'g1', name: '서울대학교 대학원', type: 'graduate', location: '서울', isPublic: true },
  { id: 'g2', name: '연세대학교 대학원', type: 'graduate', location: '서울', isPublic: false },
  { id: 'g3', name: '고려대학교 대학원', type: 'graduate', location: '서울', isPublic: false },
];

// 학교 타입별로 그룹화
export const getSchoolsByType = (type: SchoolInfo['type']) => {
  return SCHOOLS.filter(school => school.type === type);
};

// 지역별로 그룹화
export const getSchoolsByLocation = (location: string) => {
  return SCHOOLS.filter(school => school.location === location);
};

// 검색 기능
export const searchSchools = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return SCHOOLS.filter(school => 
    school.name.toLowerCase().includes(lowerQuery) ||
    school.location.toLowerCase().includes(lowerQuery)
  );
};
