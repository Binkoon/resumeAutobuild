# CV 자동 빌더 (Resume Auto Builder)

AI 기반 이력서 자동 생성 웹 애플리케이션입니다. 사용자가 입력한 정보를 바탕으로 실시간으로 이력서를 미리보기하고, AI 제안을 통해 더 나은 내용을 작성할 수 있도록 도와줍니다.

## ✨ 특징

- **개발자 시그니처 화면**: 앱 시작 시 아름다운 인트로 애니메이션
- **AI 기반 자동완성**: 스마트한 텍스트 제안 및 자동완성
- **실시간 미리보기**: 입력하는 즉시 이력서 형태로 확인
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 🏗️ 프로젝트 구조

```
src/
├── components/
│   ├── builder/                    # CV 빌더 관련 컴포넌트
│   │   ├── CVBuilder.tsx          # 메인 빌더 컨테이너 (상태 관리 + 섹션 컴포넌트 호출)
│   │   ├── GhostTextarea.tsx      # AI 추천 + Tab 확장 지원 텍스트에어리어
│   │   ├── SectionEditor.tsx      # Experience/Education/Project 공통 에디터
│   │   ├── TemplateSelector.tsx   # 이력서 템플릿 선택기
│   │   └── Preview.tsx            # 오른쪽 CV 미리보기 (A4 레이아웃)
│   └── ui/                        # 재사용 가능한 UI 컴포넌트
│       ├── IntroPage.tsx          # 개발자 시그니처 인트로 화면
│       ├── Footer.tsx             # 푸터 컴포넌트
│       ├── LocationDetector.tsx   # 위치 기반 정보 자동 입력
│       ├── SkillDropdown.tsx      # 스킬 선택 드롭다운
│       └── button.tsx             # Button 컴포넌트 (shadcn/ui 스타일)
│
├── lib/                           # 비즈니스 로직 및 유틸리티
│   ├── ai.ts                      # AI 관련 함수 (suggest, getAutocompleteSuggestions)
│   ├── download.ts                # PDF 다운로드 기능
│   ├── hooks.ts                   # useAIAutocomplete, useDebounce 커스텀 훅
│   ├── markdown.ts                # buildMarkdown, nl, fmt 등 텍스트 유틸리티
│   └── validation.ts              # 폼 유효성 검사
│
├── types/                         # TypeScript 타입 정의
│   └── cv.ts                      # ExperienceItem, EduItem, ProjectItem, PersonalInfo, CVData 인터페이스
│
├── pages/                         # 페이지 컴포넌트
│   └── index.tsx                  # 진입점 (CVBuilder 불러오기)
│
├── stores/                        # 상태 관리
│   ├── cvStore.ts                 # CV 데이터 상태 관리
│   ├── uiStore.ts                 # UI 상태 관리
│   └── index.ts                   # 스토어 통합
│
├── App.tsx                        # 메인 앱 컴포넌트
└── main.tsx                       # React 앱 진입점
```

## 🚀 주요 기능

### 1. 개발자 시그니처 화면
- **IntroPage**: 앱 시작 시 아름다운 애니메이션과 함께 개발자 시그니처 표시
- **언제든 재시청**: "Intro 다시보기" 버튼으로 언제든지 인트로 화면 재시청 가능

### 2. AI 기반 자동완성
- **GhostTextarea**: AI가 제안하는 텍스트를 실시간으로 표시
- **Tab 키 확장**: Tab 키를 눌러 AI 제안을 자동으로 적용
- **컨텍스트 기반 제안**: 입력 중인 내용을 바탕으로 관련성 높은 제안

### 3. 섹션별 편집
- **개인정보**: 이름, 연락처, 소셜 링크, 자기소개
- **경력사항**: 회사, 직책, 기간, 업무 설명, 성과
- **교육사항**: 학교, 학위, 전공, GPA, 관련 과목
- **프로젝트**: 프로젝트명, 기술스택, GitHub/Live Demo 링크
- **스킬 & 언어**: 태그 형태로 관리

### 4. 실시간 미리보기
- **A4 레이아웃**: 실제 인쇄 시와 동일한 형태로 미리보기
- **반응형 디자인**: 데스크톱과 모바일 모두 지원
- **실시간 업데이트**: 입력하는 즉시 미리보기 반영

### 5. 추가 기능
- **PDF 다운로드**: 완성된 이력서를 PDF로 다운로드
- **위치 기반 정보**: 사용자 위치를 자동으로 감지하여 정보 입력
- **템플릿 선택**: 다양한 이력서 템플릿 중 선택 가능

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🔧 개발 가이드

### 컴포넌트 추가
새로운 UI 컴포넌트는 `src/components/ui/` 디렉토리에 추가하세요.

### 상태 관리
Zustand를 사용한 상태 관리로 `src/stores/` 디렉토리에서 CV 데이터와 UI 상태를 관리합니다.

### AI 기능 확장
`src/lib/ai.ts`에서 OpenAI API 연동을 구현할 수 있습니다.

### 스타일링
Tailwind CSS를 사용하여 일관된 디자인 시스템을 유지합니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📅 개발 히스토리

- **2025-01-XX** - ver 1.1.0: 개발자 시그니처 화면 추가, PDF 다운로드 기능 구현
- **2025-08-24** - ver 1.0.0: 최초 개발