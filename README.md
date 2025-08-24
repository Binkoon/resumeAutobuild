# CV 자동 빌더 (CV Auto Builder)

**Version:** 1.0.3  
**Last Updated:** 2024년 12월 19일

AI 기반 이력서 작성 도구로 전문적이고 매력적인 이력서를 만들어보세요.

## ✨ 주요 기능

### 📝 CV 작성 및 편집
- **개인정보 입력**: 이름, 이메일, 전화번호, 위치, LinkedIn, GitHub
- **스킬 관리**: 드롭다운 선택 및 직접 입력 지원
- **언어 능력**: 다국어 지원 및 수준 표시
- **경력사항**: 회사명, 직책, 기간, 업무 내용
- **교육사항**: 학교, 전공, 학위, 졸업일
- **프로젝트**: 프로젝트명, 기술스택, 설명, 기간

### 🎨 CV 템플릿
- **역순 연대기형**: 경력 중심의 표준 이력서
- **기능형**: 스킬과 역량 중심
- **혼합형**: 스킬과 경력을 균형있게
- **학문형**: 학술 연구 중심
- **크리에이티브**: 디자인과 창의성 중심

### 💾 데이터 관리
- **임시저장**: 로컬스토리지 기반 자동 저장
- **데이터 복원**: 이전 작업 내용 자동 복구
- **진행률 표시**: 실시간 CV 작성 진행 상황
- **섹션별 완료 상태**: 각 섹션별 입력 완료 여부

### 📤 출력 및 다운로드
- **PDF 형식**: 인쇄 및 공유에 최적화
- **Markdown 형식**: GitHub, Notion 등에서 편집
- **HTML 형식**: 웹 브라우저에서 열기
- **실시간 미리보기**: A4 크기 최적화

### 🌐 부가 기능
- **번역 도구**: 다국어 입력 지원
- **위치 자동 감지**: IP 기반 위치 자동 설정
- **ATS 친화적**: 채용시스템 최적화

## 🏗️ 프로젝트 구조

### 📁 컴포넌트 구조
```
src/
├── components/
│   ├── builder/           # CV 빌더 핵심 컴포넌트
│   │   ├── CVBuilder.tsx      # 메인 빌더 컴포넌트
│   │   ├── SectionRenderer.tsx # 섹션별 렌더링
│   │   ├── SectionEditor.tsx   # 섹션 편집기
│   │   ├── Preview.tsx         # 실시간 미리보기
│   │   ├── TemplateSelector.tsx # 템플릿 선택
│   │   └── GhostTextarea.tsx   # 스마트 텍스트 입력
│   └── ui/                # 공통 UI 컴포넌트
│       ├── Header.tsx          # 헤더 (진행률, 액션 버튼)
│       ├── Footer.tsx          # 푸터
│       ├── Translator.tsx      # 번역 도구
│       ├── LocationDetector.tsx # 위치 감지
│       ├── SkillDropdown.tsx   # 스킬 선택 드롭다운
│       └── button.tsx          # 버튼 컴포넌트
```

### 📁 상태 관리
```
src/
├── stores/                # Zustand 상태 관리
│   ├── cvStore.ts            # CV 데이터 상태
│   ├── uiStore.ts            # UI 상태 (로딩, 에러)
│   └── index.ts              # 스토어 통합
```

### 📁 타입 및 유틸리티
```
src/
├── types/                 # TypeScript 타입 정의
│   └── cv.ts                 # CV 관련 타입
├── lib/                   # 유틸리티 함수
│   ├── download.ts            # CV 다운로드
│   ├── validation.ts          # 입력 검증
│   └── hooks.ts               # 커스텀 훅
└── data/                   # 정적 데이터
    └── skills.ts              # 스킬 목록
```

### 📁 스타일링
```
src/
├── styles/                # CSS 스타일
│   ├── cv-controls.css        # CV 컨트롤 스타일
│   ├── forms.css              # 폼 스타일
│   ├── global.css             # 전역 스타일
│   └── layout.css             # 레이아웃 스타일
```

## 🚀 기술 스택

- **Frontend**: React 18, TypeScript
- **상태관리**: Zustand
- **스타일링**: CSS (모듈화)
- **빌드도구**: Vite
- **패키지관리**: npm

## 📱 반응형 디자인

- **데스크톱**: 2열 그리드 레이아웃 (편집 + 미리보기)
- **태블릿**: 적응형 그리드
- **모바일**: 세로 스택 레이아웃

## 🔧 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check
```

## 📋 사용법

1. **CV 설정**: 원하는 템플릿 선택
2. **정보 입력**: 각 섹션별로 정보 입력
3. **실시간 확인**: 오른쪽에서 미리보기 확인
4. **임시저장**: 작업 중간에 자동 저장
5. **다운로드**: 완성된 CV를 원하는 형식으로 다운로드

## �� 라이선스

MIT License