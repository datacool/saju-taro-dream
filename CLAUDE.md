# CLAUDE.md - 개발 지침서

## 프로젝트 원칙
- **Modular Design:** 사주, 타로, 꿈해몽 로직은 서로 독립적인 모듈로 관리한다.
- **AI-First:** 모든 상담 로직은 단순 하드코딩이 아닌 LLM 프롬프트 엔지니어링을 중심으로 설계한다.
- **UI/UX:** 신비로우면서도 깔끔한 'Modern Spiritual' 디자인 시스템을 적용한다.

## 기술적 요구사항
1. **타입 안정성:** 모든 프론트엔드 코드는 TypeScript를 사용하며 인터페이스를 명확히 정의한다.
2. **상태 관리:** React Context API 또는 간단한 상태 관리 라이브러리를 사용한다.
3. **API 설계:** - 사주: `korean-lunar-calendar` 라이브러리류를 활용하여 데이터 변환 로직 구현.
   - 타로: `Math.random()`을 기반으로 중복 없는 카드 뽑기 로직 구현.
   - 에이전트: Dify API 연동을 기본으로 하되, 로컬에서 LangChain으로 확장 가능하게 추상화한다.

## 코딩 스타일 지침
- **Components:** `components/ui` 폴더 내에 재사용 가능한 원자적 컴포넌트를 배치한다.
- **Naming:** 함수명은 동사로 시작한다 (예: `calculateManse()`, `interpretTarot()`).
- **Error Handling:** AI API 호출 실패 시 사용자에게 적절한 피드백을 주는 에러 바운더리를 설정한다.

## 개발 우선순위
1. `Saju` 계산 로직 및 기본 UI 구성.
2. `Tarot` 카드 셔플 및 선택 로직.
3. `Dify` 혹은 LLM API 연동을 통한 결과 생성 부분 구현.
4. `Dream` 해몽을 위한 간단한 키워드 매칭 및 RAG 기초 작업.